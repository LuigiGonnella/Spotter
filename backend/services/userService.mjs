import prisma from '../utils/prismaClient.mjs';
import {hashPassword} from '../utils/hash.mjs';
import logger from '../utils/logger.mjs'

export async function createUser(userData) {
    if (userData.password) {
        userData.passwordHash = await hashPassword(userData.password);

        delete userData.password;
    }
    else {
        logger.error("Password not found!");
        throw new Error("Password not found");
    }

    const user = await prisma.user.create({
        data: userData
    });

    return user;
}

export async function findUserByEmail(email) {
    try {
        return await prisma.user.findUnique({
        where: {email}
        })
    }
    catch (error) {
        logger.error(`User with email - ${email} not found!`);
        throw new Error(`User not found`);
    }
}

export async function updateUser(userData) { //posso passare solo i campi da modificare, senza sovrascrivere tutto
    try {
        return await prisma.user.update(
        {
            where: {email: userData.email},
            data: userData
        }
        )
    }
    catch(error) {
        logger.error(`User with email - ${email} not found!`);
        throw new Error(`User not found`);
    }
}


