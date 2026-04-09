import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask
} from '../models/taskModel.js';
import { formatTask } from '../utils/formatTask.js';
import {
  validateCreateTask,
  validateTaskListQuery,
  validateUpdateTask
} from '../validators/taskValidators.js';

function parseTaskId(taskId) {
  const parsedId = Number(taskId);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

export async function listTasks(req, res, next) {
  try {
    const validation = validateTaskListQuery(req.query);

    if (!validation.isValid) {
      return res.status(400).json({ message: 'Invalid query parameters.', errors: validation.errors });
    }

    const { tasks, totalCount } = await getAllTasks({
      ...validation.value,
      user: req.user
    });
    const { hasPagination, page, limit } = validation.value;

    return res.status(200).json({
      data: tasks.map(formatTask),
      meta: {
        totalItems: totalCount,
        page: hasPagination ? page : null,
        limit: hasPagination ? limit : null,
        totalPages: hasPagination ? Math.ceil(totalCount / limit) : null,
        scope: req.user.role === 'admin' ? 'all' : 'mine'
      }
    });
  } catch (error) {
    return next(error);
  }
}

export async function getTask(req, res, next) {
  try {
    const taskId = parseTaskId(req.params.id);

    if (!taskId) {
      return res.status(400).json({ message: 'Task id must be a positive integer.' });
    }

    const task = await getTaskById(taskId, req.user);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ data: formatTask(task) });
  } catch (error) {
    return next(error);
  }
}

export async function createTaskHandler(req, res, next) {
  try {
    const validation = validateCreateTask(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ message: 'Invalid task payload.', errors: validation.errors });
    }

    const task = await createTask({
      ...validation.value,
      userId: req.user.id
    });
    return res.status(201).json({ data: formatTask(task) });
  } catch (error) {
    return next(error);
  }
}

export async function updateTaskHandler(req, res, next) {
  try {
    const taskId = parseTaskId(req.params.id);

    if (!taskId) {
      return res.status(400).json({ message: 'Task id must be a positive integer.' });
    }

    const validation = validateUpdateTask(req.body);

    if (!validation.isValid) {
      return res.status(400).json({ message: 'Invalid task payload.', errors: validation.errors });
    }

    const updatedTask = await updateTask(taskId, validation.value, req.user);

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ data: formatTask(updatedTask) });
  } catch (error) {
    return next(error);
  }
}

export async function deleteTaskHandler(req, res, next) {
  try {
    const taskId = parseTaskId(req.params.id);

    if (!taskId) {
      return res.status(400).json({ message: 'Task id must be a positive integer.' });
    }

    const wasDeleted = await deleteTask(taskId, req.user);

    if (!wasDeleted) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    return res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    return next(error);
  }
}
