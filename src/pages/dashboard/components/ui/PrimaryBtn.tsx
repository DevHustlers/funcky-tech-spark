import React from "react";

export const PrimaryBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-[13px] font-medium rounded-lg hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100">{children}</button>
);
