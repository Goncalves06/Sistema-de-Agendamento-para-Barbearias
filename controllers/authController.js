const jwt = require('jsonwebtoken');
const { User } = require('../models/userModel');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;

const loginUsuario = async (req, res) => {
    try {
        const { cpf, telefone } = req.body;

        const usuario = await User.findOne({
            where: {
                cpf: cpf,
                telefone: telefone
            }
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Usuário Não Encontrado! Dados Inválidos' });
        }

        const token = jwt.sign({ id: usuario.id, admin: usuario.admin }, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Não Foi Possível Logar! Falha Interna', error: error.message });
    }  
};

const loginAdmin = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        const usuario = await User.findOne({
            where: {
                cpf: cpf,
                senha: senha,
                admin: true
            }
        });

        if (!usuario) {
            return res.status(400).json({ message: 'Usuário administrador Não Encontrado! Dados Inválidos' });
        };

        const token = jwt.sign({ id: usuario.id, admin: usuario.admin }, SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Não Foi Possível Logar! Falha Interna', error: error.message });
    }
};

module.exports = { loginUsuario, loginAdmin };
