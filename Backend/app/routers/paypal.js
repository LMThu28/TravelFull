const express = require("express");
const paypalController = require("../controllers/paypalController");

const router = express.Router();

router.post("/pay", paypalController.payment);

router.get("/executePayment", paypalController.executePayment);

module.exports = router;
