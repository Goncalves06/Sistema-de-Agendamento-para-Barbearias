const express = require('express');
const router = express.Router();
const { verificarToken } = require('../middlewares/tokenVerify');
const { criarAgendamento, reqCancelamento, verfData } = require('../controllers/agendamentoController');
const { respostaCancelamento } = require('../controllers/adminController');

//ROTAS DE AGENDAMENTO
router.get('/horarios-disponiveis', verfData);
router.post('/agende-seu-horario', verificarToken, criarAgendamento);
router.post('/solicitar-cancelamento', verificarToken, reqCancelamento);
router.post('/resposta-cancelamento', verificarToken, respostaCancelamento );

module.exports = router;

   