const express = require("express");
const router = express.Router();

const { creatingLink } = require("../commands/creatingLink");
const { getLinks } = require("../commands/getLinks");
const { oneLinks } = require("../commands/oneLink");
const { stats } = require("../commands/stats");
const { updateLink } = require("../commands/updateLink");




router.post("/", creatingLink);

router.get("/", getLinks);

router.get("/:id", oneLinks);

router.get("/:id/stats", stats);

router.patch("/:id", updateLink);

module.exports = router;
