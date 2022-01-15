import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export interface Context { // Defines context interface, specifying which objects will be attached to the context object. In this instance, it's attaching the prisma client. This can be added to as a project grows.
    prisma: PrismaClient
}

export const context: Context = { // Exports the context object, which can then be used by a graphQL server.
    prisma,
};

