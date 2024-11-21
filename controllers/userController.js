const { User } = require('../models/userModel');

const userRegister = async (req, res) => {
    const { nome, cpf, telefone } = req.body;

    try {
        const newUser = await User.create({ nome, cpf, telefone });

        return res.status(201).json({
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
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).json({ message: 'Usuário não cadastrado, algo ocorreu!', error: error.message });
    }
};

const adminRegister = async (req, res) => {
    const { nome, cpf, telefone } = req.body;

    try {
        const newUser = await User.create({ nome, cpf, telefone, admin: true });

        return res.status(201).json({
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
        console.error('Erro ao cadastrar admin:', error);
        return res.status(500).json({ message: 'Admin não cadastrado, algo ocorreu!', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    const { cpf } = req.body;

    try {
        const user = await User.findOne({
            where: {
                cpf: cpf,
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        await user.destroy();

        return res.status(200).json({ message: 'Usuário deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return res.status(500).json({ message: 'Não foi possível deletar o usuário.', error: error.message });
    }
};

module.exports = { userRegister, deleteUser };
