const { Agendamento } = require('../models/agendamentoModel');
const { User } = require('../models/userModel');
const { Slot } = require('../models/slotModel');
const { Servico } = require('../models/servicoModel');
const { Desmarque } = require('../models/desmarqueModel');

const respostaCancelamento = async (req, res) => {
    const { resposta, desmarque_id } = req.body;

    if (!Number.isInteger(desmarque_id)) {
        return res.json({ message: 'O ID da solicitação deve ser um número inteiro válido.' });
    };

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
        }

        if (resposta === true) {
        
            await solicitacao.update({aceito: true, por_adminID: req.user.id});
            await agendamentoSolic.destroy();
            return res.json({message: 'Solicitação aceita e operada!'});
    
        } else {
            await solicitacao.update({aceito: false, por_adminID: req.user.id});
            return res.json({message: 'Solicitação recusada e atualizada!'});
        };
    
    } catch (error) {
        return res.json({message: 'Não foi possivel concluir a solicitação', error: error.message });
    };
};