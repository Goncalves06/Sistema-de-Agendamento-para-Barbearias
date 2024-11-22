const { Agendamento } = require('../models/agendamentoModel');
const { Desmarque } = require('../models/desmarqueModel');
const { User } = require('../models/userModel');
const { Slot } = require('../models/slotModel');

const respostaCancelamento = async (req, res) => {
    const { resposta, desmarque_id } = req.body;

    try {
        const solicitacao = await Desmarque.findOne({
            where: {
                id: desmarque_id
            }
        });

        if (!solicitacao) {
            return res.json({ message: 'Solicitação de desmarque não encontrada!' });
        }
    
        const agendamentoSolic = await Agendamento.findOne({
            where: {
                id: solicitacao.id_agendamento
            }
        });

        if (!agendamentoSolic) {
            return res.json({ message: 'Agendamento referente ao ID da solicitação não emcontrado!'});
        };

        const slotAgendamento = await Slot.findOne({
            where: {
                data: agendamentoSolic.data,
                horario_inicio: agendamentoSolic.horario_inicio,
                disponivel: false
            }
        });

        if (!slotAgendamento) {
            return res.json({message: 'Horario do agendamento não encontrado"'});
        };

        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        try {
            if (resposta === true) {
                await solicitacao.update({aceito: true, por_adminID: user.id });
                await agendamentoSolic.destroy();
                await slotAgendamento.update({disponivel: true});
                return res.json({message: 'Solicitação aceita e operada!'});
        
            } else {
                await solicitacao.update({aceito: false, por_adminID: user.id });
                return res.json({message: 'Solicitação recusada e atualizada!'});
            };
        
        } catch (error) {
            return res.json({message: 'Erro no processo de atualização do desmarque', error: error.message});
        };
        
    } catch (error) {
        return res.json({message: 'Não foi possivel concluir a solicitação', error: error.message });
    };
};

module.exports = { respostaCancelamento };