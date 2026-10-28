/**
 * Инициализирует таблицу links, если она ещё не существует.
 *
 * Создаёт столбцы для идентификатора ссылки, короткого кода,
 * исходного URL, срока действия и статистики переходов.
 *
 * @returns {Promise<void>} Завершает проверку и создание таблицы.
 */
async function initializeDatabase(db) {
    try {
        const exists = await db.schema.hasTable("links");

        if (!exists) {
            await db.schema.createTable("links", (table) => {
                table.string("id").primary();
                table.string("short_code").notNull().unique();
                table.string("original_url").notNull();
                table.string("created_at").notNull();
                table.string("expires_at").nullable();
                table.integer("click_count").notNull().defaultTo(0);
                table.string("last_clicked_at").nullable();
            });
            console.log("✅ Таблица 'links' создана.");
        } else {
            console.log("✅ Таблица 'links' уже существует.");
        }
    } catch (error) {
        console.error("❌ Ошибка при создании таблицы:", error.message);
    }
};


module.exports = { initializeDatabase };