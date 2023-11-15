const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    console.log("STUDENTS DATABASE MODEL")
    sequelize.define('students', {   
        student_rollno: {
            type: DataTypes.STRING(50),
            allowNull: false,
            primaryKey : true,
            unique: true,
        },
        student_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        pfp_path: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue:""
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