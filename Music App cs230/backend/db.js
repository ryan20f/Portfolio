const mysql = require('mysql2');

// Create a connection pool to the MySQL database
const connection = mysql.createPool({
  host: 'webcourse.cs.nuim.ie', // or your MySQL host
  user: 'u240211',      // your MySQL username
  password: 'ieJah5ieng6jieho',      // your MySQL password
  database: 'cs230_u240211',  // your database name
});

module.exports = connection;