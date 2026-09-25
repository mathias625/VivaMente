const express = require("express");

const router = express.Router();

const {
    validarLogin
} = require("../controllers/login.controller");

router.post("/login", validarLogin);

module.exports = router;
