const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');  // Import database connection

// Registration function
exports.register = async (req, res) => {
    // Debug log for incoming data
    console.log('📥 Incoming data:', req.body);

    const { username, password, email, address } = req.body;

    // Debug log for individual fields to check data
    console.log('🔍 username:', username);
    console.log('🔍 password:', password);
    console.log('🔍 email:', email);
    console.log('🔍 address:', address);

    // Validate required fields
    if (!username || !password || !email || !address) {
        console.log('❌ Missing required field');
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
        console.log('❌ Invalid email format');
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 8) {
        console.log('❌ Password too short');
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    try {
        // Check if username already exists
        const [existingUser] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);

        if (existingUser.length > 0) {
            console.log('❌ Username already taken');
            return res.status(400).json({ error: 'Username already taken' });
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        console.log('💾 Inserting new user...');
        const [result] = await db.query(
            'INSERT INTO Users (username, password, email, address) VALUES (?, ?, ?, ?)',
            [username, hashedPassword, email, address]
        );

        // Respond with success
        console.log('✅ Registration successful!');
        res.status(201).json({
            message: 'User registered successfully',
            userId: result.insertId,
        });

    } catch (err) {
        console.error('❌ Server error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// Login user
exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const [rows] = await db.query('SELECT * FROM Users WHERE username = ?', [username]);
  
      if (!rows.length) {
        return res.status(401).json({ error: 'User not found' });
      }
  
      const valid = await bcrypt.compare(password, rows[0].password);
  
      if (!valid) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      // Create JWT token
      const token = jwt.sign({ userId: rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.json({ token, user: { id: rows[0].id, username: rows[0].username, email: rows[0].email, address: rows[0].address } });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  