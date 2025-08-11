const express = require('express')
const verifyToken = require('../middleware/verify-token.js')
const User = require('../models/user.js')
const router = express.Router()

// ========== Public Routes ==========

router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})

router.put('/profile', verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true }
    )
    res.status(200).json(updatedUser)
  } catch (error) {
    res.status(500).json(error)
  }
})


router.get('/tickets', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    res.status(200).json({
      userId: user._id,
      userName: user.name,
      ticketCount: user.ticket || 0,
      message: user.ticket ? `You have ${user.ticket} tickets` : "No tickets found"
    })
  } catch (error) {
    res.status(500).json(error)
  }
})

module.exports = router