const express = require("express")
const cors = require('cors')
const app = express()



//middlewares
app.use(cors())
app.use(express.json())

// Routes
const registerRouter = require("./src/routes/auth/registerRoute.js")
const loginRouter = require("./src/routes/auth/loginRoute.js")
const verifyMailrouter = require("./src/routes/auth/verifyMail.js")


// route handlers
app.use('/api/v1/register', registerRouter)
app.use('/api/v1/login', loginRouter)
app.use('/verify', verifyMailrouter)











module.exports = app