"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type FeaturedNode = {
  id: string;
  latitude: number;
  longitude: number;
  color: string;
};

const featuredNodes: FeaturedNode[] = [
  { id: "seoul", latitude: 37.56, longitude: 126.98, color: "#f2b84b" },
  { id: "new-delhi", latitude: 28.61, longitude: 77.21, color: "#159a91" },
  { id: "mexico-city", latitude: 19.43, longitude: -99.13, color: "#75b85a" },
  { id: "paris", latitude: 48.86, longitude: 2.35, color: "#f2b84b" },
  { id: "new-york", latitude: 40.71, longitude: -74.01, color: "#159a91" },
];

const globeRadius = 2.5;
const defaultRotation = { x: -0.12, y: -Math.PI / 2 + 0.24, z: 0.04 };

function latLonToVector3(latitude: number, longitude: number, radius = globeRadius) {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);

  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.sin(lon),
    radius * Math.sin(lat),
    radius * Math.cos(lat) * Math.cos(lon),
  );
}

function createLatitudeRing(latitude: number, radius = globeRadius) {
  const points: THREE.Vector3[] = [];
  const lat = THREE.MathUtils.degToRad(latitude);
  const ringRadius = radius * Math.cos(lat);
  const y = radius * Math.sin(lat);

  for (let index = 0; index < 96; index += 1) {
    const angle = (index / 96) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, y, Math.sin(angle) * ringRadius));
  }

  return points;
}

function createMeridian(longitude: number, radius = globeRadius) {
  const points: THREE.Vector3[] = [];
  const lon = THREE.MathUtils.degToRad(longitude);

  for (let index = 0; index < 72; index += 1) {
    const latitude = -Math.PI / 2 + (index / 71) * Math.PI;
    points.push(
      new THREE.Vector3(
        radius * Math.cos(latitude) * Math.sin(lon),
        radius * Math.sin(latitude),
        radius * Math.cos(latitude) * Math.cos(lon),
      ),
    );
  }

  return points;
}

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return [
    Number.parseInt(value.slice(0, 2), 16) / 255,
    Number.parseInt(value.slice(2, 4), 16) / 255,
    Number.parseInt(value.slice(4, 6), 16) / 255,
  ];
}

function createSignalMaterial() {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {},
    vertexShader: `
      attribute float aSize;
      attribute vec3 aColor;
      varying vec3 vColor;

      void main() {
        vColor = aColor;
        vec4 modelPosition = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = aSize * (260.0 / max(1.0, -modelPosition.z));
        gl_Position = projectionMatrix * modelPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;

      void main() {
        float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
        float alpha = 1.0 - smoothstep(0.18, 0.5, distanceFromCenter);
        if (alpha < 0.02) discard;
        gl_FragColor = vec4(vColor, alpha * 0.9);
      }
    `,
  });
}

