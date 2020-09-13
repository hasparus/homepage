export const formatDate = (date: ConstructorParameters<typeof Date>[0]) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
