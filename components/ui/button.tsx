import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 ease-in-out disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:scale-[1.02] active:scale-[0.98] disabled:hover:scale-100",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus-visible:ring-[var(--primary)] shadow-sm hover:shadow-md",
        primary: "bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] focus-visible:ring-[var(--primary)] shadow-sm hover:shadow-md",
        secondary: "bg-[var(--secondary)] text-white hover:bg-[var(--secondary-dark)] focus-visible:ring-[var(--secondary)] shadow-sm hover:shadow-md",
        destructive: "bg-[var(--danger)] text-white hover:bg-[var(--danger-dark)] focus-visible:ring-[var(--danger)] shadow-sm hover:shadow-md",
        danger: "bg-[var(--danger)] text-white hover:bg-[var(--danger-dark)] focus-visible:ring-[var(--danger)] shadow-sm hover:shadow-md",
        success: "bg-[var(--success)] text-white hover:bg-[var(--success-dark)] focus-visible:ring-[var(--success)] shadow-sm hover:shadow-md",
        outline: "border-2 border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 focus-visible:ring-gray-300",
        ghost: "bg-transparent hover:bg-gray-100 focus-visible:ring-gray-300",
        link: "text-[var(--primary)] underline-offset-4 hover:underline hover:scale-100 !p-0 text-blue-600 hover:text-blue-700",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 py-1.5 text-sm has-[>svg]:px-2.5",
        md: "h-10 px-4 py-2.5 has-[>svg]:px-3.5",
        lg: "h-11 rounded-md px-6 py-3 text-base has-[>svg]:px-5",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
      textPosition: {
        center: "justify-center text-center",
        left: "justify-start text-left",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      textPosition: "center",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  textPosition?: "center" | "left"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, textPosition = "center", asChild = false, loading = false, startIcon, endIcon, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    const isDisabled = disabled || loading

    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ variant, size, textPosition, className }))}
        disabled={isDisabled}
        {...props}
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {!loading && startIcon && <span className="flex items-center">{startIcon}</span>}
        <span>{children}</span>
        {!loading && endIcon && <span className="flex items-center">{endIcon}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
