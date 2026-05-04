'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { taskApi } from '../lib/api';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/tasks', label: 'All Tasks', icon: '📋' },
  { href: '/tasks/new', label: 'Add Task', icon: '➕' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/about', label: 'About', icon: 'ℹ️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [taskCount, setTaskCount] = useState(null);

  useEffect(() => {
    taskApi.getStats()
      .then(res => setTaskCount(res.data.data.total))
      .catch(() => {});
  }, []);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">✅</div>
        <div className="sidebar-logo-text">Task<span>Flow</span></div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link ${isActive(item.href) ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
            {item.href === '/tasks' && taskCount !== null && (
              <span className="nav-badge">{taskCount}</span>
            )}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>TaskFlow v1.0.0</p>
        <p style={{ marginTop: 4, fontSize: 11 }}>Built with Next.js + Express</p>
      </div>
    </aside>
  );
}
