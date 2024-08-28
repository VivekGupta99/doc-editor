const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
const router = express.Router()

const SECRET_KEY = 'secretKey'

// Register route 
router.post("/register", async (req, res) => {
  const { username, password } = req.body
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await User.create({ username, password: hashedPassword })
    res.status(201).json({ message: "User created successfully" })
  } catch (error) {
    res.status(400).json({ message: "Error creating user" })
  }
})

// Login route
router.post("/login", async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: "1h" })
  res.json({ token })
})

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]
  if (!token) return res.sendStatus(401)

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

module.exports = { router, authenticateToken }
