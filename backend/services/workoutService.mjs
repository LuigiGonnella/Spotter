import prisma from '../utils/prismaClient.mjs';
import logger from '../utils/logger.mjs';

// ========================================
// DAILY WORKOUT SERVICES
// ========================================

export async function createDailyWorkout(dailyWorkoutData) {
    try {
        const dailyWorkout = await prisma.dailyWorkout.create({
            data: dailyWorkoutData,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                workoutExercises: {
                    include: {
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                muscleGroup: true,
                                description: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        logger.info(`DailyWorkout created successfully with ID: ${dailyWorkout.id}`);
        return dailyWorkout;
    } catch (error) {
        logger.error(`Error creating DailyWorkout: ${error.message}`);
        throw new Error(`Failed to create DailyWorkout: ${error.message}`);
    }
}

export async function findDailyWorkoutById(id) {
    try {
        const dailyWorkout = await prisma.dailyWorkout.findUnique({
            where: { id: parseInt(id) },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                workoutExercises: {
                    include: {
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                muscleGroup: true,
                                description: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        if (!dailyWorkout) {
            throw new Error('DailyWorkout not found');
        }

        return dailyWorkout;
    } catch (error) {
        logger.error(`Error finding DailyWorkout with ID ${id}: ${error.message}`);
        throw new Error(`DailyWorkout not found: ${error.message}`);
    }
}

export async function findDailyWorkoutsByUser(userId, options = {}) {
    try {
        const { skip = 0, take = 20, includeExercises = true } = options;
        
        const where = { createdBy: parseInt(userId) };
        
        const dailyWorkouts = await prisma.dailyWorkout.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                ...(includeExercises && {
                    workoutExercises: {
                        include: {
                            exercise: {
                                select: {
                                    id: true,
                                    name: true,
                                    muscleGroup: true
                                }
                            }
                        },
                        orderBy: {
                            order: 'asc'
                        }
                    }
                })
            }
        });

        const total = await prisma.dailyWorkout.count({ where });

        return {
            dailyWorkouts,
            pagination: {
                skip,
                take,
                total,
                hasMore: skip + take < total
            }
        };
    } catch (error) {
        logger.error(`Error finding DailyWorkouts for user ${userId}: ${error.message}`);
        throw new Error(`Failed to fetch DailyWorkouts: ${error.message}`);
    }
}

export async function updateDailyWorkout(id, updateData) {
    try {
        const dailyWorkout = await prisma.dailyWorkout.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                workoutExercises: {
                    include: {
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                muscleGroup: true,
                                description: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        logger.info(`DailyWorkout with ID ${id} updated successfully`);
        return dailyWorkout;
    } catch (error) {
        logger.error(`Error updating DailyWorkout with ID ${id}: ${error.message}`);
        throw new Error(`Failed to update DailyWorkout: ${error.message}`);
    }
}

export async function deleteDailyWorkout(id) {
    try {
        // Delete related WorkoutExercises first (cascade should handle this, but being explicit)
        await prisma.workoutExercise.deleteMany({
            where: { dailyWorkoutId: parseInt(id) }
        });

        const deletedWorkout = await prisma.dailyWorkout.delete({
            where: { id: parseInt(id) }
        });

        logger.info(`DailyWorkout with ID ${id} deleted successfully`);
        return deletedWorkout;
    } catch (error) {
        logger.error(`Error deleting DailyWorkout with ID ${id}: ${error.message}`);
        throw new Error(`Failed to delete DailyWorkout: ${error.message}`);
    }
}

// ========================================
// WORKOUT PLAN SERVICES
// ========================================

export async function createWorkoutPlan(workoutPlanData) {
    try {
        const workoutPlan = await prisma.workoutPlan.create({
            data: workoutPlanData,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        logger.info(`WorkoutPlan created successfully with ID: ${workoutPlan.id}`);
        return workoutPlan;
    } catch (error) {
        logger.error(`Error creating WorkoutPlan: ${error.message}`);
        throw new Error(`Failed to create WorkoutPlan: ${error.message}`);
    }
}

export async function findWorkoutPlanById(id) {
    try {
        const workoutPlan = await prisma.workoutPlan.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        if (!workoutPlan) {
            throw new Error('WorkoutPlan not found');
        }

        return workoutPlan;
    } catch (error) {
        logger.error(`Error finding WorkoutPlan with ID ${id}: ${error.message}`);
        throw new Error(`WorkoutPlan not found: ${error.message}`);
    }
}

export async function findWorkoutPlansByUser(userId, options = {}) {
    try {
        const { skip = 0, take = 20, includePrivate = false } = options;
        
        const where = { 
            userId: parseInt(userId),
            ...(includePrivate ? {} : { isPublic: true })
        };
        
        const workoutPlans = await prisma.workoutPlan.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        const total = await prisma.workoutPlan.count({ where });

        return {
            workoutPlans,
            pagination: {
                skip,
                take,
                total,
                hasMore: skip + take < total
            }
        };
    } catch (error) {
        logger.error(`Error finding WorkoutPlans for user ${userId}: ${error.message}`);
        throw new Error(`Failed to fetch WorkoutPlans: ${error.message}`);
    }
}

export async function findPublicWorkoutPlans(options = {}) {
    try {
        const { skip = 0, take = 20, searchTerm = '', muscleGroup = '', sortBy = 'likes' } = options;
        
        const where = {
            isPublic: true,
            ...(searchTerm && {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } }
                ]
            })
        };

        let orderBy = {};
        switch (sortBy) {
            case 'likes':
                orderBy = { likes: 'desc' };
                break;
            case 'newest':
                orderBy = { createdAt: 'desc' };
                break;
            case 'oldest':
                orderBy = { createdAt: 'asc' };
                break;
            default:
                orderBy = { likes: 'desc' };
        }
        
        const workoutPlans = await prisma.workoutPlan.findMany({
            where,
            skip,
            take,
            orderBy,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        const total = await prisma.workoutPlan.count({ where });

        return {
            workoutPlans,
            pagination: {
                skip,
                take,
                total,
                hasMore: skip + take < total
            }
        };
    } catch (error) {
        logger.error(`Error finding public WorkoutPlans: ${error.message}`);
        throw new Error(`Failed to fetch public WorkoutPlans: ${error.message}`);
    }
}

export async function updateWorkoutPlan(id, updateData) {
    try {
        const workoutPlan = await prisma.workoutPlan.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        logger.info(`WorkoutPlan with ID ${id} updated successfully`);
        return workoutPlan;
    } catch (error) {
        logger.error(`Error updating WorkoutPlan with ID ${id}: ${error.message}`);
        throw new Error(`Failed to update WorkoutPlan: ${error.message}`);
    }
}

export async function deleteWorkoutPlan(id) {
    try {
        const deletedPlan = await prisma.workoutPlan.delete({
            where: { id: parseInt(id) }
        });

        logger.info(`WorkoutPlan with ID ${id} deleted successfully`);
        return deletedPlan;
    } catch (error) {
        logger.error(`Error deleting WorkoutPlan with ID ${id}: ${error.message}`);
        throw new Error(`Failed to delete WorkoutPlan: ${error.message}`);
    }
}

export async function likeWorkoutPlan(id) {
    try {
        const workoutPlan = await prisma.workoutPlan.update({
            where: { id: parseInt(id) },
            data: {
                likes: {
                    increment: 1
                }
            }
        });

        logger.info(`WorkoutPlan with ID ${id} liked successfully`);
        return workoutPlan;
    } catch (error) {
        logger.error(`Error liking WorkoutPlan with ID ${id}: ${error.message}`);
        throw new Error(`Failed to like WorkoutPlan: ${error.message}`);
    }
}

export async function unlikeWorkoutPlan(id) {
    try {
        const workoutPlan = await prisma.workoutPlan.update({
            where: { id: parseInt(id) },
            data: {
                likes: {
                    decrement: 1
                }
            }
        });

        logger.info(`WorkoutPlan with ID ${id} unliked successfully`);
        return workoutPlan;
    } catch (error) {
        logger.error(`Error unliking WorkoutPlan with ID ${id}: ${error.message}`);
        throw new Error(`Failed to unlike WorkoutPlan: ${error.message}`);
    }
}

// ========================================
// WORKOUT PLAN ACTIVATION SERVICES
// ========================================

export async function activateWorkoutPlan(workoutPlanId) {
    try {
        const workoutPlan = await prisma.workoutPlan.update({
            where: { id: parseInt(workoutPlanId) },
            data: { isPublic: true },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        logger.info(`WorkoutPlan with ID ${workoutPlanId} activated successfully`);
        return workoutPlan;
    } catch (error) {
        logger.error(`Error activating WorkoutPlan with ID ${workoutPlanId}: ${error.message}`);
        throw new Error(`Failed to activate WorkoutPlan: ${error.message}`);
    }
}

export async function deactivateWorkoutPlan(workoutPlanId) {
    try {
        const workoutPlan = await prisma.workoutPlan.update({
            where: { id: parseInt(workoutPlanId) },
            data: { isPublic: false },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                }
            }
        });

        logger.info(`WorkoutPlan with ID ${workoutPlanId} deactivated successfully`);
        return workoutPlan;
    } catch (error) {
        logger.error(`Error deactivating WorkoutPlan with ID ${workoutPlanId}: ${error.message}`);
        throw new Error(`Failed to deactivate WorkoutPlan: ${error.message}`);
    }
}

export async function getWorkoutHistory(userId, dateRange = {}) {
    try {
        const { startDate, endDate, skip = 0, take = 20 } = dateRange;
        
        const where = { 
            createdBy: parseInt(userId)
        };

        // Aggiungi filtri per data se specificati
        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }
        
        const workouts = await prisma.dailyWorkout.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        profileImage: true
                    }
                },
                workoutExercises: {
                    include: {
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                muscleGroup: true
                            }
                        }
                    },
                    orderBy: {
                        order: 'asc'
                    }
                }
            }
        });

        const total = await prisma.dailyWorkout.count({ where });

        return {
            workouts,
            pagination: {
                skip,
                take,
                total,
                hasMore: skip + take < total
            }
        };
    } catch (error) {
        logger.error(`Error getting workout history for user ${userId}: ${error.message}`);
        throw new Error(`Failed to get workout history: ${error.message}`);
    }
}

