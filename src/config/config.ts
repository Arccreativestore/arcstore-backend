import dotenv from "dotenv";

dotenv.config({path: ['.env', '.env.keys']});
export const isDev = process.env.NODE_ENV !== "production";

const requiredEnvs = [
    "PORT",
    "MONGO_URI",
    "ACCESS_SECRETKEY",
    "REFRESH_SECRETKEY",
    "VERIFY_SECRETKEY",
    "G_HOST",
    "G_PORT",
    "G_USER",
    "G_PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET"
] as const;


interface Envs {
    [key: string]: string;
}

const envs: Envs = requiredEnvs.reduce((acc: Envs, key: string) => {
    acc[key] = process.env[key] as string;
    return acc;
}, {});

const missingEnvs: string[] = requiredEnvs.filter((key) => !envs[key]);

if (missingEnvs.length > 0) {
    console.error("ENV Error, the following ENV variables are not set:");
    console.table(missingEnvs);
    throw new Error("Fix Env and rebuild");
}


export const {
PORT,
MONGO_URI,
ACCESS_SECRETKEY,
REFRESH_SECRETKEY,
VERIFY_SECRETKEY,
G_HOST,
G_USER,
G_PORT,
G_PASSWORD,
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET
} = process.env;
