import { Router } from "express";
import multer from "../libs/multer_expenses";
import { 
    getExpenses,
    getExpensesAct, 
    getExpense,
    getExpensesMonth,
    movements, 
    totalExpenses, 
    postExpense, 
    putExpense, 
    deleteExpense, 
    avatar, 
    uploadAvatar, 
    updateImage, 
    deleteAvatar } from "../controllers/expenses";
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/all/:ceco', TokenValidation , getExpenses);
router.get('/act/all', TokenValidation , getExpensesAct);
router.post('/total/ceco', TokenValidation, totalExpenses);
router.get('/:id', TokenValidation, getExpense);
router.get('/total/month/:ceco', TokenValidation, getExpensesMonth);
router.post('/', TokenValidation, postExpense);
router.put('/:id', TokenValidation, putExpense);
router.delete('/:id', TokenValidation, deleteExpense);
router.get('/file/:filename', avatar);
router.post('/archivo/upload', [multer.single('image'), TokenValidation], uploadAvatar);
router.get('/delete-avatar/:imagen', TokenValidation, deleteAvatar);
router.put('/archivo/update', TokenValidation, updateImage);

router.post('/movements/all/:ceco', TokenValidation, movements);

export default router;