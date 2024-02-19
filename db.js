const { Sequelize } = require('sequelize');
const config = require('./config'); 

const sequelize = new Sequelize({
    username: config.USER,
    password: config.PASSWORD,
    dialect: config.dialect,
    dialectOptions: {connectString: `${config.HOST}:${config.PORT}/${config.SID}`},// oracle
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
});

module.exports = sequelize;