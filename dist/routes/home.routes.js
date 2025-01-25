"use strict";

var _require = require("express"),
  Router = _require.Router;
var Home = require("../services/home.services");
var router = Router();
router.get("/getServices", Home.getServicios);
router.post("/contactService", Home.saveContactService);
router.get("/getContactService", Home.getServicesContact);
router.post("/getServicesByCategory", Home.getServicesCategories);
router.post("/getSubscriptionById", Home.getSubscriptionsById);
router.post("/getProductsByCategory", Home.getProductsByCategory);
router.post("/getCommentsByService", Home.getCommentsByService);
router.post("/addCommentToService", Home.addCommentToService);
router.post("/validatePhone", Home.validatePhone);
router.post("/validateEmail", Home.validateEmail);
module.exports = router;