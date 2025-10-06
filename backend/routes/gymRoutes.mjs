import express from 'express';
import {rateLimitMiddleware} from '../middlewares/rateLimiter.mjs';
import { requireAuth } from '../middlewares/auth.mjs';
import { getAllGyms, joinGym, getGymMembersController, updateGymMembersController, getGymController } from '../controllers/gymController.mjs';
const router = express.Router();

router.get("/findAll", getAllGyms); //rateLimiter

router.post("/:gymId/join", requireAuth, joinGym); //rateLimiter

router.get("/:gymId/getMemberships", requireAuth, getGymMembersController); //rateLimiter

router.put("/:gymId/users/:userId/updateMemberships", requireAuth, updateGymMembersController); //rateLimiter

router.get("/:gymId", requireAuth, getGymController); //rateLimiter



export default router;