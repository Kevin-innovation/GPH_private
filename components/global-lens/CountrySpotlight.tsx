"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { countrySpotlights } from "@/content/countries";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";

const globeRadius = 2.32;
const accentPalette = ["#159a91", "#f2b84b", "#75b85a", "#117e76", "#d49b2f"];

function latLonToVector3(latitude: number, longitude: number, radius = globeRadius) {
  const lat = THREE.MathUtils.degToRad(latitude);
  const lon = THREE.MathUtils.degToRad(longitude);

  // Match SphereGeometry's equirectangular UV orientation: Greenwich sits on
  // +X and east longitudes move toward -Z on the unrotated sphere.
  return new THREE.Vector3(
    radius * Math.cos(lat) * Math.cos(lon),
    radius * Math.sin(lat),
    -radius * Math.cos(lat) * Math.sin(lon),
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
        radius * Math.cos(latitude) * Math.cos(lon),
        radius * Math.sin(latitude),
        -radius * Math.cos(latitude) * Math.sin(lon),
      ),
    );
  }

  return points;
}

function nearestAngle(angle: number, current: number) {
  let next = angle;
  while (next - current > Math.PI) next -= Math.PI * 2;
  while (next - current < -Math.PI) next += Math.PI * 2;
  return next;
}

function countryRotation(countryId: string, currentY: number) {
  const country = countrySpotlights.find((item) => item.id === countryId) ?? countrySpotlights[0];
  return {
    x: THREE.MathUtils.clamp(THREE.MathUtils.degToRad(country.latitude) * 0.84, -0.78, 0.78),
    y: nearestAngle(-THREE.MathUtils.degToRad(country.longitude) - Math.PI / 2, currentY),
    z: 0.015,
  };
}

type CountryGlobeProps = {
  selectedId: string;
  onSelect: (countryId: string) => void;
};

