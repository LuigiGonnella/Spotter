import {RateLimiterRedis} from 'rate-limiter-flexible';
import redis from '../utils/redisClient.mjs';

const rateLimiter = new RateLimiterRedis({
    storeClient: redis,
    points: 5, //utente limitato a 5 richieste
    duration: 60, //ogni 60s
    blockDuration: 900, //se supera il limite, viene bloccato per 5 minuti
})

export async function rateLimitMiddleware(req, res, next) {
    try {
        await rateLimiter.consume(req.ip);
        next();
    }
    catch {
        res.status(429).json({error: 'Too many requests, please try again later.'})
    }
}

