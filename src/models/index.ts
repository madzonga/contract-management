import { Sequelize } from 'sequelize';
import { Profile } from './profile';
import { Contract } from './contract';
import { Job } from './job';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite3'
});

// Initialize models
Profile.initialize(sequelize);
Contract.initialize(sequelize);
Job.initialize(sequelize);

// Set up associations
Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.hasMany(Job, { foreignKey: 'ContractId' });
Job.belongsTo(Contract, { foreignKey: 'ContractId' });
Contract.belongsTo(Profile, { foreignKey: 'ClientId', as: 'Client' });
Contract.belongsTo(Profile, { foreignKey: 'ContractorId', as: 'Contractor' });
export { sequelize, Profile, Contract, Job };
