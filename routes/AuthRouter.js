const express = require("express");
const router = express.Router();
const controller = require("../controllers/AuthController");

router.get("/", (req, res)=>{
    res.redirect("/Auth/login");
})
router.get("/login", controller.login);
router.post("/actLogin", controller.actLogin);
router.get("/logout", controller.logout);

module.exports = router;