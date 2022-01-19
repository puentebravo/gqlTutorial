import {APP_SECRET} from "./auth";
import * as jwt from "jsonwebtoken";

export interface AuthTokenPayload { // This defines an interface to be used in the decode auth header. Based on the shape of the jwt we issued during signup and login, this tells the server to expect a response in this format when it decodes a token. 
    userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload { // Few things going on here. Authheader is being defined as a string, and its output as an object in the shape of the interface we defined above. This function takes the authorization header, parses it, and then returns the payload of the JWT. 
    const token = authHeader.replace("Bearer ", ""); // Since bearer is the name of the authorization scheme, we can filter it out to get to the token itself - the only thing the server is really interested in. More information on this here: https://security.stackexchange.com/q/108662

    if (!token) {
        throw new Error("Warning: no token found.")
    }

    return jwt.verify(token, APP_SECRET) as AuthTokenPayload; // Decodes the token using the key that signed the token. Again; the app secret should be very well hidden. 
}