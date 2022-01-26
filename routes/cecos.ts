import { Router } from "express";
import multer from "../libs/multer_ceco";
import { getCecos, getCeco, postCeco, putCeco, avatar, deleteAvatar, deleteCeco, updateImage, uploadAvatar } from '../controllers/ceco';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getCecos);
router.get('/:id', TokenValidation, getCeco);
router.post('/', TokenValidation, postCeco);
router.put('/:id', TokenValidation, putCeco);
router.delete('/:id', TokenValidation, deleteCeco);
router.get('/file/:filename', avatar);
router.post('/upload-avatar', [multer.single('image'), TokenValidation], uploadAvatar);
router.get('/delete-avatar/:imagen', TokenValidation, deleteAvatar);
router.put('/image/update', TokenValidation, updateImage);

export default router;