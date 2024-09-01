const { DataTypes } = require("sequelize");
const sequelize = require("../config/pgConfig");

const userModel = sequelize.define('userstable', {
    id:
    {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },

    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profilePicture: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    verified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    tableName: 'userstable' // Explicitly set the table name
})
module.exports = userModel