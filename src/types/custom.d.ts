import { Request } from 'express';
import { Profile } from './models/profile'; // Adjust the path based on your project structure

export interface CustomRequest extends Request {
  profile?: Profile;
}