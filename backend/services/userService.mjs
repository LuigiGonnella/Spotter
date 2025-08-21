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
        where: {
                email: {contains: email, mode: 'insensitive'}                
            }
        })
    }
    catch (error) {
        logger.error(`User with email - ${email} not found!`);
        throw new Error(`User not found`);
    }
}

export async function findUserById(id) {
    try {
        return await prisma.user.findUnique({
        where: {
                id,
        }})
    }
    catch (error) {
        logger.error(`User with id - ${id} not found!`);
        throw new Error(`User not found`);
    }
}

// Cerca utenti per nome (parziale, case-insensitive)
export async function findUsersByName(name) {
    return prisma.user.findMany({
        where: {
            OR: [
                { firstName: { contains: name, mode: 'insensitive' } },
                { lastName: { contains: name, mode: 'insensitive' } }
            ]
        }
    });
}

// Cerca utenti per palestra (tramite UserGym)
export async function findUsersByGym(gymId) {
    return prisma.user.findMany({
        where: {
            memberships: {
                some: { gymId }
            }
        }
    });
}

// Cerca utenti per ruolo
export async function findUsersByRole(role) {
    return prisma.user.findMany({
        where: { role }
    });
}

// Cerca utenti pubblici
export async function findPublicUsers() {
    return prisma.user.findMany({
        where: { isPublic: true }
    });
}

export async function updateUser(userData) { //posso passare solo i campi da modificare, senza sovrascrivere tutto
    try {
        return await prisma.user.update(
        {
            where: {id: userData.id},
            data: userData
        }
        )
    }
    catch(error) {
        logger.error(`User with email - ${userData.email} not found!`);
        throw new Error(`User not found`);
    }
}


