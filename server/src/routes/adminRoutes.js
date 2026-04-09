import { Router } from 'express';
import { getAdminOverview, listUsers } from '../controllers/adminController.js';

const router = Router();

router.get('/overview', getAdminOverview);
router.get('/users', listUsers);

export default router;
