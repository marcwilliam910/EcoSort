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
    timer: 2500,
    title: message,
    showConfirmButton: false,
  });
}

export async function deleteAlert() {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF0000",
    confirmButtonText: "Yes, delete it!",
  });

  return result.isConfirmed;
}
