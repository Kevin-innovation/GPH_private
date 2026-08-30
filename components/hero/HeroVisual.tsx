"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const layers = [
  { id: "body", label: "Body", title: "What happens in people", description: "Biology, nutrition, and lived health", color: "#f2b84b" },
  { id: "environment", label: "Environment", title: "What shapes exposure", description: "Place, climate, food, and inequality", color: "#159a91" },
  { id: "systems", label: "Systems", title: "What changes outcomes", description: "Policy, prevention, access, and care", color: "#12314b" },
] as const;

type LayerSceneEntry = {
  group: THREE.Group;
  lineMaterial: THREE.LineBasicMaterial;
  nodeMaterials: THREE.MeshBasicMaterial[];
};

function createOrbitPoints(radius: number, squash: number, rotation: THREE.Euler) {
  const points: THREE.Vector3[] = [];
  for (let index = 0; index < 128; index += 1) {
    const angle = (index / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius * squash, 0).applyEuler(rotation));
  }
  return points;
}

export function HeroVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const selectLayerRef = useRef<((index: number) => void) | null>(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLayer = layers[activeIndex];

  const selectLayer = (index: number) => {
    activeIndexRef.current = index;
    setActiveIndex(index);
    selectLayerRef.current?.(index);
  };

  useEffect(() => {
    const mount = canvasMountRef.current;
    if (!mount) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    let renderer: THREE.WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let frameId = 0;

    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.cursor = "grab";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
      camera.position.set(0, 0, 9.8);

      const network = new THREE.Group();
      network.rotation.set(-0.08, -0.12, 0.03);
      scene.add(network);

      const centerGeometry = new THREE.RingGeometry(0.36, 0.48, 64);
      const centerMaterial = new THREE.MeshBasicMaterial({ color: "#f8fbfa", transparent: true, opacity: 0.92, side: THREE.DoubleSide });
      const irisGeometry = new THREE.RingGeometry(0.51, 0.535, 64);
      const irisMaterial = new THREE.MeshBasicMaterial({ color: "#159a91", transparent: true, opacity: 0.82, side: THREE.DoubleSide });
      geometries.push(centerGeometry, irisGeometry);
      materials.push(centerMaterial, irisMaterial);
      network.add(new THREE.Mesh(centerGeometry, centerMaterial), new THREE.Mesh(irisGeometry, irisMaterial));

      const dotGeometry = new THREE.SphereGeometry(0.09, 18, 14);
      const smallDotGeometry = new THREE.SphereGeometry(0.055, 16, 12);
      geometries.push(dotGeometry, smallDotGeometry);

      const orbitSpecs = [
        { radius: 1.35, squash: 0.72, rotation: new THREE.Euler(0.72, 0.2, 0.32), nodes: 5 },
        { radius: 2.05, squash: 0.63, rotation: new THREE.Euler(-0.48, 0.52, -0.16), nodes: 7 },
        { radius: 2.7, squash: 0.58, rotation: new THREE.Euler(0.2, -0.56, 0.42), nodes: 9 },
      ];

      const sceneLayers: LayerSceneEntry[] = orbitSpecs.map((spec, layerIndex) => {
        const layerGroup = new THREE.Group();
        const points = createOrbitPoints(spec.radius, spec.squash, spec.rotation);
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
          color: layers[layerIndex].color,
          transparent: true,
          opacity: layerIndex === activeIndexRef.current ? 0.92 : 0.24,
        });
        geometries.push(lineGeometry);
        materials.push(lineMaterial);
        layerGroup.add(new THREE.LineLoop(lineGeometry, lineMaterial));

        const nodeMaterials: THREE.MeshBasicMaterial[] = [];
        for (let nodeIndex = 0; nodeIndex < spec.nodes; nodeIndex += 1) {
          const pointIndex = Math.floor(((nodeIndex + 0.35 * layerIndex) / spec.nodes) * points.length) % points.length;
          const nodeMaterial = new THREE.MeshBasicMaterial({
            color: layers[layerIndex].color,
            transparent: true,
            opacity: layerIndex === activeIndexRef.current ? 1 : 0.36,
          });
          const node = new THREE.Mesh(nodeIndex % 3 === 0 ? dotGeometry : smallDotGeometry, nodeMaterial);
          node.position.copy(points[pointIndex]);
          node.scale.setScalar(layerIndex === activeIndexRef.current ? 1.3 : 0.86);
          nodeMaterials.push(nodeMaterial);
          materials.push(nodeMaterial);
          layerGroup.add(node);

          if (nodeIndex % 2 === 0) {
            const spokeGeometry = new THREE.BufferGeometry().setFromPoints([points[pointIndex].clone().multiplyScalar(0.2), points[pointIndex]]);
            const spokeMaterial = new THREE.LineBasicMaterial({ color: layers[layerIndex].color, transparent: true, opacity: 0.12 });
            geometries.push(spokeGeometry);
            materials.push(spokeMaterial);
            layerGroup.add(new THREE.Line(spokeGeometry, spokeMaterial));
          }
        }

        network.add(layerGroup);
        return { group: layerGroup, lineMaterial, nodeMaterials };
      });

      let currentRotation = { x: -0.08, y: -0.12, z: 0.03 };
      let targetRotation = { ...currentRotation };
      let currentLayerScale = sceneLayers.map((_, index) => (index === activeIndexRef.current ? 1.06 : 0.98));
      const targetLayerScale = [...currentLayerScale];
      let dragState: { pointerId: number; x: number; y: number; moved: boolean } | null = null;

      const render = () => renderer?.render(scene, camera);
      const animate = () => {
        frameId = 0;
        currentRotation = {
          x: THREE.MathUtils.lerp(currentRotation.x, targetRotation.x, 0.13),
          y: THREE.MathUtils.lerp(currentRotation.y, targetRotation.y, 0.13),
          z: THREE.MathUtils.lerp(currentRotation.z, targetRotation.z, 0.13),
        };
        network.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);
        let settled = Math.abs(currentRotation.x - targetRotation.x) < 0.001
          && Math.abs(currentRotation.y - targetRotation.y) < 0.001
          && Math.abs(currentRotation.z - targetRotation.z) < 0.001;

        sceneLayers.forEach((entry, index) => {
          currentLayerScale[index] = THREE.MathUtils.lerp(currentLayerScale[index], targetLayerScale[index], 0.15);
          entry.group.scale.setScalar(currentLayerScale[index]);
          if (Math.abs(currentLayerScale[index] - targetLayerScale[index]) >= 0.001) settled = false;
        });
        render();
        if (!settled) frameId = window.requestAnimationFrame(animate);
      };

      const schedule = () => {
        if (reducedMotion) {
          currentRotation = { ...targetRotation };
          network.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);
          currentLayerScale = [...targetLayerScale];
          sceneLayers.forEach((entry, index) => entry.group.scale.setScalar(currentLayerScale[index]));
          render();
          return;
        }
        if (!frameId) frameId = window.requestAnimationFrame(animate);
      };

      selectLayerRef.current = (index: number) => {
        sceneLayers.forEach((entry, layerIndex) => {
          const selected = layerIndex === index;
          entry.lineMaterial.opacity = selected ? 0.94 : 0.2;
          entry.nodeMaterials.forEach((material) => {
            material.opacity = selected ? 1 : 0.3;
            material.needsUpdate = true;
          });
          targetLayerScale[layerIndex] = selected ? 1.08 : 0.96;
        });
        targetRotation = {
          x: [-0.18, 0.1, -0.05][index],
          y: [-0.24, 0.18, 0.42][index],
          z: [0.05, -0.08, 0.14][index],
        };
        schedule();
      };

      const resize = () => {
        const bounds = mount.getBoundingClientRect();
        camera.aspect = Math.max(1, bounds.width) / Math.max(1, bounds.height);
        camera.updateProjectionMatrix();
        renderer?.setSize(Math.max(1, bounds.width), Math.max(1, bounds.height), false);
        render();
      };

      const handlePointerDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
        renderer?.domElement.setPointerCapture(event.pointerId);
        renderer?.domElement.classList.add("is-dragging");
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        const deltaX = event.clientX - dragState.x;
        const deltaY = event.clientY - dragState.y;
        dragState.x = event.clientX;
        dragState.y = event.clientY;
        if (Math.abs(deltaX) + Math.abs(deltaY) > 3) dragState.moved = true;
        const scale = event.pointerType === "touch" ? 0.008 : 0.006;
        targetRotation = {
          x: THREE.MathUtils.clamp(currentRotation.x - deltaY * scale, -0.9, 0.9),
          y: currentRotation.y + deltaX * scale,
          z: currentRotation.z,
        };
        schedule();
      };

      const finishPointer = (event: PointerEvent, shouldSelect: boolean) => {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        const wasClick = !dragState.moved;
        if (renderer?.domElement.hasPointerCapture(event.pointerId)) renderer.domElement.releasePointerCapture(event.pointerId);
        dragState = null;
        renderer?.domElement.classList.remove("is-dragging");
        if (shouldSelect && wasClick) selectLayer((activeIndexRef.current + 1) % layers.length);
      };

      const handlePointerUp = (event: PointerEvent) => finishPointer(event, true);
      const handlePointerCancel = (event: PointerEvent) => finishPointer(event, false);
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      renderer.domElement.addEventListener("pointerdown", handlePointerDown);
      renderer.domElement.addEventListener("pointermove", handlePointerMove);
      renderer.domElement.addEventListener("pointerup", handlePointerUp);
      renderer.domElement.addEventListener("pointercancel", handlePointerCancel);
      resize();
      selectLayerRef.current(activeIndexRef.current);

      return () => {
        selectLayerRef.current = null;
        renderer?.domElement.removeEventListener("pointerdown", handlePointerDown);
        renderer?.domElement.removeEventListener("pointermove", handlePointerMove);
        renderer?.domElement.removeEventListener("pointerup", handlePointerUp);
        renderer?.domElement.removeEventListener("pointercancel", handlePointerCancel);
        resizeObserver?.disconnect();
        if (frameId) window.cancelAnimationFrame(frameId);
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    } catch (error) {
      console.warn("Three.js hero lens unavailable; using accessible fallback.", error);
      stageRef.current?.classList.add("hero-lens-failed");
      renderer?.dispose();
      renderer?.domElement.remove();
      return undefined;
    }
  }, []);

  return (
    <div
      ref={stageRef}
      className="hero-lens-visual"
      role="group"
      aria-label="Interactive global-health lens. Drag the network or choose Body, Environment, or Systems."
    >
      <div className="hero-lens-heading">
        <span>GLOBAL HEALTH LENS</span>
        <small>Three connected levels</small>
      </div>
      <div ref={canvasMountRef} className="hero-lens-canvas" aria-hidden="true" />
      <div className="hero-lens-fallback" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero-lens-active" aria-live="polite">
        <span>{activeLayer.label}</span>
        <strong>{activeLayer.title}</strong>
        <small>{activeLayer.description}</small>
      </div>
      <div className="hero-lens-controls" aria-label="Choose a global-health level">
        {layers.map((layer, index) => (
          <button
            key={layer.id}
            type="button"
            className={index === activeIndex ? "is-active" : ""}
            aria-pressed={index === activeIndex}
            onClick={() => selectLayer(index)}
          >
            <i style={{ backgroundColor: layer.color }} aria-hidden="true" />
            {layer.label}
          </button>
        ))}
      </div>
      <p className="hero-lens-hint">Drag the network · Select a level</p>
    </div>
  );
}
