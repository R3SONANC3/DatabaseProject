const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getConnector, initMySQL } = require('../config');
const { JWT_SECRET } = process.env;

const router = express.Router();

router.post('/register', async (req, res) => {
  const connection = await getConnector().getConnection();
  try {
    const { email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const userData = { email, password: passwordHash, role: 'user' };
    await connection.beginTransaction();

    await connection.query('INSERT INTO users SET ?', [userData]);
    await connection.commit();

    res.json({ message: "Register Success" });
  } catch (error) {
    console.error('Error registering user:', error);
    await connection.rollback();
    res.status(500).json({ message: "Register failed", error });
  } finally {
    connection.release();
  }
});

router.post('/login', async (req, res) => {
  try {
    const connector = await getConnector();
    const { email, password } = req.body;
    const [results] = await connector.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({ message: "Login Failed (Incorrect Email or Password)" });
    }

    const userData = results[0];
    const match = await bcrypt.compare(password, userData.password);

    if (!match) {
      return res.status(400).json({ message: "Login Failed (Incorrect Email or Password)" });
    }

    const token = jwt.sign({ email, role: userData.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: "Login successful!", token });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

router.get('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

router.post('/resetPassword', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email and newPassword are required" });
  }

  let connection; // Define connection variable outside the try-catch block

  try {
    connection = await getConnector().getConnection();

    const [userResults] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    await connection.beginTransaction();
    await connection.query('UPDATE users SET password = ? WHERE id = ?', [newPasswordHash, user.id]);
    await connection.commit();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error('Error resetting password:', error);
    if (connection) {
      await connection.rollback(); // Rollback transaction on error
      connection.release(); // Release connection
    }
    res.status(500).json({ message: "Password reset failed", error: error.message });
  } finally {
    if (connection) {
      connection.release(); // Always release connection in finally block
    }
  }
});



module.exports = router;