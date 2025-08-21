import prisma from '../utils/prismaClient.mjs';
import logger from '../utils/logger.mjs'


export async function createExercise(exerciseData) {
    
    const exercise = await prisma.exercise.create({
        data: exerciseData
    });

    return exercise;
}

export async function findExerciseById(id) {
    try {
        return await prisma.exercise.findUnique({
        where: {id}
        })
    }
    catch (error) {
        logger.error(`Exercise not found!`);
        throw new Error(`Exercise not found`);
    }
}

export async function updateExercise(exerciseData) { //posso passare solo i campi da modificare, senza sovrascrivere tutto
    try {
        return await prisma.exercise.update(
        {
            where: {id: exerciseData.id},
            data: exerciseData
        }
        )
    }
    catch(error) {
        logger.error(`Exercise with id - ${exerciseData.id} not found!`);
        throw new Error(`Exercise not found`);
    }
}

export async function createExerciseRecord(exerciseData) {
    
    const exercise = await prisma.exerciseRecord.create({
        data: exerciseData
    });

    return exercise;
}

export async function findExerciseRecordById(id) {
    try {
        return await prisma.exerciseRecord.findUnique({
        where: {id}
        })
    }
    catch (error) {
        logger.error(`ExerciseRecord not found!`);
        throw new Error(`ExerciseRecord not found`);
    }
}

// Trova tutti i record di un utente (in tutte le palestre)
export async function findExerciseRecordsByUser(userId) {
    return prisma.exerciseRecord.findMany({
        where: { userId },
        include: { exercise: true, gym: true },
        orderBy: [
            { weight: 'desc' },
            { reps: 'desc' },
            {
            validationVotes: {
                _count:'desc',
            }}
        ]
    });
}

// Trova tutti i record di un utente in una palestra
export async function findExerciseRecordsByUserInGym(userId, gymId) {
    return prisma.exerciseRecord.findMany({
        where: { userId, gymId },
        include: { exercise: true },
        orderBy: [
            { weight: 'desc' },
            { reps: 'desc' },
            {validationVotes: {
                _count:'desc',
            }},
            ]
        }
    );
}

// Trova tutti i record per un esercizio in una palestra (leaderboard)
export async function findExerciseRecordsByExerciseInGym(exerciseId, gymId, limit = 10) {
    return prisma.exerciseRecord.findMany({
        where: { exerciseId, gymId },
        include: { user: true },
        orderBy: [
            { weight: 'desc' },
            { reps: 'desc' },
            {validationVotes: {
                _count:'desc',
            }}
        ],
        take: limit
    });
}

// Trova il record personale di un utente per un esercizio in una palestra
export async function findUserPRForExerciseInGym(userId, exerciseId, gymId) {
    return prisma.exerciseRecord.findUnique({
        where: {
            userId_exerciseId_gymId: { userId, exerciseId, gymId }
        }
    });
}

// Trova tutti i record per un esercizio (globale)
export async function findExerciseRecordsByExercise(exerciseId, limit = 20) {
    return prisma.exerciseRecord.findMany({
        where: { exerciseId },
        include: { user: true, gym: true },
        orderBy: [
            { weight: 'desc' },
            { reps: 'desc' },
            {validationVotes: {
                _count:'desc',
            }}
        ],
        take: limit
    });
}

// Trova tutti i record in una palestra
export async function findExerciseRecordsByGym(gymId, limit=50) {
    return prisma.exerciseRecord.findMany({
        where: { gymId },
        include: { user: true, exercise: true },
        orderBy: [
            { weight: 'desc' },
            { reps: 'desc' },
            {
            validationVotes: {
                _count:'desc',
            }
        }],
        take:limit
    });
}

// Cerca esercizi per nome (parziale, case-insensitive), trova i più popolari, ovvero quelli che sono più presenti nelle leaderboards non ufficiali
export async function findExercisesByName(name, limit=50) {
    return prisma.exercise.findMany({
        where: {
            AND: [
            {name: { contains: name, mode: 'insensitive' }},
            {isPublic: true}
            ]
        },
        orderBy: {
            exerciseRecords: {
                _count: 'desc'
            }
        },
        take:limit
    });
}

// Cerca esercizi per gruppo muscolare
export async function findExercisesByMuscleGroup(muscleGroup, limit=50) {
    return prisma.exercise.findMany({
        where: {
            AND: [
            {muscleGroup: { equals: muscleGroup, mode: 'insensitive' }},
            {isPublic: true}
            ]
        },
        orderBy: {
            exerciseRecords: {
                _count: 'desc'
            }
        },
        take:limit
    });
}

