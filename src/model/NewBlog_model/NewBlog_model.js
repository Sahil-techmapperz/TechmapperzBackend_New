const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  images: [String],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author',
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  maincontent: {
    type: String,
    required: true,
    trim: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
