const express = require("express");
const { getConnector } = require('../config');

const router = express.Router();

router.get('/users', async (req, res) => {
    const connection = await getConnector().getConnection();
    try {
        const query = `
            SELECT email, role  
            FROM users
        `
        const [result] = await connection.query(query);
        res.status(200).json(result);
    } catch (err) {
        console.error('Error fetching data:', err.message);  // Log the error message
        return res.status(500).json({ error: 'Database query failed' });
    } finally {
        // Release the connection back to the pool
        if (connection) {
            connection.release();
        }
    }
})


module.exports = router;