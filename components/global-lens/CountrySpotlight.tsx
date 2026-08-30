"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { countrySpotlights } from "@/content/countries";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";

const globeRadius = 2.32;
const accentPalette = ["#159a91", "#f2b84b", "#75b85a", "#117e76", "#d49b2f"];

const countryZoom: Record<string, number> = {
  "south-korea": 3.55,
  india: 5.0,
  mexico: 5.35,
  france: 3.85,
  "united-states": 6.65,
};

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

function countryQuaternion(countryId: string) {
  const country = countrySpotlights.find((item) => item.id === countryId) ?? countrySpotlights[0];
  const lat = THREE.MathUtils.degToRad(country.latitude);
  const lon = THREE.MathUtils.degToRad(country.longitude);
  const normal = latLonToVector3(country.latitude, country.longitude, 1).normalize();
  const east = new THREE.Vector3(-Math.sin(lon), 0, -Math.cos(lon)).normalize();
  const north = new THREE.Vector3(
    -Math.sin(lat) * Math.cos(lon),
    Math.cos(lat),
    Math.sin(lat) * Math.sin(lon),
  ).normalize();

  // Invert the country's east/north/normal basis so its surface normal faces
  // the camera (+Z) while geographic north remains upright (+Y).
  const basis = new THREE.Matrix4().makeBasis(east, north, normal).invert();
  return new THREE.Quaternion().setFromRotationMatrix(basis).normalize();
}

type CountryGlobeProps = {
  selectedId: string;
  focusRequest: number;
  overviewRequest: number;
  onSelect: (countryId: string) => void;
};

