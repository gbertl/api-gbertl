const mongoose = require('mongoose');

const schema = mongoose.Schema({
  thumbnail: { type: String, required: [true, 'Thumbnail is required'] },
  title: { type: String, required: [true, 'Title is required'] },
  text: { type: String, required: [true, 'Text is required'] },
  category: { type: String, required: [true, 'Category is required'] },
  source: { type: String },
  liveUrl: { type: String },
  priorityOrder: {
    type: Number,
    required: [true, 'Priority order is required'],
    min: [1, 'Invalid priority order'],
  },
});

module.exports = mongoose.model('Work', schema);
