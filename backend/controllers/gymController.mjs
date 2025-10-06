import { findAllGyms, addUserToGym, getGymMembers, updateGymMembership, getGymInfo} from "../services/gymService.mjs";
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

export async function joinGym(req, res, next) {
    console.log(req.body);
    logger.info('CIAOOOO');
  const gymId = req.params.gymId;
  const {userId} = req.body;
  try {
    const {user, gym} = await addUserToGym(userId, gymId);
    if (!gym || !user) {
      logger.error(`Error processing membership data - ${error.message}`);
      throw new Error(`Error processing membership data - ${error.message}`)
    }


    res.json({user, gym});

    
  } catch (error) {
    logger.error(`Error processing membership data - ${error.message}`);
    next(error);
  }
}

export async function getGymMembersController(req, res, next) {
  console.log('heyyyyyyyyyyyy');
  try {
    const gymId = req.params.gymId;
    const data = JSON.parse(req.query.data);

    const {members, pagination} = await getGymMembers(gymId, data);

    res.json({members, pagination});
    
  } catch (error) {
    logger.error(`Error processing membership data - ${error.message}`);
    next(error);
  }

}

export async function updateGymMembersController(req, res, next) {
  console.log('okgoat');
  try {
    const gymId = req.params.gymId;
    const userId = req.params.userId;

    const {data} = req.body;

    const membership = await updateGymMembership(userId, gymId, data);

    res.json({membership});
    
  } catch (error) {
    logger.error(`Error processing membership data - ${error.message}`);
    next(error);
  }

}

export async function getGymController(req, res, next) {
   console.log('HEYYYYY')
  try {
    const gymId = req.params.gymId
    const gym = await getGymInfo(gymId)
    console.log('HEYYYYY')
    console.log(gym)
    res.json({gym: {id: gym.id, name: gym.name, address: gym.address, city: gym.city, 
      description: gym.description, email: gym.email, verified: gym.verified, 
      latitude: gym.latitude, longitude: gym.longitude}, usergyms: gym.members, count: gym._count.members})
  } catch (error) {
    logger.error(`Error processing gym data - ${error.message}`);
    next(error);
  }
}