import { Profile } from './models/profile'; // Adjust the path as necessary

declare module 'express-serve-static-core' {
  interface Request {
    profile?: Profile;
  }
}
