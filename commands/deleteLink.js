const knex = require("../data/database");

/**
 * Удаляет короткую ссылку по её ID.
 *
 * Если ссылка не найдена, возвращает 404.
 * При успешном удалении возвращает 204 без тела ответа.
 *
 * @param {import("express").Request} req - HTTP-запрос с ID ссылки в req.params.id.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @param {import("express").NextFunction} next - Передаёт ошибку следующему middleware.
 * @returns {Promise<void>} Завершает обработку запроса или передаёт ошибку через next.
 */
async function deleteLink(req, res, next) {
    try {
        const deletedCount = await knex("links")
            .where("id", req.params.id)
            .del();

        if (deletedCount === 0) {
            return res.status(404).json({
                error: "Ссылка не найдена",
            });
        }

        return res.status(204).end();
    } catch (error) {
        next(error);
    }
}

module.exports = { deleteLink };
