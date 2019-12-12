module.exports = {
  client: {
    addTypename: false,
    excludes: [],
    includes: ["./src/**/*.tsx","./src/**/*.ts","./node_modules/gatsby-source-contentful/src/*.js","./node_modules/gatsby-transformer-sharp/src/*.js","./node_modules/gatsby-image/src/*.js"],
    service: {
      name: "gatsbySchema",
      localSchemaFile: "./gql-schema.json"
    },
    tagName: "graphql"
  }
}