/** Command-line parsing shared by every runner. */

export function option(name, fallback) {
  return (
    process.argv
      .find((arg) => arg.startsWith(`--${name}=`))
      ?.slice(name.length + 3) ?? fallback
  );
}

export function flag(name) {
  return process.argv.includes(`--${name}`);
}

export function numbers(name, fallback) {
  return option(name, fallback).split(",").map(Number);
}

export function list(name, fallback) {
  return option(name, fallback).split(",");
}
