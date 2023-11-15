const router = require('express').Router();
const dbModule = require('../db/mydb'); 
const db = dbModule.getDb();

const {userAuth} = require('../middleware/middleware');
const {uploadImage,deleteImage,getallImages} = require('../controllers/imageController');

const {userLogin,guestSubmit,getGuests, checkGuest, newPurpose} = require('../controllers/userController');
const {attendanceList, checkStudent, addStudent, checkStudentConfirmed,checkStudentExit} = require("../controllers/studentController")

router.post('/api/user/login',userLogin);
router.get('/api/user/auth',userAuth,async (req,res)=>{
    res.json({
        success: true,
        message: "User Authenticated",
    })
});

router.get('/api/list',async(req,res)=>{
    let sql = 'SELECT name FROM Students'
    const [result,err] = await db.query(sql)
    return res.json(result)
});

router.post('/api/user/guestSubmit',guestSubmit);
router.get('/api/user/getGuests',getGuests);
router.post('/api/user/checkGuest',checkGuest);
router.post('/api/user/newPurpose',newPurpose);

router.get("/api/student/attendanceList", attendanceList);
router.post('/api/student/checkStudent',checkStudent);
router.post('/api/student/checkStudentConfirmed',checkStudentConfirmed);
router.post('/api/student/checkStudentExit',checkStudentExit);
router.post('/api/student/addStudent',addStudent);

router.post('/api/image/upload',uploadImage);
router.post('/api/image/delete',deleteImage);
router.get('/api/image/getall',getallImages);

module.exports = router;
