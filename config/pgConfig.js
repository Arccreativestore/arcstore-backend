const { Client } = require("pg");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('node','postgres', '1234', {
    host: 'localhost',
    dialect: 'postgres'
})
module.exports = sequelize

// const pool = new Client({

//     port: 5432,
//     database: 'postgres',
//     user: 'postgres',
//     password: '1234',
//     host: 'localhost'
// })

// module.exports = pool