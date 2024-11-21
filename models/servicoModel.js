const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Servico = sequelize.define('Desmarque', {

    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    preco: {
        type: DataTypes.INTEGER,  
        allowNull: false
    }

}, {
    tableName: 'SERVICO',  
    timestamps: false 
});

module.exports = { Servico };