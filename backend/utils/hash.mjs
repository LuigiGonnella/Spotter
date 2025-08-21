import argon2 from 'argon2';

export async function hashPassword(password) {
    return argon2.hash(password, {type: argon2.argon2id}); //tipo di hashing più sicuro per password
}

export async function verifyPassword(password, hash) {
    return argon2.verify(hash, password);
}

export async function hashToken(token) {
    return argon2.hash(token, {type: argon2.argon2id}); //tipo di hashing più sicuro per token
}

export async function verifyToken(token, hash) {
    return argon2.verify(hash, token);
}