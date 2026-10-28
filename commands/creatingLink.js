const { randomUUID } = require("node:crypto");
const { db: knex } = require("../data/database");
const generateCode = require("../utils/generateCode");
const { createLinkSchema } = require("../validators/creatingLink");

/**
 * Создаёт короткую ссылку и сохраняет её в базе данных.
 *
 * Проверяет входные данные, генерирует уникальный короткий код,
 * сохраняет ссылку и возвращает созданный ресурс.
 *
 * @param {import("express").Request} req - HTTP-запрос с данными ссылки в req.body.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @param {import("express").NextFunction} next - Передаёт ошибку следующему middleware.
 * @returns {Promise<void>} Завершает обработку запроса или передаёт ошибку через next.
 */
async function creatingLink(req, res, next) {
    try {
        const data = await createLinkSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { url, customCode, expiresAt } = data;
        // Yup преобразует expiresAt в объект Date.
        // Приводим его к ISO-строке для единообразного хранения в SQLite и ответа API.
        // Если срок действия не указан, сохраняем null.
        const expiresAtISO = expiresAt ? expiresAt.toISOString() : null;

        const id = randomUUID();
        let shortCode = customCode || generateCode(5);
        // Проверяем, существует ли уже короткий код в базе данных
        while (await knex("links").where("short_code", shortCode).first()) {
            if (customCode) {
                return res.status(409).json({
                    error: "Этот короткий код уже занят",
                });
            }

            shortCode = generateCode(5);
        }

        const createdAt = new Date().toISOString();
        const parsedUrl = new URL(url);

        const link = {
            id,
            original_url: parsedUrl.href,
            short_code: shortCode,
            created_at: createdAt,
            expires_at: expiresAtISO, // Храним дату в ISO-формате или null.
            click_count: 0,
            last_clicked_at: null,
        };

        await knex("links").insert(link);

        const baseUrl = process.env.BASE_URL || "http://localhost:3001";

        return res.status(201).json({
            data: {
                id,
                url: parsedUrl.href,
                shortCode,
                shortUrl: `${baseUrl}/${shortCode}`,
                createdAt,
                expiresAt: expiresAtISO, // Возвращаем клиенту ту же дату, что сохранили в БД.
                clickCount: 0,
                lastClickedAt: null,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { creatingLink };
