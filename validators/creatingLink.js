const yup = require("yup");

const createLinkSchema = yup.object({
    url: yup.string().url().required(),

    customCode: yup
        .string()
        .matches(/^[a-zA-Z0-9_-]+$/)
        .max(50)
        .optional(),

    expiresAt: yup
        .date()
        .test(
            "future-date",
            "Дата истечения должна быть в будущем",
            (value) => !value || value > new Date(),
        )
        .optional(),// Проверяем дату относительно текущего времени при каждом запросе,
                    // а не относительно момента запуска сервера.
});

module.exports = {
    createLinkSchema,
};
