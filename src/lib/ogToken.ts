import { createHmac, timingSafeEqual } from "node:crypto";

export const signOgPost = (secret: string, post: string) =>
  createHmac("sha256", secret).update(post).digest("hex");

export function isValidOgToken(secret: string, post: string, token: string) {
  const expected = Buffer.from(signOgPost(secret, post));
  const received = Buffer.from(token);
  return (
    received.length === expected.length && timingSafeEqual(received, expected)
  );
}
