const { db: knex } = require("../data/database");
const { updateLinkSchema } = require("../validators/updateLink");

/**
 * Обновляет короткий код и/или срок действия ссылки.
 *
 * Проверяет входные данные, находит ссылку по ID,
 * обновляет указанные поля и возвращает обновлённую ссылку.
 *
 * @param {import("express").Request} req - HTTP-запрос с ID ссылки в params
 * и полями для обновления в body.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @param {import("express").NextFunction} next - Передаёт ошибку следующему middleware.
 * @returns {Promise<void>} Завершает обработку запроса или передаёт ошибку через next.
 */
async function updateLink(req, res, next) {
    try {
        const data = await updateLinkSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const updates = {};

        // Проверяем, не занят ли новый короткий код другой ссылкой.
        if (data.customCode !== undefined) {
            const existingLink = await knex("links")
                .where("short_code", data.customCode)
                .whereNot("id", req.params.id)
                .first();

            if (existingLink) {
                return res.status(409).json({
                    error: "Этот короткий код уже занят",
                });
            }
        }

        if (data.expiresAt !== undefined) {
            // Yup преобразует дату в Date.
            // Преобразуем её в ISO-строку для хранения в SQLite.
            // null позволяет убрать срок действия, если схема это допускает.
            updates.expires_at =
                data.expiresAt === null ? null : data.expiresAt.toISOString();
        }

        const link = await knex("links").where("id", req.params.id).first();

        if (!link) {
            return res.status(404).json({
                error: "Ссылка не найдена",
            });
        } else {
            await knex("links").where("id", req.params.id).update(updates);
            //обновляем данные ссылки после внесения изменений
            const updatedLink = await knex("links")
                .where("id", req.params.id)
                .first();

            return res.status(200).json({
                data: {
                    id: updatedLink.id,
                    url: updatedLink.original_url,
                    shortCode: updatedLink.short_code,
                    shortUrl: `http://localhost:3001/${updatedLink.short_code}`,
                    createdAt: updatedLink.created_at,
                    expiresAt: updatedLink.expires_at,
                    clickCount: updatedLink.click_count,
                    lastClickedAt: updatedLink.last_clicked_at,
                },
            });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { updateLink };
