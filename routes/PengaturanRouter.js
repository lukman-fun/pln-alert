const express = require("express");
const router = express.Router();
const controller = require("../controllers/PengaturanController");

router.get("/", controller.index);
router.post("/store", controller.store);
router.post("/update", controller.update);
router.get("/delete/:id", controller.delete);

module.exports=router;