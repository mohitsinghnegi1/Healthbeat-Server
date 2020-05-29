const mongoose = require('mongoose');
require('mongoose-type-email');
//attribute name should be in camelcase
const user = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  username: {
    type: String,
    index: {
      unique: true,
    },

    required: true,
  },
  email: {
    type: mongoose.SchemaTypes.Email,
    // match:
    //   '/^(([^<>()[]\\.,;:s@"]+(.[^<>()[]\\.,;:s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/',
    index: {
      unique: true,
    },

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
  // meals: {
  //   type: Array,
  //   of: Map,
  //   default: [
  //     { meal: 'pizza', calories: 100, addeddate: Date.now() },
  //     { meal: 'burger', calories: 200 },
  //   ],
  // },
  modifiedOn: {
    type: Date,
    default: new Date(),
  },
  userType: {
    type: String,
    default: 'user',
  },
});

module.exports = User = mongoose.model('User', user);
