const express = require('express');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authorRouter = express.Router();
const Author = require('../../model/Author_model/Author_model');

// Get all authors
authorRouter.get('/', async (req, res) => {
  res.send("Author route");
});



// Update an author
authorRouter.put('/:id', async (req, res) => {
  const { name, picture, authorDetails } = req.body;

  try {
    const updatedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      { name, picture, authorDetails },
      { new: true }
    );

    if (!updatedAuthor) {
      return res.status(404).json({ error: 'Author not found' });
    }

    res.json(updatedAuthor);
  } catch (error) {
    console.error('Error updating author:', error);
    res.status(500).json({ error: 'Error updating author' });
  }
});

// Signup new author
authorRouter.post('/signup', async (req, res) => {
  const { name, picture, authorDetails, password, email, socialLinks } = req.body;
  try {
    const author = new Author({ name, picture, authorDetails, password, email, socialLinks });
    await author.save();

    // Generate a token
    const token = jwt.sign({ _id: author._id }, 'your_jwt_secret');
    res.status(201).json({ author, token });
  } catch (error) {
    res.status(400).send(error);
  }
});


// Login author
authorRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const author = await Author.findOne({ email });
  if (!author) {
    return res.status(400).send({ error: 'Invalid login credentials' });
  }

  const isPasswordMatch = await argon2.verify(author.password, password);
  if (!isPasswordMatch) {
    return res.status(400).send({ error: 'Invalid login credentials' });
  }

  const token = jwt.sign({ _id: author._id }, 'your_jwt_secret');
  res.send({ author, token });
});

module.exports = authorRouter;
