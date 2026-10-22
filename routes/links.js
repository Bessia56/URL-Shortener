const express = require("express");
const router = express.Router();

const { creatingLink } = require("../commands/creatingLink");
const { getLinks } = require("../commands/getLinks");
const { oneLinks } = require("../commands/oneLink");


router.post("/", creatingLink);

router.get("/", getLinks);

router.get("/:id", oneLinks);

module.exports = router;
