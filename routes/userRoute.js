const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
const { userRegister, deleteUser } = require('../controllers/userController');
const { agendamentoUsuario } = require('../controllers/agendamentoController');
const { verificarToken } = require('../middlewares/tokenVerify');
const { addDia, delDia } = require('../controllers/adminController');

//ROTAS DE USUARIO
router.post('/registro', userRegister);
router.post('/login', loginUser);
router.delete('/apagar-conta',verificarToken, deleteUser);
router.get('/agendamentos', verificarToken, agendamentoUsuario);
router.delete('/desmarcar-data', verificarToken, delDia);
router.post('/cadastrar-data', verificarToken, addDia);

module.exports = router;  