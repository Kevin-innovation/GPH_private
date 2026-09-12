"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { countrySpotlights } from "@/content/countries";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionShell } from "@/components/ui/SectionShell";
import { orphanSafeText } from "@/components/ui/orphanSafeText";

type ThreeModule = typeof import("three");

const globeRadius = 2.32;
const accentPalette = ["#159a91", "#f2b84b", "#75b85a", "#117e76", "#d49b2f"];

const countryZoom: Record<string, number> = {
  "south-korea": 3.55,
  india: 5.0,
  mexico: 5.35,
  france: 3.85,
  "united-states": 6.65,
};
type CountryUrlMode = "push" | "replace";

function formatReviewedDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function readCountryUrlState() {
  if (typeof window === "undefined") {
    return { selectedId: countrySpotlights[0].id, isZoomed: false };
  }

  const params = new URLSearchParams(window.location.search);
  const requestedCountry = countrySpotlights.find((country) => country.id === params.get("country"));
  return {
    selectedId: requestedCountry?.id ?? countrySpotlights[0].id,
    isZoomed: params.get("zoom") === "1",
  };
}

function writeCountryUrl(selectedId: string, isZoomed: boolean, mode: CountryUrlMode) {
  if (typeof window === "undefined") return;

  const url = new URL(window.location.href);
  if (selectedId === countrySpotlights[0].id && !isZoomed) url.searchParams.delete("country");
  else url.searchParams.set("country", selectedId);

  if (isZoomed) url.searchParams.set("zoom", "1");
  else url.searchParams.delete("zoom");

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;

  const method = mode === "push" ? "pushState" : "replaceState";
  window.history[method]({ ...window.history.state, countrySpotlight: { selectedId, isZoomed } }, "", nextUrl);
}

function latLonToVector3(THREE: ThreeModule, latitude: number, longitude: number, radius = globeRadius) {
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

function createLatitudeRing(THREE: ThreeModule, latitude: number, radius = globeRadius) {
  const points: import("three").Vector3[] = [];
  const lat = THREE.MathUtils.degToRad(latitude);
  const ringRadius = radius * Math.cos(lat);
  const y = radius * Math.sin(lat);

  for (let index = 0; index < 96; index += 1) {
    const angle = (index / 96) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * ringRadius, y, Math.sin(angle) * ringRadius));
  }

  return points;
}

