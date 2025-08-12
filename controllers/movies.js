const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const verifyAdmin = require('../middleware/verify-admin.js')
const Movie = require('../models/movie.js')
const router = express.Router()

// ========== Public Routes ===========
// SHOW ALL MOVIES
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('owner')
      .sort({ createdAt: 'desc' })
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json(error)
  }
})
// SHOW ONE MOVIE DETAILS
router.get('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId).populate('owner')
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})

// SHOW SEATS
router.get('/:movieId/seats', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    
    res.status(200).json(movie.currentSeats)
  } catch (error) {
    res.status(500).json(error)
  }
})

// ========= USER ROUTES =========

router.post('/:movieId/seats/payment', verifyToken, async (req, res) => {
  try {
    const { seatNumbers } = req.body
    const movie = await Movie.findById(req.params.movieId)
    const user = await User.findById(req.user._id)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

      movie.currentSeats = movie.currentSeats.map(seat => {
        if (seatNumbers.includes(seat.number) && seat.isAvailable) {
          return { 
            ...seat, 
            isAvailable: false, 
            bookedBy: user._id 
          }
        }
        return seat
      })
      user.ticket = (user.ticket || 0) + seatNumbers.length
      
      await movie.save()
      await user.save()
  
      res.status(200).json({
        message: 'Ticket(s) booked successfully',
        movieTitle: movie.title,
        bookedSeats: seatNumbers,
        totalTickets: user.ticket
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

// ========= ADMIN ROUTES =========

// CREATE MOVIE
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    req.body.owner = req.user._id
    const movie = await Movie.create(req.body)
    movie._doc.owner = req.user
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})

// UPDATE MOVIE
router.put('/:movieId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.movieId,
      req.body,
      { new: true }
    )

    res.status(200).json(updatedMovie)
  } catch (error) {
    res.status(500).json(error)
  }
})
// CREATE SEATS
router.post('/:movieId/seats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    movie.currentSeats = req.body.seats
    await movie.save()
    
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})  

// UPDATE SEATS
router.put('/:movieId/seats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    movie.currentSeats = req.body.seats
    await movie.save()

    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})

// DELETE MOVIE
router.delete('/:movieId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const deletedMovie = await Movie.findByIdAndDelete(req.params.movieId)
    res.status(200).json(deletedMovie)
  } catch (error) {
    res.status(500).json(error)
  }
})

// CREATE A REVIEW
router.post('/:movieId/review', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    req.body.user = req.user._id;
    movie.reviews.push(req.body);
    await movie.save();

    await movie.populate(`reviews.${movie.reviews.length - 1}.user`, '-password');

    const newReview = movie.reviews[movie.reviews.length - 1];
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.put('/:movieId/reviews/:reviewId', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    const review = movie.reviews.id(req.params.reviewId)
    if (!review) return res.status(404).json({ message: "Review not found" })

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    review.comment = req.body.comment
    review.rating = req.body.rating
    await movie.save()

    res.status(200).json(review)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.delete('/:movieId/reviews/:reviewId', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    const review = movie.reviews.id(req.params.reviewId)
    if (!review) return res.status(404).json({ message: "Review not found" })

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    review.remove()
    await movie.save()
    res.status(200).json({ message: "Review deleted successfully" })
  } catch (error) {
    res.status(500).json(error)
  }
})
module.exports = router