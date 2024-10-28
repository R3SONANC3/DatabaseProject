const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { getConnector } = require('../config');
const { JWT_SECRET } = process.env;

const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

router.post('/register', async (req, res) => {
  const connection = await getConnector().getConnection();
  try {
    const { email, password, name, role = 'user' } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const userData = { 
      email, 
      password: passwordHash, 
      name,
      role,
      status: 'active',
      created_at: new Date()
    };
    
    await connection.beginTransaction();
    await connection.query('INSERT INTO users SET ?', [userData]);
    await connection.commit();

    res.status(200).json({ message: "Register Success" });
  } catch (error) {
    console.error('Error registering user:', error);
    await connection.rollback();

    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: "This email is already registered." });
    } else {
      res.status(500).json({ message: "Register failed", error });
    }
  } finally {
    connection.release();
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const connector = await getConnector();
    const { email, password } = req.body;
    const [results] = await connector.query(
      'SELECT * FROM users WHERE email = ? AND status = "active"', 
      [email]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: "Login Failed (Incorrect Email or Password)" });
    }

    const userData = results[0];
    const match = await bcrypt.compare(password, userData.password);

    if (!match) {
      return res.status(401).json({ message: "Login Failed (Incorrect Email or Password)" });
    }

    const token = jwt.sign(
      { id: userData.id, email, role: userData.role }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.status(200).json({ 
      message: "Login successful!", 
      token,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const connector = await getConnector();
    const [users] = await connector.query(
      'SELECT id, email, name, role, status, created_at FROM users'
    );
    
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
});

// Update user
router.put('/users/:id', authenticateToken, async (req, res) => {
  const connection = await getConnector().getConnection();
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    const { name, role, status } = req.body;
    
    await connection.beginTransaction();
    
    await connection.query(
      'UPDATE users SET name = ?, role = ?, status = ? WHERE id = ?',
      [name, role, status, id]
    );
    
    await connection.commit();
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error('Error updating user:', error);
    await connection.rollback();
    res.status(500).json({ message: "Failed to update user", error: error.message });
  } finally {
    connection.release();
  }
});

// Delete user
router.delete('/users/:id', authenticateToken, async (req, res) => {
  const connection = await getConnector().getConnection();
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const { id } = req.params;
    
    await connection.beginTransaction();
    await connection.query('DELETE FROM users WHERE id = ?', [id]);
    await connection.commit();
    
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error('Error deleting user:', error);
    await connection.rollback();
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  } finally {
    connection.release();
  }
});

module.exports = router;