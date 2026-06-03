import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:   "bg-primary hover:bg-primary-dark disabled:bg-primary-light text-white shadow-sm",
  secondary: "bg-secondary hover:bg-secondary-dark disabled:opacity-50 text-white shadow-sm",
  ghost:     "border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50",
  danger:    "bg-red-500 hover:bg-red-600 disabled:bg-red-200 text-white",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3.5 text-base rounded-2xl",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: Props) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        font-semibold transition-colors active:scale-95
        disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : children}
    </button>
  );
}
