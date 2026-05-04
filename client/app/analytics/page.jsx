'use client';
import { useEffect, useState } from 'react';
import { taskApi } from '../../lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#10b981' };
const STATUS_COLORS = ['#6366f1', '#f59e0b', '#10b981'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1e1e2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
      <p style={{ fontWeight: 600, marginBottom: 4 }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: <b>{p.value}</b></p>
      ))}
    </div>
  );
};

function StatRow({ label, value, color }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 15, fontWeight: 700, color: color || 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    taskApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => setError('Failed to load analytics. Is the backend running?'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="skeleton" style={{ height: 40, width: 250, marginBottom: 24 }} />
        <div className="charts-grid">
          {[1,2].map(i => <div key={i} className="card chart-container"><div className="skeleton" style={{ height: 260 }} /></div>)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper">
        <div className="empty-state">
          <div className="empty-icon">⚠️</div>
          <div className="empty-title">Failed to load analytics</div>
          <div className="empty-text">{error}</div>
        </div>
      </div>
    );
  }

  const priorityData = stats.priorityBreakdown.map(p => ({
    name: p._id.charAt(0).toUpperCase() + p._id.slice(1),
    value: p.count,
    fill: COLORS[p._id] || '#6366f1',
  }));

  const statusData = [
    { name: 'To Do', value: stats.todo },
    { name: 'In Progress', value: stats.inProgress },
    { name: 'Completed', value: stats.completed },
  ];

  const categoryData = stats.categoryBreakdown.map(c => ({
    name: c._id || 'General',
    count: c.count,
  }));

  const trendData = stats.dailyTrend.map(d => ({
    date: new Date(d._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    tasks: d.count,
  }));

  return (
    <div className="page-wrapper animate-fade">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics 📊</h1>
          <p className="page-subtitle">Insights into your productivity and task management</p>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        {[
          { label: 'Total Tasks', val: stats.total, icon: '📋', v: 'purple' },
          { label: 'Completion Rate', val: `${stats.completionRate}%`, icon: '🎯', v: 'success' },
          { label: 'Overdue', val: stats.overdue, icon: '⏰', v: 'warning' },
          { label: 'High Priority', val: stats.highPriority, icon: '🔴', v: 'danger' },
        ].map(({ label, val, icon, v }) => (
          <div key={label} className={`stat-card ${v}`}>
            <div className="stat-number">{val}</div>
            <div className="stat-label">{label}</div>
            <div className="stat-icon">{icon}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        {/* Priority Pie */}
        <div className="card chart-container">
          <div className="section-title">🔴 Tasks by Priority</div>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={priorityData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                  {priorityData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: 40 }}><div>No data yet</div></div>}
        </div>

        {/* Status Pie */}
        <div className="card chart-container">
          <div className="section-title">📌 Tasks by Status</div>
          {stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {statusData.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(v) => <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: 40 }}><div>No data yet</div></div>}
        </div>

        {/* Category Bar */}
        <div className="card chart-container">
          <div className="section-title">🏷️ Tasks by Category</div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={categoryData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#6366f1" radius={[4,4,0,0]} name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: 40 }}><div>No data yet</div></div>}
        </div>

        {/* Daily Trend */}
        <div className="card chart-container">
          <div className="section-title">📈 Tasks Created (Last 7 Days)</div>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trendData} margin={{ left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="tasks" fill="#8b5cf6" radius={[4,4,0,0]} name="New Tasks" />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state" style={{ padding: 40 }}><div>Create tasks to see trends</div></div>}
        </div>
      </div>

      {/* Summary Table */}
      <div className="card" style={{ padding: 24, marginTop: 4 }}>
        <div className="section-title">📋 Summary</div>
        <StatRow label="Total Tasks" value={stats.total} />
        <StatRow label="Completed" value={stats.completed} color="#10b981" />
        <StatRow label="In Progress" value={stats.inProgress} color="#6366f1" />
        <StatRow label="To Do" value={stats.todo} />
        <StatRow label="High Priority" value={stats.highPriority} color="#ef4444" />
        <StatRow label="Overdue" value={stats.overdue} color="#f59e0b" />
        <StatRow label="Completion Rate" value={`${stats.completionRate}%`} color="#10b981" />
      </div>
    </div>
  );
}
