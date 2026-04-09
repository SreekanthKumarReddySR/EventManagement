import { useEffect, useState } from 'react';
import { createTask, deleteTask, fetchTasks, updateTask } from '../api/tasks.js';
import { useAuth } from '../auth/AuthContext.jsx';
import Pagination from '../components/Pagination.jsx';
import StatusFilter from '../components/StatusFilter.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';

const PAGE_SIZE = 6;

export default function TasksPage() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskScope, setTaskScope] = useState('mine');
  const [pageMeta, setPageMeta] = useState({
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    totalItems: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadTasks() {
      try {
        setIsLoading(true);
        setPageError('');
        const payload = await fetchTasks(token, {
          status: selectedStatus,
          page: currentPage,
          limit: PAGE_SIZE
        });
        setTasks(payload.data || []);
        setTaskScope(payload.meta?.scope || 'mine');
        setPageMeta({
          page: payload.meta?.page || currentPage,
          limit: payload.meta?.limit || PAGE_SIZE,
          totalPages: payload.meta?.totalPages || 1,
          totalItems: payload.meta?.totalItems || 0
        });
      } catch (error) {
        setPageError(error.message || 'Unable to load tasks.');
      } finally {
        setIsLoading(false);
      }
    }

    loadTasks();
  }, [token, selectedStatus, currentPage]);

  function handleStatusFilterChange(nextStatus) {
    setSelectedStatus(nextStatus);
    setCurrentPage(1);
  }

  async function refreshCurrentPage({ page = currentPage, status = selectedStatus } = {}) {
    const payload = await fetchTasks(token, {
      status,
      page,
      limit: PAGE_SIZE
    });

    setTasks(payload.data || []);
    setTaskScope(payload.meta?.scope || 'mine');
    setPageMeta({
      page: payload.meta?.page || page,
      limit: payload.meta?.limit || PAGE_SIZE,
      totalPages: payload.meta?.totalPages || 1,
      totalItems: payload.meta?.totalItems || 0
    });
    setCurrentPage(payload.meta?.page || page);
  }

  async function handleCreateTask(formValues) {
    try {
      setIsSubmitting(true);
      await createTask(formValues, token);
      await refreshCurrentPage({ page: 1 });
      setCurrentPage(1);
      setPageError('');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(task, nextStatus) {
    if (task.status === nextStatus) {
      return;
    }

    const previousTasks = tasks;

    setUpdatingTaskId(task.id);
    setTasks((currentTasks) =>
      currentTasks.map((currentTask) =>
        currentTask.id === task.id
          ? { ...currentTask, status: nextStatus, updatedAt: new Date().toISOString() }
          : currentTask
      )
    );

    try {
      const updatedTask = await updateTask(task.id, { status: nextStatus }, token);
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask))
      );
      setPageError('');
    } catch (error) {
      setTasks(previousTasks);
      setPageError(error.message || 'Unable to update the task status.');
    } finally {
      setUpdatingTaskId(null);
    }
  }

  async function handleDelete(task) {
    const shouldDelete = window.confirm(`Delete "${task.title}"?`);

    if (!shouldDelete) {
      return;
    }

    setDeletingTaskId(task.id);

    try {
      await deleteTask(task.id, token);

      const nextPage = tasks.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      await refreshCurrentPage({ page: nextPage });
      setPageError('');
    } catch (error) {
      setPageError(error.message || 'Unable to delete the task.');
    } finally {
      setDeletingTaskId(null);
    }
  }

  return (
    <section className="page-stack">
      <section className="panel panel-compact">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>{user?.name}&apos;s tasks</h2>
          <p className="section-copy">
            {taskScope === 'all'
              ? 'Admin view shows all tasks.'
              : 'Showing tasks assigned to your account.'}
          </p>
        </div>

        <div className="task-count-card">
          <span>{pageMeta.totalItems}</span>
          <small>total tasks</small>
        </div>
      </section>

      <div className="layout-grid compact-layout-grid">
        <TaskForm onSubmit={handleCreateTask} isSubmitting={isSubmitting} />

        <div className="content-stack">
          <StatusFilter
            value={selectedStatus}
            onChange={handleStatusFilterChange}
            taskCount={tasks.length}
            pageMeta={pageMeta}
          />

          {pageError ? <p className="banner error-text">{pageError}</p> : null}
          {isLoading ? <p className="banner">Loading tasks...</p> : null}

          {!isLoading ? (
            <>
              <TaskList
                tasks={tasks}
                updatingTaskId={updatingTaskId}
                deletingTaskId={deletingTaskId}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />

              <Pagination
                page={pageMeta.page}
                totalPages={pageMeta.totalPages}
                onPageChange={setCurrentPage}
                isLoading={isLoading}
              />
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
