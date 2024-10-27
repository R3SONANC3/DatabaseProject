const cors = require('cors');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const allowedOrigins = [
    "http://localhost:3000",
    "https://field-ex.vercel.app",
    "http://localhost:5173",
    "https://database-project-bice.vercel.app"
];

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
  

const verifyUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = {
            email: decoded.email,
            role: decoded.role
        };
        next();
    });
};

module.exports = {
    corsOptions,
    verifyUser
};