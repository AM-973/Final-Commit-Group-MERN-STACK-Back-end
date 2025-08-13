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

const seatSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      max: 35,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  }
)

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
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
    seats: {
      type: [seatSchema],
      default: function() {
        const defaultSeats = []
        for (let seat = 1; seat <= 35; seat++) {
          defaultSeats.push({
            number: seat,
            isAvailable: true,
            bookedBy: null
          })
        }
        return defaultSeats
      }
    },
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


module.exports = Movie