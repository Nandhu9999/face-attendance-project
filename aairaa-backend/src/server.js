require("dotenv").config();
const app = require("express")();
// const sequelize = require("./db");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const PORT = process.env.PORT;
const routes = require("./routes/routes");
// const {filldata} = require("./utils/datascript");
const { spawn } = require('child_process');
// DATABASE
const dbModule = require('./db/mydb'); 
const db = dbModule.getDb()
const path = require('path')

morgan.token("data", (req, res) => {
    return JSON.stringify(req.body);
}); // returns body for logging

//middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data"));

//routes
app.use(routes);

//db
// async function assertDatabaseConnectionOk() {
// 	console.log(`Checking database connection...`);
// 	try {
// 		await sequelize.authenticate();
// 		console.log('Database connection OK!');
// 	} catch (error) {
// 		console.log('Unable to connect to the database:');
// 		console.log(error.message);
// 		process.exit(1);
// 	}
// }

//error handler
const errorHandler = (error, request, response, next) => {
    logger.error(error.message);
    if (error.error.isJoi) {
        res.status(400).json({
        type: err.type,
        message: err.error.toString(),
        });
    }
    if (error.name === "CastError") {
        return response.status(400).send({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

// this has to be the last loaded middleware.
app.use(errorHandler);

async function init() {
	// await assertDatabaseConnectionOk();
    // await sequelize.sync({ force: true});
    // await filldata();
	// console.log(`Starting Sequelize`);

    db.query(`CREATE TABLE IF NOT EXISTS Accounts (email varchar(100), name varchar(100), password varchar(128),PRIMARY KEY (email))`)
    .then(result=>{console.log("Accounts created")})
    .catch(err=>{console.error(err)})

    db.query(`CREATE TABLE IF NOT EXISTS Students (rollno varchar(16), name varchar(100), image_path varchar(128), last_attended real, last_exited real,PRIMARY KEY (rollno))`)
    .then(result=>{console.log("Students created")})
    .catch(err=>{console.error(err)})

    // db.query(`CREATE TABLE IF NOT EXISTS Attendance (rollno varchar(16), last_entered real, last_exited real)`)
    // .then(result=>{console.log("Attendance created")})
    // .catch(err=>{console.error(err)})


    db.query(`CREATE TABLE IF NOT EXISTS MistakenLogs (timestamp real, incorrect_rollno varchar(16), correct_rollno varchar(16))`)
    .then(result=>{console.log("MistakenLogs created")})
    .catch(err=>{console.error(err)})

    db.query(`CREATE TABLE IF NOT EXISTS Guests (gid integer, name varchar(100), purpose varchar(256), poc varchar(100), contact varchar(100), image_path varchar(128),PRIMARY KEY (gid))`)
    .then(result=>{console.log("Guests created")})
    .catch(err=>{console.error(err)})

    db.query(`CREATE TABLE IF NOT EXISTS Visits (gid integer, purpose varchar(256))`)
    .then(result=>{console.log("Guest visits created")})
    .catch(err=>{console.error(err)})

      const pythonProgram = spawn(process.env.PYTHON, [ path.join(process.cwd(), '/cnn_model/faceRecogInit.py') ]);
      
      pythonProgram.stdout.on('data', function(data) {
        const pydata = data.toString();
        console.log("python script status:", pydata);
      });
      pythonProgram.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
      });
      pythonProgram.on('close', (code) => {
        console.log(`Python Script Exited with Code: ${code}`);
	  });


	app.listen(PORT, () => {
		console.log(`Express server started on port ${PORT}.`);
	});
}

init();
