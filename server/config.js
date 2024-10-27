require('dotenv').config();
const mysql = require('mysql2/promise');

const {
  JWT_SECRET,
  DB_HOST,
  DB_USER,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT
} = process.env;

const SQL_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

let connector;

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000; // in milliseconds

const initMySQL = async (retries = MAX_RETRIES) => {
  try {
    connector = await mysql.createPool({
      uri: SQL_URL,
      waitForConnections: true,
      connectionLimit: 10, // Adjust as needed
      queueLimit: 0
    });
    console.log('Connected to database successfully!');
  } catch (error) {
    if (retries > 0) {
      console.error(`Error connecting to MySQL. Retrying in ${RETRY_INTERVAL / 1000} seconds... (${retries} retries left)`, error);
      setTimeout(() => initMySQL(retries - 1), RETRY_INTERVAL);
    } else {
      console.error('Failed to connect to MySQL after multiple attempts:', error);
      throw error;
    }
  }
};

const getConnector = () => {
  if (!connector) {
    throw new Error('MySQL not initialized');
  }
  return connector;
};

async function executeQuery(sql, params) {
  try {
    const [results] = await connector.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  }
}
module.exports = {
  JWT_SECRET,
  initMySQL,
  getConnector,
  executeQuery
};