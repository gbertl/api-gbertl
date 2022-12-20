const mongoose = require('mongoose');

const schema = mongoose.Schema({
  thumbnail: String,
  title: String,
  text: String,
  category: String,
  source: String,
  liveUrl: String,
});

module.exports = mongoose.model('Work', schema);
