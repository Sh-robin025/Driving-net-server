const router = require("express").Router();
const { handleRegister } = require("../controller/auth.controller");

router.post("/register", handleRegister);

module.exports = router;
