const knex = require("../data/database");
const { updateLinkSchema } = require("../validators/updateLink");

async function updateLink(req, res, next) {
    try {
        const data = await updateLinkSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const updates = {};

        if (data.customCode !== undefined) {
            updates.short_code = data.customCode;
        }

        if (data.expiresAt !== undefined) {
            updates.expires_at = data.expiresAt;
        }

        const link = await knex("links").where("id", req.params.id).first();

        if (!link) {
            return res.status(404).json({
                error: "Ссылка не найдена",
            });
        } else {
            await knex("links").where("id", req.params.id).update(updates);
            //обновляем данные ссылки после внесения изменений
            const updatedLink = await knex("links")
                .where("id", req.params.id)
                .first();

            return res.status(200).json({
                data: {
                    id: updatedLink.id,
                    url: updatedLink.original_url,
                    shortCode: updatedLink.short_code,
                    shortUrl: `http://localhost:3001/${updatedLink.short_code}`,
                    createdAt: updatedLink.created_at,
                    expiresAt: updatedLink.expires_at,
                    clickCount: updatedLink.click_count,
                    lastClickedAt: updatedLink.last_clicked_at,
                },
            });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = { updateLink };
