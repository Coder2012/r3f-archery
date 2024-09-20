import React, { useState, useRef } from "react";

export const Controls = ({ onChange }) => {
  const [angle, setAngle] = useState(0);
  const svgRef = useRef(null);

  const startAngleRef = useRef(0);
  const startXRef = useRef(0);

  const handleMouseMove = (event) => {
    const rect = svgRef.current.getBoundingClientRect();
    const deltaX = event.clientX - startXRef.current;
    const sensitivity = 0.2;
    const deltaAngle = -deltaX * (90 / rect.width) * sensitivity;
    let newAngle = startAngleRef.current + deltaAngle;
    newAngle = Math.max(0, Math.min(newAngle, 90));
    setAngle(newAngle);
    onChange(newAngle);
  };

  const handleMouseDown = (event) => {
    startAngleRef.current = angle;
    startXRef.current = event.clientX;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="controls">
      <svg
        ref={svgRef}
        width="200"
        height="200"
        viewBox="-10 -10 220 220"
        onMouseDown={handleMouseDown}
        style={{
          border: "2px solid #007bff",
          cursor: "pointer",
        }}
      >
        <line
          x1="0"
          y1="200"
          x2="200"
          y2="200"
          stroke="white"
          strokeWidth="4"
          style={{
            transformOrigin: "0px 200px",
            transform: `rotate(-${angle}deg)`,
          }}
        />
        <circle
          cx="200"
          cy="200"
          r="12"
          fill="#884422"
          style={{
            transformOrigin: "0px 200px",
            transform: `rotate(-${angle}deg)`,
          }}
        />
      </svg>
    </div>
  );
};
