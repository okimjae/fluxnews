interface AdSlotProps {
  size?: 'leaderboard' | 'rectangle';
  className?: string;
}

export function AdSlot({ size = 'leaderboard', className = '' }: AdSlotProps) {
  return (
    <div
      className={`ad-slot ad-slot-${size} ${className}`}
      aria-hidden="true"
      role="presentation"
    />
  );
}
