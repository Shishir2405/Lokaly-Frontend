import { cn } from '../../lib/cn';

export function Input({ label, error, leftIcon, className, ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="block mb-1.5 text-sm font-jakarta font-semibold text-ink/80">
          {label}
        </span>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-ink/50 text-lg">
            {leftIcon}
          </span>
        )}
        <input
          className={cn(
            'w-full rounded-2xl bg-white/80 backdrop-blur border-2 border-white focus:border-coral/50 focus:ring-4 focus:ring-peach/40 outline-none px-4 py-3 text-ink placeholder:text-ink/40 transition',
            leftIcon && 'pl-11',
            error && 'border-coral ring-coral/20',
            className
          )}
          {...rest}
        />
      </div>
      {error && <span className="block mt-1 text-xs text-coral font-medium">{error}</span>}
    </label>
  );
}

export function Textarea({ label, error, className, ...rest }) {
  return (
    <label className="block">
      {label && (
        <span className="block mb-1.5 text-sm font-jakarta font-semibold text-ink/80">{label}</span>
      )}
      <textarea
        className={cn(
          'w-full rounded-2xl bg-white/80 backdrop-blur border-2 border-white focus:border-coral/50 focus:ring-4 focus:ring-peach/40 outline-none px-4 py-3 text-ink placeholder:text-ink/40 transition min-h-[120px]',
          error && 'border-coral',
          className
        )}
        {...rest}
      />
      {error && <span className="block mt-1 text-xs text-coral font-medium">{error}</span>}
    </label>
  );
}

export default Input;
