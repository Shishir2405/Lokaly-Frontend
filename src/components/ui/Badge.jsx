import { cn } from '../../lib/cn';

const tones = {
  coral: 'bg-coral/15 text-coral',
  mint: 'bg-mint text-ink',
  peach: 'bg-peach text-ink',
  lavender: 'bg-lavender text-ink',
  butter: 'bg-butter text-ink',
  ink: 'bg-ink text-cream',
  leaf: 'bg-leaf/20 text-leaf',
};

export function Badge({ tone = 'peach', className, icon, children }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-jakarta font-semibold',
      tones[tone],
      className
    )}>
      {icon && <span className="text-sm">{icon}</span>}
      {children}
    </span>
  );
}

export default Badge;
