const { db: knex } = require("../data/database");

/**
 * Перенаправляет пользователя на исходный URL по короткому коду.
 *
 * Проверяет существование ссылки и срок её действия,
 * обновляет статистику переходов и выполняет перенаправление.
 *
 * @param {import("express").Request} req - HTTP-запрос с коротким кодом в req.params.code.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @param {import("express").NextFunction} next - Передаёт ошибку следующему middleware.
 * @returns {Promise<void>} Завершает обработку запроса или передаёт ошибку через next.
 */
async function redirect(req, res, next) {
    try {
        const row = await knex("links")
            .where("short_code", req.params.code)
            .first();

        if (!row) {
            return res.status(404).json({
                error: "Короткая ссылка не найдена",
            });
        }

        if (row.expires_at && new Date(row.expires_at) <= new Date()) {
            return res.status(410).json({
                error: "Срок действия ссылки истёк",
            });
        }

        await knex("links")
            .where("id", row.id)
            .update({
                // Увеличиваем текущее значение click_count на 1 прямо в БД.
                // ?? — имя столбца, + 1 — прибавляем единицу.
                click_count: knex.raw("?? + 1", ["click_count"]),
                last_clicked_at: new Date().toISOString(),
            });

        return res.redirect(row.original_url);
    } catch (error) {
        next(error);
    }
}

module.exports = { redirect };
