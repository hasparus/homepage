import { type JSX,splitProps } from "solid-js";

interface VennDiagramProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  labels: string[];
  style: JSX.CSSProperties;
  distance?: number;
  radius?: number;
  height?: number;
}
export function VennDiagram(props: VennDiagramProps) {
  const [ownProps, rest] = splitProps(props, [
    "labels",
    "distance",
    "radius",
    "height",
  ]);

  const width = 1000;
  const height = () => ownProps.height || 600;
  const paddingBottom = -60;

  const position = (angle: number) => ({
    x: +(ownProps.distance || 130) * Math.cos(angle),
    y: +(ownProps.distance || 130) * Math.sin(angle),
  });

  const circles = [
    { color: "hsl(217deg, 80%, 67%)", pos: position(-Math.PI / 2) },
    { color: "hsl(116deg, 66%, 65%)", pos: position((5 * Math.PI) / 6) },
    { color: "hsl(9deg, 80%, 66%)", pos: position(Math.PI / 6) },
  ];

  return (
    <svg
      {...rest}
      class="dark:opacity-80"
      style={{
        ...rest.style,
        font: "italic 666 2em var(--serif)",
      }}
      viewBox={`${-width / 2} ${-height() / 2} ${width} ${
        height() + paddingBottom
      }`}
    >
      <g class="isolate">
        {circles.map((circle) => (
          <circle
            cx={circle.pos.x}
            cy={circle.pos.y}
            r={ownProps.radius || 150}
            fill={circle.color}
            class="mix-blend-screen dark:opacity-100"
          />
        ))}
      </g>
      {circles.map((circle, i) => (
        <text
          x={circle.pos.x}
          y={circle.pos.y}
          text-anchor="middle"
          dominant-baseline="central"
        >
          {ownProps.labels[i]}
        </text>
      ))}
      {ownProps.labels[3] && (
        <text
          x={0}
          y={-6}
          text-anchor="middle"
          dominant-baseline="central"
          style="font-size: 0.8em;"
        >
          {ownProps.labels[3]}
        </text>
      )}
    </svg>
  );
}
