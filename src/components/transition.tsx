import { useState, useEffect } from "react";

export default function Transistion() {
  const [positions, setPositions] = useState([0, 100, 200, 300]); // Initial positions

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "d") {
        console.log("d pressed");
        setPositions((prev) => prev.map((pos) => pos + 100)); // Move all tiles right
      } else if (e.key === "a") {
        console.log("a pressed");
        setPositions((prev) => prev.map((pos) => pos - 100)); // Move all tiles left
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div style={{ display: "flex", gap: "1rem", padding: "2rem" }}>
      {positions.map((pos, index) => (
        <div
          key={index}
          className="tile"
          style={{
            transform: `translateX(${pos}px)`,
            transition: "transform 2s ease-out",
            background: "#45FF11",
            width: "4rem",
            height: "4rem",
          }}
        />
      ))}
    </div>
  );
}
