'use client';
import { useState } from 'react';

const CATEGORIES = ['General', 'Work', 'Personal', 'Health', 'Finance', 'Education', 'Shopping', 'Other'];

const defaultForm = {
  title: '', description: '', priority: 'medium',
  status: 'todo', dueDate: '', category: 'General', tags: '',
};

export default function TaskForm({ initialData = {}, onSubmit, loading, submitLabel = 'Save Task' }) {
  const [form, setForm] = useState({
    ...defaultForm,
    ...initialData,
    dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.title.length > 200) errs.title = 'Max 200 characters';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const payload = {
      ...form,
      dueDate: form.dueDate || null,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="card form-card animate-slide">
      <div className="form-group">
        <label className="form-label">Task Title *</label>
        <input className="form-input" placeholder="What needs to be done?" value={form.title} onChange={set('title')} maxLength={200} />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-textarea" placeholder="Add more details..." value={form.description} onChange={set('description')} maxLength={1000} />
        <div className="form-hint">{form.description.length}/1000 characters</div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-select" value={form.priority} onChange={set('priority')}>
            <option value="low">🟢 Low</option>
            <option value="medium">🟡 Medium</option>
            <option value="high">🔴 High</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-select" value={form.status} onChange={set('status')}>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.category} onChange={set('category')}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input type="date" className="form-input" value={form.dueDate} onChange={set('dueDate')}
            style={{ colorScheme: 'dark' }} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Tags</label>
        <input className="form-input" placeholder="design, urgent, review (comma separated)" value={form.tags} onChange={set('tags')} />
        <div className="form-hint">Separate tags with commas</div>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={() => window.history.back()}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ Saving...' : `✅ ${submitLabel}`}
        </button>
      </div>
    </form>
  );
}
