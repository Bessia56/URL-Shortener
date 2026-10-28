require("dotenv").config();

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

    const port = process.env.PORT || 3001;
    
    app.listen(port, () => {
        console.log(`Сервер запущен на порту ${port}`);
    });
}

startServer().catch((error) => {
    console.error("Ошибка запуска приложения:", error);
    process.exitCode = 1;
});
