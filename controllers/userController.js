const { User } = require('../models/userModel');

const userRegister = async (req, res) => {
    const { nome, cpf, telefone } = req.body;

    try {
        const newUser = await User.create({ nome, cpf, telefone });

        return res.json({
            message: 'Usuário cadastrado com sucesso!',
            usuario: {
                id: newUser.id,
                nome: nome,
                cpf: cpf,
                telefone: telefone,
                admin: false
            }
        });
    } catch (error) {
        return res.json({ message: 'Usuário não cadastrado, algo ocorreu!', error: error.message });
    }
};

const adminRegister = async (req, res) => {
    const { nome, cpf, telefone } = req.body;

    try {
        const newUser = await User.create({ nome, cpf, telefone, admin: true });

        return res.json({
            message: 'Administrador cadastrado com sucesso!',
            usuario: {
                id: newUser.id,
                nome: nome,
                cpf: cpf,
                telefone: telefone,
                admin: true
            }
        });
    } catch (error) {
        return res.json({ message: 'Admin não cadastrado, algo ocorreu!', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { cpf } = req.body;

    try{
        const user = await User.findOne({
            where: {
                id: req.user.id,
                cpf: cpf
            }
        });

        if(!user) {
            return res.json({message: 'CPF diferente com o cadastrado no sistema!'});
        }

        const usuarioDeletado = await user.destroy();

        if (usuarioDeletado) {
            res.json({message: 'Usuario deletado com sucesso!', usuarioDeletado});
        };

    } catch (error) {
        return res.json({ message: 'Não foi possível deletar o usuário.', error: error.message });
    }
};

module.exports = { userRegister, deleteUser };
