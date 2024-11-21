//VERIFICAÇÃO DO TOKEN DO USUARIO
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
    const SECRET_KEY = process.env.SECRET_KEY;

    if(!token) {
        return res.json({message: 'Acesso Negado. Token Não Fornecido'});
    }

    try {
        // Caso o token venha com o prefixo 'Bearer', o removemos
        const tokenSemPrefixo = token.startsWith('Bearer') ? token.slice(7) : token;
        
        // Verifica e decodifica o token usando a chave secreta
        const decoded = jwt.verify(tokenSemPrefixo, SECRET_KEY);

        // Coloca as informações decodificadas no objeto da requisição
        req.user = decoded;

        next();
    } catch (error) {
        return res.json({message: 'Token Invalido', error: error.message});
    }
};

module.exports = { verificarToken };