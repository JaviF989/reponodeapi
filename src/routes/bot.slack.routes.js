import { Router } from "express";
import { methods as botController } from "../controllers/bot.controller.js";
import { methods as apiController } from "../controllers/api.controllers.js";

const router = Router();

router.get('/api/usuarios/:idusuario', apiController.getUserById);
router.get('/api/reacciones/:idreaccion', apiController.getReacionesById);
router.get('/api/aplaudidores', apiController.getAplaudidores);

export default router;