import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from "graphql-scalars"; // imports the pre-built GraphQLDateTime scalar from the graphql-scalars library. It uses the same spec that Prisma does for its own datetime type - ISO-8601

export const GQLDate = asNexusMethod(GraphQLDateTime, "dateTime"); // the asNexusMethod function exposes a custom scalar as a nexus type. This takes two arguments - A custom sclar, and a name for the type. 

