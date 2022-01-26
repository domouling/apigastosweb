import { Router } from "express";
import multer from "../libs/multer_estimate";
import { getEstimates, getEstimate, getTotEstimate, postEstimate, putEstimate, deleteEstimate, avatar, uploadAvatar, updateImage, deleteAvatar } from "../controllers/estimates";
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getEstimates);
router.get('/:id', TokenValidation, getEstimate);
router.get('/totales/total', TokenValidation, getTotEstimate);
router.post('/', TokenValidation, postEstimate);
router.put('/:id', TokenValidation, putEstimate);
router.delete('/:id', TokenValidation, deleteEstimate);
router.get('/file/:filename', avatar);
router.post('/archivo/upload', [multer.single('file'), TokenValidation], uploadAvatar);
router.get('/delete-avatar/:imagen', TokenValidation, deleteAvatar);
router.put('/image/update', TokenValidation, updateImage);

export default router;