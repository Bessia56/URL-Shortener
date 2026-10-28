const { createDatabase } = require("./createDatabase");
const { initializeDatabase } = require("./initializeDatabase");

// Подключение к основной базе данных.
const db = createDatabase(
    process.env.DATABASE_FILENAME || "database.sqlite"
);

module.exports = { 
    db, initializeDatabase: () => initializeDatabase(db) };
