const express = require("express");
const router = express.Router();

const { creatingLink } = require("../commands/creatingLink");
const { getLinks } = require("../commands/getLinks");
const { oneLinks } = require("../commands/oneLink");
const { stats } = require("../commands/stats");
const { updateLink } = require("../commands/updateLink");
const { deleteLink } = require("../commands/deleteLink");
const { getHealth } = require("../commands/health");


/**
 * @swagger
 * /api/v1/links/health:
 *   get:
 *     summary: Проверка доступности API
 *     description: Проверяет, отвечает ли сервер на запрос.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Сервер доступен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 */
router.get("/health", getHealth);


/**
 * @swagger
 * /api/v1/links/:
 *   post:
 *     summary: Создать короткую ссылку
 *     description: Создаёт короткую ссылку с возможностью задать собственный код и срок действия.
 *     tags:
 *       - Links
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - url
 *             properties:
 *               url:
 *                 type: string
 *                 format: uri
 *                 description: Исходный URL
 *                 example: https://example.com/article
 *               customCode:
 *                 type: string
 *                 description: Желаемый короткий код (необязательно)
 *                 example: mylink
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *                 description: Дата истечения срока действия ссылки (необязательно)
 *                 example: "2027-01-01T12:00:00.000Z"
 *     responses:
 *       201:
 *         description: Короткая ссылка успешно создана
 *       400:
 *         description: Ошибка валидации входных данных
 *       409:
 *         description: Указанный короткий код уже занят
 */
router.post("/", creatingLink);


router.get("/", getLinks);

router.get("/:id", oneLinks);

router.get("/:id/stats", stats);

router.patch("/:id", updateLink);

router.delete("/:id", deleteLink);

module.exports = router;
