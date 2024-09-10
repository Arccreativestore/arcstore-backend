import {config} from "dotenv";
config({path: ['.env']});
import {ApolloServer} from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4";
import {resolvers, typeDefs} from "./schema";
import http from "http";
import {isDev, MONGO_URI, PORT} from "./config/config";
import express, {CookieOptions, NextFunction, Request, Response} from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import packageJson from "../package.json" assert {type: "json"};
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {Document} from "mongoose";
import apiRoute from "./api/route";
import db from "./config/database";
import { logger } from "./config/logger";
import context from "./context/context";


export const cookieSettings = {
    httpOnly: true,
    secure: false,
} satisfies CookieOptions;


declare global {
    type LeanDocument<T> = T & Document;

    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

interface MyContext {
    token?: String;

}



// connect db
new db(logger).connect(MONGO_URI as string); // use winston



const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer<MyContext>({
    // formatError, infuse error formatter
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
app.use(cookieParser());
app.use(cors<cors.CorsRequest>(corsOptions));



app.get("/", async (req:Request, res:Response) => {
    res.json({name: packageJson.name, version: packageJson.version, });
});


app.use('/api/v1', apiRoute);


app.use("/graphql",
    bodyParser.json({limit: "5mb"}),
    expressMiddleware(server, {
   // context: context
    })
);


// Generic error handler middleware
app.use((err:any, req:Request, res:Response, next:NextFunction) => {
    console.error(err.stack); // Log the error details
    res.status(err.status || 500).json({
        success: false,
        error: err.stack
    });
});

await new Promise<void>((resolve) =>
    httpServer.listen({port: PORT}, resolve)
);


console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
