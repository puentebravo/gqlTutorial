import { objectType, extendType, nonNull, intArg } from "nexus";
import { User } from "@prisma/client";

export const Vote = objectType({ // Not much new here, but it's worth noting this object is a union of two things: a link, and the user who cast the vote
  name: "Vote",
  definition(t) {
    t.nonNull.field("link", { type: "Link" });
    t.nonNull.field("user", { type: "User" });
  },
});

export const VoteMutation = extendType({ // This mutation returns an instance of a vote type, as seen below.
  type: "Mutation",
  definition(t) {
    t.field("vote", {
      type: "Vote",
      args: {
        linkId: nonNull(intArg()),
      },
      async resolve(parent, args, context) {
        const { userId } = context;
        const { linkId } = args;

        if (!userId) {
          throw new Error("You must be logged in to vote.");
        }

        const link = await context.prisma.link.update({ // Updates the voters field in a link with the userID of the person who voted. The connect option on line 34 connects the vote with the userID, adding that user to the many to many relationship. 
          where: {
            id: linkId,
          },
          data: {
            voters: {
              connect: {
                id: userId,
              },
            },
          },
        });

        const user = await context.prisma.user.findUnique({ where: {id: userId}})

        return {
            link,
            user: user as User  // This is notable here, as the default type returned by findUnique is User OR Null. The resolver expects User.
        }
      },
    });
  },
});