// Cerca esercizi più usati (top 10 exercises per numero di record)
export async function findMostUsedExercisesInGym(limit = 10, gymId) {
    return prisma.exercise.findMany({
        where: {
            AND: [
            {exerciseRecords: {
                some: {gymId}
            }},
            {isPublic: true}
            ]
        },
        include: {
            _count: {
                select: { exerciseRecords: true }
            }
        }, //ritorno anche il numero di volte in cui è comparso l'esercizio nei record
        take: limit,
        orderBy: {
            exerciseRecords: {
                _count: 'desc'
            }
        }

    });
}

// Cerca esercizi più usati (top 50 per numero di record)
export async function findMostUsedExercisesGlobal(limit = 50) {
    return prisma.exercise.findMany({
        take: limit,
        orderBy: {
            exerciseRecords: {
                _count: 'desc'
            }
        }
    });
}

export async function updateExerciseRecord(exerciseData) { //posso passare solo i campi da modificare, senza sovrascrivere tutto
    try {
        return await prisma.exerciseRecord.update(
        {
            where: {id: exerciseData.id},
            data: exerciseData
        }
        )
    }
    catch(error) {
        logger.error(`ExerciseRecord with id - ${exerciseData.id} not found!`);
        throw new Error(`ExerciseRecord not found`);
    }
}

// TROVA GLI ESERCIZI PIÙ POPOLARI IN UNA PALESTRA (top by record ufficiali)
export async function findMostUsedExercisesInGym(limit = 10, gymId) {
    return prisma.exercise.findMany({
        where: {
            isPublic: true
        },
        include: { _count: { select: { exerciseRecords: true } } },
        take: limit,
        orderBy: { exerciseRecords: { _count: 'desc' } }
    });
}

// TROVA GLI ESERCIZI PIÙ POPOLARI GLOBALI 
export async function findMostUsedExercisesGlobal(limit = 50) {
    return prisma.exercise.findMany({
        include: { _count: { select: { exerciseRecords: true } } },
        take: limit,
        orderBy: { exerciseRecords: { _count: 'desc' } }
    });
}


// Crea un record ufficiale (leaderboard)
export async function createLeaderboardRecord({ dataLeaderboard }) {
  try {
    return await prisma.leaderboardRecord.create({
      data: dataLeaderboard
    })
  } catch (error) {
    logger.error(`Error creating leaderboard record for exercise ${dataLeaderboard.exerciseId} in gym ${dataLeaderboard.gymId}: ${error.message}`)
    throw new Error('Leaderboard record creation failed')
  }
}

// Trova un record della leaderboard per ID
export async function getLeaderboardRecordById(id) {
  return prisma.leaderboardRecord.findUnique({
    where: { id },
    include: {
      gym: true,
      exercise: true,
      record: true,
      admin: true
    }
  })
}

// Aggiorna un record della leaderboard
export async function updateLeaderboardRecord(id, data) {
  try {
    return await prisma.leaderboardRecord.update({
      where: { id },
      data
    })
  } catch (error) {
    logger.error(`Error updating leaderboard record ${id}: ${error.message}`)
    throw new Error('Leaderboard record update failed')
  }
}

// Elimina un record della leaderboard
export async function deleteLeaderboardRecord(id) {
  try {
    return await prisma.leaderboardRecord.delete({
      where: { id }
    })
  } catch (error) {
    logger.error(`Error deleting leaderboard record ${id}: ${error.message}`)
    throw new Error('Leaderboard record deletion failed')
  }
}


// Crea un voto positivo (approvazione)
export async function createVote({ recordId, userId }) {
  try {
    return await prisma.recordValidationVote.create({
      data: { recordId, userId }
    })
  } catch (error) {
    logger.error(`Error creating vote for record ${recordId} by user ${userId}: ${error.message}`)
    throw new Error('Vote creation failed')
  }
}

// Prende tutti i voti per un record
export async function getVotesByRecord(recordId) {
  return prisma.recordValidationVote.findMany({
    where: { recordId },
    include: { user: true }
  })
}

// Conta i voti per un record
export async function countVotesByRecord(recordId) {
  return prisma.recordValidationVote.count({
    where: { recordId }
  })
}

// Cancella tutti i voti di un record (utile se eliminato o rifiutato)
export async function deleteVotesByRecord(recordId) {
  return prisma.recordValidationVote.deleteMany({
    where: { recordId }
  })
}

