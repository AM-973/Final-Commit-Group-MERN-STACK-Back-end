// routes/userRoutes.js
const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Movie = require('../models/movie.js');
const router = express.Router();

// ========== Public Routes ==========

// LIST ALL FILMS
router.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET FILM DETAILS
router.get('/movies/:movieId', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json(error);
  }
});

// LIST AVAILABLE SEATS
router.get('/movies/:movieId/seats', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const availableSeats = movie.seats.filter(seat => seat.isAvailable);
    res.status(200).json(availableSeats);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========== Protected Routes ==========
router.use(verifyToken);

// CREATE A TICKET
router.post('/movies/:movieId/seats/payment', async (req, res) => {
  try {
    const { seatNumbers } = req.body; 
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    // RESERVE THE SEATS
    let bookedSeats = [];
    movie.seats = movie.seats.map(seat => {
      if (seatNumbers.includes(seat.number) && seat.isAvailable) {
        bookedSeats.push(seat.number);
        return { ...seat._doc, isAvailable: false };
      }
      return seat;
    });

    await movie.save();

    res.status(200).json({
      message: 'Ticket(s) booked successfully',
      bookedSeats
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
