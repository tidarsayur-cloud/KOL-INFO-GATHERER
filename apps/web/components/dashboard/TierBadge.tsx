interface TierBadgeProps {
  tier: string;
  size?: 'sm' | 'md' | 'lg';
}

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  mega: { label: 'Mega KOL', color: 'text-yellow-300', bg: 'bg-yellow-500/20 border border-yellow-500/40' },
  macro: { label: 'Macro', color: 'text-purple-300', bg: 'bg-purple-500/20 border border-purple-500/40' },
  micro: { label: 'Micro', color: 'text-blue-300', bg: 'bg-blue-500/20 border border-blue-500/40' },
  nano: { label: 'Nano', color: 'text-green-300', bg: 'bg-green-500/20 border border-green-500/40' },
};

export function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const config = TIER_CONFIG[tier?.toLowerCase()] ?? {
    label: tier,
    color: 'text-gray-300',
    bg: 'bg-gray-500/20 border border-gray-500/40',
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  }[size];

  return (
    <span className={`inline-flex items-center rounded-full font-semibold ${config.bg} ${config.color} ${sizeClasses}`}>
      {config.label}
    </span>
  );
}
