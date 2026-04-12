import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';

export function Card({ className, hover = true, as: Comp = motion.div, children, ...rest }) {
  return (
    <Comp
      whileHover={hover ? { y: -4 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={cn(
        'rounded-3xl bg-white/80 backdrop-blur shadow-soft border border-white overflow-hidden',
        className
      )}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export default Card;
