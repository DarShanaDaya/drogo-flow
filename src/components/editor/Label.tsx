export function Label({ children, className }: { children: React.ReactNode, className?: string }) {
  return <label className={`text-xs font-semibold text-zinc-600 dark:text-zinc-400 ${className || ''}`}>{children}</label>;
}
