import Link from 'next/link';

export const metadata = {
  title: 'About — TaskFlow',
  description: 'Learn about TaskFlow, a professional task management application.',
};

const features = [
  { icon: '✅', title: 'Full CRUD', desc: 'Create, read, update, and delete tasks seamlessly with real-time feedback.' },
  { icon: '🔍', title: 'Smart Search', desc: 'Instantly search tasks by title, description, or tags with debounced queries.' },
  { icon: '🎯', title: 'Priority System', desc: 'Organize tasks with High, Medium, and Low priority levels and visual indicators.' },
  { icon: '📊', title: 'Analytics', desc: 'Rich charts showing completion rates, priority breakdowns, and productivity trends.' },
  { icon: '🏷️', title: 'Categories & Tags', desc: 'Group tasks into categories and tag them for precise organization.' },
  { icon: '📅', title: 'Due Dates', desc: 'Set deadlines and get visual alerts for overdue or upcoming tasks.' },
];

const techStack = [
  { label: 'Next.js 14', color: '#fff' },
  { label: 'React 18', color: '#61dafb' },
  { label: 'Express.js', color: '#68d391' },
  { label: 'MongoDB', color: '#47a248' },
  { label: 'Mongoose', color: '#aa0000' },
  { label: 'Recharts', color: '#8b5cf6' },
  { label: 'Axios', color: '#6366f1' },
];

export default function AboutPage() {
  return (
    <div className="page-wrapper animate-fade">
      {/* Hero */}
      <div className="about-hero">
        <h1>TaskFlow</h1>
        <p>A professional, full-stack task management application built with modern web technologies. Stay organized, track progress, and boost your productivity.</p>
        <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tasks/new" className="btn btn-primary">➕ Create Your First Task</Link>
          <Link href="/tasks" className="btn btn-secondary">📋 View All Tasks</Link>
        </div>
      </div>

      {/* Features */}
      <div className="section-title" style={{ marginBottom: 20 }}>✨ Features</div>
      <div className="feature-grid" style={{ marginBottom: 40 }}>
        {features.map(f => (
          <div key={f.title} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <div className="feature-desc">{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div className="section-title">🛠️ Technology Stack</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <p style={{ fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>Frontend</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Built with <b>Next.js 14</b> (App Router) for server-side capabilities and optimal performance. <b>React 18</b> powers the UI with hooks-based state management. <b>Recharts</b> provides beautiful, responsive data visualizations. <b>Axios</b> handles all API communication.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 700, marginBottom: 12, color: 'var(--accent)' }}>Backend</p>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              <b>Express.js</b> provides a fast, minimal REST API on port 5000. <b>MongoDB</b> stores task data with flexible document structure. <b>Mongoose</b> adds schema validation and elegant query APIs. <b>CORS</b> is configured to allow only the frontend origin.
            </p>
          </div>
        </div>
        <div className="divider" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {techStack.map(t => (
            <span key={t.label} className="tech-badge" style={{ borderColor: `${t.color}30`, color: t.color, background: `${t.color}10` }}>
              {t.label}
            </span>
          ))}
        </div>
      </div>

      {/* API Info */}
      <div className="card" style={{ padding: 32 }}>
        <div className="section-title">🔌 API Reference</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['Method', 'Endpoint', 'Description'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-secondary)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['GET', '/api/tasks', 'Get all tasks (supports ?search, ?status, ?priority, ?sort)'],
                ['GET', '/api/tasks/:id', 'Get single task by ID'],
                ['POST', '/api/tasks', 'Create a new task'],
                ['PUT', '/api/tasks/:id', 'Update an existing task'],
                ['PATCH', '/api/tasks/:id/toggle', 'Toggle task completion'],
                ['DELETE', '/api/tasks/:id', 'Delete a task'],
                ['GET', '/api/tasks/stats', 'Get analytics statistics'],
                ['GET', '/api/health', 'Health check endpoint'],
              ].map(([method, route, desc]) => (
                <tr key={route} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <span className="badge" style={{
                      background: method === 'GET' ? 'rgba(16,185,129,0.1)' : method === 'POST' ? 'rgba(99,102,241,0.1)' : method === 'PUT' ? 'rgba(245,158,11,0.1)' : method === 'DELETE' ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.1)',
                      color: method === 'GET' ? '#34d399' : method === 'POST' ? '#818cf8' : method === 'PUT' ? '#fbbf24' : method === 'DELETE' ? '#f87171' : '#c084fc',
                      border: 'none'
                    }}>{method}</span>
                  </td>
                  <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontSize: 13, color: 'var(--text-secondary)' }}>{route}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}