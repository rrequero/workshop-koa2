var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, trim: true},
  role: {type: String, required: true, trim: true},
  createdAt: {type: Date, required: true, default: Date.now}
});

module.exports = mongoose.model('User', User);