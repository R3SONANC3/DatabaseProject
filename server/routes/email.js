const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config');

router.get('/category', async (req, res) => {
  try {
    const categories = await executeQuery('SELECT * FROM Categories');
    res.json({ success: true, categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories.' });
  }
});

router.get('/search', async (req, res) => {
  const {
    q,
    category,
    dateFrom,
    dateTo,
    sender,
    recipient,
    size,
    page = 1,
    limit = 10
  } = req.query;

  // Ensure page and limit are numbers and calculate offset
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const offset = (pageNum - 1) * limitNum;

  // Base query for total count
  let countQuery = `SELECT COUNT(*) as total FROM Emails e WHERE 1=1`;

  // Base query for fetching emails
  let query = `
    SELECT e.*, c.categoryName 
    FROM Emails e 
    LEFT JOIN Categories c ON e.CategoryID = c.categoryID 
    WHERE 1=1
  `;

  const params = [];
  const countParams = [];

  // Add search conditions
  if (q && q.trim()) {
    const searchCondition = ` AND (e.message LIKE ? OR e.senderEmail LIKE ? OR e.recipientEmail LIKE ?)`;
    query += searchCondition;
    countQuery += searchCondition;
    const searchValue = `%${q.trim()}%`;
    params.push(searchValue, searchValue, searchValue);
    countParams.push(searchValue, searchValue, searchValue);
  }

  if (category && category !== '') {
    const condition = ` AND e.CategoryID = ?`;
    query += condition;
    countQuery += condition;
    // Convert category to number and validate
    const categoryId = parseInt(category);
    if (!isNaN(categoryId)) {
      params.push(categoryId);
      countParams.push(categoryId);
    }
  }

  if (dateFrom && dateFrom !== '') {
    const condition = ` AND e.date >= ?`;
    query += condition;
    countQuery += condition;
    params.push(dateFrom);
    countParams.push(dateFrom);
  }

  if (dateTo && dateTo !== '') {
    const condition = ` AND e.date <= ?`;
    query += condition;
    countQuery += condition;
    params.push(dateTo);
    countParams.push(dateTo);
  }

  if (sender && sender.trim()) {
    const condition = ` AND e.senderEmail LIKE ?`;
    query += condition;
    countQuery += condition;
    params.push(`%${sender.trim()}%`);
    countParams.push(`%${sender.trim()}%`);
  }

  if (recipient && recipient.trim()) {
    const condition = ` AND e.recipientEmail LIKE ?`;
    query += condition;
    countQuery += condition;
    params.push(`%${recipient.trim()}%`);
    countParams.push(`%${recipient.trim()}%`);
  }

  if (size && size !== '') {
    const condition = ` AND e.size >= ?`;
    query += condition;
    countQuery += condition;
    const sizeNum = parseInt(size);
    if (!isNaN(sizeNum)) {
      params.push(sizeNum);
      countParams.push(sizeNum);
    }
  }

  try {
    // Get total count first
    const [countResult] = await executeQuery(countQuery, countParams);
    const total = countResult.total;

    // Add ORDER BY and LIMIT clause after getting count
    query += ` ORDER BY e.date DESC LIMIT ${limitNum} OFFSET ${offset}`;

    // Get paginated results
    const emails = await executeQuery(query, params);

    res.json({
      success: true,
      emails,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    console.error('Error searching emails:', error);
    console.error('Query:', query);
    console.error('Params:', params);
    res.status(500).json({
      success: false,
      message: 'Failed to search emails.',
      error: error.message
    });
  }
});

router.post('/insert', async (req, res) => {
  const { messageId, senderEmail, recipientEmail, message, size, categoryID, date } = req.body;
  console.log(req.body);
  // Basic validation
  if (!messageId || !senderEmail || !recipientEmail || !message || !size || !categoryID || !date) {
      return res.status(400).json({
          success: false,
          message: 'All fields are required.'
      });
  }

  try {
      // Insert email into the database
      const result = await executeQuery(
          `INSERT INTO Emails (messageId, senderEmail, recipientEmail, message, size, CategoryID, date) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`, 
          [messageId, senderEmail, recipientEmail, message, size, categoryID, date]
      );

      if (result.affectedRows > 0) {
          return res.json({
              success: true,
              message: 'Email added successfully.',
              emailId: result.insertId, // Return the ID of the inserted email
          });
      } else {
          throw new Error('Failed to add email');
      }
  } catch (error) {
      console.error('Error adding email:', error);
      res.status(500).json({
          success: false,
          message: 'Failed to add email.',
          error: error.message
      });
  }
});

module.exports = router;