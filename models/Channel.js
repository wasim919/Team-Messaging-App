const mongoose = require('mongoose');
const slugify = require('slugify');
const geoCoder = require('../utils/geocoder');

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters'],
  },
  tags: {
    type: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// // Cascade delete courses when a bootcamp is deleted
// ChannelSchema.pre('remove', async function (next) {
//   await this.model('Course').deleteMany({ channel: this._id });
// });

module.exports = mongoose.model('Channel', ChannelSchema);
