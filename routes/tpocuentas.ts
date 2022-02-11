import { Router } from "express";
import { getTpocuentas, getTpocuentasAct, getTpocuenta, postTpocuenta, putTpocuenta, deleteTpocuenta } from '../controllers/tpocuenta';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getTpocuentas);
router.get('/act/all', TokenValidation , getTpocuentasAct);
router.get('/:id', TokenValidation, getTpocuenta);
router.post('/', TokenValidation, postTpocuenta);
router.put('/:id', TokenValidation, putTpocuenta);
router.delete('/:id', TokenValidation, deleteTpocuenta);

export default router;