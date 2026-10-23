const { randomUUID } = require("node:crypto");
const knex = require("../data/database");
const generateCode = require("../utils/generateCode");
const { createLinkSchema } = require("../validators/creatingLink");

async function creatingLink(req, res, next) {
    try {
        const data = await createLinkSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        const { url, customCode, expiresAt } = data;

        const id = randomUUID();
        let shortCode = customCode || generateCode(5);
        // Проверяем, существует ли уже короткий код в базе данных
        while (await knex("links").where("short_code", shortCode).first()) {
            if (customCode) {
                return res.status(409).json({
                    error: "Этот короткий код уже занят",
                });
            }

            shortCode = generateCode(5);
        };

        const createdAt = new Date().toISOString();
        const parsedUrl = new URL(url);

        const link = {
            id,
            original_url: parsedUrl.href,
            short_code: shortCode,
            created_at: createdAt,
            expires_at: expiresAt ?? null,
            click_count: 0,
            last_clicked_at: null,
        };

        await knex("links").insert(link); 

        return res.status(201).json({
            data: {
                id,
                url: parsedUrl.href,
                shortCode,
                shortUrl: `http://localhost:3001/${shortCode}`,
                createdAt,
                expiresAt: expiresAt ?? null,
                clickCount: 0,
                lastClickedAt: null,
            },
        });
    } catch (error) {
        next(error);
    }
}

module.exports = { creatingLink };
