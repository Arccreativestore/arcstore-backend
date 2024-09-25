import dotenv from "dotenv";

dotenv.config({path: ['.env', '.env.keys']});
export const isDev = process.env.NODE_ENV !== "production";

const requiredEnvs = [
    "PORT",
    "MONGO_URI",
    "ACCESS_SECRETKEY",
    "REFRESH_SECRETKEY",
    "VERIFYEMAIL_SECRETKEY",
    "G_HOST",
    "G_PORT",
    "G_USER",
    "G_PASSWORD",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "FACEBOOK_APP_ID",
    "FACEBOOK_APP_SECRET",
    "GOOGLE_CALLBACK_URL",
    "FACEBOOK_CALLBACK_URL",
    "MJ_SECRETKEY",
    "MJ_APIKEY",
    "AWS_ACCESS_KEY_ID", 
    "AWS_BUCKET_NAME", 
    "AWS_HOSTNAME_URL", 
    "AWS_REGION", 
    "AWS_SECRET_ACCESS_KEY",
    "PAYSTACK_BASE_URL", 
    "PAYSTACK_SECRET_KEY",
    "PAYSTACK_PUBLIC_KEY"
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
VERIFYEMAIL_SECRETKEY,
G_HOST,
G_USER,
G_PORT,
G_PASSWORD,
GOOGLE_CLIENT_ID,
GOOGLE_CLIENT_SECRET,
FACEBOOK_APP_ID,
FACEBOOK_APP_SECRET,
GOOGLE_CALLBACK_URL,
FACEBOOK_CALLBACK_URL,
MJ_SECRETKEY,
MJ_APIKEY,
AWS_ACCESS_KEY_ID, 
AWS_BUCKET_NAME, 
AWS_HOSTNAME_URL, 
AWS_REGION, 
AWS_SECRET_ACCESS_KEY,
PAYSTACK_BASE_URL, 
PAYSTACK_SECRET_KEY,
PAYSTACK_PUBLIC_KEY,

} = process.env;
