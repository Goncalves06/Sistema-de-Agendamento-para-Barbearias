const express = require('express');
const router = express.Router();
const { loginUser } = require('../controllers/authController');
const { userRegister, deleteUser } = require('../controllers/userController');
const { userAgendamentos } = require('../controllers/agendamentoController');
const { verificarToken } = require('../middlewares/tokenVerify');

//ROTAS DE USUARIO
router.post('/registro', userRegister);
router.post('/login', loginUser);
router.delete('/apagar-conta', deleteUser);
router.get('/agendamentos', verificarToken, userAgendamentos);

module.exports = router;  