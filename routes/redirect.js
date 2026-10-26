const express = require("express");
const router = express.Router();

/**
 * Маршруты перенаправления по короткому коду.
 *
 * Передаёт запросы с коротким кодом обработчику redirect,
 * который проверяет ссылку, обновляет статистику и перенаправляет пользователя.
 */
  const { redirect } = require("../commands/redirect");

router.get("/:code", redirect);

module.exports = router;