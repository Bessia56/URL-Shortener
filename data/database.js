const { createDatabase } = require("./createDatabase");
const { initializeDatabase } = require("./initializeDatabase");

//Определяет режим работы приложения
const isTest = process.env.NODE_ENV === "test";

//Выбирает имя файла базы данных в зависимости от режима работы приложения
const databaseFilename = isTest
    ? "database.test.sqlite"
    : (process.env.DATABASE_FILENAME || "database.sqlite");

//Создаем подключение к базе данных
const db = createDatabase(databaseFilename);

module.exports = { 
    db, initializeDatabase: () => initializeDatabase(db) };
