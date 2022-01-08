import { makeSchema } from "nexus";
import { join } from "path";

export const schema = makeSchema({
  types: [], // array of types that will comprise the schema itself
  outputs: {
      // first output: generates a schema file, defines structure of api
    schema: join(__dirname, "..", "schema.graphql"),
    // typescript definitions for all types in graphQL schema 
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
  },
});
