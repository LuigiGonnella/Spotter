import prisma from '../utils/prismaClient.mjs';
import logger from '../utils/logger.mjs'


export async function createGym(gymData) {
    
    const gym = await prisma.gym.create({
        data: gymData
    });

    return gym;
}

export async function findGymById(id, name) {
    try {
        return await prisma.gym.findUnique({
        where: {id}
        })
    }
    catch (error) {
        logger.error(`Gym ${name} not found!`);
        throw new Error(`Gym not found`);
    }
}

export async function updateGym(gymData) { //posso passare solo i campi da modificare, senza sovrascrivere tutto
    try {
        return await prisma.gym.update(
        {
            where: {id: gymData.id},
            data: gymData
        }
        )
    }
    catch(error) {
        logger.error(`Gym - ${gymData.name} not found!`);
        throw new Error(`Gym not found`);
    }
}

// --- TROVA TUTTE LE PALESTRE ---
export async function findAllGyms(limit = 50) {
    return prisma.gym.findMany({
        take: limit,
        orderBy: {
            exerciseRecords: { _count: 'desc' } // popolarità basata sui record
        }
    })
};

// --- TROVA PALESTRE PUBBLICHE PER NOME ---
export async function findGymsByName(name, limit = 50) {
    return prisma.gym.findMany({
        where: {
            AND: [
                { name: { contains: name, mode: 'insensitive' } },
            ]
        },
        take: limit,
        orderBy: {
            exerciseRecords: { _count: 'desc' }
        }
    });
}