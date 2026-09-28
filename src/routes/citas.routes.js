const { Router } = require("express");
const Citas = require("../services/citas.services");

const router = Router();

router.post("/disponibilidad", Citas.disponibilidad);
router.post("/crear", Citas.crear);
router.post("/misCitas", Citas.misCitas);
router.post("/agendaTaller", Citas.agendaTaller);
router.post("/actualizar", Citas.actualizar);

module.exports = router;
