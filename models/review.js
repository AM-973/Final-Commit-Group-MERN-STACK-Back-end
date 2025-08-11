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

const Reviews = mongoose.model('Review', reviewSchema)

module.exports = Reviews