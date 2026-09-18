"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import Image from "next/image";

interface CursorTrackingCharacterProps {
  imageUrl?: string;
  altText?: string;
  maxSize?: number;
  smoothingStrength?: number;
  className?: string;
}

export default function CursorTrackingCharacter({
  imageUrl = "/images/cursor tracking.png",
  altText = "Draw Kao Character",
  maxSize = 500,
  smoothingStrength = 0.12,
  className = "",
}: CursorTrackingCharacterProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const isDesktopRef = useRef(false);

  const clampedSmoothing = useMemo(() => {
    return Math.min(1, Math.max(0.01, smoothingStrength));
  }, [smoothingStrength]);

  const clamp = useCallback((value: number, min: number, max: number) => {
    return Math.min(max, Math.max(min, value));
  }, []);

  const applyTransform = useCallback(
    (x: number, y: number) => {
      const node = wrapperRef.current;
      if (!node) return;

      const rotateX = -y * 5;
      const rotateY = x * 8;
      const depth = (Math.abs(x) + Math.abs(y)) * 0.003;
      const scale = 1 + depth;

      node.style.transform = `rotateX(${rotateX.toFixed(3)}deg) rotateY(${rotateY.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
    },
    []
  );

  useEffect(() => {
    const node = wrapperRef.current;
    if (!node) return;
    if (typeof window === "undefined") return;

    const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    isDesktopRef.current = true;

    const onMouseMove = (event: MouseEvent) => {
      const halfW = window.innerWidth / 2 || 1;
      const halfH = window.innerHeight / 2 || 1;
      const normalizedX = clamp((event.clientX - halfW) / halfW, -1, 1);
      const normalizedY = clamp((event.clientY - halfH) / halfH, -1, 1);
      targetRef.current.x = normalizedX;
      targetRef.current.y = normalizedY;
    };

    const resetTarget = () => {
      targetRef.current.x = 0;
      targetRef.current.y = 0;
    };

    const tick = () => {
      const c = currentRef.current;
      const t = targetRef.current;
      c.x += (t.x - c.x) * clampedSmoothing;
      c.y += (t.y - c.y) * clampedSmoothing;
      applyTransform(c.x, c.y);
      rafRef.current = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", resetTarget);
    window.addEventListener("blur", resetTarget);
    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", resetTarget);
      window.removeEventListener("blur", resetTarget);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [applyTransform, clamp, clampedSmoothing]);

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ perspective: 800 }}
    >
      <div
        ref={wrapperRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: `${maxSize}px`,
          maxHeight: `${maxSize}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transformStyle: "preserve-3d",
          willChange: "transform",
          transition: "transform 0.1s ease-out",
        }}
      >
        <Image
          src={imageUrl}
          alt={altText}
          width={maxSize}
          height={maxSize}
          className="pointer-events-none select-none object-contain w-full h-full"
          priority
        />
      </div>
    </div>
  );
}