// ========================================
// WORKOUT EXERCISE SERVICES
// ========================================

export async function addExerciseToWorkout(workoutExerciseData) {
    try {
        // Get the current highest order for this workout
        const maxOrder = await prisma.workoutExercise.findFirst({
            where: { dailyWorkoutId: workoutExerciseData.dailyWorkoutId },
            orderBy: { order: 'desc' },
            select: { order: true }
        });

        const newOrder = (maxOrder?.order || 0) + 1;

        const workoutExercise = await prisma.workoutExercise.create({
            data: {
                ...workoutExerciseData,
                order: newOrder
            },
            include: {
                exercise: {
                    select: {
                        id: true,
                        name: true,
                        muscleGroup: true,
                        description: true
                    }
                },
                dailyWorkout: {
                    select: {
                        id: true,
                        title: true,
                        createdBy: true
                    }
                }
            }
        });

        logger.info(`Exercise added to workout successfully with ID: ${workoutExercise.id}`);
        return workoutExercise;
    } catch (error) {
        logger.error(`Error adding exercise to workout: ${error.message}`);
        throw new Error(`Failed to add exercise to workout: ${error.message}`);
    }
}

export async function updateWorkoutExercise(id, updateData) {
    try {
        const workoutExercise = await prisma.workoutExercise.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                exercise: {
                    select: {
                        id: true,
                        name: true,
                        muscleGroup: true,
                        description: true
                    }
                },
                dailyWorkout: {
                    select: {
                        id: true,
                        title: true,
                        createdBy: true
                    }
                }
            }
        });

        logger.info(`WorkoutExercise with ID ${id} updated successfully`);
        return workoutExercise;
    } catch (error) {
        logger.error(`Error updating WorkoutExercise with ID ${id}: ${error.message}`);
        throw new Error(`Failed to update WorkoutExercise: ${error.message}`);
    }
}

