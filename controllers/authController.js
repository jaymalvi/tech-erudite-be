const db = require('../db');
const bcrypt = require('bcryptjs');
const sendEmail = require('../services/sendEmail');

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.registerUser = (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  const code = generateCode();

  const checkQuery = 'SELECT role FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).send('Server error');

    if (results.length > 0) {
      // Email exists, send custom message
      const existingRole = results[0].role;
      return res.status(400).send(`You are already registered with the role ${existingRole}`);
    }

  const query = 'INSERT INTO users (first_name, last_name, email, password, role, verification_code) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [firstName, lastName, email, hashed, role, code], async (err) => {
    if (err) return res.status(400).send('Email already exists');
    await sendEmail(email, code);
    res.send('Registration successful. Check your email for verification code.');
  });
});
};

exports.verifyEmail = (req, res) => {
  const { email, code } = req.body;
  db.query('SELECT * FROM users WHERE email = ? AND verification_code = ?', [email, code], (err, result) => {
    if (result.length === 0) return res.status(400).send('Invalid code');
    db.query('UPDATE users SET is_verified = 1 WHERE email = ?', [email]);
    res.send('Email verified successfully');
  });
};

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (result.length === 0) return res.status(400).send("Invalid email");

    const user = result[0];
    if (!user.is_verified) return res.status(403).send("Email not verified");
    if (user.role !== 'admin') return res.status(403).send("You are not allowed to login from here");

    const validPass = bcrypt.compareSync(password, user.password);
    if (!validPass) return res.status(400).send("Incorrect password");

    res.send("Login successful");
  });
};
