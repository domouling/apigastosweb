import { Router } from "express";
import { getProviders, getProvidersAct, getProvider, postProvider, putProvider, deleteProvider } from '../controllers/providers';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getProviders);
router.get('/act/all', TokenValidation , getProvidersAct);
router.get('/:id', TokenValidation, getProvider);
router.post('/', TokenValidation, postProvider);
router.put('/:id', TokenValidation, putProvider);
router.delete('/:id', TokenValidation, deleteProvider);

export default router;