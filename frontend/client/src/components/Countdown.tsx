import { useState, useEffect } from "react";

interface CountdownProps {
  endTime: number;
}

function getDigits(seconds: number): string[] {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const str = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return str.split("");
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
      <span data-testid="countdown" className="font-mono text-lg font-extrabold text-[var(--molded-orange)]" style={{ textShadow: "0 0 10px rgba(255, 77, 0, 0.3)" }}>
        ENDED
      </span>
    );
  }

  const digits = getDigits(remaining);

  return (
    <span data-testid="countdown" className="inline-flex items-center gap-0.5 font-mono text-lg">
      {digits.map((d, i) =>
        d === ":" ? (
          <span key={i} className="mx-0.5 font-extrabold text-[var(--molded-orange)]" style={{ textShadow: "0 0 10px rgba(255, 77, 0, 0.3)" }}>:</span>
        ) : (
          <span key={i} className="counter-digit text-lg">
            {d}
          </span>
        )
      )}
    </span>
  );
}
