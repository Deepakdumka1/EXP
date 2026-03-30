"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
import { useEffect, useState, createContext, useContext, useCallback } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  addToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
const iconColors = { success: "text-green-600", error: "text-red-600", warning: "text-amber-600", info: "text-blue-600" };

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const Icon = icons[toast.type];
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 200);
    }, 4800);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={cn(
        "flex items-center gap-3 min-w-[320px] max-w-[420px] p-3.5 rounded-xl bg-[var(--card-solid)] border border-[var(--border)] shadow-xl transition-all duration-200",
        isExiting ? "opacity-0 translate-y-2 scale-95" : "opacity-100 animate-[slideUp_200ms_ease-out]"
      )}
    >
      <Icon className={cn("w-5 h-5 shrink-0", iconColors[toast.type])} />
      <span className="text-sm flex-1">{toast.message}</span>
      <button
        onClick={() => { setIsExiting(true); setTimeout(() => onRemove(toast.id), 200); }}
        className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-pointer p-1 rounded-md hover:bg-[var(--hover)] transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev.slice(-2), { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col gap-2 max-md:left-4 max-md:right-4 max-md:items-center">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
