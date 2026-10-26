const express = require("express");
const app = express();

const { initializeDatabase } = require("./data/database");
const linksRouter = require("./routes/links");
const redirectRouter = require("./routes/redirect");

// Подключаем Swagger UI и спецификацию OpenAPI.
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

app.use(express.json());

// Документация API.
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Основные маршруты.
app.use("/", redirectRouter);
app.use("/api/v1/links", linksRouter);


app.use((err, req, res, next) => {
    const isValidationError = err.name === "ValidationError";
    const statusCode = isValidationError
        ? 400
        : (err.status || err.statusCode || 500);

    const errorId = `ERR-${Date.now()}`;

    console.error({
        errorId,
        name: err.name,
        message: err.message,
        statusCode,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack,
    });

    return res.status(statusCode).json({
        errorId,
        name: isValidationError
            ? "Ошибка данных"
            : statusCode === 404
                ? "Ресурс не найден"
                : "Внутренняя ошибка сервера",
        error: isValidationError
            ? err.message
            : statusCode === 404
                ? "Запрашиваемый ресурс не найден"
                : "Произошла внутренняя ошибка сервера",
    });
});

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