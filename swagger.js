
const swaggerJsdoc = require("swagger-jsdoc");

/**
 * Основные настройки документации OpenAPI.
 */
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "URL Shortener API",
            version: "1.0.0",
            description: "API для создания и управления короткими ссылками",
        },
        servers: [
            {
                url: "http://localhost:3001",
                description: "Локальный сервер",
            },
        ],
    },
    // Файлы, в которых swagger-jsdoc будет искать JSDoc-описания API.
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
