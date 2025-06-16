const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const ejemplos = [
    "Energía Matutina",
    "Cuerpo en Movimiento",
    "Mente Clara",
    "Desconexión Digital",
    "Hidratación Pro"
  ];
  const random = ejemplos[Math.floor(Math.random() * ejemplos.length)];
  res.json({ suggestion: random });
});

module.exports = router;