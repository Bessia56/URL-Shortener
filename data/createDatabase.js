
const knex = require("knex");
const path = require("node:path");

function createDatabase(filename) {
    return knex({
        client: "better-sqlite3",
        connection: {
            filename: path.join(__dirname, filename),
        },
        useNullAsDefault: true,
    });
}

module.exports = { createDatabase };
