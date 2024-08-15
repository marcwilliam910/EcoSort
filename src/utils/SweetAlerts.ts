import Swal from "sweetalert2";

export function successAlert(message: string) {
  Swal.fire({
    icon: "success",
    timer: 2000,
    title: message,
    showConfirmButton: false,
  });
}

export function errorAlert(message: string) {
  Swal.fire({
    icon: "error",
    timer: 2000,
    title: message,
    showConfirmButton: false,
  });
}
