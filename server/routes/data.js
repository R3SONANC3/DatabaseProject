const express = require("express");
const { getConnector, executeQuery } = require('../config');
const { verifyUser } = require('../middleware');
const router = express.Router();
const {
  formatDateToMySQLDateTime,
  validateTimeFilter,
  getStartDate
} = require('../services/filterDate');

async function getEmailsByCategory() {
  const sql = `
      SELECT 
        c.categoryName,
        COUNT(e.emailID) as emailCount,
        SUM(e.size) as totalSize
      FROM Categories c
      LEFT JOIN Emails e ON c.categoryID = e.CategoryID
      GROUP BY c.categoryID, c.categoryName
      ORDER BY emailCount DESC
    `;
  return await executeQuery(sql, []);
}

async function getEmailsInCategory(categoryId) {
  const sql = `
      SELECT 
        e.emailID,
        e.messageID,
        e.date,
        e.senderEmail,
        e.recipientEmail,
        e.size,
        c.categoryName
      FROM Emails e
      JOIN Categories c ON e.CategoryID = c.categoryID
      WHERE c.categoryID = ?
      ORDER BY e.date DESC
    `;
  return await executeQuery(sql, [categoryId]);
}

async function getEmailsBySenderInCategory(categoryId) {
  const sql = `
      SELECT 
        e.senderEmail,
        COUNT(e.emailID) as emailCount,
        SUM(e.size) as totalSize,
        MIN(e.date) as firstEmail,
        MAX(e.date) as lastEmail
      FROM Emails e
      WHERE e.CategoryID = ?
      GROUP BY e.senderEmail
      ORDER BY emailCount DESC
    `;
  return await executeQuery(sql, [categoryId]);
}

async function getEmailTimeAnalysis(categoryId) {
  const sql = `
      SELECT 
        DATE_FORMAT(date, '%Y-%m') as month,
        COUNT(emailID) as emailCount,
        SUM(size) as totalSize
      FROM Emails
      WHERE CategoryID = ?
      GROUP BY DATE_FORMAT(date, '%Y-%m')
      ORDER BY month DESC
    `;
  return await executeQuery(sql, [categoryId]);
}


router.get('/categoryData', verifyUser, (req, res) => {
  const handleStatus = async () => {
    let connection;
    try {
      const userEmail = req.user.email;

      connection = await getConnector().getConnection();
      const query = `
            SELECT 
                c.categoryName,
                COUNT(*) as totalEmails,
                SUM(CASE WHEN e.senderEmail = ? THEN 1 ELSE 0 END) as sentEmails,
                SUM(CASE WHEN e.recipientEmail = ? THEN 1 ELSE 0 END) as receivedEmails
            FROM 
                Emails e
            JOIN
                Categories c ON e.CategoryID = c.categoryID
            WHERE 
                e.senderEmail = ? OR 
                e.recipientEmail = ?
            GROUP BY
                c.categoryName;
            `;

      const [results] = await connection.query(query, [userEmail, userEmail, userEmail, userEmail]);
      res.json(results);

    } catch (err) {
      console.error('Error fetching data:', err.message);
      res.status(500).json({
        error: 'Database query failed'
      });
    } finally {
      if (connection) {
        connection.release();
      }
    }
  };

  handleStatus().catch(err => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      error: 'Internal server error'
    });
  });
});

router.get('/emailVolume', verifyUser, async (req, res) => {
  let connection;
  try {
    const userEmail = req.user.email;
    const timeFilter = req.query.timeFilter || '7d';

    const startDate = getStartDate(timeFilter);

    connection = await getConnector().getConnection();
    const query = `
        SELECT 
            DATE(e.date) as date,
            COUNT(*) as totalEmails,
            SUM(CASE WHEN e.senderEmail = ? THEN 1 ELSE 0 END) as sentEmails,
            SUM(CASE WHEN e.recipientEmail = ? THEN 1 ELSE 0 END) as receivedEmails,
            SUM(e.size) as totalSize,
            AVG(e.size) as averageSize
        FROM 
            Emails e
        WHERE 
            (e.senderEmail = ? OR e.recipientEmail = ?)
            AND e.date >= ?
        GROUP BY 
            DATE(e.date)
        ORDER BY 
            date ASC
        `;

    const [results] = await connection.query(query, [
      userEmail,  // for sent emails count
      userEmail,  // for received emails count
      userEmail,  // for sender filter
      userEmail,  // for recipient filter
      startDate   // for date filter
    ]);
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err.message);
    res.status(500).json({
      error: 'Database query failed'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

router.get('/analytics/overview', async (req, res) => {
  try {
    const result = await getEmailsByCategory();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch email analytics'
    });
  }
});

router.get('/analytics/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    const emails = await getEmailsInCategory(categoryId);
    const senderAnalysis = await getEmailsBySenderInCategory(categoryId);
    const timeAnalysis = await getEmailTimeAnalysis(categoryId);

    res.json({
      success: true,
      data: {
        emails,
        senderAnalysis,
        timeAnalysis
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch category details'
    });
  }
});




module.exports = router;