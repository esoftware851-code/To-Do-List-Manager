'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { taskApi } from '../../lib/api';
import TaskCard from '../../components/TaskCard';
import FilterBar from '../../components/FilterBar';

function SkeletonCard() {
  return (
    <div className="task-card">
      <div className="skeleton" style={{ height: 20, width: '55%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, width: '75%', marginBottom: 14 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
        <div className="skeleton" style={{ height: 22, width: 90, borderRadius: 20 }} />
      </div>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all', priority: 'all', sort: '-createdAt' });

  const fetchTasks = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.priority !== 'all') params.priority = filters.priority;
      params.sort = filters.sort;
      const res = await taskApi.getAll(params);
      setTasks(res.data.data);
      setTotal(res.data.pagination.total);
    } catch (e) {
      setError('Failed to load tasks. Is the backend running?');
    } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => {
    const t = setTimeout(fetchTasks, filters.search ? 400 : 0);
    return () => clearTimeout(t);
  }, [fetchTasks, filters.search]);

  const handleUpdate = (updated) => setTasks(t => t.map(x => x._id === updated._id ? updated : x));
  const handleDelete = (id) => { setTasks(t => t.filter(x => x._id !== id)); setTotal(c => c - 1); };

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Tasks 📋</h1>
          <p className="page-subtitle">{loading ? 'Loading...' : `${total} task${total !== 1 ? 's' : ''} found`}</p>
        </div>
        <Link href="/tasks/new" className="btn btn-primary">➕ New Task</Link>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      {error && (
        <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#f87171', marginBottom: 20, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      <div className="tasks-grid">
        {loading ? (
          [1,2,3,4,5].map(i => <SkeletonCard key={i} />)
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-title">No tasks found</div>
            <div className="empty-text">Try adjusting your filters or create a new task.</div>
            <Link href="/tasks/new" className="btn btn-primary" style={{ marginTop: 20 }}>➕ Create Task</Link>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard key={task._id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}
