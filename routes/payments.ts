import { Router } from "express";
import { 
    getPayments, 
    getPaymentsAct, 
    getPayment,
    getPaymentsMonth,
    totalPayments,
    postPayment, 
    putPayment, 
    deletePayment } from '../controllers/payments';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/all/:ceco', TokenValidation , getPayments);
router.post('/total/ceco', TokenValidation, totalPayments);
router.get('/act/all', TokenValidation , getPaymentsAct);
router.get('/total/month/:ceco', TokenValidation, getPaymentsMonth);
router.get('/:id', TokenValidation, getPayment);
router.post('/', TokenValidation, postPayment);
router.put('/:id', TokenValidation, putPayment);
router.delete('/:id', TokenValidation, deletePayment);

export default router;