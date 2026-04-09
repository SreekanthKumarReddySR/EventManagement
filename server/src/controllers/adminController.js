import { getAllUsersWithTaskCounts } from '../models/userModel.js';
import { query } from '../config/db.js';
import { formatUser } from '../utils/formatUser.js';

export async function listUsers(req, res, next) {
  try {
    const users = await getAllUsersWithTaskCounts();

    return res.status(200).json({
      data: users.map((user) => ({
        ...formatUser(user),
        taskCount: user.task_count
      }))
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminOverview(req, res, next) {
  try {
    const [usersResult, tasksResult] = await Promise.all([
      query('SELECT COUNT(*)::int AS count FROM users'),
      query('SELECT COUNT(*)::int AS count FROM tasks')
    ]);

    return res.status(200).json({
      data: {
        totalUsers: usersResult.rows[0]?.count ?? 0,
        totalTasks: tasksResult.rows[0]?.count ?? 0
      }
    });
  } catch (error) {
    return next(error);
  }
}
