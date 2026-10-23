const express = require("express");
const router = express.Router();

const { redirect } = require("../commands/redirect");

router.get("/:code", redirect);

module.exports = router;