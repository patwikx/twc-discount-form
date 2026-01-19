import { cn } from "@/lib/utils";
import * as React from "react";

// Card
export function Card({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("border-2 border-black bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", className)} {...props}>
      {children}
    </div>
  );
}

// Button
export function Button({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "bg-black text-white px-6 py-3 font-mono font-bold uppercase transition-all hover:bg-white hover:text-black border-2 border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
        className
      )}
      {...props}
    />
  );
}

// Input
export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full border-2 border-black bg-transparent px-3 py-2 font-mono placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2",
        className
      )}
      {...props}
    />
  );
}

// Checkbox (Custom)
export function Checkbox({ id, checked, onCheckedChange, label }: { id: string; checked: boolean; onCheckedChange: (c: boolean) => void; label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <div
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "h-6 w-6 cursor-pointer border-2 border-black flex items-center justify-center transition-all",
          checked ? "bg-black" : "bg-white"
        )}
      >
        {checked && (
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeLinecap="square" 
              strokeLinejoin="miter" 
              className="h-4 w-4 text-white"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
        )}
      </div>
      <label htmlFor={id} className="cursor-pointer font-mono font-bold select-none" onClick={() => onCheckedChange(!checked)}>
        {label}
      </label>
    </div>
  );
}

// Badge
export function Badge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-400 text-black",
    APPROVED: "bg-green-500 text-white",
    REJECTED: "bg-red-500 text-white",
    USED: "bg-gray-200 text-gray-500 line-through",
  };
  return (
    <span className={cn("border-2 border-black px-3 py-1 font-mono font-bold text-sm", colors[status] || "bg-white")}>
      {status}
    </span>
  );
}
