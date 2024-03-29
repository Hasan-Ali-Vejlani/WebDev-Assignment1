const { DataTypes } = require('sequelize');

// Import the User model
const User = require('./user');

// Import the Sequelize connection instance
const sequelize = require('../db');

const Task = sequelize.define('task', {
  TaskID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
  },
  CreatedBy: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'UserID',
    },
  },
  AssignedTo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'UserID',
    },
  },
  Status: {
    type: DataTypes.ENUM('Ongoing', 'Completed'),
    allowNull: false,
    defaultValue: 'Ongoing',
  },
});

// Define foreign key relationships
Task.belongsTo(User, { foreignKey: 'CreatedBy' });
Task.belongsTo(User, { foreignKey: 'AssignedTo' });

Task.sync().then(() => {
  console.log('Task table created!');
}).catch((error) => {
  if (error.name === 'SequelizeDatabaseError' && error.message.includes('Table')) {
    console.log('Task table already exists.');
  } else {
    console.error(error);
  }
});

module.exports = Task;
