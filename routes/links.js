const express = require("express");
const router = express.Router();

const { creatingLink } = require("../commands/creatingLink");

router.post("/", creatingLink);

module.exports = router;


