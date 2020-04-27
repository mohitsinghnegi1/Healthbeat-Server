const mongoose = require('mongoose');
const Meal = require('./Meal.js');
//attribute name should be in camelcase
const user = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  caloriesPerDay: {
    type: Number,
    default: 1000,
  },
  userStatus: {
    type: Boolean,
    default: false,
  },
  meals: {
    type: Array,
    of: Map,
    default: [
      { meal: 'pizza', calories: 100 },
      { meal: 'burger', calories: 200 },
    ],
  },
  modifiedOn: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = User = mongoose.model('User', user);
