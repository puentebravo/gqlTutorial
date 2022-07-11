import { ApolloServer } from "apollo-server";
// Imports the object defined by Nexus. This dictates which api operations to support in the Api.
import { schema } from "./schema";
import { context } from "./context";


export const server = new ApolloServer({
    schema,
    context
})



const port = 4000;

server.listen({port}).then(({url}) => {
    console.log(`Carrier online at ${url}`)
})