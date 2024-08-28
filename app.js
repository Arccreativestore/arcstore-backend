const express = require("express")
const cors = require('cors')
const app = express()



//middlewares
app.use(cors())
app.use(express.json())

// Routes
const registerRouter = require("./src/routes/registerRoute.js")
const loginRouter = require("./src/routes/loginRoute.js")


// route handlers
app.use('/api/v1/register', registerRouter)
app.use('/api/v1/login', loginRouter)











module.exports = app