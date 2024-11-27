const { Router } = require('express');
const Home = require('../services/home.services');

const router = Router();

router.get('/getServices', Home.getServicios);
router.post('/contactService', Home.saveContactService)
router.get('/getContactService', Home.getServicesContact)

module.exports = router;
