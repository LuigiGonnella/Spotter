//HANDLING OF ENVIRONMENT VARIABLES
import dotenv from 'dotenv';
const envFile = process.env.NODE_ENV === 'production'? '.env.production' : '.env.local';
dotenv.config({path: envFile});

NEXT_PUBLIC_API_URL=process.env.NEXT_PUBLIC_API_URL;
NEXT_PUBLIC_GOOGLE_CLIENT_ID=process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

export {NEXT_PUBLIC_API_URL, NEXT_PUBLIC_GOOGLE_CLIENT_ID};