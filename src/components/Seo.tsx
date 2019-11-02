import React from "react";
import { Helmet } from "react-helmet";
import { StaticQuery, graphql } from "gatsby";
import { DeepNonNullable } from "utility-types";

import { SeoData } from "./__generated__/SeoData";

const query = graphql`
  query SeoData {
    site {
      siteMetadata {
        defaultTitle: title
        titleTemplate
        defaultDescription: description
        siteUrl
        # defaultImage: image
        twitterUsername
      }
    }
  }
`;

type SeoProps = {
  title?: string;
  description?: string;
  titleTemplate?: string;
  image?: string;
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
    render={({ site: { siteMetadata } }: DeepNonNullable<SeoData>) => {
      const seo = {
        title: title || siteMetadata.defaultTitle,
        description: description || siteMetadata.defaultDescription,
        image: `${siteMetadata.siteUrl}${image /*|| defaultImage*/}`,
        url: `${siteMetadata.siteUrl}${pathname || "/"}`,
      };

      return (
        <>
          <Helmet
            title={seo.title}
            titleTemplate={titleTemplate || siteMetadata.titleTemplate}
          >
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />

            {/* open graph */}
            {seo.url && <meta property="og:url" content={seo.url} />}
            {article && <meta property="og:type" content="article" />}
            {seo.title && <meta property="og:title" content={seo.title} />}
            {seo.description && (
              <meta property="og:description" content={seo.description} />
            )}
            {seo.image && <meta property="og:image" content={seo.image} />}

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
            {seo.image && <meta name="twitter:image" content={seo.image} />}
          </Helmet>
        </>
      );
    }}
  />
);

