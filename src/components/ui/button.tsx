import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:focus-visible:ring-zinc-50/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          {
            "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 shadow-sm dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200": variant === 'default',
            "bg-red-500 text-white hover:bg-red-600 shadow-sm": variant === 'destructive',
            "border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900 dark:text-zinc-50 shadow-sm": variant === 'outline',
            "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700": variant === 'secondary',
            "hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800": variant === 'ghost',
            "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50": variant === 'link',
          },
          {
            "h-10 px-4 py-2": size === 'default',
            "h-8 px-3 text-xs": size === 'xs',
            "h-9 px-3.5 text-sm": size === 'sm',
            "h-11 px-8 text-base": size === 'lg',
            "h-10 w-10": size === 'icon',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
