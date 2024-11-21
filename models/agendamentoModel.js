//MODELO DE AGENDAMENTO
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Agendamento = sequelize.define('Agendamento', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,      //ID DO AGENDAMENTO
        primaryKey: true,
    },

    usuario_id: {
        type: DataTypes.INTEGER,  //ID DO USUARIO
        allowNull: false
    },

    usuario_cpf: {
        type: DataTypes.INTEGER,  //CPF DO USUARIO
        allowNull: false
    },

    usuario_nome: {
        type: DataTypes.STRING,  //NOME DO USUARIO
        allowNull: false
    },

    usuario_telefone: {
        type: DataTypes.INTEGER, //TELEFONE DO USUARIO
        allowNull: false
    },

    data: {
        type: DataTypes.STRING,  //DATA DO AGENDAMENTO
        allowNull: false
    },

    horario_inicio: {
        type: DataTypes.STRING, //HORARIO DE INICIO DO AGENDAMENTO
        allowNull: false
    },

    horario_fim: {
        type: DataTypes.STRING,  //HORARIO DE FIM DO AGENDAMENTO
        allowNull: false
    },
}, {
    tableName: 'AGENDAMENTO',  //CONFIRMA O NOME DA TABELA ONDE OS DADOS SERÃO GRAVADOS NO BANCO
    timestamps: false
});

module.exports = { Agendamento };