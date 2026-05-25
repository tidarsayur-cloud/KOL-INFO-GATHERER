'use client';

export function Sidebar() {
  const navItems = [
    { label: 'Dashboard', icon: '📊', href: '#' },
    { label: 'Influencers', icon: '👤', href: '#' },
    { label: 'Compare', icon: '⚖️', href: '#' },
    { label: 'Analytics', icon: '📈', href: '#' },
    { label: 'Settings', icon: '⚙️', href: '#' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500" />
          <span className="font-bold text-white text-sm">KOL Gatherer</span>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}
