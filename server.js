const app = require("./app");
const { initializeDatabase } = require("./data/database");

/**
 * Подготавливает базу данных и запускает HTTP-сервер.
 *
 * @returns {Promise<void>} Завершает запуск сервера
 * или передаёт ошибку вызывающему коду.
 */
async function startServer() {
    await initializeDatabase();

    app.listen(3001, () => {
        console.log("Сервер запущен на порту 3001");
    });
}

startServer().catch((error) => {
    console.error("Ошибка запуска приложения:", error);
    process.exitCode = 1;
});