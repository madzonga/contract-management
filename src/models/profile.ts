import { Sequelize, Model, DataTypes, Optional } from 'sequelize';

interface ProfileAttributes {
  id: number;
  firstName: string;
  lastName: string;
  profession: string;
  balance: number;
  type: 'client' | 'contractor';
}

interface ProfileCreationAttributes extends Optional<ProfileAttributes, 'id'> {}

class Profile extends Model<ProfileAttributes, ProfileCreationAttributes> implements ProfileAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public profession!: string;
  public balance!: number;
  public type!: 'client' | 'contractor';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  
  static initialize(sequelize: Sequelize) {
    Profile.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        profession: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        balance: {
          type: DataTypes.DECIMAL(12, 2),
        },
        type: {
          type: DataTypes.ENUM('client', 'contractor'),
        },
      },
      {
        sequelize,
        modelName: 'Profile',
      }
    );
  }
}

export { Profile, ProfileAttributes, ProfileCreationAttributes };
