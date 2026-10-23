const knex = require("../data/database");

async function stats(req, res, next) {
    try {

        const link = await knex("links").where('id', req.params.id).first();
        
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

