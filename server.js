/* eslint-disable no-console */
const dotenv = require('dotenv')

dotenv.config()
const express = require('express')

const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const logger = require('morgan')

// Controllers
const testJwtRouter = require('./controllers/test-jwt')
const authRouter = require('./controllers/auth')
const userRouter = require('./controllers/users')
const moviesRouter = require('./controllers/movies')

// Middleware
const verifyToken = require('./middleware/verify-token')

// DB Connection
mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on('connected', () => {
	console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

// MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(logger('dev'))

// PUBLIC ROUTES
app.use('/auth', authRouter)
app.use('/test-jwt', testJwtRouter)

// PROTECTED ROUTES
app.use('/users', verifyToken, userRouter)
app.use('/movies', moviesRouter)



app.listen(PORT, () => {
	console.log(`The express app is ready on port 3000`)
})

