const app = require("./app");
const sequelize = require("./config/pgConfig.js");
const userModel = require("./models/authModel.js");
const env = require('dotenv').config()


sequelize.authenticate()
    .then(async () => {
       await sequelize.sync({ force: true })

        console.log('connected to DB')
        app.listen(`${process.env.PORT}`, () => {
            console.log(`server running on port ${process.env.PORT} `)
        })
    })
    .catch((e) => {
        console.log("error connecting to DB")
        console.log(e.message)
    })