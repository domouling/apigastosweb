import { Router } from "express";
import { getTrxcurrencies, getTrxcurrenciesAct, getTrxcurrency, postTrxcurrency, putTrxcurrency, deleteTrxcurrency } from '../controllers/trxcurrency';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getTrxcurrencies);
router.get('/act/all', TokenValidation, getTrxcurrenciesAct);
router.get('/:id', TokenValidation, getTrxcurrency);
router.post('/', TokenValidation, postTrxcurrency);
router.put('/:id', TokenValidation, putTrxcurrency);
router.delete('/:id', TokenValidation, deleteTrxcurrency);

export default router;