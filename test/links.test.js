// Указываем, что приложение запускается в тестовом режиме.
// Это значение используется в database.js для выбора тестовой базы данных.
// Важно установить NODE_ENV до импорта app и модулей базы данных.
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app");
const { db, initializeDatabase } = require("../data/database");

// Объединяем тесты, относящиеся к API коротких ссылок, в одну группу.
describe("Links API", () => {
    beforeAll(async () => {
        await initializeDatabase();
    });
    test("POST /api/v1/links создаёт короткую ссылку", async () => {
        // Arrange — подготовка данных
        const url = "https://example.com";

        // Act — выполняем запрос
        const response = await request(app).post("/api/v1/links").send({ url });

        // Assert — проверяем результат
        expect(response.status).toBe(201);
    });

    test("POST /api/v1/links без url возвращает ошибку", async () => {
        const response = await request(app).post("/api/v1/links").send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
        expect(response.body.error).toBe("url is a required field");
    });

    test("POST /api/v1/links возвращает 400 при некорректном URL", async () => {
        const response = await request(app)
            .post("/api/v1/links")
            .send({ url: "not-a-url" });
        console.log(response.body);

        expect(response.status).toBe(400);

        //     // Проверяем HTTP-статус ошибки
        //     expect(response.body.code).toBe("INVALID_URL");

        //     // Проверяем, что ответ содержит сообщение об ошибке
        //    expect(response.body.message.length).toBeGreaterThan(0);
    });

    afterAll(async () => {
        await db.destroy();
    });
});
