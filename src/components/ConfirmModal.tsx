import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "warning",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "bg-red-100 text-red-600",
      button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
      icon: "bg-yellow-100 text-yellow-600",
      button: "bg-yellow-500 hover:bg-yellow-600",
    },
    info: {
      icon: "bg-blue-100 text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 fade-in duration-200">
        {/* Close button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div
            className={`w-12 h-12 rounded-full ${styles.icon} flex items-center justify-center mx-auto mb-4`}
          >
            <AlertTriangle className="h-6 w-6" />
          </div>

          {/* Content */}
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">{title}</h3>
          <p className="text-gray-600 text-center text-sm mb-6">{message}</p>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} disabled={loading} className="flex-1">
              {cancelLabel}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={loading}
              className={`flex-1 text-white ${styles.button}`}
            >
              {loading ? "Processing..." : confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
