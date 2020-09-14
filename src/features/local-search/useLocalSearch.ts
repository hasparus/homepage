import { Index } from "lunr";
import { useLunr } from "react-lunr";

// TODO

/**
 * @see https://github.com/angeloashmore/react-lunr
 */
export function useLocalSearch(query: string) {
  const index: Index = (window as any).__LUNR__.en;

  return useLunr<unknown>(query, index);
}
