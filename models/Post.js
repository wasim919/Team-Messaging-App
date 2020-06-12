const mongoose = require('mongoose');
const colors = require('colors');

const CourseSchema = new mongoose.Schema({
  message: {
    type: String,
    required: [true, 'Please add a description'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  channel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Channel',
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

// // Static method to get avg of course tuitions
// CourseSchema.statics.getAverageCost = async function (bootcampId) {
//   const obj = await this.aggregate([
//     {
//       $match: { bootcamp: bootcampId },
//     },
//     {
//       $group: {
//         _id: '$bootcamp',
//         averageCost: { $avg: '$tuition' },
//       },
//     },
//   ]);

//   try {
//     await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
//       averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
//     });
//   } catch (err) {
//     console.error(err);
//   }
// };

// // Call getAverageCost after save
// CourseSchema.post('save', function () {
//   this.constructor.getAverageCost(this.bootcamp);
// });

// // Call getAverageCost before remove
// CourseSchema.pre('remove', function () {
//   this.constructor.getAverageCost(this.bootcamp);
// });

module.exports = mongoose.model('Course', CourseSchema);