export function HeroVisual() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = canvasMountRef.current;
    const stage = stageRef.current;
    if (!mount || !stage) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
    let renderer: THREE.WebGLRenderer | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let frameId = 0;

    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0x000000, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(0, 0.1, 11.4);

      const globe = new THREE.Group();
      globe.rotation.set(defaultRotation.x, defaultRotation.y, defaultRotation.z);
      scene.add(globe);

      scene.add(new THREE.HemisphereLight("#f8fbfa", "#12314b", 1.4));
      const sun = new THREE.DirectionalLight("#fff4cf", 2.2);
      sun.position.set(-4, 3, 6);
      scene.add(sun);

      const earthGeometry = new THREE.SphereGeometry(globeRadius, 96, 64);
      const earthMaterial = new THREE.MeshStandardMaterial({
        color: "#d8e6df",
        emissive: "#6d958a",
        emissiveIntensity: 0.42,
        roughness: 0.92,
        metalness: 0,
        transparent: true,
        opacity: 0.9,
      });
      geometries.push(earthGeometry);
      materials.push(earthMaterial);
      globe.add(new THREE.Mesh(earthGeometry, earthMaterial));

      const earthTexture = new THREE.TextureLoader().load(
        "/brand/earth-atmos-2048.jpg",
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          earthMaterial.map = texture;
          earthMaterial.needsUpdate = true;
          renderer?.render(scene, camera);
        },
        undefined,
        () => {
          earthMaterial.color.set("#d8e6df");
          earthMaterial.needsUpdate = true;
          renderer?.render(scene, camera);
        },
      );
      textures.push(earthTexture);

      const gridMaterial = new THREE.LineBasicMaterial({
        color: "#7cbdb8",
        transparent: true,
        opacity: 0.34,
      });
      materials.push(gridMaterial);

      [-60, -30, 0, 30, 60].forEach((latitude) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(createLatitudeRing(latitude));
        geometries.push(geometry);
        globe.add(new THREE.LineLoop(geometry, gridMaterial));
      });

      [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].forEach((longitude) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(createMeridian(longitude));
        geometries.push(geometry);
        globe.add(new THREE.Line(geometry, gridMaterial));
      });

      const haloGeometry = new THREE.SphereGeometry(globeRadius * 1.08, 48, 32);
      const haloMaterial = new THREE.MeshBasicMaterial({
        color: "#8fd0c8",
        transparent: true,
        opacity: 0.1,
        side: THREE.BackSide,
        depthWrite: false,
      });
      geometries.push(haloGeometry);
      materials.push(haloMaterial);
      globe.add(new THREE.Mesh(haloGeometry, haloMaterial));

      const nodePositions: THREE.Vector3[] = [];
      const nodeSizes: number[] = [];
      const nodeColors: number[] = [];
      const genericColor = hexToRgb("#a7d4c9");
      const accentColors = [hexToRgb("#159a91"), hexToRgb("#f2b84b"), hexToRgb("#75b85a")];

      for (let index = 0; index < 58; index += 1) {
        const latitude = -62 + ((index * 37) % 124);
        const longitude = -180 + ((index * 71) % 360);
        nodePositions.push(latLonToVector3(latitude, longitude, globeRadius * 1.012));
        nodeSizes.push(index % 9 === 0 ? 0.085 : 0.052 + (index % 3) * 0.008);
        nodeColors.push(...(index % 8 === 0 ? accentColors[index % accentColors.length] : genericColor));
      }

      featuredNodes.forEach((node) => {
        nodePositions.push(latLonToVector3(node.latitude, node.longitude, globeRadius * 1.03));
        nodeSizes.push(0.14);
        nodeColors.push(...hexToRgb(node.color));
      });

      const signalGeometry = new THREE.BufferGeometry();
      signalGeometry.setAttribute("position", new THREE.Float32BufferAttribute(nodePositions.flatMap((point) => point.toArray()), 3));
      signalGeometry.setAttribute("aSize", new THREE.Float32BufferAttribute(nodeSizes, 1));
      signalGeometry.setAttribute("aColor", new THREE.Float32BufferAttribute(nodeColors, 3));
      const signalMaterial = createSignalMaterial();
      geometries.push(signalGeometry);
      materials.push(signalMaterial);
      globe.add(new THREE.Points(signalGeometry, signalMaterial));

      const connectionMaterial = new THREE.LineBasicMaterial({
        color: "#d9aa43",
        transparent: true,
        opacity: 0.36,
      });
      materials.push(connectionMaterial);
      const featuredPositions = featuredNodes.map((node) => latLonToVector3(node.latitude, node.longitude, globeRadius * 1.03));
      const connectionPairs: [THREE.Vector3, THREE.Vector3][] = [];

      featuredPositions.forEach((point, featuredIndex) => {
        const nearby = nodePositions
          .slice(0, 58)
          .map((candidate, index) => ({ candidate, index, distance: candidate.distanceTo(point) }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);
        nearby.forEach(({ candidate }) => connectionPairs.push([point, candidate]));
        if (featuredIndex > 0) connectionPairs.push([featuredPositions[featuredIndex - 1], point]);
      });

      connectionPairs.forEach(([start, end]) => {
        const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
        geometries.push(geometry);
        globe.add(new THREE.Line(geometry, connectionMaterial));
      });

      const markerGeometry = new THREE.SphereGeometry(0.105, 16, 12);
      geometries.push(markerGeometry);
      featuredNodes.forEach((node, index) => {
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: node.color,
          transparent: true,
          opacity: 0.95,
        });
        materials.push(markerMaterial);
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(featuredPositions[index]);
        globe.add(marker);
      });

      const resize = () => {
        const bounds = mount.getBoundingClientRect();
        const width = Math.max(1, bounds.width);
        const height = Math.max(1, bounds.height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer?.setSize(width, height, false);
        renderer?.render(scene, camera);
      };

      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);

      let currentRotation = { ...defaultRotation };
      let targetRotation = { ...defaultRotation };

      const render = () => renderer?.render(scene, camera);
      const animateRotation = () => {
        frameId = 0;
        currentRotation = {
          x: THREE.MathUtils.lerp(currentRotation.x, targetRotation.x, 0.12),
          y: THREE.MathUtils.lerp(currentRotation.y, targetRotation.y, 0.12),
          z: THREE.MathUtils.lerp(currentRotation.z, targetRotation.z, 0.12),
        };
        globe.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);
        render();

        const settled = Math.abs(currentRotation.x - targetRotation.x) < 0.001
          && Math.abs(currentRotation.y - targetRotation.y) < 0.001
          && Math.abs(currentRotation.z - targetRotation.z) < 0.001;
        if (!settled) frameId = window.requestAnimationFrame(animateRotation);
      };

      const scheduleRotation = () => {
        if (reducedMotion) {
          currentRotation = { ...targetRotation };
          globe.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);
          render();
          return;
        }
        if (!frameId) frameId = window.requestAnimationFrame(animateRotation);
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
        const bounds = stage.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        targetRotation = {
          x: defaultRotation.x - y * 0.12,
          y: defaultRotation.y + x * 0.2,
          z: defaultRotation.z,
        };
        scheduleRotation();
      };

      const handlePointerLeave = () => {
        targetRotation = { ...defaultRotation };
        scheduleRotation();
      };

      stage.addEventListener("pointermove", handlePointerMove);
      stage.addEventListener("pointerleave", handlePointerLeave);
      resize();

      return () => {
        stage.removeEventListener("pointermove", handlePointerMove);
        stage.removeEventListener("pointerleave", handlePointerLeave);
        resizeObserver?.disconnect();
        if (frameId) window.cancelAnimationFrame(frameId);
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        textures.forEach((texture) => texture.dispose());
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    } catch (error) {
      console.warn("Three.js hero visual unavailable; using accessible fallback.", error);
      stage.classList.add("hero-three-failed");
      renderer?.dispose();
      renderer?.domElement.remove();
      return undefined;
    }
  }, []);

  return (
    <div
      ref={stageRef}
      className="hero-three-visual"
      role="img"
      aria-label="A restrained three-dimensional global health network with connected regional signals."
    >
      <div ref={canvasMountRef} className="hero-three-canvas" aria-hidden="true" />
      <div className="hero-three-fallback" aria-hidden="true">
        <span>GLOBAL HEALTH NETWORK</span>
        <strong>Body · Environment · Systems</strong>
        <small>Five regional signals in view</small>
      </div>
      <div className="hero-three-label hero-three-label-top" aria-hidden="true">
        <span>GLOBAL HEALTH</span>
        <strong>05 signals in view</strong>
      </div>
      <div className="hero-three-label hero-three-label-bottom" aria-hidden="true">
        <i />
        <span>Body</span>
        <i />
        <span>Environment</span>
        <i />
        <span>Systems</span>
      </div>
    </div>
  );
}
