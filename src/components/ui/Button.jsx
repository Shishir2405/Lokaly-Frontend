import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

const variants = {
  primary: 'bg-coral text-white hover:bg-coral/90 shadow-pop',
  secondary: 'bg-ink text-cream hover:bg-ink/90',
  ghost: 'bg-white/60 backdrop-blur text-ink hover:bg-white',
  soft: 'bg-peach text-ink hover:bg-peach/80',
  mint: 'bg-mint text-ink hover:bg-mint/80',
  outline: 'border-2 border-ink text-ink hover:bg-ink hover:text-cream',
};

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
  icon: 'w-11 h-11 grid place-items-center',
};

export function Button({
  as: Comp = motion.button,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  className,
  children,
  ...rest
}) {
  return (
    <Comp
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-jakarta font-semibold transition-colors focus:outline-none focus:ring-4 focus:ring-peach/60 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {leftIcon && <span className="text-lg">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="text-lg">{rightIcon}</span>}
    </Comp>
  );
}

export default Button;
