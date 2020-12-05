/**
 * @see https://github.com/tc39/proposal-throw-expressions
 */
export function panic(message: string): never {
  throw new Error(message);
}
