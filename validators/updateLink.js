const yup = require("yup");

const updateLinkSchema = yup
    .object({
        customCode: yup
            .string()
            .matches(/^[a-zA-Z0-9_-]+$/)
            .max(50)
            .optional(),
        expiresAt: yup
            .date()
            .nullable()
            .optional()
            .min(new Date(), "Дата истечения должна быть в будущем"),
    })
    .test(
        "at-least-one",
        "Необходимо указать хотя бы одно поле для изменения",
        (data) => data.customCode !== undefined || data.expiresAt !== undefined,
    );

module.exports = { updateLinkSchema };
