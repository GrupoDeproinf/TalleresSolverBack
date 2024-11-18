const { Router } = require('express');
const Home = require('../services/home.services');

const router = Router();

router.get('/getServices', Home.getServicios);

module.exports = router;
