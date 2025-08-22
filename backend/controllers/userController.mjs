import { updateUser, findUserById } from '../services/userService.mjs';
import logger from '../utils/logger.mjs';
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

    if (!user) {
      logger.error('User not found');
      let e = new Error('User not found');
      e.status = 404;
      return next(e);
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: user.bio,
      profileImage: user.profileImage,
      role: user.role,
      isPublic: user.isPublic,
      createdAt: user.createdAt
    };

    res.json(safeUser);

    
  } catch (error) {
    logger.error(`Error processing profile data - ${error.message}`);
    next(error);
  }
}