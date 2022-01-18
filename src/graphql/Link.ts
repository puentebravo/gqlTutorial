import { objectType, extendType, nonNull, stringArg, arg, intArg } from "nexus";

export const Link = objectType({
  // defines the name of the type you're building.
  name: "Link",
  // Adds different fields to the type.
  definition(t) {
    t.nonNull.int("id"); // adds non nullable id as an integer, and a description and url as strings.
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.field("postedBy", {
      type: "User",
      resolve(parent, args, context) { // similar to the User property, this lists the user who created this post, if any.
        return context.prisma.link
          .findUnique({ where: { id: parent.id } })
          .postedBy();
      },
    });
  },
});

// extending the Query root type/factory type, adding a new root field to it called feed.
export const LinkQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      //defines the return type of the feed query as a non nullable array of link type objects. In schema definition language (sdl), it'll look look like [Link!]!
      type: "Link",
      resolve(parent, args, context, info) {
        // this is the name of the resolver function of the feed query. A resolver is the implementation for a GraphQL field. Each field on every type (including root types) has a resolver which executes to get the return value when fetching that type. Essentially, this is the business end of a GraphQL type - it gets you the info you need in the format you specified. This one returns the links array.
        return context.prisma.link.findMany();
      },
    });
  },
});

// Extends the mutation type to add a new root field, linkmutation.
export const LinkMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      // names the mutation post, and returns a link object that is non nullable.
      type: "Link",
      args: {
        // Defines arguments passed to the graphql api endpoints. This is done similarly to REST api (why fix what isn't broken).
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },

      resolve(parent, args, context) {
        // Carries the arguments for the operation defined above; in this case, that's the URL and description of the link to be created. Think of these four as similar to req, res for REST endpoints. The parent carries the result of the previous resolver execution level.
        const newLink = context.prisma.link.create({
          data: {
            description: args.description,
            url: args.url,
          },
        });

        return newLink; // if anything but link is returned here, the generated types and TS will catch the mistake.
      },
    });
  },
});
