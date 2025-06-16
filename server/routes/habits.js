const express = require('express');
const router = express.Router();
const Habit = require('../Models/Habit');

/*##router.post('/', async (req, res) => {
    console.log('👉 Se recibió una petición POST a /api/habits');
    console.log('📦 Datos recibidos:', req.body);

   try {
    const { name, daysOfWeek } = req.body;

    if (!name || !daysOfWeek.length) {
      console.log('❌ Faltan datos');
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const newHabit = new Habit({ name, daysOfWeek });
    const savedHabit = await newHabit.save();

    console.log('✅ Hábito guardado:', savedHabit);
    res.status(201).json(savedHabit);
  } catch (error) {
    console.error('💥 Error al guardar el hábito:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});*/

const { suggestHabitName,
        createHabit, 
        getHabits, 
        deleteHabit, 
        updateHabit,
        markHabitCompleted } = 
        require('../Controllers/HabitController');

router.post('/', createHabit);
router.get('/', getHabits);
router.delete('/:id', deleteHabit);
router.put('/:id',updateHabit);
router.patch('/:id/complete',markHabitCompleted);
router.get('/suggest' , suggestHabitName);

module.exports = router;