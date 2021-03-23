/** @jsx jsx */
import { graphql, navigate, useStaticQuery } from "gatsby";
import { Fragment, useLayoutEffect, useRef } from "react";
import { jsx, useThemeUI } from "theme-ui";
import type { Edge, Network, Node } from "vis-network/peer";

import { GraphOverviewNotesQuery } from "../../../../../graphql-types";
import { ExactTheme, ExactThemeFromCtx } from "../../../../gatsby-plugin-theme-ui";
import { ColorMode } from "../../../../lib/theme-ui-preset-hasparus-homepage";

import "vis-network/styles/vis-network.css";

const navigationButtonsStyles = /* css */ `
  div.vis-network div.vis-navigation div.vis-button.vis-up, 
  div.vis-network div.vis-navigation div.vis-button.vis-down, 
  div.vis-network div.vis-navigation div.vis-button.vis-left, 
  div.vis-network div.vis-navigation div.vis-button.vis-right, 
  div.vis-network div.vis-navigation div.vis-button.vis-zoomIn, 
  div.vis-network div.vis-navigation div.vis-button.vis-zoomOut, 
  div.vis-network div.vis-navigation div.vis-button.vis-zoomExtends {
    background-image: none !important;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  div.vis-network div.vis-navigation div.vis-button:hover {
    box-shadow: none !important;
  }

  .vis-button:after {
    color: var(--theme-ui-colors-gray);
    opacity: 0.5;
  }

  .vis-button:hover:after {
    opacity: 1;
  }

  .vis-button.vis-up:after {
    content: "▲";
  }

  .vis-button.vis-down:after {
    content: "▼";
  }

  .vis-button.vis-left:after {
    content: "◀";
  }

  .vis-button.vis-right:after {
    content: "▶";
  }

  .vis-button.vis-zoomIn:after {
    font-size: 2em;
    content: "+";
  }

  .vis-button.vis-zoomOut:after {
    font-size: 2em;
    content: "−";
  }

  .vis-button.vis-zoomExtends:after {
    font-size: 1.3em;
    content: "⤧";
  }
`;

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

export function GraphOverview(props: GraphOverviewProps) {
  const { rawColors: colors } = useThemeUI().theme as ExactThemeFromCtx;

  const data = useStaticQuery<GraphOverviewNotesQuery>(graphql`
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
      return undefined;
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
          label: title || undefined,
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
            dragView: true,
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

      net.on("click", function handleClick(
        this: Network,
        params: {
          pointer: unknown;
          nodes: string[];
          edges: string[];
          items: unknown[];
          event: unknown;
        }
      ) {
        const node = params.nodes[0];
        if (node) {
          void navigate(node);
        }
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
    <Fragment>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: navigationButtonsStyles }}
      />
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
    </Fragment>
  );
}
