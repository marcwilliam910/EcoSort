import { toast } from "react-toastify";

export function successToast(message: string) {
  toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    closeOnClick: true,
  });
}
