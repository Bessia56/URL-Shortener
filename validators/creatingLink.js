const yup = require("yup");

const createLinkSchema = yup.object({
    url: yup.string().url().required(),

    customCode: yup
        .string()
        .matches(/^[a-zA-Z0-9_-]+$/)
        .max(50)
        .optional(),

    expiresAt: yup.date().min(new Date()).optional(),
});

module.exports = {
    createLinkSchema,
};
