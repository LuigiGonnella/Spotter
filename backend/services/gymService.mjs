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
export async function findAllGyms({ page = 1, pageSize = 1, data = {} } = {}) {
    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const take = parseInt(pageSize);
        let where = {};
        console.log(data);
        if (data.name) where.name = { contains: data.name, mode: 'insensitive' };
        if (data.address) where.address = { contains: data.address, mode: 'insensitive' };
        if (data.city) where.city = { contains: data.city, mode: 'insensitive' };
        if (data.description) where.description = { contains: data.description, mode: 'insensitive' };
        if (data.email) where.email = { contains: data.email, mode: 'insensitive' };
        if (typeof data.verified === 'boolean') where.verified = data.verified;
        else {
            where.verified = data.verified === 'true';
        }
        if (data.latitude) where.latitude = data.latitude;
        if (data.longitude) where.longitude = data.longitude;

        console.log(where);

    const [gyms, total] = await Promise.all([
        prisma.gym.findMany({
            skip,
            take,
            where,
            orderBy: {
                exerciseRecords: { _count: 'desc' }
            }
        }),
        prisma.gym.count({where})
    ]);

    return {
        gyms,
        pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total,
            totalPages: Math.ceil(total / pageSize),
            hasMore: skip + take < total
        },
        links: { //HATEAOS
            self: `/api/gyms/findAll?page=${page}&pageSize=${pageSize}`,
            prev: page > 1 ? `/api/gyms/findAll?skip=${page-1}&pageSize=${pageSize}` : null,
            next: skip + take < total ? `/api/gyms/findAll?page=${page+1}&pageSize=${pageSize}` : null

        }
    };
}

// --- TROVA PALESTRE PUBBLICHE PER NOME ---
export async function findGymByName(name, limit = 50) {
    return prisma.gym.findFirst({
        where: {
            name
        }
    });
}

// ========================================
// ========================================
// GESTIONE ADMIN PALESTRA
// ========================================

/**
 * Aggiunge un utente come admin della palestra
 * @param {number} userId - ID utente
 * @param {number} gymId - ID palestra
 * @returns {Promise<Gym>} - Palestra aggiornata
 */
export async function addAdminToGym(userId, gymId) {
    try {
        // Aggiorna la palestra aggiungendo l'utente agli admin
        const updatedGym = await prisma.gym.update({
            where: { id: parseInt(gymId) },
            data: {
                admins: {
                    connect: { id: parseInt(userId) }
                }
            },
            include: {
                admins: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        profileImage: true
                    }
                }
            }
        });
        logger.info(`User ${userId} added as admin to gym ${gymId}`);
        return updatedGym;
    } catch (error) {
        logger.error(`Error adding admin ${userId} to gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to add admin to gym: ${error.message}`);
    }
}
// GESTIONE ISCRIZIONI UTENTI
// ========================================

export async function addUserToGym(userId, gymId) {
    try {
        // Verifica se l'utente è già iscritto a questa palestra
        const existingMembership = await prisma.userGym.findUnique({
            where: {
                userId_gymId: {
                    userId: parseInt(userId),
                    gymId: parseInt(gymId)
                }
            }
        });

        if (existingMembership) {
            if (existingMembership.isActive) {
                throw new Error('User is already an active member of this gym');
            } else {
                // Riattiva l'iscrizione esistente
                const updatedMembership = await prisma.userGym.update({
                    where: { id: existingMembership.id },
                    data: { 
                        isActive: true,
                        joinedAt: new Date()
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                profileImage: true
                            }
                        },
                        gym: {
                            select: {
                                id: true,
                                name: true,
                                city: true
                            }
                        }
                    }
                });
                logger.info(`User ${userId} reactivated membership to gym ${gymId}`);
                return updatedMembership;
            }
        }

        // Crea nuova iscrizione
        const membership = await prisma.userGym.create({
            data: {
                userId: parseInt(userId),
                gymId: parseInt(gymId),
                isActive: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                gym: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                }
            }
        });

        logger.info(`User ${userId} successfully joined gym ${gymId}`);
        return membership;
    } catch (error) {
        logger.error(`Error adding user ${userId} to gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to add user to gym: ${error.message}`);
    }
}

