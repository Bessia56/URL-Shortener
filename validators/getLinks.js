const yup = require("yup");

const getLinksSchema = yup.object({
    limit: yup.number().integer().min(1).max(100).default(20),

    offset: yup.number().integer().min(0).default(0),

    sort: yup.string().oneOf(["createdAt", "clickCount"]).default("createdAt"),

    order: yup.string().oneOf(["asc", "desc"]).default("desc"),
});

module.exports = { getLinksSchema, };
