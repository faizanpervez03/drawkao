"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface CursorTrackingWrapperProps {
  children: ReactNode;
  className?: string;
  rotateYMax?: number;
  rotateXMax?: number;
  translateMax?: number;
  smoothing?: number;
}

export default function CursorTrackingWrapper({
  children,
  className = "",
  rotateYMax = 8,
  rotateXMax = 5,
  translateMax = 3,
  smoothing = 0.08,
}: CursorTrackingWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node || typeof window === "undefined") return;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const onMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2 || 1;
      const halfH = window.innerHeight / 2 || 1;
      targetRef.current.x = (e.clientX - halfW) / halfW;
      targetRef.current.y = (e.clientY - halfH) / halfH;
    };

    const onReset = () => {
      targetRef.current.x = 0;
      targetRef.current.y = 0;
    };

    const clamp = (v: number, min: number, max: number) =>
      Math.min(max, Math.max(min, v));

    const tick = () => {
      const c = currentRef.current;
      const t = targetRef.current;

      c.x += (t.x - c.x) * smoothing;
      c.y += (t.y - c.y) * smoothing;

      const rotY = clamp(c.x, -1, 1) * rotateYMax;
      const rotX = clamp(c.y, -1, 1) * -rotateXMax;
      const tx = clamp(c.x, -1, 1) * translateMax;
      const ty = clamp(c.y, -1, 1) * -translateMax;

      node.style.transform =
        `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateX(${tx.toFixed(2)}px) translateY(${ty.toFixed(2)}px)`;

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onReset);
    window.addEventListener("blur", onReset);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onReset);
      window.removeEventListener("blur", onReset);
      cancelAnimationFrame(rafRef.current);
    };
  }, [rotateYMax, rotateXMax, translateMax, smoothing]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
