import { Index } from "lunr";
import { useLunr } from "react-lunr";

// Atanas recommends Fuse instead. He had perf problems with Lunr.
// - https://www.gatsbyjs.com/plugins/@draftbox-co/gatsby-plugin-fusejs/

/**
 * @see https://github.com/angeloashmore/react-lunr
 */
export function useLocalSearch(query: string) {
  const index: Index = (window as any).__LUNR__.en;

  return useLunr<unknown>(query, index);
}
