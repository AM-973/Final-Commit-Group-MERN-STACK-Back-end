const express = require('express')
const Review = require('../models/review.js')
const router = express.Router()
router.post("/reviews",async (req, res) => {
  try {
    req.body.owner = req.user._id
    const review = await Review.create({ ...req.body })
    res.send(review)
    res.status(200).json(review)
  } catch (error) {
    res.status(500).json(error)
  }
})