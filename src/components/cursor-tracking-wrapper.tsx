"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface CursorTrackingWrapperProps {
  children: ReactNode;
  className?: string;
}

export default function CursorTrackingWrapper({
  children,
  className = "",
}: CursorTrackingWrapperProps) {
  const trackingRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const isCoarseRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const coarseQuery = window.matchMedia("(pointer: coarse)");
    isCoarseRef.current = coarseQuery.matches;

    const onCoarseChange = (e: MediaQueryListEvent) => {
      isCoarseRef.current = e.matches;
    };
    coarseQuery.addEventListener("change", onCoarseChange);

    if (isCoarseRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const normalizedX = (e.clientX / window.innerWidth - 0.5) * 2;
      const normalizedY = (e.clientY / window.innerHeight - 0.5) * 2;
      targetY.current = normalizedX * 8;
      targetX.current = normalizedY * -5;
    };

    const resetPosition = () => {
      targetX.current = 0;
      targetY.current = 0;
    };

    const tick = () => {
      currentX.current += (targetX.current - currentX.current) * 0.08;
      currentY.current += (targetY.current - currentY.current) * 0.08;

      const node = trackingRef.current;
      if (node) {
        node.style.transform =
          `rotateX(${currentX.current.toFixed(2)}deg) rotateY(${currentY.current.toFixed(2)}deg)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mouseleave", resetPosition);
    window.addEventListener("blur", resetPosition);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseleave", resetPosition);
      window.removeEventListener("blur", resetPosition);
      coarseQuery.removeEventListener("change", onCoarseChange);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className={className} style={{ perspective: "1000px" }}>
      <div
        ref={trackingRef}
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
