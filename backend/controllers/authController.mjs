import ms from 'ms';
import prisma from '../utils/prismaClient.mjs';
import logger from '../utils/logger.mjs';
import {OAuth2Client} from 'google-auth-library';
import { hashPassword, verifyPassword, hashToken, verifyToken } from '../utils/hash.mjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/token.mjs';
import {GOOGLE_CLIENT_ID, COOKIE_SECURE, COOKIE_DOMAIN, REFRESH_TOKEN_EXP} from '../utils/config.mjs'
import {findUserByEmail, createUser, updateUser, findUserById} from '../services/userService.mjs';
import { createRefreshToken, findTokenById, updateToken } from '../services/authService.mjs';
import { createGym, findGymByName, addAdminToGym, getGymByAdmin} from '../services/gymService.mjs';

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

function cookieOptions(maxAge) {
    return {
        httpOnly: true,
        secure: COOKIE_SECURE==='true',
    // If cookie is not marked secure (development, http://localhost), do NOT use SameSite=None
    // Browsers require SameSite=None cookies to also have Secure=true, otherwise they will be rejected.
    sameSite: COOKIE_SECURE==='true' ? 'None' : 'Lax',
        domain: COOKIE_DOMAIN==='localhost' ? undefined : COOKIE_DOMAIN,
        path:'/',
        maxAge,
    };
}

export async function register(req, res, next) { //registrazione classica con mail e password alla route /register, poi ci sarà una route dedicata per Oauth, con rispetivo controller. Ci sarà anche una route apposita per completare il profilo (/profile) con corrispondente controller. Ci sarà anche una route per la registrazione di una palestra, con controller dedicato (role:GYM_ADMIN) 
//! facciamo che per il mio MVP verifico a mano le palestre che mi inviano i documenti, più avanti metto sistemi di verifica automatizzati con API specifiche. Quindi ora aggiungo a gym un relazione con più admin (admins User[]) e un campo verified (finchè è false di fatto non può fare nulla, così come l'admin/gli admin), mentre in user aggiungo Gym Gym[], dove ci sono le gym di cui è admin.
    try {
        const { email, password, firstName, lastName, dateOfBirth, bio } = req.body;
        const profileImage = req.file ? req.file.filename : null; // file è in req.file e non body

        const existing = await findUserByEmail(email);
        if (existing) {
            logger.error('Email already registered');
            return res.status(400).json({ error: 'Email already registered' });

        }
        const passwordHash = await hashPassword(password);
        const isPublic = req.body.isPublic === 'true';
        const userData = { email, passwordHash, firstName, lastName, dateOfBirth, bio, profileImage, isPublic};
        const user = await createUser(userData);
        res.status(201).json({ id: user.id, email: user.email });
        
    } catch (error) {
        logger.error({ error }, 'Error in register');
        next(error);   
    }
}

export async function registerGym(req, res, next) { //registrazione palestra, con admin corrispondente (alla prima registrazione della palestra si registrano automaticamente sia primo admin che palestra), se ancora non esiste la palestra la creo unverified e resta in attesa di verifica a parte mia, fino a quel momento gym  admin non possono fare niente
//se già esiste una palestra (ha almeno un admin), l'admin deve essere accettato da uno già esistente (status_admin può essere pending, declined o accepted)
    try {
        console.log("ciao");
        console.log(req.body);
        const {name, address, city, description, email, latitude, longitude} = req.body;
        const existing_gym = await findGymByName(name);
        console.log(existing_gym);
        if (existing_gym) {
            res.status(201).json({ id: existing_gym.id, name: existing_gym.name, address: existing_gym.address, city: existing_gym.city, description: existing_gym.description, email: existing_gym.email, latitude: existing_gym.latitude, longitude: existing_gym.longitude, existed: true });
            return;
        }
        const created_gym = await createGym({name, address, city, description, email, latitude, longitude});
        console.log(createGym);

        res.status(201).json({ id: created_gym.id, name: created_gym.name, address: created_gym.address, city: created_gym.city, description: created_gym.description, email: created_gym.email, latitude: created_gym.latitude, longitude: created_gym.longitude, existed: false });
        
    } catch (error) {
        logger.error({ error }, 'Error in gym register');
        next(error);   
    }
}

export async function registerAdmin(req, res, next) {
    try {
        const { email, password, role, status_admin, firstName, lastName, dateOfBirth, bio } = req.body;
        const profileImage = req.file ? req.file.filename : null; // file è in req.file e non body

        const existing = await findUserByEmail(email);
        if (existing) {
            logger.error('Email already registered');
            return res.status(400).json({ error: 'Email already registered' });

        }
        const passwordHash = await hashPassword(password);
        const isPublic = req.body.isPublic === 'true';
        const gymId = req.body.gymId;
        const userData = { email, passwordHash, role, status_admin, firstName, lastName, dateOfBirth, bio, profileImage, isPublic};
        const user = await createUser(userData);
        const updated_gym = await addAdminToGym(user.id, gymId );
        res.status(201).json({ id: user.id, email: user.email, gymId: updated_gym.id, gymName: updated_gym.name});

        
    } catch (error) {
        logger.error({ error }, 'Error in registeration process');
        next(error);   
    }
}



