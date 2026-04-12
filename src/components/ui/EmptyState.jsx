import { HiSparkles } from 'react-icons/hi2';

export function EmptyState({ title = 'Nothing here yet', hint = 'Try coming back soon.', icon }) {
  return (
    <div className="grid place-items-center py-16 text-center">
      <div className="w-20 h-20 grid place-items-center rounded-full bg-peach/60 text-ink text-3xl mb-4">
        {icon || <HiSparkles />}
      </div>
      <h4 className="font-fraunces text-2xl text-ink mb-1">{title}</h4>
      <p className="font-caveat text-xl text-mauve">{hint}</p>
    </div>
  );
}

export default EmptyState;
