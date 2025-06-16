const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta';

router.post('/register', async (req, res) => {
  const { user, email, password } = req.body;

  try {
    const userExistente = await User.findOne({ email });
    if (userExistente) return res.status(400).json({ message: 'El usuario ya existe' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new User({ user, email, password: hashedPassword });
    await nuevoUsuario.save();

    res.status(201).json({ message: 'Usuario registrado' });
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ error: 'Error en el registro' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(400).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(400).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario._id, name: usuario.name }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, user: { id: usuario._id, name: usuario.name, email: usuario.email } });
  } catch (err) {
    res.status(500).json({ error: 'Error en el inicio de sesión' });
  }
});

module.exports = router;