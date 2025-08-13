const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  seats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  ],
  timing: {
    type: Date,
    required: true,
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;