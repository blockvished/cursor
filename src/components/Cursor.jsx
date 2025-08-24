// CursorTrail.jsx
import React, { useEffect, useRef, useState } from "react";

// grayscale shades (from light gray to pure black)
const colors = [
  "#000000",
  "#111111",
  "#1a1a1a",
  "#222222",
  "#2a2a2a",
  "#333333",
  "#3d3d3d",
  "#474747",
  "#515151",
  "#5b5b5b",
  "#656565",
  "#707070",
  "#7a7a7a",
  "#858585",
  "#909090",
  "#9a9a9a",
  "#a5a5a5",
  "#b0b0b0",
  "#bbbbbb",
  "#c6c6c6",
];

const NUM_CIRCLES = colors.length;

export default function CursorTrail() {
  const coords = useRef({ x: 0, y: 0 });
  const circlesRef = useRef([]);
  const positions = useRef(
    Array.from({ length: NUM_CIRCLES }, () => ({ x: 0, y: 0 })),
  );
  const [clickEffects, setClickEffects] = useState([]);

  useEffect(() => {
    // Hide system cursor globally
    const style = document.createElement("style");
    style.innerHTML = `* { cursor: none !important; }`;
    document.head.appendChild(style);

    const handleMouseMove = (e) => {
      coords.current.x = e.clientX;
      coords.current.y = e.clientY;
    };

    const handleClick = (e) => {
      const id = Date.now();
      setClickEffects((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);

      // remove after animation
      setTimeout(() => {
        setClickEffects((prev) => prev.filter((c) => c.id !== id));
      }, 600); // matches CSS animation duration
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleClick);

    function animateCircles() {
      let x = coords.current.x;
      let y = coords.current.y;

      positions.current.forEach((pos, index) => {
        const circle = circlesRef.current[index];
        if (!circle) return;

        circle.style.left = x - 12 + "px";
        circle.style.top = y - 12 + "px";
        circle.style.scale = (NUM_CIRCLES - index) / NUM_CIRCLES;

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
      document.head.removeChild(style); // restore cursor
    };
  }, []);

  return (
    <>
      {/* Cursor trail */}
      {colors.map((color, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) circlesRef.current[i] = el;
          }}
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "50%",
            backgroundColor: color,
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
            backgroundColor: "rgba(0,0,0,0.4)",
            pointerEvents: "none",
            zIndex: 99999999,
            animation: "ripple 0.6s ease-out forwards",
          }}
        />
      ))}

      {/* Ripple animation CSS */}
      <style>{`
        @keyframes ripple {
          0% { transform: scale(0); opacity: 0.8; }
          100% { transform: scale(3); opacity: 0; }
        }
      `}</style>
    </>
  );
}
