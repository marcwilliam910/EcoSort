import { toast } from "react-toastify";

export function successToast(message: string) {
  toast.success(message, {
    position: "top-center",
    autoClose: 5000,
    closeOnClick: true,
  });
}

export function warningToast(message: string = "Error occurred") {
  toast.error(message, {
    position: "top-center",
    autoClose: false,
    closeOnClick: true,
  });
}
