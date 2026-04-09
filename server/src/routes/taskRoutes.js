import { Router } from 'express';
import {
  createTaskHandler,
  deleteTaskHandler,
  getTask,
  listTasks,
  updateTaskHandler
} from '../controllers/taskController.js';

const router = Router();

router.get('/', listTasks);
router.get('/:id', getTask);
router.post('/', createTaskHandler);
router.patch('/:id', updateTaskHandler);
router.delete('/:id', deleteTaskHandler);

export default router;
