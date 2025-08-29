import express from 'express';
import {rateLimitMiddleware} from '../middlewares/rateLimiter.mjs';
import { requireAuth } from '../middlewares/auth.mjs';
import { getAllGyms } from '../controllers/gymController.mjs';
const router = express.Router();

router.get("/findAll", getAllGyms);

export default router;