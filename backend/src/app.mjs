import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { CORS_ORIGIN } from '../utils/config.mjs';


const envFile = process.env.NODE_ENV === 'productiion'? '.env.production' : '.env.development';
dotenv.config({path: envFile});

const app = express();
app.use(express.json());
app.use(cookieParser()); /*utile per settare/legger i cookie nelle risposte HTTP, ad esempio
res.cookie('refreshToken', refreshToken, {
    httpOnly: true,    // Non accessibile da JavaScript lato client
    secure: true,      // Solo HTTPS in produzione
    sameSite: 'None',  // Cross-site requests
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 giorni
  });
*/
app.use(cors(
    {origin: CORS_ORIGIN,
    credentials: true
    }
));

//healthcheck

app.get('/health', (req, res) => res.json({ok: true}));

export default app;