export async function googleOAuth(req, res, next) {
    
    try {
        const {gymId, idToken} = req.body;
        console.log(gymId)
        console.log('oooooo')
        
        
        //verifica token google e ottiene payload
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        if (!payload) {
            logger.error('Inavlid Google credentials');
            const error = new Error('Invalid Google credentials');
            e.status(401);
            return next(error);
        }
        // Campi utili: payload.email, payload.sub (id utente Google), payload.email_verified
        if (!payload?.email || !payload?.sub) {
            const e = new Error('Invalid Google token payload');
            e.status = 401;
            return next(e);
        }
            
        const email = payload.email;
        const providerId = payload.sub;
        let user = await findUserByEmail(email);

        if (!user) { //se primo accesso
            console.log('updateeee')
            console.log(user)
            if (gymId!='undefined' && gymId != 'null') {
                user = await createUser({email, provider: 'google', providerId, role: 'ADMIN', status_admin: 'PENDING'});
            }
            else {
                user = await createUser({email, provider: 'google', providerId});
            }
            

        }
        else { //se la mail era già stata registrata tradizionalmente e l'utente ancora non è stato collegato a google
            if (!user.provider || !user.providerId) {
                user = await updateUser({id: user.id, provider: 'google', providerId});   
            }
        }
        if (gymId!='undefined' && gymId != 'null') {
            console.log('ciaooo')
            console.log(gymId)
            console.log(user) 
            const _ = await addAdminToGym(user.id, gymId);
        }
        let gym = null;
        if (user.role === 'ADMIN') {
            gym = await getGymByAdmin(user.id);
        }
        
        const { token: accessToken } = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
        const { token: refreshToken, jti } = generateRefreshToken({ userId: user.id });
        const tokenHash = await hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + ms(REFRESH_TOKEN_EXP));
        console.log('Refresh token:', refreshToken);

         const tokenJS = await createRefreshToken({ jti, tokenHash, userId: user.id, expiresAt });

        res.cookie('refreshToken', refreshToken, cookieOptions(expiresAt.getTime() - Date.now()));
        res.json([{ accessToken, id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                profileImage: user.profileImage,
                role: user.role,
                isPublic: user.isPublic,
                createdAt: user.createdAt}, gym ? {id: gym.id, name: gym.name, address: gym.address, city: gym.city, description: gym.description, email: gym.email, verified: gym.verified, latitude: gym.latitude, longitude: gym.longitude} : null]);
    
    } catch (err) {
        logger.error({ err }, 'Google OAuth error');
        next(err);
    }
}



export async function login(req, res, next) {
    try {
        const {email, password} = req.body;
        const user = await findUserByEmail(email);
        if (!user || !user.passwordHash) {
            logger.error(`Login failed: User not found or OAuth-only - ${email}`);
            const e = new Error('Invalid credentials');
            e.status = 403;
            next(e);
        }
        const passwordHash = user.passwordHash;
        
        const ok = await verifyPassword(password, passwordHash);
        if (!ok) {
            logger.error(`Login failed: password or email wrong`);
            const e = new Error('Invalid credentials');
            e.status = 401;
            next(e); 
        }

        const {token: accessToken} = generateAccessToken({userId:user.id, email:user.email, role:user.role});
        const { token: refreshToken, jti } = generateRefreshToken({ userId: user.id });
        const tokenHash = await hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + ms(REFRESH_TOKEN_EXP));
        console.log('Refresh token:', refreshToken);
        const tokenJS = await createRefreshToken({ jti, tokenHash , userId: user.id, expiresAt });

        res.cookie('refreshToken', refreshToken, cookieOptions(expiresAt.getTime()-Date.now()));
        let gym = null;
        if (user.role === 'ADMIN') {
            gym = await getGymByAdmin(user.id);
        }
        res.json([{accessToken, id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                bio: user.bio,
                profileImage: user.profileImage,
                role: user.role,
                isPublic: user.isPublic,
                createdAt: user.createdAt}, gym? {id: gym.id, name: gym.name, address: gym.address, city: gym.city, description: gym.description, email: gym.email, verified: gym.verified, latitude: gym.latitude, longitude: gym.longitude}: null]);
    }
    catch(err) {
        logger.error({ err }, 'Unexpected error during login');
        next(err);
    }
}

export async function refresh(req, res) {
  const token = req.cookies['refreshToken'];
  if (!token) return res.status(401).json({ error: 'No refresh token' });

  let payload;
  try {
    payload =  verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }

  const stored = await findTokenById(payload.jti);
  if (!stored || stored.revoked) return res.status(401).json({ error: 'Token revoked' });

  //console.log(stored.tokenHash);

  const match = await verifyToken(token, stored.tokenHash);
  if (!match) return res.status(401).json({ error: 'Token mismatch' });

  console.log(payload.jti);

  await updateToken({ jti:payload.jti, revoked:true });

  const user = await findUserById(stored.userId);
  const { token: accessToken } = generateAccessToken({ userId: user.id, email: user.email, role: user.role });
  const { token: newRefreshToken, jti: newJti } = generateRefreshToken({ userId: user.id });
  console.log('Refresh token'+newRefreshToken);
  const newHash = await hashToken(newRefreshToken);
  const expiresAt = new Date(Date.now() + ms(REFRESH_TOKEN_EXP));

  const tokenStored = await createRefreshToken({ jti: newJti, tokenHash: newHash, userId: user.id, expiresAt });

  res.cookie('refreshToken', newRefreshToken, cookieOptions(expiresAt.getTime() - Date.now()));
  res.json({ accessToken });
}

export async function logout(req, res) {
  const token = req.cookies['refreshToken'];
  if (token) {
    try {
      const payload = verifyRefreshToken(token);
      await prisma.refreshToken.updateMany({ where: { jti: payload.jti }, data: { revoked: true } });
    } catch {}
  }
  res.clearCookie('refreshToken', { path: '/' });
  res.json({ ok: true });
}



