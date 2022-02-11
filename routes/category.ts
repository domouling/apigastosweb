import { Router } from "express";
import { getCategories, getCategoriesAct, getCategory, postCategory, putCategory, deleteCategory } from '../controllers/category';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getCategories);
router.get('/act/all', TokenValidation , getCategoriesAct);
router.get('/:id', TokenValidation, getCategory);
router.post('/', TokenValidation, postCategory);
router.put('/:id', TokenValidation, putCategory);
router.delete('/:id', TokenValidation, deleteCategory);

export default router;