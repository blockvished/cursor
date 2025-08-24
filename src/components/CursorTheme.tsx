"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useTheme } from "next-themes";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

const NUM_CIRCLES = 20;

export default function CursorTrail() {
  const { theme } = useTheme();
  const coords = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const circlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const positions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: NUM_CIRCLES }, () => ({ x: 0, y: 0 })),
  );
  const [clickEffects, setClickEffects] = useState<ClickEffect[]>([]);

  // Generate shades dynamically depending on theme
  const colors = useMemo(() => {
    const shades: string[] = [];
    for (let i = 0; i < NUM_CIRCLES; i++) {
      const value = Math.floor((i / (NUM_CIRCLES - 1)) * 200);
      if (theme === "dark") {
        // lighter shades → darker (white → gray)
        shades.push(`rgb(${255 - value}, ${255 - value}, ${255 - value})`);
      } else {
        // darker shades → lighter (black → gray)
        shades.push(`rgb(${value}, ${value}, ${value})`);
      }
    }
    return shades;
  }, [theme]);

  useEffect(() => {
    // Hide system cursor globally
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      coords.current.x = e.clientX;
      coords.current.y = e.clientY;
    };

    const handleClick = (e: MouseEvent) => {
      const id = Date.now();
      setClickEffects((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

      setTimeout(() => {
        setClickEffects((prev) => prev.filter((c) => c.id !== id));
      }, 600);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleClick);

    function animateCircles() {
      let x = coords.current.x;
      let y = coords.current.y;

      positions.current.forEach((pos, index) => {
        const circle = circlesRef.current[index];
        if (!circle) return;

        circle.style.left = `${x - 12}px`;
        circle.style.top = `${y - 12}px`;
        circle.style.scale = `${(NUM_CIRCLES - index) / NUM_CIRCLES}`;
        circle.style.backgroundColor = colors[index];

        pos.x = x;
        pos.y = y;

        const nextPos = positions.current[index + 1] || positions.current[0];
        x += (nextPos.x - x) * 0.3;
        y += (nextPos.y - y) * 0.3;
      });

      requestAnimationFrame(animateCircles);
    }

    animateCircles();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleClick);
      document.head.removeChild(style);
    };
  }, [colors]);

  return (
    <>
      {/* Cursor trail */}
      {Array.from({ length: NUM_CIRCLES }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            circlesRef.current[i] = el;
          }}
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "50%",
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 99999999,
          }}
        />
      ))}

      {/* Click ripple effect */}
      {clickEffects.map((c) => (
        <span
          key={c.id}
          style={{
            position: "fixed",
            left: c.x - 25,
            top: c.y - 25,
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor:
              theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)",
            pointerEvents: "none",
            zIndex: 99999999,
            animation: "ripple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Ripple animation */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </>
  );
}
