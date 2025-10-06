import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { BASE_URL, CORS_ORIGIN, PORT } from '../utils/config.mjs';
import authRoutes from '../routes/authRoutes.mjs';
import userRoutes from '../routes/userRoutes.mjs';
import gymRoutes from '../routes/gymRoutes.mjs';
import { errorHandler } from '../middlewares/errorHandler.mjs';


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
    credentials: true //richiede che il front-end faccia richieste con credentials: include
    }
));
app.use('/uploads', express.static('backend/uploads'));

app.use('/api/auth', authRoutes);

app.use('/api/user', userRoutes);

app.use('/api/gyms', gymRoutes);



//healthcheck

app.get('/health', (req, res) => res.json({ok: true}));

app.listen(PORT, () => {
  console.log(`Server running at: ${BASE_URL}`);
});

app.use(errorHandler);


export default app;