function CountryGlobe({ selectedId, onSelect }: CountryGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<((countryId: string) => void) | null>(null);
  const onSelectRef = useRef(onSelect);
  const selectedIdRef = useRef(selectedId);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];
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
      const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 100);
      camera.position.set(0, 0.06, 9.2);

      const globe = new THREE.Group();
      const initialRotation = countryRotation(selectedIdRef.current, 0);
      globe.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
      scene.add(globe);

      scene.add(new THREE.HemisphereLight("#f8fbfa", "#12314b", 1.25));
      const sun = new THREE.DirectionalLight("#fff4cf", 2.1);
      sun.position.set(-4, 3, 6);
      scene.add(sun);

      const earthGeometry = new THREE.SphereGeometry(globeRadius, 96, 64);
      const earthMaterial = new THREE.MeshStandardMaterial({
        color: "#d8e6df",
        emissive: "#557e75",
        emissiveIntensity: 0.28,
        roughness: 0.92,
        metalness: 0,
        transparent: true,
        opacity: 0.94,
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

      const gridMaterial = new THREE.LineBasicMaterial({ color: "#9acdc6", transparent: true, opacity: 0.27 });
      materials.push(gridMaterial);
      [-60, -30, 0, 30, 60].forEach((latitude) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(createLatitudeRing(latitude, globeRadius * 1.008));
        geometries.push(geometry);
        globe.add(new THREE.LineLoop(geometry, gridMaterial));
      });
      [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].forEach((longitude) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(createMeridian(longitude, globeRadius * 1.008));
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

      const markerGeometry = new THREE.SphereGeometry(0.085, 18, 14);
      const hitGeometry = new THREE.SphereGeometry(0.25, 12, 10);
      const ringGeometry = new THREE.RingGeometry(0.13, 0.145, 28);
      geometries.push(markerGeometry, hitGeometry, ringGeometry);

      const markerEntries = countrySpotlights.map((country, index) => {
        const position = latLonToVector3(country.latitude, country.longitude, globeRadius * 1.025);
        const markerMaterial = new THREE.MeshBasicMaterial({ color: accentPalette[index % accentPalette.length] });
        const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: accentPalette[index % accentPalette.length],
          transparent: true,
          opacity: country.id === selectedIdRef.current ? 0.9 : 0.28,
          side: THREE.DoubleSide,
          depthWrite: false,
        });
        materials.push(markerMaterial, hitMaterial, ringMaterial);

        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.copy(position);
        marker.userData.countryId = country.id;
        globe.add(marker);

        const hit = new THREE.Mesh(hitGeometry, hitMaterial);
        hit.position.copy(position);
        hit.userData.countryId = country.id;
        globe.add(hit);

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(position);
        ring.lookAt(position.clone().multiplyScalar(2));
        globe.add(ring);

        return { country, marker, hit, ring, ringMaterial };
      });

      const updateMarkerSelection = (countryId: string) => {
        markerEntries.forEach(({ country, marker, ring, ringMaterial }) => {
          const isSelected = country.id === countryId;
          marker.scale.setScalar(isSelected ? 1.55 : 1);
          ring.scale.setScalar(isSelected ? 1.45 : 1);
          ringMaterial.opacity = isSelected ? 0.9 : 0.28;
          ringMaterial.needsUpdate = true;
        });
      };

      let currentRotation = { ...initialRotation };
      let targetRotation = { ...initialRotation };
      let dragState: { pointerId: number; x: number; y: number; moved: boolean } | null = null;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();

      const render = () => renderer?.render(scene, camera);
      const animateRotation = () => {
        frameId = 0;
        currentRotation = {
          x: THREE.MathUtils.lerp(currentRotation.x, targetRotation.x, 0.14),
          y: THREE.MathUtils.lerp(currentRotation.y, targetRotation.y, 0.14),
          z: THREE.MathUtils.lerp(currentRotation.z, targetRotation.z, 0.14),
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

      const focusCountry = (countryId: string) => {
        targetRotation = countryRotation(countryId, targetRotation.y);
        updateMarkerSelection(countryId);
        scheduleRotation();
      };
      focusRef.current = focusCountry;
      updateMarkerSelection(selectedIdRef.current);

      const resize = () => {
        const bounds = mount.getBoundingClientRect();
        const width = Math.max(1, bounds.width);
        const height = Math.max(1, bounds.height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer?.setSize(width, height, false);
        renderer?.render(scene, camera);
      };

      const raycastCountry = (event: PointerEvent) => {
        const bounds = renderer?.domElement.getBoundingClientRect();
        if (!bounds) return undefined;
        pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObjects(markerEntries.map(({ hit }) => hit), false);
        return hits[0]?.object.userData.countryId as string | undefined;
      };

      const handlePointerDown = (event: PointerEvent) => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        dragState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
        renderer?.domElement.setPointerCapture(event.pointerId);
        renderer?.domElement.classList.add("is-dragging");
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (!dragState || dragState.pointerId !== event.pointerId) {
          const countryId = raycastCountry(event);
          renderer?.domElement.classList.toggle("has-marker", Boolean(countryId));
          return;
        }

        const deltaX = event.clientX - dragState.x;
        const deltaY = event.clientY - dragState.y;
        dragState.x = event.clientX;
        dragState.y = event.clientY;
        if (Math.abs(deltaX) + Math.abs(deltaY) > 3) dragState.moved = true;
        const scale = event.pointerType === "touch" ? 0.008 : 0.006;
        targetRotation = {
          x: THREE.MathUtils.clamp(currentRotation.x - deltaY * scale, -1.05, 1.05),
          y: currentRotation.y + deltaX * scale,
          z: currentRotation.z,
        };
        scheduleRotation();
      };

      const finishPointer = (event: PointerEvent, shouldSelect: boolean) => {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        const wasClick = !dragState.moved;
        renderer?.domElement.releasePointerCapture(event.pointerId);
        renderer?.domElement.classList.remove("is-dragging");
        dragState = null;
        if (shouldSelect && wasClick) {
          const countryId = raycastCountry(event);
          if (countryId) onSelectRef.current(countryId);
        }
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
      render();

      return () => {
        focusRef.current = null;
        renderer?.domElement.removeEventListener("pointerdown", handlePointerDown);
        renderer?.domElement.removeEventListener("pointermove", handlePointerMove);
        renderer?.domElement.removeEventListener("pointerup", handlePointerUp);
        renderer?.domElement.removeEventListener("pointercancel", handlePointerCancel);
        resizeObserver?.disconnect();
        if (frameId) window.cancelAnimationFrame(frameId);
        geometries.forEach((geometry) => geometry.dispose());
        materials.forEach((material) => material.dispose());
        textures.forEach((texture) => texture.dispose());
        renderer?.dispose();
        renderer?.domElement.remove();
      };
    } catch (error) {
      console.warn("Three.js country globe unavailable; country buttons remain available.", error);
      renderer?.dispose();
      renderer?.domElement.remove();
      return undefined;
    }
  }, []);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    focusRef.current?.(selectedId);
  }, [selectedId]);

  return (
    <div
      ref={mountRef}
      className="country-spotlight-globe"
      role="img"
      aria-label="Interactive Earth globe. Drag to rotate and select a country marker."
    />
  );
}

