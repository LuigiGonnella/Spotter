import { updateUser, findUserById } from '../services/userService.mjs';
import logger from '../utils/logger.mjs';
import { getGymByAdmin, getUserGyms } from '../services/gymService.mjs';
/**
 * Aggiorna il profilo dell'utente
 * Campi opzionali: firstName, lastName, dateOfBirth, bio, profileImage, isPublic
 * Altri campi sensibili (email, password, role, provider...) non vengono modificati qui
 */
export async function updateProfile(req, res, next) {
  try {
    const userId = req.user.id; // presuppone che tu abbia middleware di auth che popola req.user
    const {
      firstName,
      lastName,
      dateOfBirth,
      bio,
      profileImage,
      isPublic
    } = req.body;

    // Creiamo un oggetto con solo i campi presenti
    const updatedData = {};
    if (firstName !== undefined) updatedData.firstName = firstName;
    if (lastName !== undefined) updatedData.lastName = lastName;
    if (dateOfBirth !== undefined) updatedData.dateOfBirth = new Date(dateOfBirth);
    if (bio !== undefined) updatedData.bio = bio;
    if (profileImage !== undefined) updatedData.profileImage = profileImage;
    if (isPublic !== undefined) updatedData.isPublic = isPublic;

    // Nessun campo obbligatorio, quindi se updatedData è vuoto non facciamo update
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'No fields provided for update' });
    }

    const updatedUser = await updateUser(updatedData);

    res.json({ id: userId, email: updatedUser.email, firstName: updatedUser.firstName, lastName: updatedUser.firstName, dateOfBirth: updatedUser.dateOfBirth, bio: updatedUser.bio });
  } catch (err) {
    logger.error({ err }, 'Error updating profile');
    next(err);
  }
}

export async function getProfile(req, res, next) {
  const userId = req.user.id;
  try {
    const user = await findUserById(userId);
    let gym = null;
    if (!user) {
      logger.error('User not found');
      let e = new Error('User not found');
      e.status = 404;
      return next(e);
    }
    if (user.role === 'ADMIN') {
      gym = await getGymByAdmin(user.id);
    }

    const safeUser = [{
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profileImage: user.profileImage,
      role: user.role,
      isPublic: user.isPublic,
      createdAt: user.createdAt,
    }, gym ? {id: gym.id, name: gym.name, address: gym.address, city: gym.city, description: gym.description, email: gym.email, verified: gym.verified, latitude: gym.latitude, longitude: gym.longitude} : null];

    res.json(safeUser);

    
  } catch (error) {
    logger.error(`Error processing profile data - ${error.message}`);
    next(error);
  }
}

export async function getUserGymsController(req, res, next) {
  const userId = req.params.userId;
  try {
    const gyms = await getUserGyms(userId);
    console.log(gyms);
    if (!gyms) {
      res.json([]);
      return;
    }

    const gyms_to_return = gyms.map((gym_memb) => ({id: gym_memb.gym.id, name: gym_memb.gym.name, address: gym_memb.gym.address, city: gym_memb.gym.city, description: gym_memb.gym.description, email: gym_memb.gym.email, verified: gym_memb.gym.verified, latitude: gym_memb.gym.latitude, longitude: gym_memb.gym.longitude}));

    res.json(gyms_to_return);

    
  } catch (error) {
    logger.error(`Error processing gyms data - ${error.message}`);
    next(error);
  }
}