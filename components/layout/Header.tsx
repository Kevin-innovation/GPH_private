"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, type NavigationItem } from "@/content/navigation";

function isGroup(item: NavigationItem): item is Extract<NavigationItem, { items: readonly { label: string; href: string }[] }> {
  return "items" in item;
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const firstInteractiveRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let frame = 0;
    const updateScrollState = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setMobileGroup(null);
        triggerRef.current?.focus();
      }

      if (event.key === "Tab") {
        const focusableElements = Array.from(
          mobileNavRef.current?.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])',
          ) ?? [],
        ).filter((element) => !element.closest("[hidden]"));
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstFocusable) {
          event.preventDefault();
          lastFocusable?.focus();
        } else if (!event.shiftKey && document.activeElement === lastFocusable) {
          event.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    firstInteractiveRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenGroup(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenGroup(null);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setOpenGroup(null);
      setMobileOpen(false);
      setMobileGroup(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  const closeMenu = () => {
    setMobileOpen(false);
    setMobileGroup(null);
    triggerRef.current?.focus();
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} data-scrolled={scrolled ? "true" : "false"}>
      <div className="header-inner">
        {/* Use a native home anchor here so the brand always exits a nested route, even before client navigation hydrates. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          className="brand-lockup"
          href="/"
          aria-label="Global Public Health Lens home"
          onClick={(event) => {
            if (window.location.pathname !== "/") {
              event.preventDefault();
              window.location.assign("/");
            }
          }}
        >
          <Image src="/brand/logo-mark-3d.webp" alt="" width={48} height={48} priority />
          <span>
            <strong>Global Public Health</strong>
            <span>Lens</span>
          </span>
        </a>

        <nav ref={navRef} className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => {
            if (!isGroup(item)) {
              const directClass = `nav-direct-link nav-direct-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              return (
                <a
                  key={item.href}
                  className={`${directClass}${isActive(item.href) ? " is-active" : ""}`}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            }

            const groupIsActive = item.items.some((child) => isActive(child.href));
            const isOpen = openGroup === item.label;
            const menuId = `nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

            return (
              <div
                key={item.label}
                className={`nav-group${isOpen ? " is-open" : ""}${groupIsActive ? " is-active" : ""}`}
                onMouseEnter={() => setOpenGroup(item.label)}
                onFocus={() => setOpenGroup(item.label)}
              >
                <button
                  type="button"
                  className="nav-disclosure"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  aria-haspopup="menu"
                  onClick={() => setOpenGroup(isOpen ? null : item.label)}
                >
                  {item.label}
                  <span className="nav-chevron" aria-hidden="true" />
                </button>
                <div className="nav-dropdown" id={menuId} hidden={!isOpen}>
                  {item.items.map((child) => (
                    <a
                      key={child.href}
                      className={isActive(child.href) ? "is-active" : undefined}
                      href={child.href}
                      aria-current={isActive(child.href) ? "page" : undefined}
                      onClick={() => setOpenGroup(null)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
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
        <div ref={mobileNavRef} className="mobile-nav" id="mobile-navigation">
          <nav aria-label="Mobile navigation">
            {navigation.map((item, index) => {
              if (!isGroup(item)) {
                const directClass = `nav-direct-link nav-direct-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                return (
                  <a
                    key={item.href}
                    className={`${directClass}${isActive(item.href) ? " is-active" : ""}`}
                    href={item.href}
                    onClick={closeMenu}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </a>
                );
              }

              const isOpen = mobileGroup === item.label;
              const menuId = `mobile-nav-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
              return (
                <div key={item.label} className={`mobile-nav-group${isOpen ? " is-open" : ""}`}>
                  <button
                    ref={index === 0 ? firstInteractiveRef : undefined}
                    type="button"
                    className="mobile-nav-disclosure"
                    aria-expanded={isOpen}
                    aria-controls={menuId}
                    onClick={() => setMobileGroup((current) => (current === item.label ? null : item.label))}
                  >
                    {item.label}
                    <span className="nav-chevron" aria-hidden="true" />
                  </button>
                  <div className="mobile-nav-submenu" id={menuId} hidden={!isOpen}>
                    {item.items.map((child) => (
                      <a key={child.href} className={isActive(child.href) ? "is-active" : undefined} href={child.href} onClick={closeMenu} aria-current={isActive(child.href) ? "page" : undefined}>
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
