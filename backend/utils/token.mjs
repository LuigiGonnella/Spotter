import jwt from 'jsonwebtoken';
import {v4 as uuidv4} from 'uuid';
import {
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXP,
    REFRESH_TOKEN_EXP
} from './config.mjs';

export function generateAccessToken(payload) { //payload=({ userId: user.id, email: user.email, role: user.role })
    const jti = uuidv4();
    const token = jwt.sign({...payload, jti},ACCESS_TOKEN_SECRET,{expiresIn: ACCESS_TOKEN_EXP});
    return {token, jti};

} //ritorna accessToken + jti

export function generateRefreshToken(payload) { //payload=({ userId: user.id })
    const jti = uuidv4();
    const token = jwt.sign({...payload, jti}, REFRESH_TOKEN_SECRET, {expiresIn: REFRESH_TOKEN_EXP});
    return {token, jti};

} //ritorna Refreshtoken + jti

export function verifyAccessToken(token) {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
}