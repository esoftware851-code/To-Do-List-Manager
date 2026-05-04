'use client';
import { useState } from 'react';
import Link from 'next/link';
import { taskApi } from '../lib/api';
import toast from 'react-hot-toast';

function getPriorityClass(p) { return `badge badge-${p}`; }
function getStatusClass(s) { return `badge badge-${s}`; }

function formatDate(d) {
  if (!d) return null;
  const date = new Date(d);
  const now = new Date();
  const diff = (date - now) / 86400000;
  return { label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), overdue: diff < 0, soon: diff >= 0 && diff <= 2 };
}

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [loading, setLoading] = useState(false);
  const due = task.dueDate ? formatDate(task.dueDate) : null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const res = await taskApi.toggle(task._id);
      toast.success(res.data.message);
      onUpdate(res.data.data);
    } catch (e) {
      toast.error(e.message);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return;
    try {
      await taskApi.delete(task._id);
      toast.success('Task deleted');
      onDelete(task._id);
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className={`task-card animate-fade ${task.status === 'completed' ? 'completed' : ''}`}>
      <div className="task-card-header">
        <button
          className={`task-checkbox ${task.status === 'completed' ? 'checked' : ''}`}
          onClick={handleToggle}
          disabled={loading}
          title="Toggle complete"
        >
          {task.status === 'completed' && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
        </button>
        <div style={{ flex: 1 }}>
          <div className="task-title-text">{task.title}</div>
          {task.description && <div className="task-description">{task.description}</div>}
        </div>
      </div>

      <div className="task-meta">
        <span className={getPriorityClass(task.priority)}>
          {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
        </span>
        <span className={getStatusClass(task.status)}>{task.status}</span>
        {task.category && (
          <span className="badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
            🏷️ {task.category}
          </span>
        )}
        {due && (
          <span className={`due-date ${due.overdue ? 'overdue' : due.soon ? 'soon' : ''}`}>
            📅 {due.label} {due.overdue ? '(overdue)' : due.soon ? '(soon)' : ''}
          </span>
        )}
        <div className="task-actions">
          <Link href={`/tasks/${task._id}/edit`} className="btn btn-secondary btn-sm btn-icon" title="Edit">✏️</Link>
          <button className="btn btn-danger btn-sm btn-icon" onClick={handleDelete} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}
