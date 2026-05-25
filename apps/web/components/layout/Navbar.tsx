'use client';

export function Navbar() {
  return (
    <header className="h-16 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <span className="text-lg font-semibold text-white">KOL Info Gatherer</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-400">Analytics Platform</span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold">
          K
        </div>
      </div>
    </header>
  );
}
