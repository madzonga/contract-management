import fs from 'fs';
import { Sequelize } from 'sequelize';

const dbFile = './database.sqlite3';

async function initDatabase() {
  try {
    // Check if database file exists
    if (!fs.existsSync(dbFile)) {
      console.log(`Creating SQLite database file: ${dbFile}`);
      // Create an empty database file
      fs.writeFileSync(dbFile, '');
    }

    // Initialize Sequelize with SQLite configuration
    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: dbFile
    });

    // Add Sequelize model definitions and synchronization logic here
    // Example:
    // sequelize.define('Profile', { ... });

    // Synchronize models with the database
    await sequelize.sync({ force: true });

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();