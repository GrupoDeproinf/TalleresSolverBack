const { Router } = require("express");
const Distance = require("../services/distance.services");
const router = Router();

router.post('/nearby', Distance.getNearby)

module.exports = router;