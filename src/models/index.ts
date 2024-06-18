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
Contract.belongsTo(Profile, { as: 'Contractor' });
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' });
Contract.belongsTo(Profile, { as: 'Client' });
Contract.hasMany(Job);
Job.belongsTo(Contract);

export { sequelize, Profile, Contract, Job };
