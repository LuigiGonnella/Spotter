//HANDLING OF ENVIRONMENT VARIABLES
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production'? '.env.production' : '.env.development';
dotenv.config({path: envFile});

const PORT = process.env.PORT;

const DATABASE_URL = process.env.DATABASE_URL;

const REDIS_URL = process.env.REDIS_URL;

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

const ACCESS_TOKEN_EXP = process.env.ACCESS_TOKEN_EXP;

const REFRESH_TOKEN_EXP = process.env.REFRESH_TOKEN_EXP;

const COOKIE_SECURE = process.env.COOKIE_SECURE;

const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;

const CORS_ORIGIN = process.env.CORS_ORIGIN;

const NODE_ENV = process.env.NODE_ENV;

const CHAT_SECRET = process.env.CHAT_SECRET;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const BASE_URL = process.env.BASE_URL;

export {BASE_URL, GOOGLE_CLIENT_ID, CHAT_SECRET, PORT, DATABASE_URL, COOKIE_DOMAIN, COOKIE_SECURE, CORS_ORIGIN, NODE_ENV, ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, REDIS_URL};
