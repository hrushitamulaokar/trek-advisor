const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: String,
  text: String,
}, { timestamps: true });

const reviewSchema = new mongoose.Schema({
  user: String,
  text: String,
  photos: [String], // URLs to images
  likes: { type: Number, default: 0 },
  likedBy: [String], // user IDs or emails
  comments: [commentSchema],
}, { timestamps: true });

const trekSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String, // URL to image
  experiences: [reviewSchema],
}, { timestamps: true });

module.exports = mongoose.model('Trek', trekSchema);
