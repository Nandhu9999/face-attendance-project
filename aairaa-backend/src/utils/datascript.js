const n_iters = 10;

async function filldata(){
    const { models } = require("../db");
    const { hashPassword } = require("../utils/utils");
    const userData = [];
    const studentData = [];
    for(let i =0;i<n_iters;i++){
        userData.push({
            username: `user${i}`,
            password: await hashPassword(`user${i}`),
            email: `user${i}@cb.amrita.edu`,
        });
        studentData.push({
            student_rollno: `CB.EN.U4CSE2000${i}`,
            student_name: `student${i}`,
            student_password: await hashPassword(`student${i}`),
        });
    }
    try {
        await models.user.bulkCreate(userData);
        await models.student.bulkCreate(studentData);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {filldata};