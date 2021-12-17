const express = require("express");
const router = express.Router();
const { pointOfInterest } = require("../controllers");

//pointOfInterest
router.post("/", pointOfInterest.addPointOfInterest);
router.delete("/", pointOfInterest.deletePointOfInterest);
router.put("/", pointOfInterest.editPointOfInterest);
router.get("/", pointOfInterest.getPointOfInterests);

router.get("/all", pointOfInterest.getAllPointOfInterests);

module.exports = router;
