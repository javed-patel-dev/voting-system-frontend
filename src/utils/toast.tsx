import { AlertCircle, CheckCircle, X } from "lucide-react";
import { createRoot } from "react-dom/client";

type ToastType = "success" | "error" | "info";

const ToastComponent = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: ToastType;
  onClose: () => void;
}) => {
  const Icon = type === "success" ? CheckCircle : AlertCircle;
  const bgColor =
    type === "success"
      ? "bg-green-50 border-green-200"
      : type === "error"
        ? "bg-red-50 border-red-200"
        : "bg-blue-50 border-blue-200";
  const iconColor =
    type === "success" ? "text-green-600" : type === "error" ? "text-red-600" : "text-blue-600";
  const textColor =
    type === "success" ? "text-green-900" : type === "error" ? "text-red-900" : "text-blue-900";

  return (
    <div
      className={`${bgColor} ${textColor} border rounded-lg shadow-lg p-4 flex items-center justify-between min-w-[300px] max-w-[500px] animate-in slide-in-from-top-5 fade-in duration-300`}
    >
      <div className="flex items-center space-x-3">
        <Icon className={`h-5 w-5 ${iconColor}`} />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

const showToast = (message: string, type: ToastType = "info") => {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "20px";
  container.style.right = "20px";
  container.style.zIndex = "9999";

  document.body.appendChild(container);

  const root = createRoot(container);

  const closeToast = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  root.render(<ToastComponent message={message} type={type} onClose={closeToast} />);

  setTimeout(closeToast, 3000);
};

export const toast = {
  success: (message: string) => showToast(message, "success"),
  error: (message: string) => showToast(message, "error"),
  info: (message: string) => showToast(message, "info"),
};
