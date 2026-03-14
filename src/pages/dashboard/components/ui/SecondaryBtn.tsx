import React from "react";

export const SecondaryBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 border border-border text-[13px] font-medium text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 rounded-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">{children}</button>
);
