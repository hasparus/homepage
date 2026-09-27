/** Browser bundle entry: everything a page needs to run the suite. */

export {
  WINDOW,
  cacheBase,
  calendar,
  fixture,
  width,
  windowStart,
} from "./fixtures.mjs";
export { strategies } from "./strategies.mjs";
export { expectedStates, measure, verify, workloads } from "./measure.mjs";