function CountryGlobe({ selectedId, focusRequest, overviewRequest, onSelect }: CountryGlobeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<((countryId: string) => void) | null>(null);
  const overviewRef = useRef<(() => void) | null>(null);
  const onSelectRef = useRef(onSelect);
  const selectedIdRef = useRef(selectedId);
  const previousFocusRequestRef = useRef(focusRequest);
  const previousOverviewRequestRef = useRef(overviewRequest);
  const focusedIdRef = useRef<string | null>(null);

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

      const capitalLabel = document.createElement("div");
      capitalLabel.className = "country-capital-label";
      capitalLabel.setAttribute("aria-hidden", "true");
      mount.appendChild(capitalLabel);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(29, 1, 0.1, 100);
      camera.position.set(0, 0.06, 9.2);

      const globe = new THREE.Group();
      // Keep the opening view at globe scale, but orient it to the default
      // South Korea story so the map and the detail panel share one context.
      const initialQuaternion = countryQuaternion(selectedIdRef.current);
      globe.quaternion.copy(initialQuaternion);
      scene.add(globe);

      scene.add(new THREE.HemisphereLight("#f8fbfa", "#12314b", 1.25));
      const sun = new THREE.DirectionalLight("#fff4cf", 2.1);
      sun.position.set(-4, 3, 6);
      scene.add(sun);

      const earthGeometry = new THREE.SphereGeometry(globeRadius, 96, 64);
      const earthMaterial = new THREE.MeshStandardMaterial({
        color: "#d8e6df",
        emissive: "#557e75",
        emissiveIntensity: 0.08,
        roughness: 0.82,
        metalness: 0,
      });
      geometries.push(earthGeometry);
      materials.push(earthMaterial);
      globe.add(new THREE.Mesh(earthGeometry, earthMaterial));

      const earthTexture = new THREE.TextureLoader().load(
        "/brand/earth-clear-8192.webp",
        (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          texture.anisotropy = Math.min(8, renderer?.capabilities.getMaxAnisotropy() ?? 1);
          texture.minFilter = THREE.LinearMipmapLinearFilter;
          texture.magFilter = THREE.LinearFilter;
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

      const gridMaterial = new THREE.LineBasicMaterial({ color: "#9acdc6", transparent: true, opacity: 0.09 });
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
        opacity: 0.035,
        side: THREE.BackSide,
        depthWrite: false,
      });
      geometries.push(haloGeometry);
      materials.push(haloMaterial);
      globe.add(new THREE.Mesh(haloGeometry, haloMaterial));

      const markerGeometry = new THREE.SphereGeometry(0.072, 18, 14);
      const hitGeometry = new THREE.SphereGeometry(0.25, 12, 10);
      const ringGeometry = new THREE.RingGeometry(0.13, 0.145, 28);
      geometries.push(markerGeometry, hitGeometry, ringGeometry);

      const markerEntries = countrySpotlights.map((country, index) => {
        const position = latLonToVector3(country.latitude, country.longitude, globeRadius * 1.025);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: accentPalette[index % accentPalette.length],
          transparent: true,
          opacity: country.id === selectedIdRef.current ? 0.9 : 0,
        });
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

        return { country, marker, markerMaterial, hit, ring, ringMaterial };
      });

      const updateMarkerSelection = (countryId: string | null) => {
        markerEntries.forEach(({ country, marker, markerMaterial, ring, ringMaterial }) => {
          const isSelected = country.id === countryId;
          const isOverview = countryId === null;
          marker.scale.setScalar(isSelected ? 0.09 : 0.055);
          markerMaterial.opacity = isSelected ? 0.78 : isOverview ? 0.52 : 0;
          markerMaterial.needsUpdate = true;
          ring.scale.setScalar(isSelected ? 0.12 : 0.08);
          ringMaterial.opacity = isSelected && reducedMotion ? 0.32 : 0;
          ringMaterial.needsUpdate = true;
        });
      };

      const currentQuaternion = initialQuaternion.clone();
      const targetQuaternion = initialQuaternion.clone();
      let currentCameraZ = 9.2;
      let targetCameraZ = 9.2;
      let finalCameraZ = 9.2;
      let transitionPhase: "idle" | "zoom-out" | "rotate" | "zoom-in" = "idle";
      let capitalLabelEnabled = false;
      let lastAnimationTime = performance.now();
      let dragState: { pointerId: number; x: number; y: number; moved: boolean } | null = null;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const labelPoint = new THREE.Vector3();

      const positionCapitalLabel = () => {
        const activeEntry = markerEntries.find(({ country }) => country.id === focusedIdRef.current);
        if (!activeEntry || !capitalLabelEnabled) {
          capitalLabel.classList.remove("is-visible");
          return;
        }

        globe.updateMatrixWorld(true);
        activeEntry.marker.getWorldPosition(labelPoint);
        if (labelPoint.z <= 0) {
          capitalLabel.classList.remove("is-visible");
          return;
        }

        labelPoint.project(camera);
        const bounds = mount.getBoundingClientRect();
        capitalLabel.style.left = `${(labelPoint.x * 0.5 + 0.5) * bounds.width}px`;
        capitalLabel.style.top = `${(-labelPoint.y * 0.5 + 0.5) * bounds.height}px`;
        capitalLabel.classList.add("is-visible");
      };

      const render = () => {
        positionCapitalLabel();
        renderer?.render(scene, camera);
      };
      const animateRotation = (time = performance.now()) => {
        frameId = 0;
        const deltaSeconds = Math.min(0.05, Math.max(0.001, (time - lastAnimationTime) / 1000));
        lastAnimationTime = time;

        if (transitionPhase === "zoom-out") {
          targetCameraZ = 8.6;
          if (Math.abs(currentCameraZ - targetCameraZ) < 0.04) transitionPhase = "rotate";
        } else if (transitionPhase === "rotate") {
          const rotationAlpha = 1 - Math.exp(-deltaSeconds * 3.6);
          currentQuaternion.slerp(targetQuaternion, rotationAlpha).normalize();
          if (currentQuaternion.angleTo(targetQuaternion) < 0.012) {
            currentQuaternion.copy(targetQuaternion);
            transitionPhase = "zoom-in";
            targetCameraZ = finalCameraZ;
            capitalLabelEnabled = Boolean(focusedIdRef.current);
          }
        } else {
          const rotationAlpha = 1 - Math.exp(-deltaSeconds * 4.2);
          currentQuaternion.slerp(targetQuaternion, rotationAlpha).normalize();
        }

        currentCameraZ = THREE.MathUtils.damp(currentCameraZ, targetCameraZ, 4, deltaSeconds);
        globe.quaternion.copy(currentQuaternion);
        camera.position.z = currentCameraZ;

        if (transitionPhase === "zoom-in" && Math.abs(currentCameraZ - finalCameraZ) < 0.02) {
          currentCameraZ = finalCameraZ;
          camera.position.z = finalCameraZ;
          transitionPhase = "idle";
        }

        const activeEntry = markerEntries.find(({ country }) => country.id === focusedIdRef.current);
        if (activeEntry && !reducedMotion) {
          const phase = (time % 1700) / 1700;
          const pulseScale = 0.12 + phase * 0.18;
          activeEntry.ring.scale.setScalar(pulseScale);
          activeEntry.ringMaterial.opacity = (1 - phase) * 0.42;
          activeEntry.ringMaterial.needsUpdate = true;
          activeEntry.marker.scale.setScalar(0.09 + Math.sin(phase * Math.PI) * 0.012);
        }
        render();

        const settled = transitionPhase === "idle"
          && currentQuaternion.angleTo(targetQuaternion) < 0.001
          && Math.abs(currentCameraZ - targetCameraZ) < 0.002;
        const shouldPulse = Boolean(focusedIdRef.current) && !reducedMotion;
        if (!settled || shouldPulse) frameId = window.requestAnimationFrame(animateRotation);
      };

      const scheduleRotation = () => {
        if (reducedMotion) {
          transitionPhase = "idle";
          targetCameraZ = finalCameraZ;
          currentQuaternion.copy(targetQuaternion);
          globe.quaternion.copy(currentQuaternion);
          currentCameraZ = finalCameraZ;
          camera.position.z = finalCameraZ;
          capitalLabelEnabled = Boolean(focusedIdRef.current);
          render();
          return;
        }
        if (!frameId) {
          lastAnimationTime = performance.now();
          frameId = window.requestAnimationFrame(animateRotation);
        }
      };

      const focusCountry = (countryId: string) => {
        focusedIdRef.current = countryId;
        const country = countrySpotlights.find((item) => item.id === countryId);
        capitalLabel.textContent = country ? `${country.capital} · ${country.name}` : "";
        const nextQuaternion = countryQuaternion(countryId);
        if (targetQuaternion.dot(nextQuaternion) < 0) {
          nextQuaternion.set(-nextQuaternion.x, -nextQuaternion.y, -nextQuaternion.z, -nextQuaternion.w);
        }
        targetQuaternion.copy(nextQuaternion);
        finalCameraZ = countryZoom[countryId] ?? 5.6;
        capitalLabelEnabled = false;
        capitalLabel.classList.remove("is-visible");
        transitionPhase = currentCameraZ < 7.8 && currentQuaternion.angleTo(targetQuaternion) > 0.04
          ? "zoom-out"
          : "rotate";
        targetCameraZ = transitionPhase === "zoom-out" ? 8.6 : currentCameraZ;
        updateMarkerSelection(countryId);
        scheduleRotation();
      };

      const showOverview = () => {
        focusedIdRef.current = null;
        capitalLabel.textContent = "";
        targetQuaternion.copy(countryQuaternion(selectedIdRef.current));
        finalCameraZ = 9.2;
        targetCameraZ = 9.2;
        capitalLabelEnabled = false;
        transitionPhase = "zoom-in";
        updateMarkerSelection(null);
        scheduleRotation();
      };

      focusRef.current = focusCountry;
      overviewRef.current = showOverview;
      updateMarkerSelection(null);

      const resize = () => {
        const bounds = mount.getBoundingClientRect();
        const width = Math.max(1, bounds.width);
        const height = Math.max(1, bounds.height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer?.setSize(width, height, false);
        render();
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
        // Touch belongs to the page: country buttons provide the mobile
        // selection path without competing with vertical scrolling.
        if (event.pointerType === "touch") return;
        if (event.pointerType === "mouse" && event.button !== 0) return;
        transitionPhase = "idle";
        targetCameraZ = currentCameraZ;
        finalCameraZ = currentCameraZ;
        dragState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
        renderer?.domElement.setPointerCapture(event.pointerId);
        renderer?.domElement.classList.add("is-dragging");
      };

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;
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
        const scale = 0.006;
        const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), deltaX * scale);
        const pitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -deltaY * scale);
        targetQuaternion.premultiply(yaw).premultiply(pitch).normalize();
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
        overviewRef.current = null;
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
        capitalLabel.remove();
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
    if (previousFocusRequestRef.current !== focusRequest) {
      previousFocusRequestRef.current = focusRequest;
      focusRef.current?.(selectedId);
    }
    if (previousOverviewRequestRef.current !== overviewRequest) {
      previousOverviewRequestRef.current = overviewRequest;
      overviewRef.current?.();
    }
  }, [focusRequest, overviewRequest, selectedId]);

  return (
    <div
      ref={mountRef}
      className="country-spotlight-globe"
      role="img"
      aria-label="Interactive Earth globe. Use the country buttons to select a location; drag with a mouse to rotate."
    />
  );
}

