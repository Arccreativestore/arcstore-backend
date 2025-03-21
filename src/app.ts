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
//import passportGoogleAuth from "./api/3rdpartyAuth/oauth";
//import FacebookAuth from "./api/3rdpartyAuth/facebook";
import { userModel } from "./models/user";
import formatError from "./helpers/formatError";
import Base from "./base";
import { expressHandler } from "./helpers/expressError";
import { ObjectId } from "mongoose";
import faqModel from "./models/Faq";
import agenda from "./config/agenda";
import AssetModel from "./models/asset";
import  fileModel  from "./models/files";
import CategoryModel from "./models/assetCategory";
import savedAssetsModel from "./models/savedAssets";
import downloadsModel from "./models/downloads";

export const cookieSettings = {
    httpOnly: true,
    secure: false,
} satisfies CookieOptions;

export interface User{
    _id: ObjectId
    firstName: string
    email?:string
    permissions: string[]
    role: string
    features: string[]
    iat: number
    exp: number
}

declare global {
    type LeanDocument<T> = T & Document;

    namespace Express {
        interface Request {
            user?: User;
        }

        interface cookies {
            cookies?:  { [key: string]: string };
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
//app
const origin = [
    "https://arcstore-frontend.fly.dev",
    "https://arc-creatives.fly.dev",
    "http://localhost:3000",
   'https://localhost:3000' ,
    "https://frontend.arcdesign.duckdns.org",
    "https://wooky.fly.dev",
   "https://wooky1.vercel.app"
];

if (isDev) {
    // origin.push("http://localhost:3000", "http://localhost:3001", "");
}


const corsOptions = {
    origin,
    credentials: true, // <-- REQUIRED backend setting
};
agenda.start()
.then(()=>{
    console.log('Agenda running and ready to process jobs')
})
.catch((e)=> console.log(e))

await server.start();
//await userModel().deleteMany({}) // for dev purposes
app.use(cookieParser());
app.use(cors<cors.CorsRequest>(corsOptions));
app.use(cookieParser())
app.use(passport.initialize() as any);

//new passportGoogleAuth().init()
//yanew FacebookAuth().init()

app.get("/", async (req:Request, res:Response) => {
    console.log(req.body, "body") 

    res.json({name: packageJson.name, version: packageJson.version, });
});


app.use('/api/v1', apiRoute);

app.use("/graphql",
    bodyParser.json({ limit: "5mb" }),
    expressMiddleware(server, {
      context: async ({ req, res }:{req:Request, res:Response}) => {
        const token = (req?.headers?.authorization?.startsWith('Bearer ') ? req?.headers?.authorization.substring(7) : req?.headers?.authorization);
        let user = null
        if (token) {
          user = await new Base().extractUserDetails(token)
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
    httpServer.listen({port: PORT,host: '0.0.0.0',}, resolve)
);

app.use(expressHandler) 

console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    logger.error(`Uncaught Exception: ${JSON.stringify(error, null, 2)}`);
    process.exit(1); 
  });

process.on('SIGTERM', async () => {
    console.log('Shutting down Agenda...');
    await agenda.stop();
    process.exit(0);
});
  