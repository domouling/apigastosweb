import { Router } from "express";
import { getSubcategories2, getSubcategory2, getSubSubCat, postSubcategory2, putSubcategory2, deleteSubcategory2 } from '../controllers/subcategory2';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getSubcategories2);
router.get('/:id', TokenValidation, getSubcategory2);
router.get('/subcat/:id', TokenValidation, getSubSubCat);
router.post('/', TokenValidation, postSubcategory2);
router.put('/:id', TokenValidation, putSubcategory2);
router.delete('/:id', TokenValidation, deleteSubcategory2);

export default router;