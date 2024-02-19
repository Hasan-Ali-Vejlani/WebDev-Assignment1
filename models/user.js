const { DataTypes } = require('sequelize');

// Import the Sequelize connection instance
const sequelize = require('../db');

const User = sequelize.define('User', {
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  DOB: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  IsManager: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure unique email addresses
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync({ force: true }).then(() => {
  console.log('User table created!');
});

module.exports = User;
