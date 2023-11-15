require("dotenv").config();
const mysql = require("mysql2")

const dbConfig = {
  host    :process.env.DB_HOST,
  user    :process.env.DB_USER,
  password:process.env.DB_PASS,
  database:process.env.DB_NAME
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Export a function to get the database object
module.exports = {
  getDb: () => {
    return pool.promise(); // Using promises for queries
  }
};
