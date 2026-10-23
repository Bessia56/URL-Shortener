const knex = require("../data/database");

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
            .increment("click_count", 1)
            .update({
                last_clicked_at: new Date().toISOString(),
            });

        return res.redirect(row.original_url);
    } catch (error) {
        next(error);
    }
}

module.exports = { redirect };
