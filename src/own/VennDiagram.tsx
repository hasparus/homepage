import { splitProps, type JSX } from "solid-js";

interface VennDiagramProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  labels: string[];
  style: JSX.CSSProperties;
}
export function VennDiagram(props: VennDiagramProps) {
  const [ownProps, rest] = splitProps(props, ["labels"]);

  const radius = 150;
  const width = 1000;
  const height = 600;
  const paddingBottom = -60;

  const distance = 130;

  const position = (angle: number) => ({
    x: +distance * Math.cos(angle),
    y: +distance * Math.sin(angle),
  });

  const circles = [
    { color: "#4090F3", pos: position(-Math.PI / 2), text: "a" },
    { color: "#6DDF65", pos: position((5 * Math.PI) / 6), text: "b" },
    { color: "#ED735D", pos: position(Math.PI / 6), text: "c" },
  ];

  return (
    <svg
      {...rest}
      class="dark:opacity-80"
      style={{
        ...rest.style,
        font: "italic 666 2em var(--serif)",
      }}
      viewBox={`${-width / 2} ${-height / 2} ${width} ${
        height + paddingBottom
      }`}
    >
      <g class="isolate">
        {circles.map((circle) => (
          <circle
            cx={circle.pos.x}
            cy={circle.pos.y}
            r={radius}
            fill={circle.color}
            class="mix-blend-screen"
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
      <text
        x={0}
        y={-6}
        text-anchor="middle"
        dominant-baseline="central"
        style="font-size: 0.8em;"
      >
        {ownProps.labels[props.labels.length - 1]}
      </text>
    </svg>
  );
}
