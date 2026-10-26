const knex = require("../data/database");

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
