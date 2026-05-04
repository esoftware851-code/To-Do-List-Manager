'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { taskApi } from '../lib/api';
import TaskCard from '../components/TaskCard';

function StatCard({ number, label, variant = '', icon }) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-number">{number}</div>
      <div className="stat-label">{label}</div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="task-card">
      <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 10 }} />
      <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 14 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ height: 22, width: 70, borderRadius: 20 }} />
        <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 20 }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true); setError(null);
    try {
      const [statsRes, tasksRes] = await Promise.all([
        taskApi.getStats(),
        taskApi.getAll({ sort: '-createdAt', limit: 5 }),
      ]);
      setStats(statsRes.data.data);
      setRecentTasks(tasksRes.data.data);
    } catch (e) {
      setError('Cannot connect to server. Make sure the backend is running on port 5000.');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleUpdate = (updated) => setRecentTasks(t => t.map(x => x._id === updated._id ? updated : x));
  const handleDelete = (id) => setRecentTasks(t => t.filter(x => x._id !== id));

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard 🏠</h1>
          <p className="page-subtitle">Welcome back! Here's your productivity overview.</p>
        </div>
        <Link href="/tasks/new" className="btn btn-primary">➕ New Task</Link>
      </div>

      {error && (
        <div style={{ padding: '16px 20px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, color: '#f87171', marginBottom: 24, fontSize: 14 }}>
          ⚠️ {error}
        </div>
      )}

      {/* Stats */}
      <div className="stats-grid">
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="stat-card"><div className="skeleton" style={{ height: 40, width: '50%', marginBottom: 8 }} /><div className="skeleton" style={{ height: 14, width: '70%' }} /></div>)
        ) : stats ? (
          <>
            <StatCard number={stats.total} label="Total Tasks" icon="📋" variant="purple" />
            <StatCard number={stats.completed} label="Completed" icon="✅" variant="success" />
            <StatCard number={stats.inProgress} label="In Progress" icon="🔄" variant="" />
            <StatCard number={stats.todo} label="To Do" icon="📌" variant="" />
            <StatCard number={stats.highPriority} label="High Priority" icon="🔴" variant="danger" />
            <StatCard number={stats.overdue} label="Overdue" icon="⏰" variant="warning" />
          </>
        ) : null}
      </div>

      {/* Completion Progress */}
      {stats && (
        <div className="card" style={{ padding: '24px', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontWeight: 600 }}>Overall Completion Rate</span>
            <span style={{ fontWeight: 800, fontSize: 20, color: '#6366f1' }}>{stats.completionRate}%</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${stats.completionRate}%` }} />
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
            <span>✅ {stats.completed} Completed</span>
            <span>🔄 {stats.inProgress} In Progress</span>
            <span>📌 {stats.todo} To Do</span>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="section-title">⏱️ Recent Tasks</div>
      <div className="tasks-grid">
        {loading ? (
          [1,2,3].map(i => <SkeletonCard key={i} />)
        ) : recentTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <div className="empty-title">No tasks yet</div>
            <div className="empty-text">Create your first task to get started!</div>
            <Link href="/tasks/new" className="btn btn-primary" style={{ marginTop: 20 }}>➕ Create Task</Link>
          </div>
        ) : (
          recentTasks.map(task => (
            <TaskCard key={task._id} task={task} onUpdate={handleUpdate} onDelete={handleDelete} />
          ))
        )}
      </div>

      {recentTasks.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <Link href="/tasks" className="btn btn-secondary">View All Tasks →</Link>
        </div>
      )}
    </div>
  );
}
