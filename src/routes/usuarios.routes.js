const { Router } = require('express');
const Usuarios = require('../services/usuarios.services');

const router = Router();

router.get('/GetUsers', Usuarios.getUsuarios);

router.post('/SaveClient', Usuarios.SaveClient);

router.post('/SaveTaller', Usuarios.SaveTaller); 
 
router.post('/SaveTallerExtended', Usuarios.SaveTallerExtended); 

router.post('/authenticateUser', Usuarios.authenticateUser);  

router.post('/deleteUserFromAuth', Usuarios.deleteUserFromAuth);  

router.post('/getUserByUid', Usuarios.getUserByUid);

router.post('/SaveTallerAll', Usuarios.SaveTallerAll); 

router.post('/restorePass', Usuarios.restorePass);  

router.post('/getTalleres', Usuarios.getTalleres); 

router.post('/actualizarStatusUsuario', Usuarios.actualizarStatusUsuario);    

router.post('/UpdateClient', Usuarios.UpdateClient);     

router.post('/UpdateTaller', Usuarios.UpdateTaller);   

router.post('/getServicesByTalleruid', Usuarios.getServicesByTalleruid); 

router.post('/getServiceByUid', Usuarios.getServiceByUid); 

router.get('/getActiveCategories', Usuarios.getActiveCategories);   

router.post('/getSubcategoriesByCategoryUid', Usuarios.getSubcategoriesByCategoryUid);

router.post('/saveOrUpdateService', Usuarios.saveOrUpdateService); 

router.get('/getPlanes', Usuarios.getPlanes); 

router.get('/getMetodosPago', Usuarios.getMetodosPago); 

router.post('/ReportarPagoData', Usuarios.ReportarPagoData); 

router.post('/AsociarPlan', Usuarios.AsociarPlan);

router.post('/updateScheduleDate', Usuarios.updateScheduleDate); 

router.post('/sendNotification', Usuarios.sendNotification); 

router.post('/UpdateUsuariosAll', Usuarios.UpdateUsuariosAll); 



module.exports = router;
