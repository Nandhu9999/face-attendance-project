const dbModule = require('./src/db/mydb'); 
const db = dbModule.getDb()
const fs = require('fs/promises');
const path = require('path');

async function removeFiles(dirPath){
  try {
    const files = await fs.readdir(path.join(__dirname, dirPath));

    const deleteFilePromises = files.map(file =>
      fs.unlink(path.join(__dirname,dirPath, file)),
    );

    await Promise.all(deleteFilePromises);
  } catch (err) {
    console.log(err);
  }
}

async function removeOneFile(fpath){
  try {
    fs.unlink(path.join(__dirname,fpath))
  } catch (err) {
    console.log(err);
  }
}


async function drop(){
	let tables = ['Students','Accounts','MistakenLogs','Visits','Guests']
	console.log(tables)
	
	tables.forEach((table)=>{
		let sql = 'DROP TABLE ' + table;
		try{db.query(sql, [])}
		catch(err){console.log(`error when dropping {table}`,err)}
	})
	console.log("Ctrl + C to end SQL connection..")
}


console.log("RESETING DATABASE AND IMAGES")
removeFiles("/cnn_model/face-images/")
removeFiles("/cnn_model/guest-images/")
removeOneFile("/cnn_model/MODEL.pickle")
removeOneFile("/cnn_model/GUEST_MODEL.pickle")
drop()
