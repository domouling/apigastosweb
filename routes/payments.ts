import { Router } from "express";
import { getPayments, getPayment, postPayment, putPayment, deletePayment } from '../controllers/payments';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getPayments);
router.get('/:id', TokenValidation, getPayment);
router.post('/', TokenValidation, postPayment);
router.put('/:id', TokenValidation, putPayment);
router.delete('/:id', TokenValidation, deletePayment);

export default router;