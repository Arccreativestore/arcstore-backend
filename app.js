//
const express = require("express")
const cors = require('cors')
const registerRouter = require("./src/routes/registerRoute.js")
const app = express()
app.use(express.json())



// middleware
app.use(cors())
app.use('/api/v1/register', registerRouter)










module.exports = app