import { cn } from '../../lib/cn';

function initials(name = '') {
  return name.split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
}

export function Avatar({ src, name = '', size = 'md', aura, className }) {
  const sizes = { xs: 'w-8 h-8 text-xs', sm: 'w-10 h-10 text-sm', md: 'w-14 h-14 text-base', lg: 'w-20 h-20 text-xl', xl: 'w-28 h-28 text-2xl' };
  const auraColor = aura >= 80 ? 'ring-leaf' : aura >= 50 ? 'ring-tangerine' : aura ? 'ring-coral' : 'ring-white';

  return (
    <div className={cn('relative inline-grid place-items-center', className)}>
      <div className={cn(
        'absolute inset-0 -m-1.5 rounded-full ring-4 opacity-70 blur-[1px]',
        auraColor
      )} />
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('relative rounded-full object-cover ring-4 ring-white', sizes[size])}
        />
      ) : (
        <div className={cn(
          'relative rounded-full bg-gradient-to-br from-peach to-lavender grid place-items-center font-jakarta font-bold text-ink ring-4 ring-white',
          sizes[size]
        )}>{initials(name)}</div>
      )}
    </div>
  );
}

export default Avatar;
