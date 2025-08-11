const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const Movie = require('../models/movie.js')
const router = express.Router()

// ========== Public Routes ===========
router.get('/', async (req, res) => {
    try {
      const movies = await Movie.find({})
        .populate('author')
        .sort({ createdAt: 'desc' });
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json(error);
    }
  });
// ========= Protected Routes =========

router.use(verifyToken)

// CREATE NEW MOVIE
router.post('/', async (req, res) => {
	try {
		req.body.author = req.user._id
		const movie = await Movie.create(req.body)
		movie._doc.author = req.user
		res.status(201).json(movie)
	} catch (error) {
		console.log(error)
		res.status(500).json(error)
	}
})


router.get('/:movieId', async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.movieId).populate('author');
      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json(error);
    }
  });


router.put('/:movieId', async (req, res) => {
    try {
      // Find the movie:
      const movie = await Movie.findById(req.params.movieId);
  
      // Check permissions:
      if (!movie.author.equals(req.user._id)) {
        return res.status(403).send("You're not allowed to do that!");
      }
  
      // Update movie:
      const updatedMovie = await Movie.findByIdAndUpdate(
        req.params.movieId,
        req.body,
        { new: true }
      );
  
      
      updatedMovie._doc.author = req.user;
  
      
      res.status(200).json(updatedMovie);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  

router.delete('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);

    if (!movie.author.equals(req.user._id)) {
      return res.status(403).send("You're not allowed to do that!");
    }

    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId);
    res.status(200).json(deletedMovie);
  } catch (error) {
    res.status(500).json(error);
  }
});



router.post('/:movieId/comments', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const movie = await Movie.findById(req.params.movieId);
    movie.comments.push(req.body);
    await movie.save();

    
    const newComment = movie.comments[movie.comments.length - 1];

    newComment._doc.author = req.user;

    
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json(error);
  }
});


router.put('/:movieId/comments/:commentId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    const comment = movie.comments.id(req.params.commentId);
    comment.text = req.body.text;
    await movie.save();
    res.status(200).json({ message: 'This comment has been updated.' });
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete comment

router.delete('/:movieId/comments/:commentId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    movie.comments.remove({ _id: req.params.commentId });
    await movie.save();
    res.status(200).json({ message: 'This comment has been deleted.' });
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router