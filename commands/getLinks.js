const knex = require("../data/database");
const { getLinksSchema } = require("../validators/getLinks");

/**
 * Возвращает список коротких ссылок с пагинацией и сортировкой.
 *
 * Проверяет параметры запроса, получает ссылки из базы данных
 * и возвращает общее количество ссылок вместе с данными пагинации.
 *
 * @param {import("express").Request} req - HTTP-запрос с параметрами limit, offset, sort и order.
 * @param {import("express").Response} res - HTTP-ответ клиенту.
 * @param {import("express").NextFunction} next - Передаёт ошибку следующему middleware.
 * @returns {Promise<void>} Завершает обработку запроса или передаёт ошибку через next.
 */
async function getLinks(req, res, next) {
    try {
        const params = await getLinksSchema.validate(req.query, {
            abortEarly: false,
            stripUnknown: true,
        });

        const sortFields = {
            createdAt: "created_at",
            clickCount: "click_count",
        };

        const links = await knex("links")
            .select("*")
            .orderBy(sortFields[params.sort], params.order)
            .limit(params.limit)
            .offset(params.offset);

        const [{ total }] = await knex("links").count("* as total"); // получение всего количества ссылок для пагинации

        return res.status(200).json({
            data: links.map((link) => ({
                id: link.id,
                url: link.original_url,
                shortCode: link.short_code,
                shortUrl: `http://localhost:3001/${link.short_code}`,
                createdAt: link.created_at,
                expiresAt: link.expires_at,
                clickCount: link.click_count,
                lastClickedAt: link.last_clicked_at,
            })),
            pagination: {
                limit: params.limit,
                offset: params.offset,
                total: Number(total),
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { getLinks };
