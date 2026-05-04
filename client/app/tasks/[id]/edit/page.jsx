'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { taskApi } from '../../../../lib/api';
import TaskForm from '../../../../components/TaskForm';

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    taskApi.getById(id)
      .then(res => setTask(res.data.data))
      .catch(() => setError('Task not found'))
      .finally(() => setFetching(false));
  }, [id]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await taskApi.update(id, data);
      toast.success('Task updated successfully! ✏️');
      router.push('/tasks');
    } catch (e) {
      toast.error(e.message);
    } finally { setLoading(false); }
  };

  if (fetching) {
    return (
      <div className="page-wrapper">
        <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 24 }} />
        <div className="card form-card">
          {[1,2,3,4].map(i => (
            <div key={i} style={{ marginBottom: 20 }}>
              <div className="skeleton" style={{ height: 14, width: 100, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 44, borderRadius: 10 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <div className="empty-title">{error}</div>
          <Link href="/tasks" className="btn btn-primary" style={{ marginTop: 20 }}>← Back to Tasks</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Task ✏️</h1>
          <p className="page-subtitle">Update task details</p>
        </div>
        <Link href="/tasks" className="btn btn-secondary">← Back to Tasks</Link>
      </div>
      {task && <TaskForm initialData={task} onSubmit={handleSubmit} loading={loading} submitLabel="Update Task" />}
    </div>
  );
}
