const express = require("express");
const router = express.Router();

const { creatingLink } = require("../commands/creatingLink");
const { getLinks } = require("../commands/getLinks");

router.post("/", creatingLink);

router.get("/", getLinks);

module.exports = router;
