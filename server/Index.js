// server/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const Habit = require('./Models/Habit');

const habitRouters = require('./routes/habits');

const app = express();

const suggestionsRouter = require('./routes/suggestions');

const authRouter = require('./routes/auth');

const cors = require('cors');

app.use(cors({
  origin: ['https://habit-tracker-alpha-sooty.vercel.app'], // tu dominio frontend en Vercel
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json());
app.use('/api/habits', habitRouters);
app.use('/api/suggestions', suggestionsRouter);
app.use('/api/auth', authRouter);

console.log('Key api',process.env.OPENAI_API_KEY);


mongoose.connect(process.env.MONGO_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('conectado a mongo'))
.catch((err) => console.error('fallo de conexion',err))

app.get('/', (req, res) => {
  res.send('API funcionando');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


