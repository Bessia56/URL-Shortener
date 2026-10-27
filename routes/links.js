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
 * @api {get} /api/v1/links/health Проверка доступности API
 * @apiName GetHealth
 * @apiGroup Health
 *
 * @apiSuccess {String} status Состояние сервера.
 * @apiSuccessExample {json} Успешный ответ:
 * HTTP/1.1 200 OK
 * {
 *   "status": "OK"
 * }
 */
router.get("/health", getHealth);

/**
 * @api {post} /api/v1/links/ Создать короткую ссылку
 * @apiName CreateLink
 * @apiGroup Links
 * @apiDescription Создаёт короткую ссылку с возможностью указать собственный код и срок действия.
 *
 * @apiBody {String} url Исходный URL.
 * @apiBody {String} [customCode] Желаемый короткий код.
 * @apiBody {String} [expiresAt] Дата истечения срока действия в формате ISO 8601.
 *
 * @apiSuccess {Object} data Данные созданной ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.url Исходный URL.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {String} data.shortUrl Полная короткая ссылка.
 * @apiSuccess {String} data.createdAt Дата создания.
 * @apiSuccess {String|null} data.expiresAt Дата истечения срока действия или null.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (201):
 * {
 *   "data": {
 *     "id": "uuid",
 *     "url": "https://example.com/article",
 *     "shortCode": "abc12",
 *     "shortUrl": "http://localhost:3001/abc12",
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "expiresAt": null,
 *     "clickCount": 0,
 *     "lastClickedAt": null
 *   }
 * }
 *
 * @apiError (400) BadRequest Ошибка валидации входных данных.
 * @apiError (409) Conflict Указанный короткий код уже занят.
 */
router.post("/", creatingLink);


/**
 * @api {get} /api/v1/links/ Получить список коротких ссылок
 * @apiName GetLinks
 * @apiGroup Links
 * @apiDescription Возвращает список коротких ссылок с пагинацией и сортировкой.
 *
 * @apiQuery {Number} [limit=20] Количество ссылок в ответе (от 1 до 100).
 * @apiQuery {Number} [offset=0] Количество ссылок, которые нужно пропустить.
 * @apiQuery {String="createdAt","clickCount"} [sort=createdAt] Поле сортировки.
 * @apiQuery {String="asc","desc"} [order=desc] Направление сортировки.
 *
 * @apiSuccess {Object[]} data Список коротких ссылок.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.url Исходный URL.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {String} data.shortUrl Полная короткая ссылка.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.expiresAt Дата истечения срока действия или null.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 * @apiSuccess {Object} pagination Информация о пагинации.
 * @apiSuccess {Number} pagination.limit Фактический лимит записей.
 * @apiSuccess {Number} pagination.offset Фактическое смещение.
 * @apiSuccess {Number} pagination.total Общее количество ссылок в базе данных.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": [
 *     {
 *       "id": "uuid",
 *       "url": "https://example.com/article",
 *       "shortCode": "abc12",
 *       "shortUrl": "http://localhost:3001/abc12",
 *       "createdAt": "2026-10-26T10:00:00.000Z",
 *       "expiresAt": null,
 *       "clickCount": 3,
 *       "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *     }
 *   ],
 *   "pagination": {
 *     "limit": 20,
 *     "offset": 0,
 *     "total": 1
 *   }
 * }
 *
 * @apiError (400) BadRequest Некорректные параметры запроса.
 */
router.get("/", getLinks);

/**
 * @api {get} /api/v1/links/:id Получить ссылку по ID
 * @apiName GetLinkById
 * @apiGroup Links
 * @apiDescription Возвращает информацию об одной короткой ссылке, включая срок действия и статистику переходов.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiSuccess {Object} data Данные короткой ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.url Исходный URL.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {String} data.shortUrl Полная короткая ссылка.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.expiresAt Дата истечения срока действия или null.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "url": "https://example.com/article",
 *     "shortCode": "abc12",
 *     "shortUrl": "http://localhost:3001/abc12",
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "expiresAt": null,
 *     "clickCount": 3,
 *     "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *   }
 * }
 *
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 */
router.get("/:id", oneLinks);

/**
 * @api {get} /api/v1/links/:id/stats Получить статистику переходов
 * @apiName GetLinkStats
 * @apiGroup Links
 * @apiDescription Возвращает статистику переходов по короткой ссылке.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiSuccess {Object} data Статистика короткой ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "shortCode": "abc12",
 *     "clickCount": 3,
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *   }
 * }
 *
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 */
router.get("/:id/stats", stats);