export function CountrySpotlightSection() {
  const [selectedId, setSelectedId] = useState(countrySpotlights[0].id);
  const selectedCountry = countrySpotlights.find((country) => country.id === selectedId) ?? countrySpotlights[0];

  return (
    <SectionShell id="country-spotlight" surface="cloud" labelledBy="country-spotlight-title" className="country-spotlight-section">
      <div className="page-width">
        <div className="country-spotlight-intro">
          <SectionHeading
            eyebrow="Country spotlight"
            title="The same health question looks different in every place."
            intro="Nutrition is one entry point. Explore how geography, environment, inequality, policy, and access to care change the public-health picture from country to country."
            id="country-spotlight-title"
          />
        </div>

        <div className="country-spotlight-layout">
          <div className="country-spotlight-map-column">
            <div className="country-spotlight-globe-wrap">
              <CountryGlobe selectedId={selectedId} onSelect={setSelectedId} />
              <div className="country-spotlight-globe-hint" aria-hidden="true">
                <span>Drag to rotate</span>
                <i />
                <span>Select a country</span>
              </div>
            </div>
            <div className="country-spotlight-country-list" aria-label="Choose a country">
              {countrySpotlights.map((country, index) => (
                <button
                  key={country.id}
                  type="button"
                  aria-pressed={country.id === selectedId}
                  className={country.id === selectedId ? "is-active" : ""}
                  onClick={() => setSelectedId(country.id)}
                >
                  <span>0{index + 1}</span>
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          <article className="country-spotlight-detail" aria-live="polite">
            <div className="country-spotlight-detail-topline">
              <span>{selectedCountry.region}</span>
              <span>Selected country</span>
            </div>
            <div className="country-spotlight-detail-heading">
              <Eyebrow>{selectedCountry.issueLabel}</Eyebrow>
              <h3>{selectedCountry.name}</h3>
              <p>{selectedCountry.issue}</p>
            </div>
            <div className="country-spotlight-facts">
              <div>
                <span>{selectedCountry.driversLabel}</span>
                <p>{selectedCountry.drivers}</p>
              </div>
              <div>
                <span>{selectedCountry.responseLabel}</span>
                <p>{selectedCountry.response}</p>
              </div>
            </div>
            <div className="country-spotlight-sources">
              <span>Read the starting sources</span>
              <ul>
                {selectedCountry.sources.map((source) => (
                  <li key={source.url}>
                    <a href={source.url} target="_blank" rel="noreferrer">
                      {source.organization} · {source.title}<b aria-hidden="true">↗</b>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>

        <p className="country-spotlight-note">
          Illustrative starting points — the country profiles will expand as reviewed content and local sources are added.
        </p>
      </div>
    </SectionShell>
  );
}
