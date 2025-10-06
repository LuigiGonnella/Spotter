import prisma from '../utils/prismaClient.mjs';
import logger from '../utils/logger.mjs'


export async function createRequest(requestData) {
    
    const request = await prisma.gymBuddyRequest.create({
        data: requestData
    });

    return request;
}

export async function findRequestById(id) {
    try {
        return await prisma.gymBuddyRequest.findUnique({
        where: {id}
        })
    }
    catch (error) {
        logger.error(`gymBuddyRequest not found!`);
        throw new Error(`gymBuddyRequest not found`);
    }
}

export async function updateExercise(requestData) { //posso passare solo i campi da modificare, senza sovrascrivere tutto
    try {
        return await prisma.gymBuddyRequest.update(
        {
            where: {id: requestData.id},
            data: requestData
        }
        )
    }
    catch(error) {
        logger.error(` gymBuddyRequest with id - ${requestData.id} not found!`);
        throw new Error(`gymBuddyRequest not found`);
    }
}

export async function createFrienship(friendshipData) {
    
    const friendship = await prisma.gymBroFriendship.create({
        data: friendshipData
    });

    return friendship;
}

export async function findFriendshipById(id) {
    try {
        return await prisma.gymBroFriendship.findUnique({
        where: {id}
        })
    }
    catch (error) {
        logger.error(`gymBroFriendship not found!`);
        throw new Error(`gymBroFriendship not found`);
    }
}

export async function updateFriendship(friendshipData) { //posso passare solo i campi da modificare, senza sovrascrivere tutto
    try {
        return await prisma.gymBroFriendship.update(
        {
            where: {id: friendshipData.id},
            data: friendshipData
        }
        )
    }
    catch(error) {
        logger.error(` friendshipData with id - ${friendshipData.id} not found!`);
        throw new Error(`friendshipData not found`);
    }
}

export async function deleteRequest(id) {
    try {
        const deleted = await prisma.gymBuddyRequest.delete({
            where: { id }
        });
        return deleted;
    } catch (error) {
        logger.error(`GymBuddyRequest with id ${id} not found`, error);
        throw new Error('GymBuddyRequest not found');
    }
}

export async function deleteFriendship(id) {
    try {
        const deleted = await prisma.gymBroFriendship.delete({
            where: { id }
        });
        return deleted;
    } catch (error) {
        logger.error(`GymBroFriendship with id ${id} not found`, error);
        throw new Error('GymBroFriendship not found');
    }
}

//trova amicizie user
export async function findFriendshipsForUser(userId) {
    try {
        const friendships = await prisma.gymBroFriendship.findMany({
            where: {
                OR: [
                    { user1Id: userId },
                    { user2Id: userId }
                ]
            }
        });
        return friendships;
    } catch (error) {
        logger.error(`Error fetching friendships for user ${userId}`, error);
        throw new Error('Unable to fetch friendships');
    }
}

//controlla se due utenti sono già amici
export async function areFriends(user1Id, user2Id, gymId) {
    try {
        const friendship = await prisma.gymBroFriendship.findFirst({
            where: {
                OR: [
                    { user1Id, user2Id, gymId },
                    { user1Id: user2Id, user2Id: user1Id, gymId }
                ]
            }
        });
        return !!friendship; //se è un oggetto torna TRUE, se è undefined torna FALSE
    } catch (error) {
        logger.error(`Error checking friendship between ${user1Id} and ${user2Id} in gym ${gymId}`, error);
        throw new Error('Unable to check friendship');
    }
}

export async function listUserRequests(userId) {
  try {
    return await prisma.gymBuddyRequest.findMany({
      where: {
        OR: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
      include: {
        fromUser: true,
        toUser: true,
        gym: true
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    logger.error(`Failed to list requests for user ${userId}: ${error.message}`);
    throw new Error('Unable to list user requests.');
  }
}

/**
 * Recupera tutte le amicizie di un utente
 */
export async function listUserFriendships(userId) {
  try {
    return await prisma.gymBroFriendship.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ]
      },
      include: {
        user1: true,
        user2: true,
        gym: true
      },
      orderBy: { becameFriendsAt: 'desc' }
    });
  } catch (error) {
    logger.error(`Failed to list friendships for user ${userId}: ${error.message}`);
    throw new Error('Unable to list user friendships.');
  }
}