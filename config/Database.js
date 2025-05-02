import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create Sequelize instance using environment variables directly
const db = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    // Add connection pool settings
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    // Increase timeout settings
    dialectOptions: {
      connectTimeout: 60000,
    },
    // Add logging control
    logging: process.env.NODE_ENV === "production" ? false : console.log,
    // Retry logic
    retry: {
      max: 3,
      match: [/Deadlock/i, /ETIMEDOUT/]
    }
  }
);

// Improved connection testing
const testConnection = async () => {
  try {
    await db.authenticate();
    console.log("Database connection established successfully.");
    console.log(`Connected to: ${process.env.DB_NAME} on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
    return true;
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    if (error.parent) {
      console.error("Connection error details:", {
        code: error.parent.code,
        errno: error.parent.errno,
        syscall: error.parent.syscall,
        address: error.parent.address,
        port: error.parent.port
      });
      
      // Check if environment variables are properly set
      if (!process.env.DB_NAME || !process.env.DB_HOST) {
        console.error("\nEnvironment variables not set properly:");
        console.error("Make sure your .env file contains all required database settings");
        console.error("Required variables: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT");
      }
      
      // Provide helpful troubleshooting tips based on error
      if (error.parent.code === 'ETIMEDOUT') {
        console.error("\nTroubleshooting tips for ETIMEDOUT:");
        console.error(`1. Verify MySQL server is running`);
        console.error(`2. Check if MySQL is accessible at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.error("3. Ensure firewall isn't blocking the connection");
        console.error("4. Try increasing connection timeout settings");
      } else if (error.parent.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error("\nTroubleshooting tips for ACCESS DENIED:");
        console.error("1. Verify username and password are correct in your .env file");
        console.error(`2. Ensure user '${process.env.DB_USER}' has correct privileges`);
      } else if (error.parent.code === 'ECONNREFUSED') {
        console.error("\nTroubleshooting tips for CONNECTION REFUSED:");
        console.error(`1. Check if MySQL is running on ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.error(`2. Verify host is reachable (try ping ${process.env.DB_HOST})`);
      }
    }
    return false;
  }
};

// Export both the database instance and connection test function
export { testConnection };
export default db;
