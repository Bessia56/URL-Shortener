process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../app");
const {
    db,
    initializeDatabase,
} = require("../data/database.test");


test("POST /api/v1/links создаёт короткую ссылку", async () => {
    await initializeDatabase();

    const response = await request(app)
        .post("/api/v1/links")
        .send({
            url: "https://example.com",
        });

    assert.equal(response.status, 201);
});