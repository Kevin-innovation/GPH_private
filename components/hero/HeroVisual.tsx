"use client";

import { useEffect, useRef, useState } from "react";

type ThreeModule = typeof import("three");
type FadeMaterial = import("three").MeshBasicMaterial | import("three").MeshStandardMaterial;

type FadeEntry = {
  material: FadeMaterial;
  opacity: number;
};

type SceneStructure = {
  group: import("three").Group;
  fades: FadeEntry[];
};

type TracerEntry = {
  mesh: import("three").Mesh;
  material: import("three").MeshBasicMaterial;
  curve: import("three").Curve<import("three").Vector3>;
  start: number;
  end: number;
};

const layers = [
  { id: "body", label: "Body", title: "What happens in people", description: "Biology, nutrition, and lived health", color: "#f2b84b" },
  { id: "environment", label: "Environment", title: "What shapes exposure", description: "Place, climate, food, and inequality", color: "#159a91" },
  { id: "systems", label: "Systems", title: "What changes outcomes", description: "Policy, prevention, access, and care", color: "#12314b" },
] as const;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const easeInOutCubic = (value: number) => {
  const progress = clamp01(value);
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

const windowProgress = (value: number, start: number, end: number) => (
  easeInOutCubic((value - start) / Math.max(0.001, end - start))
);

const pulseProgress = (value: number, start: number, end: number) => {
  if (value <= start || value >= end) return 0;
  return Math.sin(Math.PI * clamp01((value - start) / Math.max(0.001, end - start)));
};

function createOrganicLoopPoints(
  THREE: ThreeModule,
  radiusX: number,
  radiusY: number,
  phase: number,
  depth: number,
) {
  return Array.from({ length: 72 }, (_, index) => {
    const angle = (index / 72) * Math.PI * 2;
    const contour = 1 + Math.sin(angle * 3 + phase) * 0.035 + Math.cos(angle * 5 - phase) * 0.018;
    return new THREE.Vector3(
      Math.cos(angle) * radiusX * contour,
      Math.sin(angle) * radiusY * (1 + Math.cos(angle * 2 + phase) * 0.028),
      depth + Math.sin(angle * 2 + phase) * 0.055,
    );
  });
}

export function HeroVisual() {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const selectLayerRef = useRef<((index: number) => void) | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [renderStatus, setRenderStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  const activeLayer = layers[activeIndex];

  const selectLayer = (index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    selectLayerRef.current?.(index);
  };

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return undefined;

    let cancelled = false;
    let cleanupScene: (() => void) | undefined;

    const initialize = async () => {
      let renderer: import("three").WebGLRenderer | null = null;
      const geometries: import("three").BufferGeometry[] = [];
      const materials: import("three").Material[] = [];
      let resizeObserver: ResizeObserver | null = null;
      let motionQuery: MediaQueryList | null = null;
      let handleMotionChange: ((event: MediaQueryListEvent) => void) | null = null;
      let reducedMotion = false;
      let frameId = 0;

      try {
        const THREE = await import("three");
        if (cancelled) return;

        motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        reducedMotion = motionQuery.matches;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.04;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.domElement.setAttribute("aria-hidden", "true");
        mount.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
        camera.position.set(0, 0, 9.25);

        const world = new THREE.Group();
        world.rotation.set(0.025, -0.045, 0.005);
        scene.add(world);

        const hemisphereLight = new THREE.HemisphereLight(0xf8fbfa, 0x12314b, 1.35);
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
        const fillLight = new THREE.PointLight(0x9fd7cd, 2.5, 9);
        keyLight.position.set(-2.8, 3.4, 5.8);
        fillLight.position.set(2.8, -1.2, 3.8);
        scene.add(hemisphereLight, keyLight, fillLight);

        const evidenceGeometry = new THREE.SphereGeometry(0.086, 18, 14);
        const evidenceLargeGeometry = new THREE.SphereGeometry(0.12, 20, 16);
        const tracerGeometry = new THREE.SphereGeometry(0.055, 14, 10);
        const markerGeometry = new THREE.SphereGeometry(0.23, 24, 18);
        geometries.push(evidenceGeometry, evidenceLargeGeometry, tracerGeometry, markerGeometry);

        const makeTube = (
          points: import("three").Vector3[],
          options: { color: string; opacity: number; radius: number; closed?: boolean; segments?: number },
        ) => {
          const curve = new THREE.CatmullRomCurve3(points, options.closed ?? false, "centripetal", 0.5);
          const geometry = new THREE.TubeGeometry(
            curve,
            options.segments ?? (options.closed ? 88 : 56),
            options.radius,
            6,
            options.closed ?? false,
          );
          const material = new THREE.MeshBasicMaterial({
            color: options.color,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          });
          const mesh = new THREE.Mesh(geometry, material);
          geometries.push(geometry);
          materials.push(material);
          return { curve, material, mesh, opacity: options.opacity };
        };

        const verticalAxis = new THREE.Vector3(0, 1, 0);
        const makeStraightSegment = (
          start: import("three").Vector3,
          end: import("three").Vector3,
          options: { color: string; opacity: number; radius: number },
        ) => {
          const direction = new THREE.Vector3().subVectors(end, start);
          const geometry = new THREE.CylinderGeometry(options.radius, options.radius, direction.length(), 6, 1, false);
          const material = new THREE.MeshBasicMaterial({
            color: options.color,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          });
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.copy(start).add(end).multiplyScalar(0.5);
          mesh.quaternion.setFromUnitVectors(verticalAxis, direction.normalize());
          geometries.push(geometry);
          materials.push(material);
          return { material, mesh, opacity: options.opacity };
        };

        const makeTracer = (
          curve: import("three").Curve<import("three").Vector3>,
          color: string,
          start: number,
          end: number,
        ): TracerEntry => {
          const material = new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          });
          const mesh = new THREE.Mesh(tracerGeometry, material);
          mesh.visible = false;
          materials.push(material);
          return { mesh, material, curve, start, end };
        };

        // BODY: evidence passes through nested, organic membranes and converges
        // on one biological response. Nothing here loops after the click event.
        const bodyGroup = new THREE.Group();
        bodyGroup.position.set(-0.82, 0, 0);
        const bodyFades: FadeEntry[] = [];
        const bodyMembranes: import("three").Mesh[] = [];
        [
          { x: 1.42, y: 1.18, phase: 0.2, z: -0.08, opacity: 0.27, radius: 0.012 },
          { x: 1.01, y: 0.83, phase: 1.15, z: 0.02, opacity: 0.39, radius: 0.014 },
          { x: 0.61, y: 0.49, phase: 2.2, z: 0.14, opacity: 0.55, radius: 0.016 },
        ].forEach((specification) => {
          const tube = makeTube(
            createOrganicLoopPoints(THREE, specification.x, specification.y, specification.phase, specification.z),
            {
              color: layers[0].color,
              opacity: specification.opacity,
              radius: specification.radius,
              closed: true,
            },
          );
          bodyMembranes.push(tube.mesh);
          bodyFades.push({ material: tube.material, opacity: tube.opacity });
          bodyGroup.add(tube.mesh);
        });

        const bodyCoreMaterial = new THREE.MeshStandardMaterial({
          color: "#f5e7bd",
          emissive: layers[0].color,
          emissiveIntensity: 0.16,
          metalness: 0.03,
          roughness: 0.34,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const bodyCore = new THREE.Mesh(markerGeometry, bodyCoreMaterial);
        bodyCore.position.z = 0.25;
        bodyCore.scale.set(1, 1.16, 0.58);
        materials.push(bodyCoreMaterial);
        bodyFades.push({ material: bodyCoreMaterial, opacity: 0.9 });
        bodyGroup.add(bodyCore);

        const bodyPathMaterials: import("three").MeshBasicMaterial[] = [];
        const bodyTracers: TracerEntry[] = [];
        [0.92, 0.32, -0.34, -0.92].forEach((startY, index) => {
          const tube = makeTube([
            new THREE.Vector3(-1.72, startY, 0.16 - index * 0.03),
            new THREE.Vector3(-1.24, startY * 0.84, 0.2),
            new THREE.Vector3(-0.72, startY * 0.52, 0.25),
            new THREE.Vector3(-0.05, startY * 0.08, 0.3),
          ], {
            color: layers[0].color,
            opacity: 0.2,
            radius: 0.009,
            segments: 52,
          });
          const tracer = makeTracer(tube.curve, layers[0].color, 0.1 + index * 0.055, 0.61 + index * 0.055);
          bodyPathMaterials.push(tube.material);
          bodyTracers.push(tracer);
          bodyFades.push({ material: tube.material, opacity: tube.opacity });
          bodyGroup.add(tube.mesh, tracer.mesh);
        });

        // ENVIRONMENT: asymmetric place contours and directional exposure flows.
        // It intentionally avoids globes, shells, and planetary orbits.
        const environmentGroup = new THREE.Group();
        environmentGroup.position.set(-0.78, 0, 0);
        const environmentFades: FadeEntry[] = [];
        const environmentContours: Array<{ mesh: import("three").Mesh; material: import("three").MeshBasicMaterial; opacity: number }> = [];
        [-1.12, -0.58, -0.05, 0.52, 1.06].forEach((baseY, contourIndex) => {
          const points = Array.from({ length: 10 }, (_, pointIndex) => {
            const progress = pointIndex / 9;
            const x = -1.78 + progress * 3.05;
            const y = baseY
              + Math.sin(progress * Math.PI * (1.35 + contourIndex * 0.08) + contourIndex * 0.7) * 0.13
              + Math.cos(progress * Math.PI * 3.2 - contourIndex) * 0.035;
            return new THREE.Vector3(x, y, -0.14 + contourIndex * 0.045 + Math.sin(progress * Math.PI) * 0.08);
          });
          const tube = makeTube(points, {
            color: contourIndex % 2 === 0 ? "#78bdb5" : layers[1].color,
            opacity: contourIndex === 2 ? 0.37 : 0.24,
            radius: contourIndex === 2 ? 0.013 : 0.01,
            segments: 64,
          });
          environmentContours.push({ mesh: tube.mesh, material: tube.material, opacity: tube.opacity });
          environmentFades.push({ material: tube.material, opacity: tube.opacity });
          environmentGroup.add(tube.mesh);
        });

        const environmentFlowMaterials: import("three").MeshBasicMaterial[] = [];
        const environmentFlowOpacities = [0.4, 0.58, 0.4];
        const environmentTracers: TracerEntry[] = [];
        [
          [new THREE.Vector3(-1.8, 0.88, 0.2), new THREE.Vector3(-1.1, 0.62, 0.24), new THREE.Vector3(-0.38, 0.28, 0.3), new THREE.Vector3(1.08, -0.12, 0.34)],
          [new THREE.Vector3(-1.8, 0.08, 0.08), new THREE.Vector3(-0.98, 0.02, 0.16), new THREE.Vector3(-0.18, -0.04, 0.24), new THREE.Vector3(1.08, -0.12, 0.34)],
          [new THREE.Vector3(-1.8, -0.92, 0.16), new THREE.Vector3(-1.18, -0.72, 0.22), new THREE.Vector3(-0.44, -0.38, 0.28), new THREE.Vector3(1.08, -0.12, 0.34)],
        ].forEach((points, index) => {
          const tube = makeTube(points, {
            color: index === 1 ? "#117e76" : layers[1].color,
            opacity: index === 1 ? 0.58 : 0.4,
            radius: index === 1 ? 0.02 : 0.015,
            segments: 68,
          });
          const tracer = makeTracer(tube.curve, index === 1 ? "#f2b84b" : "#159a91", 0.16 + index * 0.09, 0.78 + index * 0.055);
          environmentFlowMaterials.push(tube.material);
          environmentTracers.push(tracer);
          environmentFades.push({ material: tube.material, opacity: tube.opacity });
          environmentGroup.add(tube.mesh, tracer.mesh);
        });

        const environmentMarkerMaterial = new THREE.MeshStandardMaterial({
          color: "#f5e7bd",
          emissive: layers[0].color,
          emissiveIntensity: 0.12,
          roughness: 0.34,
          metalness: 0.02,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const environmentMarkerRingGeometry = new THREE.TorusGeometry(0.25, 0.014, 8, 48);
        const environmentMarkerRingMaterial = new THREE.MeshBasicMaterial({
          color: layers[0].color,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const environmentMarker = new THREE.Mesh(evidenceLargeGeometry, environmentMarkerMaterial);
        const environmentMarkerRing = new THREE.Mesh(environmentMarkerRingGeometry, environmentMarkerRingMaterial);
        environmentMarker.position.set(1.08, -0.12, 0.34);
        environmentMarkerRing.position.copy(environmentMarker.position);
        geometries.push(environmentMarkerRingGeometry);
        materials.push(environmentMarkerMaterial, environmentMarkerRingMaterial);
        environmentFades.push(
          { material: environmentMarkerMaterial, opacity: 0.94 },
          { material: environmentMarkerRingMaterial, opacity: 0.62 },
        );
        environmentGroup.add(environmentMarker, environmentMarkerRing);

        // SYSTEMS: policy and service nodes form a dense, straight-edge mesh.
        // Stronger final links keep the direction toward an outcome readable.
        const systemsGroup = new THREE.Group();
        systemsGroup.position.set(-0.82, 0, 0);
        const systemsFades: FadeEntry[] = [];
        const systemLocalLayout = [
          [-1.55, 1.04, 0.02], [-1.55, 0.35, 0.14], [-1.55, -0.35, 0.08], [-1.55, -1.04, -0.02],
          [-0.42, 0.9, 0.1], [-0.42, 0.3, 0.23], [-0.42, -0.3, 0.18], [-0.42, -0.9, 0.06],
          [0.55, 0.64, 0.16], [0.55, 0, 0.3], [0.55, -0.64, 0.14], [1.15, 0, 0.36],
        ].map(([x, y, z]) => new THREE.Vector3(x, y, z));
        const systemEdges: Array<{ material: import("three").MeshBasicMaterial; opacity: number; order: number }> = [];
        const systemConnectionGroups = [
          {
            pairs: [
              [0, 4], [0, 5],
              [1, 4], [1, 5], [1, 6],
              [2, 5], [2, 6], [2, 7],
              [3, 6], [3, 7],
            ],
            order: 0,
            opacity: 0.32,
            radius: 0.01,
          },
          {
            pairs: [[4, 5], [5, 6], [6, 7]],
            order: 1,
            opacity: 0.22,
            radius: 0.008,
          },
          {
            pairs: [
              [4, 8], [4, 9],
              [5, 8], [5, 9],
              [6, 8], [6, 9], [6, 10],
              [7, 9], [7, 10],
            ],
            order: 1,
            opacity: 0.35,
            radius: 0.011,
          },
          {
            pairs: [[8, 9], [9, 10]],
            order: 2,
            opacity: 0.25,
            radius: 0.009,
          },
          {
            pairs: [[8, 11], [9, 11], [10, 11]],
            order: 2,
            opacity: 0.58,
            radius: 0.017,
          },
        ] as const;
        systemConnectionGroups.forEach((connectionGroup) => {
          connectionGroup.pairs.forEach(([fromIndex, toIndex]) => {
            const segment = makeStraightSegment(systemLocalLayout[fromIndex], systemLocalLayout[toIndex], {
              color: layers[2].color,
              opacity: connectionGroup.opacity,
              radius: connectionGroup.radius,
            });
            systemEdges.push({
              material: segment.material,
              opacity: segment.opacity,
              order: connectionGroup.order,
            });
            systemsFades.push({ material: segment.material, opacity: segment.opacity });
            systemsGroup.add(segment.mesh);
          });
        });

        const systemOutcomeRingGeometry = new THREE.TorusGeometry(0.25, 0.015, 8, 52);
        const systemOutcomeRingMaterial = new THREE.MeshBasicMaterial({
          color: layers[0].color,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const systemOutcomeRing = new THREE.Mesh(systemOutcomeRingGeometry, systemOutcomeRingMaterial);
        systemOutcomeRing.position.copy(systemLocalLayout[11]);
        geometries.push(systemOutcomeRingGeometry);
        materials.push(systemOutcomeRingMaterial);
        systemsFades.push({ material: systemOutcomeRingMaterial, opacity: 0.72 });
        systemsGroup.add(systemOutcomeRing);

        const systemSignalCurve = new THREE.CurvePath<import("three").Vector3>();
        [1, 5, 9, 11].forEach((nodeIndex, pathIndex, path) => {
          if (pathIndex === path.length - 1) return;
          systemSignalCurve.add(new THREE.LineCurve3(
            systemLocalLayout[nodeIndex].clone(),
            systemLocalLayout[path[pathIndex + 1]].clone(),
          ));
        });
        const systemSignal = makeTracer(systemSignalCurve, layers[0].color, 0.35, 0.9);
        systemsGroup.add(systemSignal.mesh);

        const structures: SceneStructure[] = [
          { group: bodyGroup, fades: bodyFades },
          { group: environmentGroup, fades: environmentFades },
          { group: systemsGroup, fades: systemsFades },
        ];
        world.add(bodyGroup, environmentGroup, systemsGroup);

        const toWorldLayout = (group: import("three").Group, coordinates: number[][]) => coordinates.map(([x, y, z]) => (
          new THREE.Vector3(x + group.position.x, y + group.position.y, z + group.position.z)
        ));
        const bodyLayout = toWorldLayout(bodyGroup, [
          [-1.18, 0.68, 0.04], [-1.16, -0.68, 0.1], [-0.55, 1.08, -0.04], [-0.52, -1.08, 0.02],
          [0.4, 1, 0.12], [0.42, -1, 0.1], [1.12, 0.62, 0.08], [1.1, -0.62, 0.14],
          [-0.64, 0.34, 0.28], [-0.62, -0.34, 0.24], [0.64, 0.32, 0.32], [0.62, -0.32, 0.34],
        ]);
        const environmentLayout = toWorldLayout(environmentGroup, [
          [-1.62, 0.96, 0.14], [-1.18, 0.7, 0.2], [-0.68, 0.48, 0.26], [-0.12, 0.26, 0.3],
          [-1.6, 0.08, 0.05], [-1.02, 0.03, 0.13], [-0.42, -0.02, 0.2], [0.16, -0.07, 0.28],
          [-1.5, -0.92, 0.1], [-0.94, -0.68, 0.18], [-0.34, -0.39, 0.25], [0.55, -0.18, 0.34],
        ]);
        const systemsLayout = systemLocalLayout.map((position) => position.clone().add(systemsGroup.position));
        const layouts = [bodyLayout, environmentLayout, systemsLayout];

        const evidenceGroup = new THREE.Group();
        const evidenceNodes: import("three").Mesh[] = [];
        const evidenceMaterials: import("three").MeshStandardMaterial[] = [];
        bodyLayout.forEach((position, index) => {
          const material = new THREE.MeshStandardMaterial({
            color: layers[0].color,
            emissive: layers[0].color,
            emissiveIntensity: 0.08,
            metalness: 0.07,
            roughness: 0.28,
            transparent: true,
            opacity: 0.88,
            depthWrite: false,
          });
          const node = new THREE.Mesh(index % 4 === 0 || index === 11 ? evidenceLargeGeometry : evidenceGeometry, material);
          node.position.copy(position);
          evidenceNodes.push(node);
          evidenceMaterials.push(material);
          materials.push(material);
          evidenceGroup.add(node);
        });
        world.add(evidenceGroup);

        const sceneMix = [1, 0, 0];
        const transitionFromMix = [1, 0, 0];
        const fadeOutRatios = structures.map((structure) => structure.fades.map(() => 1));
        const allTracers = [...bodyTracers, ...environmentTracers, systemSignal];
        const tracerSceneIndexes = allTracers.map((_, index) => (
          index < bodyTracers.length ? 0 : index < bodyTracers.length + environmentTracers.length ? 1 : 2
        ));
        const tracerExitOpacities = allTracers.map(() => 0);
        const transitionFromPositions = evidenceNodes.map((node) => node.position.clone());
        const transitionFromColors = evidenceMaterials.map((material) => material.color.clone());
        const eventFromNodeScales = evidenceNodes.map((node) => node.scale.x);
        const eventFromNodeEmissive = evidenceMaterials.map((material) => material.emissiveIntensity);
        const eventFromNodeOpacity = evidenceMaterials.map((material) => material.opacity);
        const eventFromBodyMembraneScales = bodyMembranes.map((membrane) => membrane.scale.x);
        const eventFromBodyCoreScale = bodyCore.scale.clone();
        let eventFromBodyCoreEmissive = bodyCoreMaterial.emissiveIntensity;
        const eventFromBodyPathOpacity = bodyPathMaterials.map((material) => material.opacity);
        const eventFromEnvironmentContourScales = environmentContours.map(({ mesh }) => mesh.scale.clone());
        const eventFromEnvironmentContourOpacity = environmentContours.map(({ material }) => material.opacity);
        const eventFromEnvironmentFlowOpacity = environmentFlowMaterials.map((material) => material.opacity);
        let eventFromEnvironmentMarkerScale = environmentMarkerRing.scale.x;
        let eventFromEnvironmentMarkerEmissive = environmentMarkerMaterial.emissiveIntensity;
        const eventFromSystemEdgeOpacity = systemEdges.map(({ material }) => material.opacity);
        let eventFromSystemOutcomeScale = systemOutcomeRing.scale.x;
        const targetColor = new THREE.Color(layers[0].color);
        const rotationTargets = [
          { x: 0.025, y: -0.045, z: 0.005 },
          { x: -0.02, y: 0.055, z: -0.012 },
          { x: 0, y: 0.01, z: 0 },
        ];
        const cameraTargets = [9.25, 9.95, 9.62];
        let targetIndex = activeIndexRef.current;
        let transitionStart = 0;
        let transitionDuration = 960;
        let transitionActive = false;
        let eventStart = 0;
        let eventActive = false;
        let cameraFromZ = camera.position.z;
        let rotationFrom = { x: world.rotation.x, y: world.rotation.y, z: world.rotation.z };

        const prepareTracers = (eventProgress: number) => {
          const exitFade = 1 - windowProgress(eventProgress, 0, 0.18);
          allTracers.forEach((tracer, index) => {
            const sceneIndex = tracerSceneIndexes[index];
            const startMix = Math.max(0.001, transitionFromMix[sceneIndex]);
            const sceneFade = Math.min(1, sceneMix[sceneIndex] / startMix);
            const opacity = tracerExitOpacities[index] * exitFade * sceneFade;
            tracer.material.opacity = opacity;
            tracer.mesh.visible = opacity > 0.004;
          });
        };

        const updateTracer = (tracer: TracerEntry, eventProgress: number, mix: number) => {
          const progress = clamp01((eventProgress - tracer.start) / Math.max(0.001, tracer.end - tracer.start));
          const active = mix > 0.004 && eventProgress > tracer.start && eventProgress < tracer.end;
          if (!active) return;
          tracer.mesh.visible = true;
          tracer.curve.getPointAt(easeInOutCubic(progress), tracer.mesh.position);
          tracer.material.opacity = mix * Math.sin(Math.PI * progress) * 0.96;
          tracer.mesh.scale.setScalar(0.82 + Math.sin(Math.PI * progress) * 0.5);
        };

        const applyScene = (eventProgress: number, transitionProgress: number) => {
          const eventBlend = windowProgress(eventProgress, 0, 0.18);
          structures.forEach((structure, index) => {
            const mix = sceneMix[index];
            structure.group.visible = mix > 0.003;
            structure.fades.forEach((entry, fadeIndex) => {
              const retainedDetail = index === targetIndex ? 1 : fadeOutRatios[index][fadeIndex];
              entry.material.opacity = entry.opacity * mix * retainedDetail;
            });
          });
          prepareTracers(eventProgress);

          if (targetIndex === 0) {
            bodyMembranes.forEach((membrane, index) => {
              const settle = windowProgress(eventProgress, 0.08 + index * 0.055, 0.55 + index * 0.045);
              const compression = pulseProgress(eventProgress, 0.3 + index * 0.04, 0.72 + index * 0.04);
              const startScale = 1.09 - index * 0.018;
              const targetScale = THREE.MathUtils.lerp(startScale, 1, settle) - compression * 0.025;
              membrane.scale.setScalar(THREE.MathUtils.lerp(eventFromBodyMembraneScales[index], targetScale, eventBlend));
            });
            const response = pulseProgress(eventProgress, 0.56, 0.9);
            const coreScale = 1 + response * 0.2;
            bodyCore.scale.set(
              THREE.MathUtils.lerp(eventFromBodyCoreScale.x, coreScale, eventBlend),
              THREE.MathUtils.lerp(eventFromBodyCoreScale.y, 1.16 * coreScale, eventBlend),
              THREE.MathUtils.lerp(eventFromBodyCoreScale.z, 0.58 * coreScale, eventBlend),
            );
            bodyCoreMaterial.emissiveIntensity = THREE.MathUtils.lerp(
              eventFromBodyCoreEmissive,
              0.16 + response * 0.72,
              eventBlend,
            );
            bodyTracers.forEach((tracer, index) => {
              updateTracer(tracer, eventProgress, sceneMix[0]);
              const targetOpacity = 0.2 * sceneMix[0]
                * (0.72 + pulseProgress(eventProgress, tracer.start, tracer.end) * 0.7);
              bodyPathMaterials[index].opacity = THREE.MathUtils.lerp(
                eventFromBodyPathOpacity[index],
                targetOpacity,
                eventBlend,
              );
            });
          }

          if (targetIndex === 1) {
            environmentContours.forEach(({ mesh, material, opacity }, index) => {
              const reveal = windowProgress(eventProgress, 0.05 + index * 0.05, 0.5 + index * 0.045);
              const fromScale = eventFromEnvironmentContourScales[index];
              mesh.scale.set(
                THREE.MathUtils.lerp(fromScale.x, 0.82 + reveal * 0.18, eventBlend),
                THREE.MathUtils.lerp(fromScale.y, 1 + (1 - reveal) * 0.045, eventBlend),
                THREE.MathUtils.lerp(fromScale.z, 1, eventBlend),
              );
              material.opacity = THREE.MathUtils.lerp(
                eventFromEnvironmentContourOpacity[index],
                opacity * sceneMix[1] * (0.48 + reveal * 0.52),
                eventBlend,
              );
            });
            environmentTracers.forEach((tracer, index) => {
              updateTracer(tracer, eventProgress, sceneMix[1]);
              const targetOpacity = environmentFlowOpacities[index] * sceneMix[1]
                * (0.72 + pulseProgress(eventProgress, tracer.start, tracer.end) * 0.55);
              environmentFlowMaterials[index].opacity = THREE.MathUtils.lerp(
                eventFromEnvironmentFlowOpacity[index],
                targetOpacity,
                eventBlend,
              );
            });
            const arrival = pulseProgress(eventProgress, 0.7, 0.98);
            environmentMarkerRing.scale.setScalar(THREE.MathUtils.lerp(
              eventFromEnvironmentMarkerScale,
              1 + arrival * 0.32,
              eventBlend,
            ));
            environmentMarkerMaterial.emissiveIntensity = THREE.MathUtils.lerp(
              eventFromEnvironmentMarkerEmissive,
              0.12 + arrival * 0.66,
              eventBlend,
            );
          }

          if (targetIndex === 2) {
            systemEdges.forEach((edge, index) => {
              const withinStage = (index % 5) * 0.022;
              const reveal = windowProgress(
                eventProgress,
                0.12 + edge.order * 0.17 + withinStage,
                0.42 + edge.order * 0.17 + withinStage,
              );
              edge.material.opacity = THREE.MathUtils.lerp(
                eventFromSystemEdgeOpacity[index],
                edge.opacity * sceneMix[2] * (0.14 + reveal * 0.86),
                eventBlend,
              );
            });
            updateTracer(systemSignal, eventProgress, sceneMix[2]);
            const arrival = pulseProgress(eventProgress, 0.73, 0.98);
            systemOutcomeRing.scale.setScalar(THREE.MathUtils.lerp(
              eventFromSystemOutcomeScale,
              1 + arrival * 0.38,
              eventBlend,
            ));
          }

          const transitionCompression = Math.sin(Math.PI * clamp01(transitionProgress)) * 0.1;
          evidenceNodes.forEach((node, index) => {
            let semanticPulse = 0;
            if (targetIndex === 0) {
              semanticPulse = pulseProgress(eventProgress, 0.3 + index * 0.012, 0.76 + index * 0.01);
            } else if (targetIndex === 1) {
              semanticPulse = pulseProgress(eventProgress, 0.2 + (index % 4) * 0.055, 0.76 + (index % 4) * 0.045);
            } else {
              const stage = index < 4 ? 0 : index < 8 ? 1 : index < 11 ? 2 : 3;
              semanticPulse = pulseProgress(eventProgress, 0.2 + stage * 0.17, 0.56 + stage * 0.17);
            }
            const targetScale = 1 - transitionCompression + semanticPulse * 0.28;
            node.scale.setScalar(THREE.MathUtils.lerp(eventFromNodeScales[index], targetScale, eventBlend));
            evidenceMaterials[index].emissiveIntensity = THREE.MathUtils.lerp(
              eventFromNodeEmissive[index],
              0.07 + semanticPulse * 0.52,
              eventBlend,
            );
            evidenceMaterials[index].opacity = THREE.MathUtils.lerp(
              eventFromNodeOpacity[index],
              0.78 + semanticPulse * 0.2,
              eventBlend,
            );
          });
        };

        const render = () => renderer?.render(scene, camera);

        const animate = (now: number) => {
          frameId = 0;
          let transitionProgress = 1;

          if (transitionActive) {
            transitionProgress = clamp01((now - transitionStart) / transitionDuration);
            const eased = easeInOutCubic(transitionProgress);
            evidenceNodes.forEach((node, index) => {
              node.position.lerpVectors(transitionFromPositions[index], layouts[targetIndex][index], eased);
              evidenceMaterials[index].color.lerpColors(transitionFromColors[index], targetColor, eased);
              evidenceMaterials[index].emissive.copy(evidenceMaterials[index].color);
            });
            sceneMix.forEach((_, index) => {
              const targetMix = index === targetIndex ? 1 : 0;
              sceneMix[index] = THREE.MathUtils.lerp(transitionFromMix[index], targetMix, windowProgress(transitionProgress, 0.03, 0.72));
            });
            camera.position.z = THREE.MathUtils.lerp(cameraFromZ, cameraTargets[targetIndex], eased);
            world.rotation.set(
              THREE.MathUtils.lerp(rotationFrom.x, rotationTargets[targetIndex].x, eased),
              THREE.MathUtils.lerp(rotationFrom.y, rotationTargets[targetIndex].y, eased),
              THREE.MathUtils.lerp(rotationFrom.z, rotationTargets[targetIndex].z, eased),
            );
            if (transitionProgress >= 1) transitionActive = false;
          }

          let eventProgress = 1;
          if (eventActive) {
            eventProgress = clamp01((now - eventStart) / 1080);
            if (eventProgress >= 1) eventActive = false;
          }

          applyScene(eventProgress, transitionProgress);
          render();
          if (transitionActive || eventActive) frameId = window.requestAnimationFrame(animate);
        };

        const schedule = () => {
          if (!frameId) frameId = window.requestAnimationFrame(animate);
        };

        const applyReducedMotionState = (index: number) => {
          targetIndex = index;
          evidenceNodes.forEach((node, nodeIndex) => {
            node.position.copy(layouts[index][nodeIndex]);
            evidenceMaterials[nodeIndex].color.set(layers[index].color);
            evidenceMaterials[nodeIndex].emissive.set(layers[index].color);
          });
          sceneMix.forEach((_, sceneIndex) => {
            sceneMix[sceneIndex] = sceneIndex === index ? 1 : 0;
          });
          camera.position.z = cameraTargets[index];
          world.rotation.set(rotationTargets[index].x, rotationTargets[index].y, rotationTargets[index].z);
          transitionActive = false;
          eventActive = false;
          applyScene(1, 1);
          render();
        };

        selectLayerRef.current = (index: number) => {
          if (reducedMotion) {
            applyReducedMotionState(index);
            return;
          }

          const now = performance.now();
          const sameTarget = index === targetIndex;
          allTracers.forEach((tracer, tracerIndex) => {
            tracerExitOpacities[tracerIndex] = tracer.material.opacity;
          });
          evidenceNodes.forEach((node, nodeIndex) => {
            eventFromNodeScales[nodeIndex] = node.scale.x;
            eventFromNodeEmissive[nodeIndex] = evidenceMaterials[nodeIndex].emissiveIntensity;
            eventFromNodeOpacity[nodeIndex] = evidenceMaterials[nodeIndex].opacity;
          });
          bodyMembranes.forEach((membrane, membraneIndex) => {
            eventFromBodyMembraneScales[membraneIndex] = membrane.scale.x;
          });
          eventFromBodyCoreScale.copy(bodyCore.scale);
          eventFromBodyCoreEmissive = bodyCoreMaterial.emissiveIntensity;
          bodyPathMaterials.forEach((material, pathIndex) => {
            eventFromBodyPathOpacity[pathIndex] = material.opacity;
          });
          environmentContours.forEach(({ mesh, material }, contourIndex) => {
            eventFromEnvironmentContourScales[contourIndex].copy(mesh.scale);
            eventFromEnvironmentContourOpacity[contourIndex] = material.opacity;
          });
          environmentFlowMaterials.forEach((material, flowIndex) => {
            eventFromEnvironmentFlowOpacity[flowIndex] = material.opacity;
          });
          eventFromEnvironmentMarkerScale = environmentMarkerRing.scale.x;
          eventFromEnvironmentMarkerEmissive = environmentMarkerMaterial.emissiveIntensity;
          systemEdges.forEach(({ material }, edgeIndex) => {
            eventFromSystemEdgeOpacity[edgeIndex] = material.opacity;
          });
          eventFromSystemOutcomeScale = systemOutcomeRing.scale.x;
          structures.forEach((structure, sceneIndex) => {
            structure.fades.forEach((entry, fadeIndex) => {
              const denominator = entry.opacity * sceneMix[sceneIndex];
              fadeOutRatios[sceneIndex][fadeIndex] = denominator > 0.0001
                ? THREE.MathUtils.clamp(entry.material.opacity / denominator, 0, 1.4)
                : 1;
            });
          });
          transitionFromPositions.forEach((position, nodeIndex) => position.copy(evidenceNodes[nodeIndex].position));
          transitionFromColors.forEach((color, nodeIndex) => color.copy(evidenceMaterials[nodeIndex].color));
          transitionFromMix.forEach((_, sceneIndex) => {
            transitionFromMix[sceneIndex] = sceneMix[sceneIndex];
          });
          cameraFromZ = camera.position.z;
          rotationFrom = { x: world.rotation.x, y: world.rotation.y, z: world.rotation.z };
          targetIndex = index;
          targetColor.set(layers[index].color);
          transitionDuration = sameTarget ? 520 : 960;
          transitionStart = now;
          eventStart = now;
          transitionActive = true;
          eventActive = true;
          schedule();
        };

        handleMotionChange = (event: MediaQueryListEvent) => {
          reducedMotion = event.matches;
          if (!reducedMotion) return;
          if (frameId) window.cancelAnimationFrame(frameId);
          frameId = 0;
          applyReducedMotionState(targetIndex);
        };
        motionQuery.addEventListener("change", handleMotionChange);

        const resize = () => {
          const bounds = mount.getBoundingClientRect();
          camera.aspect = Math.max(1, bounds.width) / Math.max(1, bounds.height);
          camera.updateProjectionMatrix();
          renderer?.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false);
          render();
        };

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        resize();
        selectLayerRef.current(activeIndexRef.current);
        setRenderStatus("ready");

        cleanupScene = () => {
          selectLayerRef.current = null;
          resizeObserver?.disconnect();
          if (handleMotionChange) motionQuery?.removeEventListener("change", handleMotionChange);
          if (frameId) window.cancelAnimationFrame(frameId);
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer?.dispose();
          renderer?.domElement.remove();
        };
      } catch (error) {
        console.warn("Three.js hero lens unavailable; using accessible fallback.", error);
        selectLayerRef.current = null;
        resizeObserver?.disconnect();
        if (handleMotionChange) motionQuery?.removeEventListener("change", handleMotionChange);
        if (frameId) window.cancelAnimationFrame(frameId);
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        if (!cancelled) setRenderStatus("unavailable");
        renderer?.dispose();
        renderer?.domElement.remove();
      }
    };

    // Keep the editorial text available immediately, then hydrate WebGL after
    // the critical hero content and controls have painted.
    const loadTimer = window.setTimeout(() => {
      void initialize();
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(loadTimer);
      cleanupScene?.();
    };
  }, []);

  return (
    <div
      className={`hero-lens-visual hero-lens-${renderStatus}`}
      role="group"
      aria-label="Interactive global-health lens. Choose Body, Environment, or Systems to see a distinct health pathway."
    >
      <div className="hero-lens-heading">
        <span>GLOBAL HEALTH LENS</span>
        <small>One evidence set · Three scales</small>
      </div>
      <div ref={canvasMountRef} className="hero-lens-canvas" aria-hidden="true" />
      <div className="hero-lens-fallback" aria-hidden="true"><i /><i /><i /></div>
      <p className="sr-only" role="status" aria-live="polite">
        {renderStatus === "loading"
          ? "Preparing the interactive global-health lens."
          : renderStatus === "unavailable"
            ? "The interactive visual is unavailable. Use the labelled controls to explore each level."
            : "Interactive global-health lens ready."}
      </p>
      <div className="hero-lens-active" aria-live="polite">
        <span>{activeLayer.label}</span>
        <strong>{activeLayer.title}</strong>
        <small>{activeLayer.description}</small>
      </div>
      <div className="hero-lens-controls" aria-label="Choose a global-health lens">
        {layers.map((layer, index) => (
          <button
            key={layer.id}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-label={`${layer.label}: ${layer.title}. ${index === activeIndex ? "Replay this pathway animation" : "Show this pathway animation"}.`}
            aria-pressed={index === activeIndex}
            onClick={() => selectLayer(index)}
          >
            <i style={{ backgroundColor: layer.color }} aria-hidden="true" />
            {layer.label}
          </button>
        ))}
      </div>
      <p className="hero-lens-hint">Select a lens · Click again to replay</p>
    </div>
  );
}