export async function removeUserFromGym(userId, gymId) {
    try {
        const membership = await prisma.userGym.findUnique({
            where: {
                userId_gymId: {
                    userId: parseInt(userId),
                    gymId: parseInt(gymId)
                }
            }
        });

        if (!membership) {
            throw new Error('User is not a member of this gym');
        }

        // Disattiva l'iscrizione invece di eliminarla (mantiene lo storico)
        const updatedMembership = await prisma.userGym.update({
            where: { id: membership.id },
            data: { isActive: false },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                gym: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                }
            }
        });

        logger.info(`User ${userId} removed from gym ${gymId}`);
        return updatedMembership;
    } catch (error) {
        logger.error(`Error removing user ${userId} from gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to remove user from gym: ${error.message}`);
    }
}

export async function getUserGymMembership(userId, gymId) {
    try {
        const membership = await prisma.userGym.findUnique({
            where: {
                userId_gymId: {
                    userId: parseInt(userId),
                    gymId: parseInt(gymId)
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                gym: {
                    select: {
                        id: true,
                        name: true,
                        city: true,
                        verified: true
                    }
                }
            }
        });

        return membership;
    } catch (error) {
        logger.error(`Error getting gym membership for user ${userId} in gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to get gym membership: ${error.message}`);
    }
}

export async function getUserGyms(userId) {
    try {
        const memberships = await prisma.userGym.findMany({
            where: { 
                userId: parseInt(userId),
                isActive: true
            },
            include: {
                gym: true
            },
            orderBy: { joinedAt: 'desc' }
        });

        return memberships;
    } catch (error) {
        logger.error(`Error getting gyms for user ${userId}: ${error.message}`);
        throw new Error(`Failed to get user gyms: ${error.message}`);
    }
}

export async function getGymMembers(gymId, options = {}) {
    try {
        const { skip = 0, take = 20, activeOnly = true } = options;
        
        const where = { 
            gymId: parseInt(gymId),
            ...(activeOnly && { isActive: true })
        };
        
        const members = await prisma.userGym.findMany({
            where,
            skip,
            take,
            orderBy: { joinedAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true,
                        email: true
                    }
                }
            }
        });

        const total = await prisma.userGym.count({ where });

        return {
            members,
            pagination: {
                skip,
                take,
                total,
                hasMore: skip + take < total
            }
        };
    } catch (error) {
        logger.error(`Error getting members for gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to get gym members: ${error.message}`);
    }
}

export async function updateGymMembership(userId, gymId, updateData) {
    try {
        const membership = await prisma.userGym.update({
            where: {
                userId_gymId: {
                    userId: parseInt(userId),
                    gymId: parseInt(gymId)
                }
            },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                gym: {
                    select: {
                        id: true,
                        name: true,
                        city: true
                    }
                }
            }
        });

        logger.info(`Gym membership updated for user ${userId} in gym ${gymId}`);
        return membership;
    } catch (error) {
        logger.error(`Error updating gym membership for user ${userId} in gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to update gym membership: ${error.message}`);
    }
}

export async function getGymMemberCount(gymId) {
    try {
        const totalMembers = await prisma.userGym.count({
            where: { 
                gymId: parseInt(gymId),
                isActive: true
            }
        });

        return totalMembers;
    } catch (error) {
        logger.error(`Error getting member count for gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to get gym member count: ${error.message}`);
    }
}

export async function getActiveGymMembers(gymId) {
    try {
        const activeMembers = await prisma.userGym.findMany({
            where: { 
                gymId: parseInt(gymId),
                isActive: true
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            },
            orderBy: { joinedAt: 'desc' }
        });

        return activeMembers;
    } catch (error) {
        logger.error(`Error getting active members for gym ${gymId}: ${error.message}`);
        throw new Error(`Failed to get active gym members: ${error.message}`);
    }
}

export async function getGymByAdmin(userId) {
  return await prisma.gym.findFirst({
    where: {
      admins: {
        some: { id: parseInt(userId) }
      }
    }
  });
}