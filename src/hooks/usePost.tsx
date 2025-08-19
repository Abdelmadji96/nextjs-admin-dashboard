import toast from "react-hot-toast";
import {
  XCircleIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  X,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";

function showToast(
  type: "success" | "error" | "warning",
  title: string,
  description: string
) {
  const config = {
    success: {
      icon: <CheckCircleIcon className="text-green-600 mt-1" size={24} />,
      borderColor: "border-green-600",
      titleColor: "text-green-700",
      textColor: "text-green-600",
    },
    error: {
      icon: <XCircleIcon className="text-red-600 mt-1" size={24} />,
      borderColor: "border-red-600",
      titleColor: "text-red-700",
      textColor: "text-red-600",
    },
    warning: {
      icon: <AlertTriangleIcon className="text-yellow-600 mt-1" size={24} />,
      borderColor: "border-yellow-600",
      titleColor: "text-yellow-700",
      textColor: "text-yellow-600",
    },
  };

  const style = config[type];

  toast.custom((t) => (
    <div
      className={`relative max-w-md w-full bg-white border-l-4 ${style.borderColor} shadow-lg rounded-lg px-4 py-3 text-sm flex gap-3 items-start`}
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        animation: t.visible
          ? "slideIn 0.4s ease-out"
          : "slideOut 0.4s ease-in",
      }}
    >
      {style.icon}
      <div className="pr-6">
        <p className={`font-bold text-base ${style.titleColor}`}>{title}</p>
        <p className={`text-sm mt-1 leading-5 ${style.textColor}`}>
          {description}
        </p>
      </div>
      <button
        onClick={() => toast.dismiss(t.id)}
        className={`absolute top-2 right-2 ${style.textColor} hover:opacity-70 p-1`}
      >
        <X size={18} />
      </button>
    </div>
  ));
}

export function usePost<TData, TVariables>(
  mutationFn: (data: TVariables) => Promise<TData>
) {
  return useMutation<TData, any, TVariables>({
    mutationFn,
    onSuccess: (data: any) => {
      if (data?.status === 200 || data?.status === 201) {
        showToast(
          "success",
          "Success",
          data?.message || "Operation completed successfully"
        );
      }
    },
    onError: (error: any) => {
      console.error("usePost error:", error);

      if (error?.response?.status === 401) {
        showToast(
          "error",
          error?.response?.data?.error ?? "Unauthorized",
          error?.response?.data?.message || "Please check your credentials"
        );
      } else if (error?.response?.status === 403) {
        showToast(
          "warning",
          "Access Denied",
          error?.response?.data?.message || "You do not have permission"
        );
      } else if (error?.code === "ERR_NETWORK") {
        showToast("error", "Network Error", "Check your internet connection");
      } else {
        showToast(
          "error",
          "Error",
          error?.response?.data?.message || "Something went wrong"
        );
      }
    },
  });
}
