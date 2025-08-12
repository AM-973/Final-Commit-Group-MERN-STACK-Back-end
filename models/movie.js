const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },  
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const availableSeatsSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: Number,
      required: true,
      max: 35,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    }
  }
)

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    Summary: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    creationdate: {
      type: Date,
      default: Date.now,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    currentSeats: [availableSeatsSchema],
    category: {
      type: String,
      required: true,
      enum: ['Action', 'Adventure', 'Horror', 'Comedy', 'Romance', 'Science-fiction'],
    },
    reviews: [reviewSchema],
  },
  { timestamps: true }
)

const Movie = mongoose.model('Movie', movieSchema)
const Review = mongoose.model('Review', reviewSchema)
const Seats = mongoose.model('Seats', availableSeatsSchema)


module.exports = Movie, Review, Seats