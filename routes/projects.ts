import { Router } from "express";
import { getProjects, getProject, postProject, putProject, deleteProject } from '../controllers/projects';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/', TokenValidation , getProjects);
router.get('/:id', TokenValidation, getProject);
router.post('/', TokenValidation, postProject);
router.put('/:id', TokenValidation, putProject);
router.delete('/:id', TokenValidation, deleteProject);

export default router;