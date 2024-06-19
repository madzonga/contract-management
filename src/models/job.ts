import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { Contract } from './contract';

// Define the attributes for the Job model
interface JobAttributes {
  id: number;
  description: string;
  price: number;
  paid: boolean;
  paymentDate: Date | null;
  ContractId: number;
  Contract?: Contract; 
}

// Define the attributes for Job creation
interface JobCreationAttributes extends Optional<JobAttributes, 'id' | 'paid' | 'paymentDate'> {}

// Extend the Job model with the attributes and creation attributes
class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public id!: number;
  public description!: string;
  public price!: number;
  public paid!: boolean;
  public paymentDate!: Date | null;
  public ContractId!: number;  // Add the foreign key attribute
  public Contract?: Contract; // Association with Contract

  // Initialize the Job model with its attributes
  static initialize(sequelize: Sequelize) {
    Job.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        price: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
        },
        paid: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        paymentDate: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        ContractId: {  // Add the foreign key attribute definition
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Job',
      }
    );
  }
}

// Export the Job model and its attributes
export { Job, JobAttributes, JobCreationAttributes };
