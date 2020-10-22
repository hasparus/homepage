module.exports = {
  client: {
    addTypename: false,
    excludes: [],
    includes: ["./src/**/*.tsx","./src/**/*.ts","./plugins/**/*.js","./node_modules/gatsby-source-contentful/src/fragments.js","./node_modules/gatsby-source-datocms/fragments/*.js","./node_modules/gatsby-source-sanity/fragments/*.js","./node_modules/gatsby-transformer-sharp/src/fragments.js","./src/**/*.tsx","./src/**/*.ts","./src/**/*fragments.js"],
    service: {
      name: "gatsbySchema",
      localSchemaFile: "gql-schema.json"
    },
    tagName: "graphql"
  }
}