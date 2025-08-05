const { Router } = require("express");
const Distance = require("../services/distance.services");
const router = Router();

router.post('/nearby', Distance.getNearby)
router.post('/getNearbyWithCategories', Distance.getNearbyWithCategories)

module.exports = router;