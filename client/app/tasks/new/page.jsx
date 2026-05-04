'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { taskApi } from '../../../lib/api';
import TaskForm from '../../../components/TaskForm';

export default function NewTaskPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await taskApi.create(data);
      toast.success('Task created successfully! 🎉');
      router.push('/tasks');
    } catch (e) {
      toast.error(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Task ➕</h1>
          <p className="page-subtitle">Add a new task to your list</p>
        </div>
        <Link href="/tasks" className="btn btn-secondary">← Back to Tasks</Link>
      </div>
      <TaskForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Task" />
    </div>
  );
}
