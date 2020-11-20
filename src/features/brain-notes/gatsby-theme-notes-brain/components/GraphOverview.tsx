/** @jsx jsx */
import "vis-network/styles/vis-network.css";

import { graphql, useStaticQuery } from "gatsby";
import { useLayoutEffect, useRef } from "react";
import { jsx, useThemeUI } from "theme-ui";
import type { Edge, Network, Node } from "vis-network/peer";

import { ExactTheme } from "../../../../gatsby-plugin-theme-ui";
import { ColorMode } from "../../../../lib/theme-ui-preset-hasparus-homepage";

function getNodeStyle(colors: ColorMode): Node {
  return {
    color: {
      background: colors.muted,
      border: colors.mutedPrimary09,
      highlight: colors.mutedPrimary09,
      hover: colors.mutedPrimary09,
    },
    font: {
      color: colors.text,
    },
  };
}

export interface GraphOverviewProps {
  id?: string;
}

// TODO: Get rid of background images and use unicode arrows
// https://en.wikipedia.org/wiki/Arrows_(Unicode_block)
export function GraphOverview(props: GraphOverviewProps) {
  const { colors } = useThemeUI().theme as ExactTheme;

  const data = useStaticQuery<GatsbyTypes.GraphOverviewNotesQuery>(graphql`
    query GraphOverviewNotes {
      allFile(filter: { sourceInstanceName: { eq: "notes" } }) {
        nodes {
          childMdx {
            fields {
              title
              route
            }
            outboundReferences {
              ... on Mdx {
                fields {
                  route
                }
              }
            }
          }
        }
      }
    }
  `);

  const containerRef = useRef<HTMLDivElement>(null);
  const network = useRef<Network | undefined>();

  // makeGraph is async so colors change while it runs
  const currentColors = useRef<typeof colors>(colors);
  currentColors.current = colors;

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    void (async function makeGraph() {
      const { DataSet } = await import("vis-data/peer");
      const { Network } = await import("vis-network/peer");

      const nodes: Node[] = [];
      const edges: Edge[] = [];

      for (const file of data.allFile.nodes) {
        const { fields, outboundReferences } = file.childMdx!;
        const { route, title } = fields!;

        nodes.push({
          id: route,
          label: title,
          // title: 'popup?'
        });

        for (const reference of outboundReferences) {
          edges.push({
            from: route,
            to: reference.fields!.route,
          });
        }
      }

      const net = new Network(
        containerRef.current as HTMLElement,
        {
          edges: new DataSet<Edge>(edges),
          nodes: new DataSet<Node>(nodes),
        },
        {
          /**
           * @see https://visjs.github.io/vis-network/docs/network/interaction.html
           */
          interaction: {
            hover: true,
            dragView: false,
            navigationButtons: true,
            keyboard: true,
          },
          nodes: {
            shape: "box",
            chosen: {
              node: true,
              label: false,
            },
            ...getNodeStyle(currentColors.current),
          },
          edges: { width: 2, hoverWidth: 3, selectionWidth: 3 },
        }
      );

      net.on("click", function (this: Network, params: any) {
        params.event = "[original event]";
        console.log(params);
      });

      net.on("hoverNode", () => {
        container.style.cursor = "pointer";
      });
      net.on("blurNode", () => {
        container.style.cursor = "initial";
      });

      let cursorBeforeDrag = "initial";
      net.on("dragStart", () => {
        cursorBeforeDrag = container.style.cursor;
        container.style.cursor = "grabbing";
      });
      net.on("dragEnd", () => {
        container.style.cursor = cursorBeforeDrag;
      });

      network.current = net;

      console.log(network.current);
    })();

    return () => {
      network.current?.destroy();
    };
  }, [data.allFile.nodes]);

  useLayoutEffect(() => {
    if (network.current) {
      network.current.setOptions({
        nodes: getNodeStyle(colors),
      });
      network.current.redraw();
    }
  }, [colors]);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <div
      id="graph-overview"
      sx={{
        border: "1px solid",
        borderColor: "muted",
        height: "600px",
        maxHeight: "70vh",
      }}
      ref={containerRef}
      {...props}
    />
  );
}
