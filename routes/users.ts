import { Router } from "express";
import multer from "../libs/multer";
import { deleteUser, getUser, getUsers, getTokeninf ,postUser, putUser, avatar ,updateImage, uploadAvatar, deleteAvatar, login, register } from "../controllers/users";
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/', TokenValidation , getUsers);
router.get('/:id', TokenValidation, getUser);
router.get('/token/info', TokenValidation, getTokeninf)
router.post('/', TokenValidation, postUser);
router.put('/:id', TokenValidation, putUser);
router.delete('/:id', TokenValidation, deleteUser);
router.get('/file/:filename', avatar);
router.post('/upload-avatar', [multer.single('image'), TokenValidation], uploadAvatar);
router.get('/delete-avatar/:imagen', TokenValidation, deleteAvatar);
router.put('/image/update', TokenValidation, updateImage);

export default router;