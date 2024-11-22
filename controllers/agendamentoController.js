const { Agendamento } = require('../models/agendamentoModel');
const { User } = require('../models/userModel');
const { Slot } = require('../models/slotModel');
const { Servico } = require('../models/servicoModel');
const { Desmarque } = require('../models/desmarqueModel');

async function verfData (req, res) {
    const { data } = req.body;

    try {
        const consultaData = await Slot.findAll({
            where: {
                data: data,
                disponivel: true
            }
        });
    
        if (consultaData.length === 0) {
            return res.json({message: 'Não há nenhum horario disponivel na data selecionada!'})
        };
    
        res.json({consultaData});
    
    } catch (error) {
        return res.json({message: 'Ocorreu algum erro: ', error: error.message});
    };
};

async function criarAgendamento(req, res) {
    const { data, horario_inicio, servico } = req.body;

    try {
        const verfSlot = await Slot.findOne({
            where: {
                data: data,
                horario_inicio: horario_inicio,
                disponivel: true
            }
        });

        if (!verfSlot) {
            return res.json({ message: 'Horário inserido não disponível!' });
        };

        const verfServico = await Servico.findOne({
            where: {
                nome: servico,
            }
        });

        if (!verfServico) {
            return res.json({ message: 'Serviço selecionado não existe!' });
        };

        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.json({ message: 'Dados do usuário não encontrados no JWT!' });
        }

        const novoAgendamento = await Agendamento.create({
            usuario_id: req.user.id,
            usuario_cpf: user.cpf,
            usuario_nome: user.nome,
            usuario_telefone: user.telefone,
            data: data,
            horario_inicio: horario_inicio,
            servico: servico
        });
        
        if (novoAgendamento) {
            await verfSlot.update({ disponivel: false });
            return res.json({ message: 'Agendamento realizado com sucesso!', novoAgendamento });
        };

    } catch (error) {
        return res.json({ message: 'Algum erro ocorreu no processo!', error: error.message });
    }
};

async function agendamentoUsuario (req, res) {
    try {
        const user = await User.findOne({
            where: {
                id: req.user.id
            }
        });

        if (!user) {
            return res.json({ message: 'ID do usuário não encontrado no JWT' });
        };

        const agendamentos = await Agendamento.findAll({
            where: {
                usuario_id: user.id
            },
            attributes: ['id', 'horario_inicio', 'horario_fim'],
            include: [
                {
                    model: Service,
                    attributes: ['nome']
                }
            ]
        });

        if (agendamentos.length === 0) {
            return res.json({ message: 'Você não tem agendamentos!' });
        };

        return res.json({
            agendamentos: agendamentos.map(agendamento => ({
                id: agendamento.id,
                horario_inicio: agendamento.horario_inicio,
                horario_fim: agendamento.horario_fim,
                servico: agendamento.servico
            }))
        });

    } catch (error) {
        return res.json({ message: 'Erro ao consultar seus agendamentos!', error: error.message });
    };
};

async function reqCancelamento (req, res) {
    const { agendamentoID } = req.body;

    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    if (!user) {
        return res.json({ message: 'ID do usuário não encontrado no JWT' });
    };

    const isAdmin = user.admin;

    if (!isAdmin) {
        try {
            const agendamento = await Agendamento.findOne({
                where: {
                    id: agendamentoID,
                    usuario_id: req.user.id
                }
            });
    
            if (!agendamento) {
                return res.json({message: 'Agendamento não encontrado! Verifique se o ID corresponde ao de seu agendamento.'});
            };
    
            const slot = await Slot.findOne({
                where: {
                    data: agendamento.data,
                    horario_inicio: agendamento.horario_inicio
                }
            });
    
            if (!slot) {
                return res.json({message: 'Erro ao verificar slot!'});
            };

            const solicitacao = await Desmarque.create({
                id_usuario: req.user.id,
                id_agendamento: agendamentoID,
                aceito: false
            });

            return res.json({message: 'Solicitação enviada com sucesso!'});
        
        } catch (error) {
            res.json({message: 'Algo deu errado', error: error.message });
        };
    };

    if (isAdmin) {
        try {
            const agendamento = await Agendamento.findOne({
                where: {
                    id: agendamentoID,
                }
            });
    
            if (!agendamento) {
                return res.json({message: 'Agendamento não encontrado! Verifique se o agendamento existe.'});
            };
    
            const slot = await Slot.findOne({
                where: {
                    data: agendamento.data,
                    horario_inicio: agendamento.horario_inicio
                }
            });
    
            if (!slot) {
                return res.json({message: 'Erro: ', error: error.message });
            };

            const cancelarAgendamento = await agendamento.destroy();

            if (cancelarAgendamento) {
                await Desmarque.create({
                    id_usuario: agendamento.usuario_id,
                    id_agendamento: agendamentoID,
                    aceito: true,
                    por_adminID: req.user.id
                });

                await slot.update({disponivel: true});
                return ({message: 'Cancelamento feito com sucesso', Desmarque});
            };
        } catch (error) {
            return res.json({message: 'Algo deu errado', error: error.message });
        };
    };
};

module.exports = { reqCancelamento, agendamentoUsuario, criarAgendamento, verfData };