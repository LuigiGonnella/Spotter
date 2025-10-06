import prisma from '../utils/prismaClient.mjs';
import logger from '../utils/logger.mjs'

export async function createUser(userData) {
    let user;
    try {
        user = await prisma.user.create({
        data: userData
        });
    } 
    catch (error) {
        if (error.code === 'P2002') {
        // Unique constraint failed
        throw new Error('Email already registered');
        }
        throw error;
    }

    return user;
}

export async function findUserByEmail(email) {
    try {
        return await prisma.user.findUnique({
        where: {
                email               
            }
        })
    }
    catch (error) {
        return null;
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
    let user;
    try {
        user= await prisma.user.update(
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
    console.log(user);
    return user;
}

// ========================================
// GESTIONE PALESTRE DELL'UTENTE
// ========================================

export async function getUserGymMemberships(userId) {
    try {
        const memberships = await prisma.userGym.findMany({
            where: { userId: parseInt(userId) },
            include: {
                gym: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        verified: true,
                        address: true,
                        description: true
                    }
                }
            },
            orderBy: { joinedAt: 'desc' }
        });

        return memberships;
    } catch (error) {
        logger.error(`Error getting gym memberships for user ${userId}: ${error.message}`);
        throw new Error(`Failed to get user gym memberships: ${error.message}`);
    }
}





export async function getUserGymHistory(userId) {
    try {
        const gymHistory = await prisma.userGym.findMany({
            where: { userId: parseInt(userId) },
            include: {
                gym: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        verified: true
                    }
                }
            },
            orderBy: { joinedAt: 'desc' }
        });

        return gymHistory;
    } catch (error) {
        logger.error(`Error getting gym history for user ${userId}: ${error.message}`);
        throw new Error(`Failed to get user gym history: ${error.message}`);
    }
}


