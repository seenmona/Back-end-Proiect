const express = require("express");
const router = express.Router();
const { reset, middleware } = require("../controllers");

const authRouter = require("./auth");
const pointOfInterestRouter = require("./pointOfInterest");

//reset
router.get("/reset", reset.reset);

router.use("/points", middleware.checkLogin, pointOfInterestRouter);
router.use("/", authRouter);

module.exports = router;
