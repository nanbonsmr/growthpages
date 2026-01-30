import { useState, useEffect } from 'react';
import { CountdownProps } from '../types';

interface CountdownBlockProps {
  props: CountdownProps;
  isSelected: boolean;
  isPreview?: boolean;
  onUpdate?: (props: Partial<CountdownProps>) => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownBlock({ props }: CountdownBlockProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(props.targetDate).getTime() - Date.now();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [props.targetDate]);

  const units = [
    { key: 'days', label: 'Days', show: props.showDays },
    { key: 'hours', label: 'Hours', show: props.showHours },
    { key: 'minutes', label: 'Min', show: props.showMinutes },
    { key: 'seconds', label: 'Sec', show: props.showSeconds },
  ].filter((u) => u.show);

  return (
    <div className="text-center">
      {props.label && (
        <p className="text-muted-foreground text-sm mb-3">{props.label}</p>
      )}
      <div className="flex justify-center gap-3">
        {units.map((unit) => (
          <div
            key={unit.key}
            className="flex flex-col items-center"
          >
            <div
              className="text-3xl font-bold w-16 h-16 flex items-center justify-center rounded-lg"
              style={{ backgroundColor: `${props.color}20`, color: props.color }}
            >
              {String(timeLeft[unit.key as keyof TimeLeft]).padStart(2, '0')}
            </div>
            <span className="text-xs text-muted-foreground mt-1">{unit.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
