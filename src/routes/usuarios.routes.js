const { Router } = require('express');
const Usuarios = require('../services/usuarios.services');

const router = Router();

router.get('/GetUsers', Usuarios.getUsuarios);

router.post('/SaveClient', Usuarios.SaveClient);

router.post('/SaveTaller', Usuarios.SaveTaller); 

router.post('/authenticateUser', Usuarios.authenticateUser);  

router.post('/getUserByUid', Usuarios.getUserByUid);  

router.post('/SaveTallerAll', Usuarios.SaveTallerAll); 

router.post('/restorePass', Usuarios.restorePass);  

router.get('/getTalleres', Usuarios.getTalleres); 

router.post('/actualizarStatusUsuario', Usuarios.actualizarStatusUsuario);    

router.post('/UpdateClient', Usuarios.UpdateClient);     

router.post('/UpdateTaller', Usuarios.UpdateTaller);     



module.exports = router;
