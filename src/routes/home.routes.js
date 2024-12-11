const { Router } = require('express');
const Home = require('../services/home.services');

const router = Router();

router.get('/getServices', Home.getServicios);
router.post('/contactService', Home.saveContactService)
router.get('/getContactService', Home.getServicesContact)
router.post('/getServicesByCategory', Home.getServicesCategories)
router.post('/getSubscriptionById', Home.getSubscriptionsById)

module.exports = router;
