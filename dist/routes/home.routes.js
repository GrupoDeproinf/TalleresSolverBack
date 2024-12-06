"use strict";

var _require = require('express'),
  Router = _require.Router;
var Home = require('../services/home.services');
var router = Router();
router.get('/getServices', Home.getServicios);
router.post('/contactService', Home.saveContactService);
router.get('/getContactService', Home.getServicesContact);
router.post('/getServicesByCategory', Home.getServicesCategories);
module.exports = router;