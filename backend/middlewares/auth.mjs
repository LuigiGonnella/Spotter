import { verifyAccessToken } from "../utils/token.mjs";
import {body, validationResult} from 'express-validator';
import logger from '../utils/logger.mjs';

//AGGIUNGERE MIDDLEWARES per controllo campi PROFILO UTENTE, ECC...
export function requireAuth(req, res, next) { //ogni route protetta richiede che sia acceduta con header "Authorization: Bearer <token>" con l'accessToken

    try {
        const auth = req.headers['authorization'];
        //! 
        if (!auth) {
            logger.warn('No authorization header');
            return res.status(401).json({error:'Missing authorization header'});
        }
        const [scheme, token] = auth.split(' ');
        if (scheme!='Bearer' || !token) {
            logger.error('Invalid athorization header');
            return res.status(401).json({error:'Invalid authorization header'});
        }
        const decoded = verifyAccessToken(token); //torna il payload=({ userId: user.id, email: user.email, role: user.role })
        req.user = {id: decoded.userId, email:decoded.email, role: decoded.role}; //aggiungo user alla richiesta, così posso accedervi nelle routes nel server
        next(); 

    } catch  {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

export const registerValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error(errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    next();

  },
];

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').exists().withMessage('Password is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Error during login");
      return res.status(400).json({ errors: errors.array() });
    } 
    next();
  },
];

export const googleOAuthValidator = [
  body('idToken').isString().withMessage('idToken is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];


export const registerGymValidator = [
  body('name').notEmpty().withMessage('Gym name required'),
  body('address').notEmpty().withMessage('Address required'),
  body('city').notEmpty().withMessage('City required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
];

