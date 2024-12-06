const express = require('express');
const router = express.Router();
const Comment = require('../../model/Comment_model/Comment_model');
const BlogPost = require('../../model/NewBlog_model/NewBlog_model');

// Get all comments
router.get('/', async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
});

// Create a new comment
router.post('/', async (req, res) => {
  const { content, name, email, postId } = req.body;
  const comment = new Comment({ content, name, email, postId });
  await comment.save();

  // Append to post's comments array
  const post = await BlogPost.findById(postId);
  post.comments.push(comment);
  await post.save();

  res.json(comment);
});

// ...

// Reply to a specific comment
router.post('/:id/replies', async (req, res) => {
  const { content, name, email } = req.body;
  
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    comment.replies.push({ content, name, email });
    await comment.save();
    res.json(comment);
  } catch (error) {
    console.error('Error replying to comment:', error);
    res.status(500).json({ error: 'Error replying to comment' });
  }
});

// ...


// Get a specific comment
router.get('/:id', async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }
  res.json(comment);
});

// Update a specific comment
router.put('/:id', async (req, res) => {
  const { content, name, email } = req.body;
  
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      { content, name, email },
      { new: true }
    );

    if (!updatedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(updatedComment);
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ error: 'Error updating comment' });
  }
});

// Delete a specific comment
router.delete('/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndRemove(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(deletedComment);
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ error: 'Error deleting comment' });
  }
});

module.exports = router;
