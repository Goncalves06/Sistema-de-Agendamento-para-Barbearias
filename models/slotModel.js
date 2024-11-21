//MODELO DE SLOT (LOGICA PARA AGENDAMENTOS)
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Slot = sequelize.define('Slot', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,      //ID DO SLOT
        primaryKey: true,
    },

    data: {
        type: DataTypes.STRING,  //DATA DO SLOT
        allowNull: false
    },

    horario_inicio: {
        type: DataTypes.STRING,  //HORARIO INICIAL DO SLOT
        allowNull: false
    },

    horario_fim: {
        type: DataTypes.STRING,  //HORARIO FINAL DO SLOT
        allowNull: false
    },

    disponivel: {
        type: DataTypes.BOOLEAN,  //SLOT DISPONIVEL?
        allowNull: false
    }
}, {
    tableName: 'SLOTS',  //CONFIRMA O NOME DA TABELA NO BANCO
    timestamps: false 
});

module.exports = { Slot };