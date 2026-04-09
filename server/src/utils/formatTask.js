export function formatTask(task) {
  return {
    id: task.id,
    userId: task.user_id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueDate: task.due_date,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  };
}
