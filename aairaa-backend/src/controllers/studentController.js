// const { models } = require('../db')
const dbModule = require('../db/mydb'); 
const db = dbModule.getDb()
const path = require('path')
const multer = require('multer');
const { spawn } = require('child_process');
const { upload } = require("./imageController")

const attendanceList = async (req,res) => {
  let findsql = 'SELECT rollno, name, last_attended, last_exited FROM Students'
  try{
    const [result,err] = await db.query(findsql, [])
    return res.status(200).json({status:"success", list:result})
  }
  catch(err){
    return res.status(200).json({status:"error"})
  }
}

const checkStudent = async (req, res) => {
  upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) { console.log(err); return res.status(500).json(err)
      } else if (err) { console.log(err); return res.status(500).json(err) }
      
      console.log(">>", req.file)
      const pythonProgram = spawn(process.env.PYTHON, [path.join(process.cwd(),'/cnn_model/faceDetect.py'), req.file.path]);
      
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

const checkStudentConfirmed = async (req, res) => {
  const {incorrect_rollno , correct_rollno} = req.body;
  console.log(incorrect_rollno, correct_rollno)
  // update last attended
  let sql = 'UPDATE Students SET last_attended=? WHERE rollno=?'
  try{const [result,err] = await db.query(sql, [Date.now(), correct_rollno])}
  catch(err){console.log("error when finding student...",err);
  return res.json({status:"error"})}


  // update mistaken logs
  if(incorrect_rollno != correct_rollno){
    let mistaken_sql = 'INSERT INTO MistakenLogs (timestamp, incorrect_rollno, correct_rollno) VALUES (?, ?, ?)'
    try{const [result,err] = await db.query(mistaken_sql, [Date.now(), incorrect_rollno, correct_rollno])}
    catch(err){console.log("error when inserting into mistakenlogs...",err);
    return res.json({status:"error"})}
  }
  return res.json({status:"success"})
}

const checkStudentExit = async (req, res) => {
  const {incorrect_rollno , correct_rollno} = req.body;
  console.log(incorrect_rollno, correct_rollno)
  // update last exited
  let sql = 'UPDATE Students SET last_exited=? WHERE rollno=?'
  try{const [result,err] = await db.query(sql, [Date.now(), correct_rollno])}
  catch(err){console.log("error when finding student...",err);
  return res.json({status:"error"})}


  // update mistaken logs
  if(incorrect_rollno != correct_rollno){
    let mistaken_sql = 'INSERT INTO MistakenLogs (timestamp, incorrect_rollno, correct_rollno) VALUES (?, ?, ?)'
    try{const [result,err] = await db.query(mistaken_sql, [Date.now(), incorrect_rollno, correct_rollno])}
    catch(err){console.log("error when inserting into mistakenlogs...",err);
    return res.json({status:"error"})}
  }

  return res.json({status:"success"})
}



const addStudent = async (req, res) => {
  console.log("➕ add student")
  upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) { console.log(err); return res.status(500).json(err)
      } else if (err) { console.log(err); return res.status(500).json(err) }
    
      // CHECKING IF USER EXISTS OR NOT
      let findsql = 'SELECT * FROM Students WHERE rollno = ?'
      try{
        const [result,err] = await db.query(findsql, [req.body.rollno.toUpperCase()])
        if (result.length > 0){
          return res.status(200).json({status:"error", reason:"Student already exists"})
        }
      }
      catch(err){
        console.log("error when finding student...",err)
      }

      // ADDING USER TO DATABASE
      let sql = 'INSERT INTO Students (rollno, name, image_path, last_attended) VALUES (?, ?, ?, ?)'
      try{
        const [studentResult,err] = await db.query(sql, 
          [req.body.rollno.toUpperCase(), req.body.name.toUpperCase(), req.file.path, Date.now()])
        console.log('New student created');
      }
      catch(err){
        console.log("error when creating student...",err)
      }
      
      // CHECK IF PYTHON WORKS [!] give script path properly
      // const pythonProcess = spawn('python', ['src/controllers/check.py', "arg01", "arg02"]);
      // pythonProcess.stdout.on('data', (data) => {console.log(`Python Script Output: ${data}`);});
      // pythonProcess.stderr.on('data', (data) => {console.error(`Error: ${data}`);});
      // pythonProcess.on('close', (code) => {console.log(`Python Script Exited with Code: ${code}`);});

      // ADDING USER TO CNN MODEL
      const pythonProgram = spawn(process.env.PYTHON, 
        [path.join(process.cwd(),'/cnn_model/faceAdd.py'), req.file.path, req.body.rollno.toUpperCase()]);
      
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

module.exports = {
  attendanceList,
  checkStudent,
  checkStudentConfirmed,
  checkStudentExit,
  addStudent
}
