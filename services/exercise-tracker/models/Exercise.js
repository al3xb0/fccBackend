const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'ExerciseUser', required: true },
    description: { type: String, required: true, trim: true },
    duration: { type: Number, required: true, min: 1 },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', ExerciseSchema);
