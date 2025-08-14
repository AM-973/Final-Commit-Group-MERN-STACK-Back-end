const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const verifyAdmin = require('../middleware/verify-admin.js')
const Movie = require('../models/movie.js')
const User = require('../models/user.js')
const Booking = require('../models/booking.js')
const router = express.Router()

// ========== Public Routes ===========
// SHOW ALL MOVIES
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({})
      .populate('owner', 'username')
      .sort({ createdAt: 'desc' })
    res.status(200).json(movies)
  } catch (error) {
    res.status(500).json(error)
  }
})

// get specific movie
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
      .populate('seats.bookedBy', 'username')
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    
    res.status(200).json(movie.seats)
  } catch (error) {
    res.status(500).json(error)
  }
})

// ========= USER ROUTES =========

router.post('/:movieId/seats/payment', verifyToken, async (req, res) => {
  try {
    let seatNumbers = req.body.seatNumbers;
    if (!seatNumbers || !Array.isArray(seatNumbers) || seatNumbers.length === 0) {
      return res.status(400).json({ message: 'seatNumbers array is required' });
    }

    seatNumbers = seatNumbers.map(Number);

    const movie = await Movie.findById(req.params.movieId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const unavailableSeats = seatNumbers.filter(seatNum => {
      const seat = movie.seats.find(s => s.number == seatNum);
      return !seat || !seat.isAvailable;
    });

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `Seats already booked or invalid: ${unavailableSeats.join(', ')}`
      });
    }

    // Update seats in movie
    movie.seats.forEach(seat => {
      if (seatNumbers.includes(seat.number)) {
        seat.isAvailable = false;
        seat.bookedBy = user._id;
      }
    });

    await movie.save();

    // Get seat IDs for booking document
    const bookedSeatIds = movie.seats
      .filter(seat => seatNumbers.includes(seat.number))
      .map(seat => seat._id);

    const ticketNumber = `T-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const booking = await Booking.create({
      ticketNumber,
      user: user._id,
      movie: movie._id,
      seats: bookedSeatIds,
      timing: movie.creationdate, // change if you add actual showtime
    });

    user.ticket = (user.ticket || 0) + seatNumbers.length;
    await user.save();

    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'username')  
      .populate('movie', 'title creationdate');

    res.status(200).json({
      message: 'Ticket(s) booked successfully',
      booking: {
        user: {
          _id: populatedBooking.user._id,
          username: populatedBooking.user.username, 
        },
        movie: {
          title: populatedBooking.movie.title,
          timing: new Date(populatedBooking.movie.creationdate).toLocaleString(), 
        },
        seats: seatNumbers,
      },
      totalTickets: user.ticket,
    });


  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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

// ADMIN - GET SEATS WITH USER DETAILS
router.get('/:movieId/admin/seats', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
      .populate('seats.bookedBy', 'username') 
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    res.status(200).json(movie.seats)
  } catch (error) {
    res.status(500).json(error)
  }
})



router.get('/:movieId/reviews', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    res.status(200).json(movie.reviews)
  } catch (error) {
    res.status(500).json(error)
  }
})

// CREATE A REVIEW
router.post('/:movieId/reviews', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    req.body.user = req.user._id;
    movie.reviews.push(req.body);
    await movie.save();

    await movie.populate(`reviews.${movie.reviews.length - 1}.user`);

    const newReview = movie.reviews[movie.reviews.length - 1];
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

// UPDATE REVIEW
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

// DELETE REVIEW
router.delete('/:movieId/reviews/:reviewId', verifyToken, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.movieId)
    if (!movie) return res.status(404).json({ message: "Movie not found" })
    const review = movie.reviews.id(req.params.reviewId)
    if (!review) return res.status(404).json({ message: "Review not found" })

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }

    movie.reviews.pull(req.params.reviewId)
    await movie.save()
    res.status(200).json({ message: "Review deleted successfully" })
  } catch (error) {
    res.status(500).json(error)
  }
})
module.exports = router