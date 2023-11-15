const {DataTypes}   = require('sequelize')

module.exports = (sequelize) => {
    sequelize.define('guest', {
        visit_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        pointofcontact: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        purpose: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        reviewed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    });
};

