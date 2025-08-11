const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const verifyAdmin = require('../middleware/verify-admin.js')
const Movie = require('../models/movie.js')
const router = express.Router()

// ========== Public Routes ===========

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('owner')
      .populate('currentSeats')
      .populate('reviews')
      .populate('ticket')
      .sort({ createdAt: 'desc' })
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId).populate('owner')
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})


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

router.post('/:movieId/seats', verifyToken, async (req, res) => {
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

router.post('/:movieId/seats/payment', verifyToken, async (req, res) => {
  try {
    const { seatNumbers } = req.body
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })


    res.status(200).json({
      message: 'Ticket(s) booked successfully',
      movieId: req.params.movieId,
      bookedSeats: seatNumbers,
      ticket: req.body.ticket
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

// ========= ADMIN ROUTES =========


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


router.post('/:movieId', verifyToken, verifyAdmin, async (req, res) => {
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

})


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

module.exports = router