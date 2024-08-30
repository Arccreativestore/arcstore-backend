const express = require("express")
const cors = require('cors')
const passport = require('passport')
const passportAuth = require("./services/Auth/OauthServices.js")
const app = express()
const logger = require('./config/logger.js')


//middlewares
app.use(cors())
app.use(express.json())
app.use(passport.initialize())
passportAuth()
app.use((req, res, next) => {
    logger.info(`HTTP ${req.method} ${req.url}`);
    next();
});



// Routes
const registerRouter = require("./src/routes/auth/registerRoute.js")
const loginRouter = require("./src/routes/auth/loginRoute.js")
const verifyMailrouter = require("./src/routes/auth/verifyMail.js")
const oAuthrouter = require("./src/routes/auth/oauthRoute.js")
const oauthCallbackrouter = require("./src/routes/auth/oauthCallback.js")



// route handlers
app.use('/api/v1/register', registerRouter)
app.use('/api/v1/login', loginRouter)
app.use('/verify', verifyMailrouter)
app.use('/api/v1/auth/google', oAuthrouter)
app.use('/api/v1/auth/google/callback', oauthCallbackrouter)







// Error-handling middleware
app.use((err, req, res, next) => {
    logger.error(`universal error: ${err}`);
    const statusCode = err.statusCode || 500;
    const message = err.isOperational ? err.message : 'Internal Server Error';
    res.status(statusCode).json({ status: 'error', data: {}, message });
});



module.exports = app