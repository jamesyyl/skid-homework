import { useMemo } from "react";

type ForceData = {
  name: string;
  x: number; // Horizontal component (e.g., 10)
  y: number; // Vertical component (e.g., -10)
  color?: string;
};

export default function ForceDiagram({ code }: { code: string }) {
  const forces: ForceData[] = useMemo(() => {
    try {
      return JSON.parse(code);
    } catch {
      return [];
    }
  }, [code]);

  // SVG Config
  const size = 300;
  const center = size / 2;
  const scale = 20; // Scale factor: 1 unit = 20px

  return (
    <div className="my-6 flex justify-center rounded-lg border border-gray-200 bg-gray-50 p-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Define Arrow Marker */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#555" />
          </marker>
        </defs>

        {/* Grid Lines (Optional background) */}
        <line
          x1={center}
          y1={0}
          x2={center}
          y2={size}
          stroke="#e5e7eb"
          strokeWidth="2"
        />
        <line
          x1={0}
          y1={center}
          x2={size}
          y2={center}
          stroke="#e5e7eb"
          strokeWidth="2"
        />

        {/* The Object (Block) */}
        <rect
          x={center - 20}
          y={center - 20}
          width={40}
          height={40}
          fill="#374151" // gray-700
          rx={4}
        />

        {/* Force Vectors */}
        {forces.map((f, i) => {
          // SVG Y-axis is inverted (down is positive), so we negate f.y
          const endX = center + f.x * scale;
          const endY = center - f.y * scale;
          const color = f.color || "#ef4444"; // default red

          return (
            <g key={i}>
              {/* The Arrow Line */}
              <line
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke={color}
                strokeWidth="3"
                markerEnd={`url(#arrowhead-${i})`} // Use unique marker for color
              />

              {/* Dynamic Colored Marker */}
              <defs>
                <marker
                  id={`arrowhead-${i}`}
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3.5, 0 7" fill={color} />
                </marker>
              </defs>

              {/* Force Label */}
              <text
                x={endX + (f.x >= 0 ? 10 : -20)}
                y={endY + (f.y >= 0 ? -10 : 20)}
                fill={color}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
              >
                {f.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
