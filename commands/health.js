//Проверка пинга

/**
 * Проверяет доступность сервера.
 *
 * Возвращает HTTP-статус 200 и JSON с текущим состоянием сервера.
 *
 * @param {import("express").Request} req - HTTP-запрос.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @returns {import("express").Response} Ответ со статусом 200 и состоянием сервера.
 */
function getHealth(req, res) {
    return res.status(200).json({
        status: "OK",
    });
}
module.exports = { getHealth };

