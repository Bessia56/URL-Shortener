const knex = require("../data/database");

/**
 * Получает информацию об одной короткой ссылке по её ID.
 *
 * Ищет ссылку в базе данных и возвращает её основные данные,
 * включая короткий URL, срок действия и статистику переходов.
 *
 * @param {import("express").Request} req - HTTP-запрос с ID ссылки в req.params.id.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @param {import("express").NextFunction} next - Передаёт ошибку следующему middleware.
 * @returns {Promise<void>} Завершает обработку запроса или передаёт ошибку через next.
 */
async function oneLinks(req, res, next) {
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
                url: link.original_url,
                shortCode: link.short_code,
                shortUrl: `http://localhost:3001/${link.short_code}`,
                createdAt: link.created_at,
                expiresAt: link.expires_at,
                clickCount: link.click_count,
                lastClickedAt: link.last_clicked_at,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { oneLinks };
