const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const verifyAdmin = require('../middleware/verify-admin.js')
const Movie = require('../models/movie.js')
const router = express.Router()

// ========== Public Routes ===========

router.get('/shows', async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('owner')
      .sort({ createdAt: 'desc' })
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.get('/:showId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.showId).populate('owner')
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get('/:showId/seats', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.showId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    
    res.status(200).json(movie.currentSeats)
  } catch (error) {
    res.status(500).json(error)
  }
})

// ========= Protected Routes =========

router.post('/:showId/seats/payment', verifyToken, async (req, res) => {
  try {
    const { seatNumbers } = req.body
    const movie = await Movie.findById(req.params.showId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })


    res.status(200).json({
      message: 'Ticket(s) booked successfully',
      movieId: req.params.showId,
      bookedSeats: seatNumbers
    })
  } catch (error) {
    res.status(500).json(error)
  }
})


router.post('/shows', verifyToken, verifyAdmin, async (req, res) => {
  try {
    req.body.owner = req.user._id
    const movie = await Movie.create(req.body)
    movie._doc.owner = req.user
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.post('/:showId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.showId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    movie.currentSeats = req.body.seats
    await movie.save()
    
    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.put('/:showId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.showId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.showId,
      req.body,
      { new: true }
    )

    res.status(200).json(updatedMovie)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.put('/:showId/seats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.showId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    movie.currentSeats = req.body.seats
    await movie.save()

    res.status(200).json(movie)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.delete('/:showId', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.showId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })

    const deletedMovie = await Movie.findByIdAndDelete(req.params.showId)
    res.status(200).json(deletedMovie)
  } catch (error) {
    res.status(500).json(error)
  }
})



module.exports = router