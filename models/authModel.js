const { DataTypes } = require("sequelize");
const sequelize = require("../config/pgConfig");

const userModel = sequelize.define('userstable', {
    
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
 
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.STRING,
        defaultValue: null
    }

},{
    tableName: 'userstable' // Explicitly set the table name
  })
module.exports = userModel