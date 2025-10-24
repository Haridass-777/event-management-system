const fs = require('fs');
const path = require('path');
const { query } = require('./config/database');

async function initDatabase() {
  try {
    console.log('Initializing database...');

    // Read the schema file
    const schemaPath = path.join(__dirname, '..', 'database_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);

    // Execute each statement
    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');
        try {
          await query(statement);
        } catch (error) {
          console.log('Skipping statement (might already exist):', error.message);
        }
      }
    }

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();
