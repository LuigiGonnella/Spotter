import express from 'express';
import {rateLimitMiddleware} from '../middlewares/rateLimiter.mjs';
import {
  registerValidator,
  loginValidator,
  googleOAuthValidator,
  registerGymValidator
} from '../middlewares/auth.mjs';
import {
  register,
  login,
  refresh,
  logout,
  googleOAuth,
  registerGym
} from '../controllers/authController.mjs';

const router = express.Router();

router.post('/register', rateLimitMiddleware, registerValidator, register);
router.post('/registerGym', rateLimitMiddleware, registerGymValidator, registerGym);

router.post('/login',    rateLimitMiddleware, loginValidator,  login);
router.post('/refresh',  rateLimitMiddleware, refresh);
router.post('/logout',   rateLimitMiddleware, logout);
router.post('/oauth/google', rateLimitMiddleware, googleOAuthValidator, googleOAuth);

export default router;
