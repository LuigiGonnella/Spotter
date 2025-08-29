import express from 'express';
import {rateLimitMiddleware} from '../middlewares/rateLimiter.mjs';
import { requireAuth } from '../middlewares/auth.mjs';
import { getProfile, getUserGymsController } from '../controllers/userController.mjs';

const router = express.Router();

router.get('/profile', requireAuth , getProfile); //TODO ratelimitermiddleware
router.get('/:userId/my-gyms', requireAuth , getUserGymsController); //TODO ratelimitermiddleware

export default router;