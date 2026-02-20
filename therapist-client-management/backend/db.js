const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'webcourse.cs.nuim.ie',    // Your DB host
  user: 'u240211',                 // Your DB user
  password: 'ieJah5ieng6jieho',    // Your DB password
  database: 'cs230_u240211',       // Your DB name
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected!');
    connection.release();
  }
});

module.exports = pool.promise();