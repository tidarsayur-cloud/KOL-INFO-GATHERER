'use client';

export function SyncStatus() {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/30 border border-green-700/50">
      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
      <span className="text-xs text-green-400 font-medium">Live Sync</span>
    </div>
  );
}
