const express = require("express");
const router = express.Router();


/**
 * @api {get} /:code Перейти по короткой ссылке
 * @apiName RedirectLink
 * @apiGroup Redirect
 * @apiDescription Перенаправляет пользователя на исходный URL по короткому коду. При успешном переходе обновляет статистику ссылки.
 *
 * @apiParam {String} code Короткий код ссылки.
 *
 * @apiSuccess (302) Found Выполняет перенаправление на исходный URL.
 *
 * @apiError (404) NotFound Короткая ссылка не найдена.
 * @apiError (410) Gone Срок действия ссылки истёк.
 *
 * @apiErrorExample {json} Ошибка 404:
 * {
 *   "error": "Короткая ссылка не найдена"
 * }
 *
 * @apiErrorExample {json} Ошибка 410:
 * {
 *   "error": "Срок действия ссылки истёк"
 * }
 */
router.get("/:code", redirect);


module.exports = router;