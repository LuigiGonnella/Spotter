import { findAllGyms } from "../services/gymService.mjs";
import logger from "../utils/logger.mjs";

export async function getAllGyms(req, res, next) {
  const {page, pageSize} = req.query;
  const data = JSON.parse(req.query.data);
  console.log(data);
  try {
    const {gyms, pagination, links} = await findAllGyms({page, pageSize, data});
    if (!gyms) {
      res.json([]);
      return;
    }

    const gyms_to_return = gyms.map((gym) => ({id: gym.id, name: gym.name, address: gym.address, city: gym.city, description: gym.description, email: gym.email, verified: gym.verified, latitude: gym.latitude, longitude: gym.longitude}));

    res.json({gyms: gyms_to_return, pagination, links});

    
  } catch (error) {
    logger.error(`Error processing gyms data - ${error.message}`);
    next(error);
  }
}