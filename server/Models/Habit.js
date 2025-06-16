const mongoose = require('mongoose');

const HabitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: {type: String, required: true},
  daysOfWeek: [{ type: String, required: true}],
  createdAt: { type: Date, default: Date.now },
  records: [
    {
      date: { type: String, required: true },
      completed: { type: Boolean, default: false }
    }
  ]
});

module.exports = mongoose.model('Habit', HabitSchema);