"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportNotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export function ReportNotification({ 
  message, 
  type, 
  onClose, 
  duration = 5000 
}: ReportNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2">
      <div className={`
        flex items-center gap-3 p-4 rounded-lg shadow-lg border
        ${type === "success" 
          ? "bg-green-50 border-green-200 text-green-800" 
          : "bg-red-50 border-red-200 text-red-800"
        }
      `}>
        {type === "success" ? (
          <CheckCircle className="w-5 h-5 text-green-600" />
        ) : (
          <AlertTriangle className="w-5 h-5 text-red-600" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className={`
            h-6 w-6 p-0 hover:bg-opacity-20
            ${type === "success" 
              ? "hover:bg-green-600 text-green-600" 
              : "hover:bg-red-600 text-red-600"
            }
          `}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
} 