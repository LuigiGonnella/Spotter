import { findAllGyms } from "../services/gymService.mjs";

export async function getAllGyms(req, res, next) {
  const {page, pageSize} = req.query;
  try {
    const gyms = await findAllGyms(page, pageSize);
    if (!gyms) {
      res.json([]);
      return;
    }

    const gyms_to_return = gyms.map((gym) => ({id: gym.id, name: gym.name, address: gym.address, city: gym.city, description: gym.description, email: gym.email, verified: gym.verified, latitude: gym.latitude, longitude: gym.longitude}));

    res.json(gyms_to_return);

    
  } catch (error) {
    logger.error(`Error processing gyms data - ${error.message}`);
    next(error);
  }
}