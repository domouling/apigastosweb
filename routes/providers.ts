import { Router } from "express";
import { getProviders, getProvider, postProvider, putProvider, deleteProvider } from '../controllers/providers';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getProviders);
router.get('/:id', TokenValidation, getProvider);
router.post('/', TokenValidation, postProvider);
router.put('/:id', TokenValidation, putProvider);
router.delete('/:id', TokenValidation, deleteProvider);

export default router;