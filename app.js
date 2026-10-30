const express = require("express");
const app = express();

const linksRouter = require("./routes/links");
const redirectRouter = require("./routes/redirect");
const { getHealth } = require("./commands/health");

app.use(express.json());

// Основные маршруты.
app.get("/health", getHealth);
app.use("/api/v1/links", linksRouter);
app.use("/", redirectRouter);



app.use((err, req, res, next) => {
    const isValidationError = err.name === "ValidationError";

    const statusCode = isValidationError
        ? 400
        : (err.status || err.statusCode || 500);

    let code = "INTERNAL_ERROR";

    if (isValidationError) {
        if (err.path === "url" && err.type === "url") {
            code = "INVALID_URL";
        } else {
            code = "INVALID_REQUEST";
        }
    }

    if (statusCode === 404) {
        code = "NOT_FOUND";
    }

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
        code,
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

