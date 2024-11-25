const express = require('express');
const router = express.Router();
const { loginUsuario, loginAdmin } = require('../controllers/authController');
const { registroUsuario, registroAdmin, atualizarUsuario, apagarUsuario } = require('../controllers/userController');
const { agendamentoUsuario } = require('../controllers/agendamentoController');
const { verificarToken } = require('../middlewares/tokenVerify');
const { addDia, delDia } = require('../controllers/adminController');

//ROTAS DE USUARIO

//ROTAS DE REGISTRO
router.post('/registro', registroUsuario);
router.post('/registro-admin', registroAdmin);

//ROTAS DE LOGIN
router.post('/login', loginUsuario);
router.post('/login-admin', loginAdmin);

//ROTAS DE ADMINISTRADOR
router.delete('/desmarcar-data', verificarToken, delDia);
router.post('/cadastrar-data', verificarToken, addDia);

//ROTAS DIVERSAS
router.delete('/apagar-conta',verificarToken, apagarUsuario);
router.get('/agendamentos', verificarToken, agendamentoUsuario);
router.put('/atualizar-dados', verificarToken, atualizarUsuario);

module.exports = router;  