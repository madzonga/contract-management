import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface ContractAttributes {
  id: number;
  terms: string;
  status: 'new' | 'in_progress' | 'terminated';
  ClientId: number;
  ContractorId: number;
}

interface ContractCreationAttributes extends Optional<ContractAttributes, 'id'> {}

class Contract extends Model<ContractAttributes, ContractCreationAttributes> implements ContractAttributes {
  public id!: number;
  public terms!: string;
  public status!: 'new' | 'in_progress' | 'terminated';
  public ClientId!: number;
  public ContractorId!: number;

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