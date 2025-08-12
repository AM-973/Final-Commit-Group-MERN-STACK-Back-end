const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: Object,
      required: true,
    },
    creationdate: {
      type: Date,
      default: Date.now,
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    currentSeats: {
      type: Object,
    },
    rating: {
      type: Number,
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