import { Router } from "express";
import { getCategories, getCategory, postCategory, putCategory, deleteCategory } from '../controllers/category';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getCategories);
router.get('/:id', TokenValidation, getCategory);
router.post('/', TokenValidation, postCategory);
router.put('/:id', TokenValidation, putCategory);
router.delete('/:id', TokenValidation, deleteCategory);

export default router;