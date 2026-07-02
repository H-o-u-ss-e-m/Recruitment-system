import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence>
          {toasts.map((toast) => {
            let bgColor = "bg-white border-slate-100 shadow-xl";
            let iconColor = "text-brand-blue-600";
            let IconComponent = Info;

            if (toast.type === "success") {
              bgColor = "bg-emerald-50 border-emerald-100 text-emerald-900 shadow-emerald-100/50 shadow-lg";
              iconColor = "text-emerald-600";
              IconComponent = CheckCircle2;
            } else if (toast.type === "error") {
              bgColor = "bg-rose-50 border-rose-100 text-rose-900 shadow-rose-100/50 shadow-lg";
              iconColor = "text-rose-600";
              IconComponent = AlertCircle;
            } else if (toast.type === "warning") {
              bgColor = "bg-amber-50 border-amber-100 text-amber-900 shadow-amber-100/50 shadow-lg";
              iconColor = "text-amber-600";
              IconComponent = AlertTriangle;
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border ${bgColor}`}
              >
                <div className="mt-0.5">
                  <IconComponent className={`h-5 w-5 ${iconColor}`} />
                </div>
                <div className="flex-1 text-sm font-medium pr-2">
                  {toast.message}
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
