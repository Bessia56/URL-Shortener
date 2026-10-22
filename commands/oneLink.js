const knex = require("../data/database");


async function oneLinks(req, res, next) {
    try {
         const link = await knex("links")
            .where("id", req.params.id)
            .first();
console.log("ID из запроса:", req.params.id);
console.log("Найденная запись:", link);
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