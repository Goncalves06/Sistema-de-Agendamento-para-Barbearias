const Sequelize = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'config/banco.db'
});

module.exports = sequelize;
  