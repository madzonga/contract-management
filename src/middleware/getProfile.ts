import { Request, Response, NextFunction } from 'express';
import { Profile } from '../models/profile';
import { CustomRequest } from '../types/custom';

const getProfile = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const { Profile } = req.app.get('models');
  const profile: Profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
  
  if (!profile) return res.status(401).end();
  
  req.profile = profile; 
  
  next();
};

export { getProfile };
