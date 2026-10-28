const express = require("express");
const app = express();

const linksRouter = require("./routes/links");
const redirectRouter = require("./routes/redirect");

app.use(express.json());

// Основные маршруты.
app.use("/api/v1/links", linksRouter);
app.use("/", redirectRouter);



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

module.exports = app;

