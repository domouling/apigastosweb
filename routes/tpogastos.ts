import { Router } from "express";
import { getTpogastos, getTpogasto, postTpogasto, putTpogasto, deleteTpogasto } from '../controllers/tpogasto';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getTpogastos);
router.get('/:id', TokenValidation, getTpogasto);
router.post('/', TokenValidation, postTpogasto);
router.put('/:id', TokenValidation, putTpogasto);
router.delete('/:id', TokenValidation, deleteTpogasto);

export default router;