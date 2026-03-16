import { useState, useEffect } from "react";

interface CountdownProps {
  endTime: number;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function Countdown({ endTime }: CountdownProps) {
  const [remaining, setRemaining] = useState(() =>
    Math.max(0, endTime - Math.floor(Date.now() / 1000))
  );

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, endTime - Math.floor(Date.now() / 1000));
      setRemaining(diff);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTime]);

  if (remaining <= 0) {
    return (
      <span data-testid="countdown" className="font-mono text-lg text-destructive">
        ENDED
      </span>
    );
  }

  return (
    <span data-testid="countdown" className="font-mono text-lg text-primary">
      {formatTime(remaining)}
    </span>
  );
}
