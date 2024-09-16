import {config} from "dotenv";
config({path: ['.env']});
import {ApolloServer} from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4";
import {resolvers, typeDefs} from "./schema";
import http from "http";
import {isDev, MONGO_URI, PORT} from "./config/config";
import express, {CookieOptions, Request, Response} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import packageJson from "../package.json" assert {type: "json"};
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {Document} from "mongoose";
import apiRoute from "./api/route";
import db from "./config/database";
import { logger } from "./config/logger";
import passport from "passport";
import passportAuth from "./services/user/oauth";
import { userModel } from "./models/user";
import formatError from "./helpers/formatError";

import Base from "./base";
export const cookieSettings = {
    httpOnly: true,
    secure: false,
} satisfies CookieOptions;

export interface User{
    _id: string
    email?:string
    iat: number
    exp: number
}

declare global {
    type LeanDocument<T> = T & Document;

    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

interface MyContext {
    token?: String;

}



// connect db
new db(console).connect(MONGO_URI as string); // use winston

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
    formatError, 
    typeDefs,
    resolvers,
    csrfPrevention: false,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    

});

const origin = [
    // "https://example.com", //allowed origin
];

if (isDev) {
    origin.push("http://localhost:3000");
}


const corsOptions = {
    origin,
    credentials: true, // <-- REQUIRED backend setting
};

await server.start();
await userModel().deleteMany({}) // for dev purposes
app.use(cookieParser());
app.use(cors<cors.CorsRequest>(corsOptions));
app.use(passport.initialize())
passportAuth()


app.get("/", async (req:Request, res:Response) => {
    res.json({name: packageJson.name, version: packageJson.version, });
});


app.use('/api/v1', apiRoute);


app.use("/graphql",
    bodyParser.json({ limit: "5mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }) => {

        const token = (req?.headers?.authorization?.startsWith('Bearer ') ? req.headers.authorization.substring(7) : null);

        let user = null
        if (token) {
            
          user = new Base().extractUserDetails(token)
          
        }
      
        return {
          req,
          res,
          user
        };
      },
    })
  );


await new Promise<void>((resolve) =>
    httpServer.listen({port: PORT}, resolve)
);


console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    logger.error(`Uncaught Exception: ${JSON.stringify(error, null, 2)}`);
    process.exit(1); 
  });
