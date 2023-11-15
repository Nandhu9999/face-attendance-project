// const {models} = require('../db')
const dbModule = require('../db/mydb'); 
const db = dbModule.getDb()

const multer = require('multer');
const { spawn } = require('child_process');
const { upload2 } = require("./imageController")
const path = require('path')

const jwt = require('jsonwebtoken')
const {comparePassword} = require('../utils/utils')

const userLogin = async (req, res) => {
        const {username, password} = req.body;
        console.log("Username ",username)
        console.log("Password ",password)

        // const user = await models.user.findOne({
        //     where: {
        //         username: username,
        //     },
        // }).then(async (user) => {
        //         console.log("User ",user)
        //         if (user) {
        //             const isValid = await comparePassword(password,user.dataValues.password)
        //             if (isValid) {
        //                 return user
        //             } else {
        //                 return null
        //             }
        //         } else {
        //             return null
        //         }
        // })
        let user = undefined
        if (username == process.env.ADMIN_NAME && password == process.env.ADMIN_PASS){
            user = {
                name: "admin"
            }
        } 
        if(user){
            const token = jwt.sign({name: user.name}, process.env.JWT_SECRET,{expiresIn: '14d'});
            res.send({token: token,message:"Login Successfull"});
        }else{
            res.status(401).send({error: "Invalid username/password"});
        }
}


const guestSubmit = async (req, res) => {

    console.log("[*] add guest")
    upload2(req, res, async (err) => {
        if (err instanceof multer.MulterError) { console.log(err); return res.status(500).json(err)
        } else if (err) { console.log(err); return res.status(500).json(err) }
      
      	// console.log(">>", req.file)
      	// console.log(">>", req.body)
      	
        // CHECKING IF USER EXISTS OR NOT
        let findsql = 'SELECT * FROM Guests WHERE name = ?'
        try{
          const [result,err] = await db.query(findsql, [req.body.name.toUpperCase()])
          console.log(result,result.length)
          if (result.length > 0){
          	console.log("error bruh")
            return res.json({status:"error", reason:"Guest name already exists"})
          }
        }
        catch(err){
          console.log("error when finding guest...",err)
        }

        // ADDING USER TO DATABASE
        const randId = Math.floor(Math.random() * 1_000_000 )
        let sql = 'INSERT INTO Guests (gid, name, purpose, poc, contact, image_path) VALUES (?, ?, ?, ?, ?, ?)'
        try{
          const [guestResult,err] = await db.query(sql, 
            [randId, req.body.name.toUpperCase(), req.body.purpose, req.body.poc, req.body.contact, req.file.path])
          console.log('New guest created');
        }
        catch(err){
          console.log("error when creating guest...",err)
        }
        
        // ADDING USER TO CNN MODEL
        const pythonProgram = spawn(process.env.PYTHON, [ path.join(process.cwd(), '/cnn_model/guestAdd.py' ), req.file.path, req.body.name ]);
        
        pythonProgram.stdout.on('data', function(data) {
            const pydata = data.toString();
            // console.log("PYDATA:",pydata)
            output = JSON.parse(pydata);
            console.log("OUTPUT:",output)
            return res.status(200).json({status:"success", output:output})
          });
          pythonProgram.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
            return res.status(200).json({status:"error", reason: data})
          });
          pythonProgram.on('close', (code) => {
            console.log(`Python Script Exited with Code: ${code}`);
            // return res.status(200).json({status:"success", reason:"python script closed"})
        });
    })
}


const checkGuest = async (req, res) => {
  upload2(req, res, async (err) => {
      if (err instanceof multer.MulterError) { console.log(err); return res.status(500).json(err)
      } else if (err) { console.log(err); return res.status(500).json(err) }
      
      console.log(">>", req.file)
      const pythonProgram = spawn(process.env.PYTHON, [path.join(process.cwd(),'/cnn_model/guestDetect.py'), req.file.path]);
      
      let output;
      pythonProgram.stdout.on('data', function(data) {
          const pydata = data.toString();
          output = JSON.parse(pydata);
          return res.status(200).json({status:"success", output:output})
      });
	  pythonProgram.stderr.on('data', (data) => {
		 console.error(`Error: ${data}`);
		 return res.status(200).json({status:"error", reason: data})
	  });
	  pythonProgram.on('close', (code) => {
		console.log(`Python Script Exited with Code: ${code}`);
		// return res.status(200).json({status:"success", reason:"python script closed"})
	  });
  
  })
}

const newPurpose = async (req, res) => {
  const {name , purpose} = req.body;
  console.log(name , purpose)
  let gid;
  
  let findsql = 'SELECT * FROM Guests WHERE name = ?'
  try{
    const [result,err] = await db.query(findsql, [name])
    if (result.length == 0){
      return res.status(200).json({status:"error", reason:"Guest does not exist"})
    }
    gid = result[0].gid
  }
  catch(err){
    console.log("error when finding guest...",err)
  }
  
  
  let sql = 'INSERT INTO Visits (gid, purpose) VALUES (?, ?)'
  try{
    const [result,err] = await db.query(sql, [gid, purpose])
    return res.json({status:"success"})
  }
  catch(err){
    console.log("error when finding guest...",err)
    return res.json({status:"error"})
  }
	
}


const getGuests = async (req, res) => {
    let sql = 'SELECT * FROM Guests'
    try{
        const [guestResult,err] = await db.query(sql, [])
        return res.json({status:"success",data:guestResult})
    }
    catch(err){
        console.log("error when creating guest...",err)
        return res.json({status:"error"})
    }
}

const userPathCheck = async (req, res) => {
	return res.json({path:__dirname, cwd:process.cwd()})
}

module.exports = {
    userLogin,
    guestSubmit,
    getGuests,
    checkGuest,
    newPurpose
};

