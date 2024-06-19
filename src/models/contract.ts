import { Sequelize, Model, DataTypes, Optional } from 'sequelize';
import { Profile } from './profile';

interface ContractAttributes {
  id: number;
  terms: string;
  status: 'new' | 'in_progress' | 'terminated';
  ClientId: number;
  ContractorId: number;
  Client?: Profile;
  Contractor?: Profile
}

interface ContractCreationAttributes extends Optional<ContractAttributes, 'id'> {}

class Contract extends Model<ContractAttributes, ContractCreationAttributes> implements ContractAttributes {
  public id!: number;
  public terms!: string;
  public status!: 'new' | 'in_progress' | 'terminated';
  public ClientId!: number;
  public ContractorId!: number;
  public Client?: Profile; // Association with Profile for Client
  public Contractor?: Profile; // Association with Profile for Contractor
  
  static initialize(sequelize: Sequelize) {
    Contract.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        terms: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        status: {
          type: DataTypes.ENUM('new', 'in_progress', 'terminated'),
          allowNull: false,
        },
        ClientId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
        ContractorId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Contract',
      }
    );
  }
}

export { Contract, ContractAttributes, ContractCreationAttributes };