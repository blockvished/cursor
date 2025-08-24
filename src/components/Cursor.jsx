import React, { useEffect, useRef } from "react";

const colors = [
  "#ffb56b",
  "#fdaf69",
  "#f89d63",
  "#f59761",
  "#ef865e",
  "#ec805d",
  "#e36e5c",
  "#df685c",
  "#d5585c",
  "#d1525c",
  "#c5415d",
  "#c03b5d",
  "#b22c5e",
  "#ac265e",
  "#9c155f",
  "#950f5f",
  "#830060",
  "#7c0060",
  "#680060",
  "#60005f",
  "#48005f",
  "#3d005e",
];

const NUM_CIRCLES = 20;

export default function CursorTrail() {
  const coords = useRef({ x: 0, y: 0 });
  const circlesRef = useRef([]);
  const positions = useRef(
    Array.from({ length: NUM_CIRCLES }, () => ({ x: 0, y: 0 })),
  );

  useEffect(() => {
    // Hide the native cursor globally
    document.body.style.cursor = "none";

    const handleMouseMove = (e) => {
      coords.current.x = e.clientX;
      coords.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

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
      document.body.style.cursor = "auto"; // restore cursor on unmount
    };
  }, []);

  return (
    <>
      {Array.from({ length: NUM_CIRCLES }).map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) circlesRef.current[i] = el;
          }}
          style={{
            height: "24px",
            width: "24px",
            borderRadius: "50%",
            backgroundColor: colors[i % colors.length],
            position: "fixed",
            top: 0,
            left: 0,
            pointerEvents: "none",
            zIndex: 99999999,
          }}
        />
      ))}
    </>
  );
}
