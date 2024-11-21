const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/tokenVerify');
const { consultarHorarios, criarAgendamento } = require('../controllers/agendamentoController');

//ROTAS DE AGENDAMENTO
router.get('/horarios-disponiveis', consultarHorarios);
router.post('/agende-seu-horario',verificarToken, criarAgendamento);

module.exports = router;

