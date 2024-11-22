//MODELO DE USUARIO
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', { 

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,      //ID DO USUARIO
        primaryKey: true,
    },
    
    nome: {
        type: DataTypes.STRING,  //NOME DO USUARIO
        allowNull: false,
    },

    cpf: {
        type: DataTypes.STRING, 
        allowNull: false,        //CPF DO USUARIO
        unique: true,
    },

    telefone: {
        type: DataTypes.INTEGER,
        allowNull: false,         //TELEFONE DO USUARIO
        unique: true,
    },

    admin: {
        type: DataTypes.BOOLEAN,  //É USUARIO ADMINISTRADOR
        allowNull: false,
        defaultValue: 0
    },

    senha: {
        type: DataTypes.STRING, 
        allowNull: true,
    }
}, {
    tableName: 'USER',  //CONFIRMA O NOME DA TABELA NO BANCO
    timestamps: false   
});

module.exports = { User };

