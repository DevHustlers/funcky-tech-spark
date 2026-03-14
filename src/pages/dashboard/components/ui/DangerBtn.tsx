import React from "react";

export const DangerBtn = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[13px] font-medium hover:bg-red-500/20 transition-colors">{children}</button>
);
