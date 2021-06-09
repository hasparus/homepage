import { graphql, StaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import { DeepNonNullable } from "utility-types";

import type {
  ImageSharpOriginal,
  SeoDataQuery,
} from "../../../graphql-types";

const query = graphql`
  query SeoData {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl
        htmlAttributes {
          lang
        }
        # defaultImage: image
        twitterUsername
      }
    }
  }
`;

// react-helmet checks children types
export function seoImage(imageSrc: string) {
  return [
    <meta key="seoImage-image" name="image" content={imageSrc} />,
    <meta key="seoImage-og:image" property="og:image" content={imageSrc} />,
    <meta
      key="seoImage-twitter:image"
      name="twitter:image"
      content={imageSrc}
    />,
  ];
}

type SeoProps = {
  title?: string;
  description?: string;
  titleTemplate?: string;
  image?: string | ImageSharpOriginal;
  pathname?: string;
  article?: boolean;
};

export const Seo = ({
  title,
  titleTemplate,
  description,
  image,
  pathname,
  article,
}: SeoProps) => (
  <StaticQuery
    query={query}
    render={({ site: { siteMetadata } }: DeepNonNullable<SeoDataQuery>) => {
      const seo = {
        title: title || siteMetadata.defaultTitle,
        description: description ?? siteMetadata.defaultDescription,
        imageSrc:
          image &&
          `${siteMetadata.siteUrl}${
            typeof image === "string" ? image : image.src
          }`,
        url: `${siteMetadata.siteUrl}${pathname || "/"}`,
      };

      return (
        <>
          <Helmet
            htmlAttributes={siteMetadata.htmlAttributes}
            title={seo.title}
            titleTemplate={titleTemplate || siteMetadata.titleTemplate}
          >
            <meta name="description" content={seo.description} />

            {seo.imageSrc && seoImage(seo.imageSrc)}

            {/* open graph */}
            {seo.url && <meta property="og:url" content={seo.url} />}
            {article && <meta property="og:type" content="article" />}
            {seo.title && <meta property="og:title" content={seo.title} />}
            {seo.description && (
              <meta property="og:description" content={seo.description} />
            )}
            {typeof image === "object" && [
              <meta
                key="1"
                property="og:image:width"
                content={String(image.width)}
              />,
              <meta
                key="2"
                property="og:image:height"
                content={String(image.height)}
              />,
            ]}

            {/* twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            {siteMetadata.twitterUsername && (
              <meta
                name="twitter:creator"
                content={siteMetadata.twitterUsername}
              />
            )}
            {seo.title && <meta name="twitter:title" content={seo.title} />}
            {seo.description && (
              <meta name="twitter:description" content={seo.description} />
            )}
          </Helmet>
        </>
      );
    }}
  />
);
