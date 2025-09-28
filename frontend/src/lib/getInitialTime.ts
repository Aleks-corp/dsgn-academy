export default function getInitialTime(
  duration: string,
  progress: number
): number {
  const durationSec = Number(duration) || 0;

  if (durationSec > 0 && progress >= durationSec - 5) {
    return 0;
  }

  return progress;
}
