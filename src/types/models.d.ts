import { Model, Optional } from 'sequelize';

declare module '../models/job' {
  import { Contract } from '../models/contract';

  interface Job {
    Contract?: Contract;
  }
}