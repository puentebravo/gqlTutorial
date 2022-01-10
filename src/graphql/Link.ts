import { objectType, extendType, nonNull, stringArg, arg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  // defines the name of the type you're building.
  name: "Link",
  // Adds different fields to the type.
  definition(t) {
    t.nonNull.int("id"); // adds non nullable id as an integer, and a description and url as strings.
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

// defines the type of the links variable as an array of Link objects, such as those listed below.
let links: NexusGenObjects["Link"][] = [
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];
// extending the Query root type/factory type, adding a new root field to it called feed.
export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      //defines the return type of the feed query as a non nullable array of link type objects. In schema definition language (sdl), it'll look look like [Link!]!
      type: "Link",
      resolve(parent, args, context, info) {
        // this is the name of the resolver function of the feed query. A resolver is the implementation for a GraphQL field. Each field on every type (including root types) has a resolver which executes to get the return value when fetching that type. Essentially, this is the business end of a GraphQL type - it gets you the info you need in the format you specified. This one returns the links array.
        return links;
      },
    });
  },
});


// Extends the mutation type to add a new root field, linkmutation. 
export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", { // names the mutation post, and returns a link object that is non nullable. 
      type: "Link",
      args: {  // Defines arguments passed to the graphql api endpoints. This is done similarly to REST api (why fix what isn't broken). 
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        const { description, url } = args;

        let idCount = links.length + 1;
        const link = {
          id: idCount,
          description: args.description,
          url: args.url,
        };
        links.push(link);
        return link;
      },
    });
  },
});