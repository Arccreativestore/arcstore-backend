const app = require("./app");
const logger = require("./config/logger.js");
const sequelize = require("./config/pgConfig.js");
const userModel = require("./models/authModel.js");
const env = require('dotenv').config()


sequelize.authenticate()
    .then(async () => {
      // await sequelize.sync({ force: true })

        console.log('connected to DB')
        app.listen(`${process.env.PORT}`, () => {
            console.log(`server running on port ${process.env.PORT} `)
        })
    })
    .catch((e) => {
        logger.error(`Error connecting to DB : ${e.message}`)
    })