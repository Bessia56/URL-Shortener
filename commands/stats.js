const { db: knex } = require("../data/database");

/**
 * Получает статистику переходов по короткой ссылке.
 *
 * Ищет ссылку в базе данных и возвращает количество переходов,
 * дату создания и время последнего перехода.
 *
 * @param {import("express").Request} req - HTTP-запрос с ID ссылки в req.params.id.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @param {import("express").NextFunction} next - Передаёт ошибку следующему middleware.
 * @returns {Promise<void>} Завершает обработку запроса или передаёт ошибку через next.
 */
async function stats(req, res, next) {
    try {
        const link = await knex("links").where("id", req.params.id).first();

        if (!link) {
            return res.status(404).json({
                error: "Ссылка не найдена",
            });
        }
        return res.status(200).json({
            data: {
                id: link.id,
                shortCode: link.short_code,
                clickCount: link.click_count,
                createdAt: link.created_at,
                lastClickedAt: link.last_clicked_at,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { stats };
