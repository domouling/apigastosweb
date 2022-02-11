import { Router } from "express";
import { getCtagastos, getCtagastosAct, getCtagasto, putCtagasto, postCtagasto, deleteCtagasto } from '../controllers/ctagasto';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getCtagastos);
router.get('/act/all', TokenValidation , getCtagastosAct);
router.get('/:id', TokenValidation, getCtagasto);
router.post('/', TokenValidation, postCtagasto);
router.put('/:id', TokenValidation, putCtagasto);
router.delete('/:id', TokenValidation, deleteCtagasto);

export default router;