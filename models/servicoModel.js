const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Servico = sequelize.define('Servico', {

    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    preco: {
        type: DataTypes.INTEGER,  
        allowNull: false
    },

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,      
        primaryKey: true
    },

    ativo: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }

}, {
    tableName: 'SERVICO',  
    timestamps: false 
});

module.exports = { Servico }