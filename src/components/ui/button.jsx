import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, type = "button", ...props }, ref) => {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
        "px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }