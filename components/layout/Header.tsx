"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/navigation";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }

      if (event.key === "Tab" && event.shiftKey && document.activeElement === firstLinkRef.current) {
        event.preventDefault();
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand-lockup" href="#hero" aria-label="Global Public Health Lens home">
          <Image src="/brand/logo-mark-3d.webp" alt="" width={48} height={48} priority />
          <span>
            <strong>Global Public Health</strong>
            <span>Lens</span>
          </span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
          <a className="nav-cta" href="#country-spotlight">
            Explore the Map
          </a>
        </nav>

        <button
          ref={triggerRef}
          className="menu-toggle"
          type="button"
          aria-expanded={mobileOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          <span aria-hidden="true" className="menu-lines">
            <i />
            <i />
            <i />
          </span>
        </button>
      </div>

      {mobileOpen ? (
        <div className="mobile-nav" id="mobile-navigation">
          <nav aria-label="Mobile navigation">
            {navigation.map((item, index) => (
              <a key={item.href} ref={index === 0 ? firstLinkRef : undefined} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
            <a className="mobile-cta" href="#country-spotlight" onClick={closeMenu}>
              Explore the Map
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
