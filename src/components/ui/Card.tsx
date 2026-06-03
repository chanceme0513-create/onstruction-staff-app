import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg" | "none";
};

const paddingClasses = {
  none: "",
  sm:   "p-3",
  md:   "p-5",
  lg:   "p-6",
};

export function Card({ padding = "md", className = "", children, ...props }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
