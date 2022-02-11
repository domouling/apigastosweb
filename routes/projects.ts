import { Router } from "express";
import { 
    getProjects, 
    getProjectsAct, 
    getProject,
    getProjExpenses,
    getProjExpensesId,
    postProject, 
    putProject, 
    putSaldo, 
    deleteProject } from '../controllers/projects';
import { TokenValidation } from '../libs/verifyToken';
 
const router = Router();

router.get('/all/:ceco', TokenValidation , getProjects);
router.get('/act/all', TokenValidation , getProjectsAct);
router.get('/:id', TokenValidation, getProject);
router.get('/expenses/:ceco', TokenValidation, getProjExpenses);
router.get('/expenses/id/:id', TokenValidation, getProjExpensesId);
router.post('/', TokenValidation, postProject);
router.put('/:id', TokenValidation, putProject);
router.put('/saldo/pag/:id', TokenValidation, putSaldo);
router.delete('/:id', TokenValidation, deleteProject);

export default router;