export async function deleteWorkoutExercise(id) {
    try {
        const deletedExercise = await prisma.workoutExercise.delete({
            where: { id: parseInt(id) }
        });

        // Reorder remaining exercises in the same workout
        await reorderWorkoutExercises(deletedExercise.dailyWorkoutId);

        logger.info(`WorkoutExercise with ID ${id} deleted successfully`);
        return deletedExercise;
    } catch (error) {
        logger.error(`Error deleting WorkoutExercise with ID ${id}: ${error.message}`);
        throw new Error(`Failed to delete WorkoutExercise: ${error.message}`);
    }
}

export async function reorderWorkoutExercises(dailyWorkoutId) {
    try {
        const exercises = await prisma.workoutExercise.findMany({
            where: { dailyWorkoutId: parseInt(dailyWorkoutId) },
            orderBy: { order: 'asc' }
        });

        // Update order to be sequential starting from 1
        for (let i = 0; i < exercises.length; i++) {
            await prisma.workoutExercise.update({
                where: { id: exercises[i].id },
                data: { order: i + 1 }
            });
        }

        logger.info(`WorkoutExercises reordered for workout ${dailyWorkoutId}`);
    } catch (error) {
        logger.error(`Error reordering WorkoutExercises for workout ${dailyWorkoutId}: ${error.message}`);
        throw new Error(`Failed to reorder exercises: ${error.message}`);
    }
}

