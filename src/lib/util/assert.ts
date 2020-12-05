import { AssertionError } from "assert";

export function assert(
  condition: any,
  message?: string
): asserts condition {
  if (!condition) {
    console.error(message);
    throw new AssertionError({ message });
  }
}