/**
 * @api {get} /api/v1/links/:id/stats Получить статистику переходов
 * @apiName GetLinkStats
 * @apiGroup Links
 * @apiDescription Возвращает статистику переходов по короткой ссылке.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiSuccess {Object} data Статистика короткой ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "shortCode": "abc12",
 *     "clickCount": 3,
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *   }
 * }
 *
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 */
router.get("/:id/stats", stats);

/**
 * @api {get} /api/v1/links/:id/stats Получить статистику переходов
 * @apiName GetLinkStats
 * @apiGroup Links
 * @apiDescription Возвращает статистику переходов по короткой ссылке.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiSuccess {Object} data Статистика короткой ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "shortCode": "abc12",
 *     "clickCount": 3,
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *   }
 * }
 *
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 */
router.get("/:id/stats", stats);

/**
 * @api {get} /api/v1/links/:id/stats Получить статистику переходов
 * @apiName GetLinkStats
 * @apiGroup Links
 * @apiDescription Возвращает статистику переходов по короткой ссылке.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiSuccess {Object} data Статистика короткой ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "shortCode": "abc12",
 *     "clickCount": 3,
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *   }
 * }
 *
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 */
router.get("/:id/stats", stats);

/**
 * @api {get} /api/v1/links/:id/stats Получить статистику переходов
 * @apiName GetLinkStats
 * @apiGroup Links
 * @apiDescription Возвращает статистику переходов по короткой ссылке.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiSuccess {Object} data Статистика короткой ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": {
 *     "id": "550e8400-e29b-41d4-a716-446655440000",
 *     "shortCode": "abc12",
 *     "clickCount": 3,
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *   }
 * }
 *
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 */
router.get("/:id/stats", stats);


/**
 * @api {patch} /api/v1/links/:id Обновить короткую ссылку
 * @apiName UpdateLink
 * @apiGroup Links
 * @apiDescription Изменяет короткий код и/или срок действия существующей ссылки.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiBody {String} [customCode] Новый короткий код (до 50 символов, только латинские буквы, цифры, _ и -).
 * @apiBody {String|null} [expiresAt] Новая дата истечения в формате ISO 8601 или null для удаления срока действия.
 *
 * @apiSuccess {Object} data Данные обновлённой ссылки.
 * @apiSuccess {String} data.id Уникальный идентификатор ссылки.
 * @apiSuccess {String} data.url Исходный URL.
 * @apiSuccess {String} data.shortCode Короткий код.
 * @apiSuccess {String} data.shortUrl Полная короткая ссылка.
 * @apiSuccess {String} data.createdAt Дата создания ссылки.
 * @apiSuccess {String|null} data.expiresAt Дата истечения срока действия или null.
 * @apiSuccess {Number} data.clickCount Количество переходов.
 * @apiSuccess {String|null} data.lastClickedAt Дата последнего перехода или null.
 *
 * @apiSuccessExample {json} Успешный ответ (200):
 * {
 *   "data": {
 *     "id": "uuid",
 *     "url": "https://example.com/article",
 *     "shortCode": "new_code",
 *     "shortUrl": "http://localhost:3001/new_code",
 *     "createdAt": "2026-10-26T10:00:00.000Z",
 *     "expiresAt": null,
 *     "clickCount": 3,
 *     "lastClickedAt": "2026-10-26T10:30:00.000Z"
 *   }
 * }
 *
 * @apiError (400) BadRequest Некорректные данные или не указано ни одного поля для изменения.
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 * @apiError (409) Conflict Указанный короткий код уже занят.
 */
router.patch("/:id", updateLink);

/**
 * @api {delete} /api/v1/links/:id Удалить короткую ссылку
 * @apiName DeleteLink
 * @apiGroup Links
 * @apiDescription Удаляет короткую ссылку по её уникальному ID.
 *
 * @apiParam {String} id Уникальный идентификатор ссылки.
 *
 * @apiSuccess (204) NoContent Ссылка успешно удалена. Тело ответа отсутствует.
 *
 * @apiError (404) NotFound Ссылка с указанным ID не найдена.
 *
 * @apiErrorExample {json} Ошибка 404:
 * HTTP/1.1 404 Not Found
 * {
 *   "error": "Ссылка не найдена"
 * }
 */
router.delete("/:id", deleteLink);


module.exports = router;
