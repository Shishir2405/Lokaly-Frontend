import { AnimatePresence, motion } from 'framer-motion';
import { HiXMark } from 'react-icons/hi2';

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${width} rounded-3xl bg-cream shadow-2xl border border-white overflow-hidden`}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/5">
              <h3 className="font-fraunces text-xl text-ink">{title}</h3>
              <button
                aria-label="close"
                onClick={onClose}
                className="w-9 h-9 grid place-items-center rounded-full hover:bg-peach/60 text-ink"
              >
                <HiXMark />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
