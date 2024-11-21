const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Desmarque = sequelize.define('Desmarque', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,     
        primaryKey: true,
    },

    id_usuario: {
        type: DataTypes.INTEGER,  
        allowNull: false
    },

    id_agendamento: {
        type: DataTypes.INTEGER,  
        allowNull: false
    },

    aceito: {
        type: DataTypes.BOOLEAN,  
        allowNull: false
    }
}, {
    tableName: 'DESMARQUE',  
    timestamps: false 
});

module.exports = { Desmarque };