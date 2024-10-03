import Swal from "sweetalert2";

export function successAlert(message: string, isDarkMode: boolean) {
  Swal.fire({
    icon: "success",
    timer: 2000,
    title: message,
    showConfirmButton: false,
    background: isDarkMode ? "#2C3138" : "#F9F9F9", // Dynamically change background
    color: isDarkMode ? "#E1E5EA" : "#23272F", // Dynamically change text color
  });
}

export function errorAlert(message: string, isDarkMode: boolean) {
  Swal.fire({
    icon: "error",
    timer: 2500,
    title: message,
    showConfirmButton: false,
    background: isDarkMode ? "#2C3138" : "#F9F9F9", // Dynamically change background
    color: isDarkMode ? "#E1E5EA" : "#23272F", // Dynamically change text color
  });
}

export function infoAlert(
  message: string,
  isDarkMode: boolean,
  duration: number,
  link?: {url: string; text: string} // Optional link parameter
) {
  const htmlMessage = link
    ? `${message} <br><br><a href="${link.url}" target="_blank" style="color: #1E90FF;">${link.text}</a>`
    : message;

  Swal.fire({
    icon: "info",
    timer: link ? undefined : duration,
    html: htmlMessage, // Use HTML if a link is provided
    showConfirmButton: false,
    showCloseButton: link ? true : false, // Show close button when there's a link

    background: isDarkMode ? "#2C3138" : "#F9F9F9", // Dynamically change background
    color: isDarkMode ? "#E1E5EA" : "#23272F", // Dynamically change text color
  });
}

export async function deleteAlert(isDarkMode: boolean) {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#FF0000",
    confirmButtonText: "Yes, delete it!",
    background: isDarkMode ? "#2C3138" : "#F9F9F9", // Dynamically change background
    color: isDarkMode ? "#E1E5EA" : "#23272F", // Dynamically change text color
  });

  return result.isConfirmed;
}