export async function moveWorkoutExercise(id, newOrder) {
    try {
        const workoutExercise = await prisma.workoutExercise.findUnique({
            where: { id: parseInt(id) },
            select: { dailyWorkoutId: true, order: true }
        });

        if (!workoutExercise) {
            throw new Error('WorkoutExercise not found');
        }

        const { dailyWorkoutId, order: currentOrder } = workoutExercise;
        const targetOrder = parseInt(newOrder);

        if (targetOrder === currentOrder) {
            return await findWorkoutExerciseById(id);
        }

        // Get all exercises in the workout
        const exercises = await prisma.workoutExercise.findMany({
            where: { dailyWorkoutId },
            orderBy: { order: 'asc' }
        });

        if (targetOrder < 1 || targetOrder > exercises.length) {
            throw new Error('Invalid order position');
        }

        // Reorder exercises
        if (targetOrder > currentOrder) {
            // Moving down: shift exercises between current and target up
            for (const exercise of exercises) {
                if (exercise.order > currentOrder && exercise.order <= targetOrder) {
                    await prisma.workoutExercise.update({
                        where: { id: exercise.id },
                        data: { order: exercise.order - 1 }
                    });
                }
            }
        } else {
            // Moving up: shift exercises between target and current down
            for (const exercise of exercises) {
                if (exercise.order >= targetOrder && exercise.order < currentOrder) {
                    await prisma.workoutExercise.update({
                        where: { id: exercise.id },
                        data: { order: exercise.order + 1 }
                    });
                }
            }
        }

        // Update the target exercise
        const updatedExercise = await prisma.workoutExercise.update({
            where: { id: parseInt(id) },
            data: { order: targetOrder },
            include: {
                exercise: {
                    select: {
                        id: true,
                        name: true,
                        muscleGroup: true,
                        description: true
                    }
                },
                dailyWorkout: {
                    select: {
                        id: true,
                        title: true,
                        createdBy: true
                    }
                }
            }
        });

        logger.info(`WorkoutExercise with ID ${id} moved to position ${targetOrder}`);
        return updatedExercise;
    } catch (error) {
        logger.error(`Error moving WorkoutExercise with ID ${id}: ${error.message}`);
        throw new Error(`Failed to move exercise: ${error.message}`);
    }
}

export async function findWorkoutExerciseById(id) {
    try {
        const workoutExercise = await prisma.workoutExercise.findUnique({
            where: { id: parseInt(id) },
            include: {
                exercise: {
                    select: {
                        id: true,
                        name: true,
                        muscleGroup: true,
                        description: true
                    }
                },
                dailyWorkout: {
                    select: {
                        id: true,
                        title: true,
                        createdBy: true
                    }
                }
            }
        });

        if (!workoutExercise) {
            throw new Error('WorkoutExercise not found');
        }

        return workoutExercise;
    } catch (error) {
        logger.error(`Error finding WorkoutExercise with ID ${id}: ${error.message}`);
        throw new Error(`WorkoutExercise not found: ${error.message}`);
    }
}

