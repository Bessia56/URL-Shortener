
const { createDatabase } = require("./createDatabase");
const { initializeDatabase } = require("./initializeDatabase");

// Подключение к тестовой базе данных.
const db = createDatabase("database.test.sqlite");

module.exports = { 
    db, 
    initializeDatabase: () => initializeDatabase(db) 
};


