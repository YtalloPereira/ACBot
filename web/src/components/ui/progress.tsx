import * as Progress from '@radix-ui/react-progress';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar = ({ progress }: ProgressBarProps) => {
  return (
    <Progress.Root
      className="rounded-full w-32 h-6 bg-border/80 overflow-hidden"
      value={progress}
    >
      <Progress.Indicator
        className="bg-primary size-full"
        style={{
          transform: `translateX(-${100 - progress}%)`,
          transition: 'transform 660ms cubic-bezier(0.65, 0, 0.35, 1)',
        }}
      />
    </Progress.Root>
  );
};
