const { Error } = require("mongoose");
const Habit = require("../Models/Habit");
const OpenAI = require("openai");
const openai = new OpenAI({
    apikey: process.env.OPENAI_API_KEY,
});

const suggestHabitName = async (req, res) => {
  try {
    const { topic } = req.body;

    const prompt = `Sugiere un nombre atractivo y breve para un hábito relacionado con: "${topic}".`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const suggestion = response.choices[0]?.message?.content?.trim();

    res.json({ suggestion });
  } catch (error) {
    console.error('Error al obtener sugerencia de hábito:', error.message);
    res.status(500).json({ error: 'Error al obtener sugerencia' });
  }
};


const createHabit = async (req, res) => {
    
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
};

const getHabits = async (req, res) => {
    try{
        const habits = await Habit.find();
        res.json(habits)
    }catch (err){
        res.status(500).json({error: 'No se pudieron obtener los habitos'})
    } 
};

const deleteHabit= async (req, res) => {
    try{
        const deletedHabit = await Habit.findByIdAndDelete(req.params.id);
        if (!deletedHabit) return res.status(404).json({ error: 'Habito no encontrado'});
        res.status(200).json({ message: 'Habito eliminado'});
    }catch (err){
        res.status(500).json({error: 'Error al eliminar el habito'})
    } 
};

const updateHabit= async (req, res) =>{
    try{
        const {name, daysOfWeek}= req.body;
        const updateHabit = await Habit.findByIdAndUpdate(
            req.params.id,
            { name, daysOfWeek},
            { new: true}
        );
        if(!req.params.id){
          return res.status(400).json({ error: 'Falta el ID del hábito para actualizar' });  
        }
        if(!updateHabit){
            return res.status(404).json({error: 'Habito no encontrado'})
        }

        res.json(updateHabit);
    } catch (err){
        console.error('Error al actualizar hábito:', err);
        res.status(500).json({ error: 'Error al actualizar el hábito' });
    }
};

const markHabitCompleted = async (req, res) => {
  const { id } = req.params; // ID del hábito
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  const today = localDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
  try {
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ error: 'Hábito no encontrado' });

    const existing = habit.records.find(r => r.date === today);
    if (existing) {
      existing.completed = true; // Ya existía, solo marcar como completado
    } else {
      habit.records.push({ date: today, completed: true }); // Nuevo día
    }

    await habit.save();
    res.json(habit);
  } catch (err) {
    console.error('Error al marcar hábito:', err);
    res.status(500).json({ error: 'Error al actualizar el seguimiento' });
  }
};


module.exports = {
    createHabit,
    getHabits,
    deleteHabit,
    updateHabit,
    markHabitCompleted,
    suggestHabitName
};