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
  registerAdmin,
  login,
  refresh,
  logout,
  googleOAuth,
  registerGym
} from '../controllers/authController.mjs';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' }); // oppure configura storage

const router = express.Router();

router.post('/register', upload.single('profileImage'), registerValidator, register); //TODO ratelimitermiddleware
router.post('/register/admin', upload.single('profileImage'), registerValidator, registerAdmin); //TODO ratelimitermiddleware

router.post('/register/gym', registerGymValidator, registerGym); //TODO ratelimitermiddleware

router.post('/login',  loginValidator,  login); //TODO ratelimitermiddleware
router.post('/refresh', refresh); //TODO ratelimitermiddleware
router.delete('/logout', logout); //in REST logout è delete (token/sessione eliminata) //TODO ratelimitermiddleware
router.post('/oauth/google', googleOAuthValidator, googleOAuth); //TODO ratelimitermiddleware

export default router;
