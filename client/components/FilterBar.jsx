'use client';

export default function FilterBar({ filters, onChange }) {
  const set = (field) => (e) => onChange({ ...filters, [field]: e.target.value });

  return (
    <div className="filter-bar">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={set('search')}
        />
      </div>

      <select className="filter-select" value={filters.status || 'all'} onChange={set('status')}>
        <option value="all">All Status</option>
        <option value="todo">📌 To Do</option>
        <option value="in-progress">🔄 In Progress</option>
        <option value="completed">✅ Completed</option>
      </select>

      <select className="filter-select" value={filters.priority || 'all'} onChange={set('priority')}>
        <option value="all">All Priority</option>
        <option value="high">🔴 High</option>
        <option value="medium">🟡 Medium</option>
        <option value="low">🟢 Low</option>
      </select>

      <select className="filter-select" value={filters.sort || '-createdAt'} onChange={set('sort')}>
        <option value="-createdAt">Newest First</option>
        <option value="createdAt">Oldest First</option>
        <option value="-priority">Priority (High→Low)</option>
        <option value="dueDate">Due Date</option>
        <option value="title">Title A–Z</option>
      </select>
    </div>
  );
}
