'use strict';

const jwt = require('jsonwebtoken');
const config = require('config');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    generateAuthenticationToken() {
      const token = jwt.sign({
        id: this.id,
        is_admin: this.is_admin
      }, config.get('myprivatekey'), { expiresIn: '1h' });

      return token;
    }
  };
  User.init({
    name: { type: DataTypes.STRING(50), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING(255), allowNull: false },
    is_admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
