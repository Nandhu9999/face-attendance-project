const jwt = require("jsonwebtoken");
// const {models} = require('../db')
const dbModule = require('../db/mydb'); 
const db = dbModule.getDb()

const userAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // const sql = "SELECT * FROM Accounts WHERE name = ?"
        // const [user,err] = await db.query(sql,[decoded.name])
        let user = undefined
        if(decoded.name == process.env.ADMIN_NAME){
            user = {name:"admin"}
        }
        // const user = await models.user.findOne({
        //     where: {
        //         username: decoded.username,
        //     },
        // });

        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({error: "Please authenticate."});
    }
}

module.exports = {userAuth};