export function CountrySpotlightSection() {
  const [selectedId, setSelectedId] = useState(countrySpotlights[0].id);
  const [focusRequest, setFocusRequest] = useState(0);
  const [overviewRequest, setOverviewRequest] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const selectedCountry = countrySpotlights.find((country) => country.id === selectedId) ?? countrySpotlights[0];
  const selectCountry = (countryId: string) => {
    setSelectedId(countryId);
    setIsZoomed(true);
    setFocusRequest((request) => request + 1);
  };
  const showFullGlobe = () => {
    setIsZoomed(false);
    setOverviewRequest((request) => request + 1);
  };

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
              <CountryGlobe
                selectedId={selectedId}
                focusRequest={focusRequest}
                overviewRequest={overviewRequest}
                onSelect={selectCountry}
              />
              {isZoomed ? (
                <button
                  type="button"
                  className="country-spotlight-overview-button"
                  onClick={showFullGlobe}
                  aria-label="Return to the full globe view"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M3.8 12h16.4M12 3.5c2.2 2.3 3.3 5.1 3.3 8.5S14.2 18.2 12 20.5M12 3.5C9.8 5.8 8.7 8.6 8.7 12s1.1 6.2 3.3 8.5" />
                  </svg>
                  <span>View full globe</span>
                </button>
              ) : null}
              <div className="country-spotlight-globe-hint" aria-hidden="true">
                <span className="country-spotlight-hint-desktop">Drag to rotate</span>
                <span className="country-spotlight-hint-mobile">Choose below</span>
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
                  onClick={() => selectCountry(country.id)}
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
