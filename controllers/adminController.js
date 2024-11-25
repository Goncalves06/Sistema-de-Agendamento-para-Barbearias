const { Agendamento } = require('../models/agendamentoModel');
const { Desmarque } = require('../models/desmarqueModel');
const { User } = require('../models/userModel');
const { Slot } = require('../models/slotModel');
const { Servico } = require('../models/servicoModel');

async function addDia (req, res) {
    try {
        const { data } = req.body;

        const dataExiste = await Slot.findOne({
            where: {
                data: data
            }
        });

        if (dataExiste) {
            return res.json({message: 'Data já disponivel/cadastrada anteriormente para agendamentos!'});
        };
        
        const novosSlots = await Slot.bulkCreate([
            { data: data, horario_inicio: '10:00', horario_fim: '10:30', disponivel: true },
            { data: data, horario_inicio: '10:30', horario_fim: '11:00', disponivel: true },
            { data: data, horario_inicio: '11:00', horario_fim: '11:30', disponivel: true },
            { data: data, horario_inicio: '11:30', horario_fim: '12:00', disponivel: true },
            { data: data, horario_inicio: '12:00', horario_fim: '12:30', disponivel: true },
            { data: data, horario_inicio: '12:30', horario_fim: '13:00', disponivel: true },
            { data: data, horario_inicio: '14:00', horario_fim: '14:30', disponivel: true },
            { data: data, horario_inicio: '14:30', horario_fim: '15:00', disponivel: true },
            { data: data, horario_inicio: '15:00', horario_fim: '15:30', disponivel: true },
            { data: data, horario_inicio: '15:30', horario_fim: '16:00', disponivel: true },
            { data: data, horario_inicio: '16:00', horario_fim: '16:30', disponivel: true },
            { data: data, horario_inicio: '16:30', horario_fim: '17:00', disponivel: true },
            { data: data, horario_inicio: '17:00', horario_fim: '17:30', disponivel: true },
            { data: data, horario_inicio: '17:30', horario_fim: '18:00', disponivel: true },
            { data: data, horario_inicio: '18:00', horario_fim: '18:30', disponivel: true },
            { data: data, horario_inicio: '18:30', horario_fim: '19:00', disponivel: true },
            { data: data, horario_inicio: '19:00', horario_fim: '19:30', disponivel: true },
            { data: data, horario_inicio: '19:30', horario_fim: '20:00', disponivel: true },
            ]);

        return res.json({message: 'Data selecionada diponivel para agendamento! Novos horarios criados'});
        
    } catch (error) {
        return res.json({message: 'Algo ocorreu no processo!', error: error.message});
    };
};

async function delDia (req, res) {
    const { data } = req.body;
  
    try {
      const slotExiste = await Slot.findOne({ where: { data: data } });
      if (!slotExiste) {
        return res.json({ message: 'Data selecionada não disponível/cadastrada para agendamentos!' });
      }
  
      const haAgendamentos = await Agendamento.findAll({ where: { data: data } });
  
      if (haAgendamentos.length === 0) {
        await Slot.destroy({ where: { data: data } });
        return res.json({ message: 'Não havia agendamentos no dia! Dia/horários deletado com sucesso!' });
      }
  
      for (const agendamento of haAgendamentos) {
        await Desmarque.create({
          id_usuario: agendamento.usuario_id,
          id_agendamento: agendamento.id,
          aceito: true,
          por_adminID: req.user.id
        });
      }
  
      await Agendamento.destroy({ where: { data: data } });
      await Slot.destroy({ where: { data: data } });
  
      return res.json({ message: 'Agendamentos desmarcados e registros criados com sucesso!' });
  
    } catch (error) {
      return res.json({ message: 'Algo ocorreu ao processar a requisição!', error: error.message });
    };
  };

const bloqHorario = async (req, res) => {
    const { data, horario_inicio } = req.body;

    try {
        const slot = await Slot.findOne({
            where: {
                data: data,
                horario_inicio: horario_inicio,
                disponivel: true
            }
        });

        if (!slot) {
            return res.json({message: 'Não foi possivel encontrar o horario! Horario marcado ou não existente no sistema!'})
        };

        await slot.update({
            disponivel: false
        });

        return res.json({message: 'Horario atualizado para indisponivel!'});
    
    } catch (error) {
        return res.json({ message: 'Algo ocorreu ao processar a requisição!', error: error.message });
    };
};
  
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

const novoServico = async (req, res) => {
    const { nome, preco } = req.body;
    
    try {
        const isAdmin = req.user.admin;
        
        if (isAdmin == false) {
            return res.json({message: 'Você não tem permissão para cadastrar novos serviços!'});
        };
        
        if (nome.length < 3) {
            return res.json({message: 'Coloque um nome valido para o novo serviço!'});
        };
        
        const servico = await Servico.create({
            nome: nome,
            preco: preco,
            ativo: true
        });

        if (!servico) {
            return res.json({message: 'Não foi possivel cadastrar o novo serviço!'});
        };

        return res.json({message: 'Novo serviço cadastrado!', servico});
    
    } catch (error) {
        return res.json({message: 'Erro! Algo ocorreu', error: error.message});
    }
};

const mostrarServicos = async (res) => {
    const servicos = await Servico.findAll;

    if (servicos.length < 1) {
        return res.json({message: 'Não ha agendamentos cadastrados!'})
    };

    return res.json({servicos});
};

const suspenderServico = async (req, res) => {
    const { id } = req.body;

    try {
        const isAdmin = req.user.admin;
        
        if (isAdmin == false) {
            return res.json({message: 'Você não tem permissão para cadastrar novos serviços!'});
        };

        const servico = await Servico.findOne({
            where: {
                id: id,
                ativo: true
            }
        });

        if (!servico) {
            return res.json({message: 'Serviço não existe, ou já não ativo!'})
        };

        await servico.update({ativo: false});
    
    } catch (error) {
        return res.json({message: 'Erro! Algo ocorreu', error: error.message});
    }
};

const ativarServico = async (req, res) => {
    const { id } = req.body;

    try {
        const isAdmin = req.user.admin;
        
        if (isAdmin == false) {
            return res.json({message: 'Você não tem permissão para cadastrar novos serviços!'});
        };
        
        const servico = await Servico.findOne({
            where: {
                id: id,
                ativo: false
            }
        });

        if (!servico) {
            return res.json({message: 'Serviço não existe, ou já não ativo!'})
        };

        await servico.update({ativo: true});
    
    } catch (error) {
        return res.json({message: 'Erro! Algo ocorreu', error: error.message});
    }
};

const deleteServico = async (req, res) => {
    const { id } = req.body;

    try{
        const isAdmin = req.user.admin;
        
        if (isAdmin == false) {
            return res.json({message: 'Você não tem permissão para cadastrar novos serviços!'});
        };
        
        const servico = await Servico.findOne({
            where: {
                id: id
            }
        });

        if (!servico) {
            return res.json({message: 'Não foi possivel encontrar o servico pelo ID!'});
        };

        await servico.destroy();

        return res.json({message: 'Servico excluido com sucesso!'});
    
    } catch (error) {
        return res.json({message: 'Erro! Algo ocorreu', error: error.message});
    }
}

module.exports = { respostaCancelamento, delDia, addDia, novoServico, mostrarServicos, suspenderServico, ativarServico, deleteServico, bloqHorario };