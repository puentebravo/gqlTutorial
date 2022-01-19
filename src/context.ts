import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/clientAuth";
import { Request } from "express";


export const prisma = new PrismaClient();

export interface Context { // Defines context interface, specifying which objects will be attached to the context object. In this instance, it's attaching the prisma client. It's also now defining user ID as a number, while also setting it to optional for when no users are logged in or no requests are sent without the Authorization header 
    prisma: PrismaClient
    userId?: number
}


export const context = ({ req }: {req: Request}): Context => { // No longer the simple return we had here before, this is now a function that needs to be executed to return the actual Context-typed object. 

    const token = 
    req && req.headers.authorization
        ? decodeAuthHeader(req.headers.authorization)
        : null

    return {
        prisma, 
        userId: token?.userId
    }
}