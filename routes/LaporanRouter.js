const express = require("express");
const router = express.Router();
const controller = require("../controllers/LaporanController");

router.get("/", controller.index);
router.get("/Input_Laporan", controller.index);
router.post("/store", controller.store);
router.get("/Monitoring_Laporan", controller.monitoring);
router.get("/Rekapitulasi_Laporan", controller.rekapitulasi);
router.get("/Laporan_Close/:id", controller.laporan_close);
router.get("/laporan_to_excel/:nama", controller.laporan_to_excel);
router.get("/api_mon", controller.get_mon);
router.post("/api_mon/:id", controller.up_mon);

module.exports = router;

