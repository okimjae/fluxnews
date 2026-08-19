import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  label: string;
}

export function Badge({ label, className = '', ...props }: BadgeProps) {
  return (
    <span className={`badge ${className}`.trim()} {...props}>
      {label}
    </span>
  );
}
