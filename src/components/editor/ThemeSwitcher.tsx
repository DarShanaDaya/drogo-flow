'use client';

interface Props {
  theme: string;
  onChange: (t: any) => void;
  direction: string;
  onDirectionChange: (d: string) => void;
}

export function ThemeSwitcher({ theme, onChange, direction, onDirectionChange }: Props) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={theme}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 px-2 rounded-md border bg-white dark:bg-zinc-900 text-xs"
      >
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="forest">Forest</option>
        <option value="neutral">Neutral</option>
        <option value="base">Base</option>
      </select>

      <select
        value={direction}
        onChange={(e) => onDirectionChange(e.target.value)}
        className="h-7 px-2 rounded-md border bg-white dark:bg-zinc-900 text-xs"
      >
        <option value="TD">Top-Down</option>
        <option value="LR">Left-Right</option>
        <option value="BT">Bottom-Top</option>
        <option value="RL">Right-Left</option>
      </select>
    </div>
  );
}
