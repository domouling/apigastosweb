import { Router } from "express";
import { getSubcategories, getSubcategory, getSubCat, postSubcategory, putSubcategory, deleteSubcategory } from '../controllers/subcategory';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getSubcategories);
router.get('/:id', TokenValidation, getSubcategory);
router.get('/cat/:id', TokenValidation, getSubCat);
router.post('/', TokenValidation, postSubcategory);
router.put('/:id', TokenValidation, putSubcategory);
router.delete('/:id', TokenValidation, deleteSubcategory);

export default router;