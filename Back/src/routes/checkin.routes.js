const express = require("express");

const router = express.Router();

const controller = require("../controllers/checkin.controller");

router.post("/", controller.cadastrar);

module.exports = router;