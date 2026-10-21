const knex = require("knex");

const db = knex({
    client: "better-sqlite3",
    connection: {
        filename: "./data/database.sqlite",
    },
    useNullAsDefault: true,
});

(async () => {
    try {
        await db.schema.createTableIfNotExists("links", (table) => {
            table.string("id").primary();
            table.string("short_code").notNull().unique();
            table.string("original_url").notNull();
            table.string("created_at").notNull();
            table.string("expires_at").nullable();
            table.integer("click_count").notNull().defaultTo(0);
            table.string("last_clicked_at").nullable();
        });
        console.log("✅ Таблица 'links' успешно создана или уже существовала.");
    } catch (error) {
        console.error("❌ Ошибка при создании таблицы:", error.message);
    } finally {
        await db.destroy(); // корректно закрывает соединение
    }
})();
