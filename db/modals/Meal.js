const mongoose = require('mongoose');
//attribute name should be in camelcase
const meal = new mongoose.Schema({
  mealName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    min: 20,
  },
  calorie: {
    type: Number,
  },
  isInDayLimit: {
    type: Boolean,
  },
  modifiedOn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = Meal = mongoose.model('Meal', meal);
