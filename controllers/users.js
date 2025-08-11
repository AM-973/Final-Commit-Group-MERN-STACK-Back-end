// routes/userRoutes.js
const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Show = require('../models/Show.js');
const router = express.Router();

// ========== Public Routes ==========

// LIST ALL FILMS
router.get('/shows', async (req, res) => {
  try {
    const shows = await Show.find({});
    res.status(200).json(shows);
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET FILM DETAILS
router.get('/shows/:showId', async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId);
    if (!show) return res.status(404).json({ message: "Show not found" });
    res.status(200).json(show);
  } catch (error) {
    res.status(500).json(error);
  }
});

// LIST AVAILABLE SEATS
router.get('/shows/:showId/seats', async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    const availableSeats = show.seats.filter(seat => seat.isAvailable);
    res.status(200).json(availableSeats);
  } catch (error) {
    res.status(500).json(error);
  }
});

// ========== Protected Routes ==========
router.use(verifyToken);

// CREATE A TICKET
router.post('/shows/:showId/seats/payment', async (req, res) => {
  try {
    const { seatNumbers } = req.body; // Array of seat numbers
    const show = await Show.findById(req.params.showId);
    if (!show) return res.status(404).json({ message: "Show not found" });

    // RESERVE THE SEATS
    let bookedSeats = [];
    show.seats = show.seats.map(seat => {
      if (seatNumbers.includes(seat.number) && seat.isAvailable) {
        bookedSeats.push(seat.number);
        return { ...seat._doc, isAvailable: false };
      }
      return seat;
    });

    await show.save();

    res.status(200).json({
      message: 'Ticket(s) booked successfully',
      bookedSeats
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
