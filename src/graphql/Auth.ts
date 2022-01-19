import { objectType, extendType, nonNull, stringArg } from "nexus";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { APP_SECRET } from "../utils/auth";

export const AuthPayload = objectType({
  name: "AuthPayload",
  definition(t) {
    t.nonNull.string("token");
    t.nonNull.field("user", {
      type: "User",
    });
  },
});

export const AuthMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("signup", { //returns an instacnce of auth payload, which contains three arugments: email, password, and the user name, all of which are non nullable. 
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      async resolve(parent, args, context) {
        const { email, name } = args; 

        const password = await bcrypt.hash(args.password, 10); // uses bcrypt to hash the user's password. Second parameter is the salt length to generate.

        const user = await context.prisma.user.create({ // Stores new user record in database via the create method.
          data: { email, name, password },
        });

        const token = jwt.sign({ userID: user.id }, APP_SECRET); // generates a json web token, signed by an app secret. This token encodes a unique ID for the user while signed in.

        return { // Returns both the token and the user as an object in the shape of the authpayload defined earlier. As before, if anything but this shape is returned, the IDE will return an error. 
          token,
          user,
        };
      },
    });

    t.nonNull.field("login", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },

      async resolve(parent, args, context) { // The resolvers in both this and the signup function above are async; unlike before, we need to run a few functions within first before the resolver completes. 

        const user = await context.prisma.user.findUnique({ //instead of creating a new user, we're trying to find an existing one here using their email address as their unique identifier. 
          where: {email: args.email},
        });

        if (!user) { // if that user doesn't exist, throw an error. 
          throw new Error("We can't find that user. Don't have an account? Sign up for a new one!")
        }

        const valid = await bcrypt.compare( // compares the entered password with the user's saved hash. 
          args.password,
          user.password
        );

        if (!valid) {
          throw new Error("Well, that password didn't work. One more time?")
        };

        const token = jwt.sign({ userID: user.id }, APP_SECRET); //just like in signup, this creates a new json web token containing the user id of the person logging in. 

        return {
          token,
          user
        }
      }

    })

  },
});
