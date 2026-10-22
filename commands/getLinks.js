const knex = require("../data/database");
const { getLinksSchema } = require("../validators/getLinks");

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
