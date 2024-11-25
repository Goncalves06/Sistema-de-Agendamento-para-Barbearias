const { User } = require('../models/userModel');

const registroUsuario = async (req, res) => {
    const { nome, cpf, telefone } = req.body;

    try {
        
        if (cpf.length !== 11 || telefone.length !== 11 || nome.length < 3) {
            return res.json({message: 'Um ou mais dados são invalidos!'})
        };

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

const registroAdmin = async (req, res) => {
    const { nome, cpf, telefone, senha } = req.body;

    if (cpf.length !== 11 || telefone.length !== 11 || nome.length < 3) {
        return res.json({message: 'Um ou mais dados são invalidos!'})
    };

    try {
        const newAdmin = await User.create({ 
            nome: nome,
            cpf: cpf,
            telefone: telefone,
            admin: true,
            senha: senha 
        });
        
        return res.json({message: 'Novo administrador cadastrado!', newAdmin});
    
    } catch (error) {
        return res.json({ message: 'Admin não cadastrado, algo ocorreu!', error: error.message });
    }
};

const apagarUsuario = async (req, res) => {
    const isAdmin = req.user.admin;
    const { cpf } = req.body;

    if (isAdmin == false) {
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

    if (isAdmin == false) {
        try{
            const user = await User.findOne({
                where: {
                    cpf: cpf
                }
            });
    
            if(!user) {
                return res.json({message: 'Usuario não encontrado pelo CPF!'});
            }
    
            const usuarioDeletado = await user.destroy();
    
            if (usuarioDeletado) {
                res.json({message: 'Usuario deletado com sucesso!', usuarioDeletado});
            };
    
        } catch (error) {
            return res.json({ message: 'Não foi possível deletar o usuário.', error: error.message });
        }
    };
};

const atualizarUsuario = async (req, res) => {
    const { cpf, telefone, nome } = req.body;
    const isAdmin = req.user.admin;
 
    if (isAdmin == false) {
        try {
            const user = await User.findOne({
                where: {
                    id: req.user.id,
                    cpf: cpf
                }
            });
    
            if (!user) {
                return res.json({message: 'Este não é seu CPF!'});
            };
    
            if (telefone.length !== 11 || nome.length !== 3) {
                return res.json({message: 'Numero de telefone invalido, ou nome curto demais!'})
            }
    
            const alteracoes = await user.update({
                telefone: telefone,
                nome: nome
            });
    
            return res.json({message: 'Alterações feitas!', alteracoes});
        
        } catch (error) {
            return res.json({message: 'Algo deu errado', error: error.message});
        }
    };

    if (isAdmin == true) {
        try {
            const user = await User.findOne({
                where: {
                    cpf: cpf
                }
            });
    
            if (!user) {
                return res.json({message: 'Usuario não encontrado com este CPF!'});
            };
    
            if (telefone.length !== 11 || nome.length !== 3) {
                return res.json({message: 'Numero de telefone invalido, ou nome curto demais!'})
            }
    
            const alteracoes = await user.update({
                telefone: telefone,
                nome: nome
            });
    
            return res.json({message: 'Alterações feitas!', alteracoes});
        
        } catch (error) {
            return res.json({message: 'Algo deu errado', error: error.message});
        }
    }
};

module.exports = { registroUsuario, registroAdmin, atualizarUsuario, apagarUsuario };
