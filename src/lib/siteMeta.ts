import type { AuthorRef } from "./seo/jsonLd";

export const SITE_NAME = "hasparus";
export const SITE_BLURB = "an online abode of Piotr Monwid-Olechnowicz";

export const AUTHOR_BIO =
  "a software sculptor, clanker cowboy, interested in human computer interaction, and tools that push us into the pit of success. building zagrajmy.net, hobbyist designer of games for nerds";

export const AUTHOR: AuthorRef = {
  "@type": "Person",
  name: "Piotr Monwid-Olechnowicz",
  url: "https://haspar.us/",
  description: AUTHOR_BIO,
  sameAs: ["https://github.com/hasparus"],
};
