"use strict";

var _require = require('express'),
  Router = _require.Router;
var Home = require('../services/home.services');
var router = Router();
router.get('/getServices', Home.getServicios);
module.exports = router;