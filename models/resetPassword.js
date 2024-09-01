const { DataTypes } = require("sequelize");
const sequelize = require("../config/pgConfig");
const userModel = require("./authModel");


const rPasswordModel = sequelize.define('resetpassword', {

    user_email:
    {
        type: DataTypes.STRING,
        references:
        {
            model: userModel,
            key: 'email'
        },
        allowNull: false
    },
    token: 
    {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiredAt:
    {
        type: DataTypes.DATE,
        allowNull: false
    }
},
{
    tableName: 'resetpassword'
})

module.exports = rPasswordModel