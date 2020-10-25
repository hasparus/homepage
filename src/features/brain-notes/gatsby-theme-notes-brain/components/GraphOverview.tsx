/** @jsx jsx */
import { useLayoutEffect, useRef } from "react";

import type { Node, Edge, Network } from "vis-network/peer";
import { jsx } from "theme-ui";

import "vis-network/styles/vis-network.css";
import { graphql, useStaticQuery } from "gatsby";

export interface GraphOverviewProps {
  id?: string;
}

// TODO: Get rid of background images and use unicode arrows
// https://en.wikipedia.org/wiki/Arrows_(Unicode_block)
export function GraphOverview(props: GraphOverviewProps) {
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

  let network: Network;

  useLayoutEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    void (async function makeGraph() {
      const { DataSet } = await import("vis-data/peer");
      const { Network } = await import("vis-network/peer");

      const nodes = new DataSet<Node>([
        { id: 1, label: "Node 1", title: "popup" },
        { id: 2, label: "Node 2", title: "popup" },
        { id: 3, label: "Node 3", title: "popup" },
        { id: 4, label: "Node 4", title: "popup" },
        { id: 5, label: "Node 5", title: "popup" },
      ]);

      const edges = new DataSet<Edge>([
        { from: 1, to: 3 },
        { from: 1, to: 2 },
        { from: 2, to: 4 },
        { from: 2, to: 5 },
        { from: 3, to: 3 },
      ]);

      network = new Network(
        containerRef.current as HTMLElement,
        { edges, nodes },
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
        }
      );

      network.on("click", function (this: Network, params: any) {
        params.event = "[original event]";
        console.log(
          "click event, getNodeAt returns: " +
            this.getNodeAt(params.pointer.DOM)
        );
      });
    })();

    return () => {
      network.destroy();
    };
  }, []);

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