function createMeridian(THREE: ThreeModule, longitude: number, radius = globeRadius) {
  const points: import("three").Vector3[] = [];
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

function countryQuaternion(THREE: ThreeModule, countryId: string) {
  const country = countrySpotlights.find((item) => item.id === countryId) ?? countrySpotlights[0];
  const lat = THREE.MathUtils.degToRad(country.latitude);
  const lon = THREE.MathUtils.degToRad(country.longitude);
  const normal = latLonToVector3(THREE, country.latitude, country.longitude, 1).normalize();
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
  const pendingGlobeActionRef = useRef<{ type: "focus"; countryId: string } | { type: "overview" } | null>(null);
  const [globeStatus, setGlobeStatus] = useState<"waiting" | "loading" | "ready" | "unavailable">("waiting");

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let cancelled = false;
    let hasStarted = false;
    let visibilityObserver: IntersectionObserver | null = null;
    let cleanupScene: (() => void) | undefined;

    const initialize = async () => {
      if (hasStarted) return;
      hasStarted = true;
      setGlobeStatus("loading");
      let renderer: import("three").WebGLRenderer | null = null;

      try {
        const THREE = await import("three");
        if (cancelled) return;

        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const geometries: import("three").BufferGeometry[] = [];
        const materials: import("three").Material[] = [];
        const textures: import("three").Texture[] = [];
        let resizeObserver: ResizeObserver | null = null;
        let frameId = 0;

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
      const initialQuaternion = countryQuaternion(THREE, selectedIdRef.current);
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
        "/brand/earth-atmos-2048.jpg",
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
        const geometry = new THREE.BufferGeometry().setFromPoints(createLatitudeRing(THREE, latitude, globeRadius * 1.008));
        geometries.push(geometry);
        globe.add(new THREE.LineLoop(geometry, gridMaterial));
      });
      [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].forEach((longitude) => {
        const geometry = new THREE.BufferGeometry().setFromPoints(createMeridian(THREE, longitude, globeRadius * 1.008));
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

      // The visible marker stays deliberately small at the closest country
      // zoom. A separate invisible hit sphere preserves an easy click target.
      const markerGeometry = new THREE.SphereGeometry(0.035, 18, 14);
      const hitGeometry = new THREE.SphereGeometry(0.25, 12, 10);
      const ringGeometry = new THREE.RingGeometry(0.052, 0.064, 28);
      geometries.push(markerGeometry, hitGeometry, ringGeometry);

      const markerEntries = countrySpotlights.map((country, index) => {
        const position = latLonToVector3(THREE, country.latitude, country.longitude, globeRadius * 1.025);
        const markerMaterial = new THREE.MeshBasicMaterial({
          color: accentPalette[index % accentPalette.length],
          transparent: true,
          opacity: country.id === selectedIdRef.current ? 0.72 : 0,
        });
        const hitMaterial = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: accentPalette[index % accentPalette.length],
          transparent: true,
          opacity: country.id === selectedIdRef.current ? 0.38 : 0.16,
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

      const updateMarkerSelection = (countryId: string, showAll = false) => {
        markerEntries.forEach(({ country, marker, markerMaterial, ring, ringMaterial }) => {
          const isSelected = country.id === countryId;
          marker.scale.setScalar(isSelected ? 1 : 0.82);
          markerMaterial.opacity = isSelected ? 0.74 : showAll ? 0.28 : 0;
          markerMaterial.needsUpdate = true;
          ring.scale.setScalar(isSelected ? 1 : 0.9);
          ringMaterial.opacity = isSelected && reducedMotion ? 0.3 : 0;
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
      let pulseUntil = 0;
      let dragState: { pointerId: number; x: number; y: number; moved: boolean } | null = null;
      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const labelPoint = new THREE.Vector3();
      const hitWorldPoint = new THREE.Vector3();
      let mountWidth = 1;
      let mountHeight = 1;

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
        capitalLabel.style.left = `${(labelPoint.x * 0.5 + 0.5) * mountWidth}px`;
        capitalLabel.style.top = `${(-labelPoint.y * 0.5 + 0.5) * mountHeight}px`;
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
        if (activeEntry && !reducedMotion && time < pulseUntil) {
          const phase = (time % 720) / 720;
          const blink = 0.5 - Math.cos(phase * Math.PI * 2) * 0.5;
          activeEntry.marker.scale.setScalar(0.9 + blink * 0.18);
          activeEntry.markerMaterial.opacity = 0.38 + blink * 0.4;
          activeEntry.markerMaterial.needsUpdate = true;
          activeEntry.ring.scale.setScalar(1 + blink * 0.2);
          activeEntry.ringMaterial.opacity = 0.14 + blink * 0.34;
          activeEntry.ringMaterial.needsUpdate = true;
        } else if (activeEntry && !reducedMotion) {
          activeEntry.marker.scale.setScalar(1);
          activeEntry.markerMaterial.opacity = 0.74;
          activeEntry.markerMaterial.needsUpdate = true;
          activeEntry.ring.scale.setScalar(1);
          activeEntry.ringMaterial.opacity = 0.3;
          activeEntry.ringMaterial.needsUpdate = true;
        }
        render();

        const settled = transitionPhase === "idle"
          && currentQuaternion.angleTo(targetQuaternion) < 0.001
          && Math.abs(currentCameraZ - targetCameraZ) < 0.002;
        const shouldPulse = Boolean(focusedIdRef.current) && !reducedMotion && time < pulseUntil;
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
        const nextQuaternion = countryQuaternion(THREE, countryId);
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
        pulseUntil = performance.now() + 3600;
        scheduleRotation();
      };

      const showOverview = () => {
        focusedIdRef.current = null;
        capitalLabel.textContent = "";
        targetQuaternion.copy(countryQuaternion(THREE, selectedIdRef.current));
        finalCameraZ = 9.2;
        targetCameraZ = 9.2;
        capitalLabelEnabled = false;
        pulseUntil = 0;
        transitionPhase = "zoom-in";
        updateMarkerSelection(selectedIdRef.current, true);
        scheduleRotation();
      };

      focusRef.current = focusCountry;
      overviewRef.current = showOverview;
      updateMarkerSelection(selectedIdRef.current, true);
      const pendingGlobeAction = pendingGlobeActionRef.current;
      pendingGlobeActionRef.current = null;
      if (pendingGlobeAction?.type === "focus") focusCountry(pendingGlobeAction.countryId);
      if (pendingGlobeAction?.type === "overview") showOverview();

      const resize = () => {
        const bounds = mount.getBoundingClientRect();
        mountWidth = Math.max(1, bounds.width);
        mountHeight = Math.max(1, bounds.height);
        camera.aspect = mountWidth / mountHeight;
        camera.updateProjectionMatrix();
        renderer?.setSize(mountWidth, mountHeight, false);
        render();
      };

      const raycastCountry = (event: PointerEvent) => {
        const bounds = renderer?.domElement.getBoundingClientRect();
        if (!bounds) return undefined;
        pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        globe.updateMatrixWorld(true);
        const hits = raycaster.intersectObjects(markerEntries.map(({ hit }) => hit), false);
        const visibleHit = hits.find((hit) => {
          hit.object.getWorldPosition(hitWorldPoint);
          return hitWorldPoint.z > 0;
        });
        return visibleHit?.object.userData.countryId as string | undefined;
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
        const pitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaY * scale);
        targetQuaternion.premultiply(yaw).premultiply(pitch).normalize();
        scheduleRotation();
      };

      const finishPointer = (event: PointerEvent, shouldSelect: boolean) => {
        if (!dragState || dragState.pointerId !== event.pointerId) return;
        const wasClick = !dragState.moved;
        if (renderer?.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId);
        }
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
      setGlobeStatus("ready");

      cleanupScene = () => {
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
        if (!cancelled) setGlobeStatus("unavailable");
        renderer?.dispose();
        renderer?.domElement.remove();
      }
    };

    if ("IntersectionObserver" in window) {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          visibilityObserver?.disconnect();
          void initialize();
        },
        { rootMargin: "480px 0px" },
      );
      visibilityObserver.observe(mount);
    } else {
      void initialize();
    }

    return () => {
      cancelled = true;
      visibilityObserver?.disconnect();
      cleanupScene?.();
    };
  }, []);

  useEffect(() => {
    selectedIdRef.current = selectedId;
    if (previousFocusRequestRef.current !== focusRequest) {
      previousFocusRequestRef.current = focusRequest;
      if (focusRef.current) focusRef.current(selectedId);
      else pendingGlobeActionRef.current = { type: "focus", countryId: selectedId };
    }
    if (previousOverviewRequestRef.current !== overviewRequest) {
      previousOverviewRequestRef.current = overviewRequest;
      if (overviewRef.current) overviewRef.current();
      else pendingGlobeActionRef.current = { type: "overview" };
    }
  }, [focusRequest, overviewRequest, selectedId]);

  return (
    <div
      className={`country-spotlight-globe is-${globeStatus}`}
      role="group"
      aria-label="Interactive Earth globe. Use the country buttons to select a location; drag with a mouse to rotate."
    >
      <div ref={mountRef} className="country-spotlight-globe-canvas" aria-hidden="true" />
      {globeStatus !== "ready" ? (
        <div className="country-spotlight-globe-status" role="status" aria-live="polite">
          <span>{globeStatus === "unavailable" ? "Interactive globe unavailable" : "Preparing interactive globe"}</span>
          <small>Country profiles remain available below.</small>
        </div>
      ) : null}
    </div>
  );
}

export function CountrySpotlightSection() {
  const [selectedId, setSelectedId] = useState(countrySpotlights[0].id);
  const [focusRequest, setFocusRequest] = useState(0);
  const [overviewRequest, setOverviewRequest] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const countryButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedIdRef = useRef(countrySpotlights[0].id);
  const isZoomedRef = useRef(false);
  const isUrlRestoredRef = useRef(false);
  const selectedCountry = countrySpotlights.find((country) => country.id === selectedId) ?? countrySpotlights[0];
  const reviewedAt = selectedCountry.sources.reduce(
    (latest, source) => (source.reviewedAt > latest ? source.reviewedAt : latest),
    selectedCountry.sources[0]?.reviewedAt ?? "",
  );
  const applyUrlState = () => {
    const nextState = readCountryUrlState();
    const selectedChanged = selectedIdRef.current !== nextState.selectedId;
    const zoomChanged = isZoomedRef.current !== nextState.isZoomed;

    selectedIdRef.current = nextState.selectedId;
    isZoomedRef.current = nextState.isZoomed;
    setSelectedId(nextState.selectedId);
    setIsZoomed(nextState.isZoomed);
    if (nextState.isZoomed && (selectedChanged || zoomChanged)) {
      setFocusRequest((request) => request + 1);
    } else if (!nextState.isZoomed && (selectedChanged || zoomChanged)) {
      setOverviewRequest((request) => request + 1);
    }
    isUrlRestoredRef.current = true;
  };

  useEffect(() => {
    const restoreFrame = window.requestAnimationFrame(applyUrlState);
    const handlePopState = () => applyUrlState();
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.cancelAnimationFrame(restoreFrame);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const selectCountry = (countryId: string, mode: CountryUrlMode = "push") => {
    if (!countrySpotlights.some((country) => country.id === countryId)) return;

    selectedIdRef.current = countryId;
    isZoomedRef.current = true;
    setSelectedId(countryId);
    setIsZoomed(true);
    setFocusRequest((request) => request + 1);
    if (isUrlRestoredRef.current) writeCountryUrl(countryId, true, mode);
  };
  const showFullGlobe = () => {
    isZoomedRef.current = false;
    setIsZoomed(false);
    setOverviewRequest((request) => request + 1);
    if (isUrlRestoredRef.current) writeCountryUrl(selectedIdRef.current, false, "push");
  };
  const focusCountryAt = (index: number) => {
    const normalizedIndex = (index + countrySpotlights.length) % countrySpotlights.length;
    selectCountry(countrySpotlights[normalizedIndex].id);
    countryButtonRefs.current[normalizedIndex]?.focus();
  };
  const handleCountryKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | undefined;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = index + 1;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = index - 1;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = countrySpotlights.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    focusCountryAt(nextIndex);
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
            level="h1"
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
                  ref={(button) => {
                    countryButtonRefs.current[index] = button;
                  }}
                  type="button"
                  aria-pressed={country.id === selectedId}
                  className={country.id === selectedId ? "is-active" : ""}
                  onClick={() => selectCountry(country.id)}
                  onKeyDown={(event) => handleCountryKeyDown(event, index)}
                >
                  <span className="country-spotlight-country-index">0{index + 1}</span>
                  <span className="country-spotlight-country-name">{country.name}</span>
                  <span className="country-spotlight-country-action" aria-hidden="true">
                    {country.id === selectedId ? "Selected" : "View"}<b>→</b>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <article
            className="country-spotlight-detail"
            aria-live="polite"
            aria-labelledby={`country-detail-${selectedCountry.id}`}
          >
            <div className="country-spotlight-detail-content" key={selectedCountry.id}>
              <div className="country-spotlight-detail-topline">
                <span>{selectedCountry.region}</span>
                <span>Selected country</span>
              </div>
              <div className="country-spotlight-detail-heading">
                <Eyebrow>{selectedCountry.issueLabel}</Eyebrow>
                <h3 id={`country-detail-${selectedCountry.id}`}>{orphanSafeText(selectedCountry.name)}</h3>
                <p>{orphanSafeText(selectedCountry.issue)}</p>
              </div>
              <div className="country-spotlight-facts">
                <div>
                  <span>{selectedCountry.driversLabel}</span>
                  <p>{orphanSafeText(selectedCountry.drivers)}</p>
                </div>
                <div>
                  <span>{selectedCountry.responseLabel}</span>
                  <p>{orphanSafeText(selectedCountry.response)}</p>
                </div>
              </div>
              <div className="country-spotlight-sources">
                <span>Read the starting sources</span>
                <ul>
                  {selectedCountry.sources.map((source) => (
                    <li key={source.url}>
                      <ExternalLink href={source.url}>
                        {orphanSafeText(`${source.organization} · ${source.title}`)}<b aria-hidden="true">↗</b>
                      </ExternalLink>
                    </li>
                  ))}
                </ul>
                {reviewedAt ? (
                  <p className="country-spotlight-reviewed">
                    Sources reviewed <time dateTime={reviewedAt}>{formatReviewedDate(reviewedAt)}</time>
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        </div>

        <p className="country-spotlight-note">
          Illustrative starting points — the country profiles will expand as reviewed content and local sources are added.
        </p>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          Selected country: {orphanSafeText(selectedCountry.name)}{isZoomed ? " (focused)" : " (overview)"}
        </p>
      </div>
    </SectionShell>
  );
}
