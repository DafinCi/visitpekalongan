"use client";

import { useEffect, useRef, useState } from "react";
import { BRAND_LOGO_GEOMETRY } from "./logo-geometry";
import {
  createPortalIntroController,
  type PortalIntroController,
  type PortalIntroState,
} from "@/lib/intro/portal-intro-machine";
import { useScrollLock } from "@/lib/hooks/useScrollLock";

/**
 * Server-rendered welcome overlay. CSS owns the visual timeline so the logo is
 * painted with the document instead of waiting for hydration.
 */
export function PortalIntroOverlay() {
  const [introState, setIntroState] = useState<PortalIntroState>("PLAYING");
  const controllerRef = useRef<PortalIntroController | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useScrollLock(introState === "PLAYING");

  useEffect(() => {
    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const controller = createPortalIntroController({
      prefersReducedMotion,
      onStateChange: setIntroState,
    });
    controllerRef.current = controller;
    const initial = controller.start();

    const motionQuery =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    let isDisposed = false;

    if (initial === "PLAYING") {
      const overlayElement = overlayRef.current;
      const fadeAnimation = overlayElement
        ?.getAnimations?.()
        .find(
          (animation) =>
            (animation as CSSAnimation).animationName ===
            "portal-intro-overlay-out"
        );
      fadeAnimation?.finished
        .then(() => {
          if (!isDisposed) controller.complete();
        })
        .catch(() => {});
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        controller.complete();
      }
    };

    const handleMotionChange = () => {
      if (motionQuery?.matches) {
        controller.complete();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    motionQuery?.addEventListener?.("change", handleMotionChange);

    return () => {
      isDisposed = true;
      window.removeEventListener("keydown", handleKeyDown);
      motionQuery?.removeEventListener?.("change", handleMotionChange);
      controller.dispose();
    };
  }, []);

  useEffect(() => {
    if (introState !== "PLAYING") return;

    const appContent = document.getElementById("app-content");
    const previousActive =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    appContent?.setAttribute("inert", "");
    overlayRef.current?.focus({ preventScroll: true });

    return () => {
      appContent?.removeAttribute("inert");
      if (previousActive?.isConnected) {
        previousActive.focus({ preventScroll: true });
      }
    };
  }, [introState]);

  if (introState === "COMPLETE") {
    return null;
  }

  const skip = () => controllerRef.current?.complete();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Sambutan VisitPekalongan"
      ref={overlayRef}
      tabIndex={-1}
      data-intro-state={introState}
      className="portal-intro-overlay fixed inset-0 z-[100] flex cursor-pointer touch-none select-none items-center justify-center overflow-hidden px-6 focus:outline-none"
      onClick={skip}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          skip();
        }
      }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <mask id="visitpekalongan-portal-reveal-mask">
            <rect x="-50" y="-50" width="200" height="200" fill="white" />
            <path
              className="portal-intro-mask"
              d={BRAND_LOGO_GEOMETRY.portalCutoutPath}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="var(--primitive-grout-200)"
          mask="url(#visitpekalongan-portal-reveal-mask)"
        />
      </svg>

      <div className="portal-intro-lockup relative z-10 flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={BRAND_LOGO_GEOMETRY.viewBox}
          fill="none"
          className="h-20 w-20 sm:h-24 sm:w-24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            className="portal-intro-stroke portal-intro-stroke-outer"
            d={BRAND_LOGO_GEOMETRY.outerArch.d}
            stroke="var(--primitive-roast-700)"
            strokeWidth={BRAND_LOGO_GEOMETRY.outerArch.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
          <path
            className="portal-intro-stroke portal-intro-stroke-middle"
            d={BRAND_LOGO_GEOMETRY.middleArch.d}
            stroke="var(--primitive-roast-700)"
            strokeWidth={BRAND_LOGO_GEOMETRY.middleArch.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
          <path
            className="portal-intro-stroke portal-intro-stroke-inner"
            d={BRAND_LOGO_GEOMETRY.innerArch.d}
            stroke="var(--primitive-roast-700)"
            strokeWidth={BRAND_LOGO_GEOMETRY.innerArch.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
          />
          <line
            className="portal-intro-stroke portal-intro-stroke-base"
            x1={BRAND_LOGO_GEOMETRY.leftBase.x1}
            y1={BRAND_LOGO_GEOMETRY.leftBase.y1}
            x2={BRAND_LOGO_GEOMETRY.leftBase.x2}
            y2={BRAND_LOGO_GEOMETRY.leftBase.y2}
            stroke="var(--primitive-roast-700)"
            strokeWidth={BRAND_LOGO_GEOMETRY.leftBase.strokeWidth}
            strokeLinecap="round"
            pathLength={1}
          />
          <line
            className="portal-intro-stroke portal-intro-stroke-base"
            x1={BRAND_LOGO_GEOMETRY.rightBase.x1}
            y1={BRAND_LOGO_GEOMETRY.rightBase.y1}
            x2={BRAND_LOGO_GEOMETRY.rightBase.x2}
            y2={BRAND_LOGO_GEOMETRY.rightBase.y2}
            stroke="var(--primitive-roast-700)"
            strokeWidth={BRAND_LOGO_GEOMETRY.rightBase.strokeWidth}
            strokeLinecap="round"
            pathLength={1}
          />
          <line
            className="portal-intro-stroke portal-intro-stroke-stem"
            x1={BRAND_LOGO_GEOMETRY.centerStem.x1}
            y1={BRAND_LOGO_GEOMETRY.centerStem.y1}
            x2={BRAND_LOGO_GEOMETRY.centerStem.x2}
            y2={BRAND_LOGO_GEOMETRY.centerStem.y2}
            stroke="var(--primitive-roast-700)"
            strokeWidth={BRAND_LOGO_GEOMETRY.centerStem.strokeWidth}
            strokeLinecap="butt"
            pathLength={1}
          />
          <polygon
            className="portal-intro-diamond"
            points={BRAND_LOGO_GEOMETRY.diamond.points}
            fill="var(--primitive-terracotta-raw)"
          />
        </svg>

        <span
          aria-hidden="true"
          className="portal-intro-wordmark mt-3 font-serif text-2xl tracking-tight sm:text-3xl"
          style={{ color: "var(--primitive-roast-700)" }}
        >
          VisitPekalongan
        </span>
      </div>

    </div>
  );
}
