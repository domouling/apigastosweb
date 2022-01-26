import { Router } from "express";
import multer from "../libs/multer_expenses";
import { getExpenses, getExpense, postExpense, putExpense, deleteExpense, avatar, uploadAvatar, updateImage, deleteAvatar } from "../controllers/expenses";
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getExpenses);
router.get('/:id', TokenValidation, getExpense);
router.post('/', TokenValidation, postExpense);
router.put('/:id', TokenValidation, putExpense);
router.delete('/:id', TokenValidation, deleteExpense);
router.get('/file/:filename', avatar);
router.post('/archivo/upload', [multer.single('image'), TokenValidation], uploadAvatar);
router.get('/delete-avatar/:imagen', TokenValidation, deleteAvatar);
router.put('/archivo/update', TokenValidation, updateImage);

export default router;