export async function findExercisesByWorkout(dailyWorkoutId) {
    try {
        const exercises = await prisma.workoutExercise.findMany({
            where: { dailyWorkoutId: parseInt(dailyWorkoutId) },
            orderBy: { order: 'asc' },
            include: {
                exercise: {
                    select: {
                        id: true,
                        name: true,
                        muscleGroup: true,
                        description: true
                    }
                }
            }
        });

        return exercises;
    } catch (error) {
        logger.error(`Error finding exercises for workout ${dailyWorkoutId}: ${error.message}`);
        throw new Error(`Failed to fetch workout exercises: ${error.message}`);
    }
}

// ========================================
// COMPOSITE WORKOUT SERVICES
// ========================================

export async function createWorkoutWithExercises(workoutData, exercises) {
    try {
        const result = await prisma.$transaction(async (tx) => {
            // Create the workout
            const dailyWorkout = await tx.dailyWorkout.create({
                data: workoutData
            });

            // Add exercises with proper ordering
            const workoutExercises = [];
            for (let i = 0; i < exercises.length; i++) {
                const exerciseData = {
                    ...exercises[i],
                    dailyWorkoutId: dailyWorkout.id,
                    order: i + 1
                };

                const workoutExercise = await tx.workoutExercise.create({
                    data: exerciseData,
                    include: {
                        exercise: {
                            select: {
                                id: true,
                                name: true,
                                muscleGroup: true,
                                description: true
                            }
                        }
                    }
                });

                workoutExercises.push(workoutExercise);
            }

            return {
                ...dailyWorkout,
                workoutExercises
            };
        });

        logger.info(`Workout with exercises created successfully with ID: ${result.id}`);
        return result;
    } catch (error) {
        logger.error(`Error creating workout with exercises: ${error.message}`);
        throw new Error(`Failed to create workout with exercises: ${error.message}`);
    }
}

export async function copyWorkoutPlanToDailyWorkout(workoutPlanId, userId, title, description) {
    try {
        const workoutPlan = await prisma.workoutPlan.findUnique({
            where: { id: parseInt(workoutPlanId) },
            include: {
                // Include the week schedule to get workout IDs
            }
        });

        if (!workoutPlan) {
            throw new Error('WorkoutPlan not found');
        }

        // This would need to be implemented based on how you want to handle
        // copying from a workout plan to a daily workout
        // For now, returning a placeholder
        throw new Error('Copying from WorkoutPlan to DailyWorkout not yet implemented');
    } catch (error) {
        logger.error(`Error copying workout plan ${workoutPlanId}: ${error.message}`);
        throw new Error(`Failed to copy workout plan: ${error.message}`);
    }
}

export async function getWorkoutStats(userId, timeRange = 'month') {
    try {
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            case 'year':
                startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        }

        const stats = await prisma.$transaction([
            // Total workouts in time range
            prisma.dailyWorkout.count({
                where: {
                    createdBy: parseInt(userId),
                    createdAt: { gte: startDate }
                }
            }),
            // Total exercises performed
            prisma.workoutExercise.count({
                where: {
                    dailyWorkout: {
                        createdBy: parseInt(userId),
                        createdAt: { gte: startDate }
                    }
                }
            }),
            // Most used muscle groups
            prisma.workoutExercise.groupBy({
                by: ['exerciseId'],
                where: {
                    dailyWorkout: {
                        createdBy: parseInt(userId),
                        createdAt: { gte: startDate }
                    }
                },
                _count: {
                    exerciseId: true
                },
                orderBy: {
                    _count: {
                        exerciseId: 'desc'
                    }
                },
                take: 5
            })
        ]);

        return {
            totalWorkouts: stats[0],
            totalExercises: stats[1],
            topMuscleGroups: stats[2].map(item => ({
                muscleGroup: item.exercise.muscleGroup,
                count: item._count.exerciseId
            }))
        };
    } catch (error) {
        logger.error(`Error getting workout stats for user ${userId}: ${error.message}`);
        throw new Error(`Failed to get workout stats: ${error.message}`);
    }
}

