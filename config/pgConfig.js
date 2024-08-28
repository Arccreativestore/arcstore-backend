const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('node','postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false
})
module.exports = sequelize
