const express = require('express');
const sequelize = require('./config/config');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const userRouter = require('./routes/userRoute');
app.use('/usuario', userRouter);

const agendamentoRouter = require('./routes/agendamentoRoutes');
app.use('/agendamento', agendamentoRouter);

sequelize.sync().then(() => {
    console.log('Conectado ao Banco!');
    app.listen(3001, () => {
      console.log('Servidor rodando na porta 3001');
    });
  }).catch((error) => console.log('Erro ao conectar ao banco:', error));



