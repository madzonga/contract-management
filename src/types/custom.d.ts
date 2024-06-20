import { Request } from 'express';
import { Profile } from './models/profile'; 

export interface CustomRequest extends Request {
  profile?: Profile;
}