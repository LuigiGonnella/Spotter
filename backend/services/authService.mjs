import prisma from '../utils/prismaClient.mjs';

export async function createRefreshToken(refreshData) {

    const token = await prisma.refreshToken.create({
        data: refreshData
    });

    return token;
}

export async function findTokenById(jti) {
    try {
        return await prisma.refreshToken.findUnique({
            where: {jti}
        })
    }
    catch(error) {
        throw new Error(`Token not found`);
    }
}

export async function updateToken(tokenData) {
    try {
        return await prisma.refreshToken.update(
        {
            where: {jti: tokenData.jti},
            data: tokenData
        }
        )
    }
    catch(error) {
        throw new Error(`Token not found`);
    }
}