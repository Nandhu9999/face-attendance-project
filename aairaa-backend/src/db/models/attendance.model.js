const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    sequelize.define('attendance', {
        roll_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
            primaryKey: true,
        },
    });
};


