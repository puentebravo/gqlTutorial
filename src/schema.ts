import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";

export const schema = makeSchema({
  types, // array of types that will comprise the schema itself
  outputs: {
    // first output: generates a schema file, defines structure of api
    schema: join(__dirname, "..", "schema.graphql"),
    // typescript definitions for all types in graphQL schema
    typegen: join(__dirname, "..", "nexus-typegen.ts"),
  },
  contextType: { // defines context object
    module: join(__dirname, "./context.ts"), // absolute path to the module where the interface/type is being exported
    export: "Context", // Name of the exported interface/type in the referenced module. 
  },
});
