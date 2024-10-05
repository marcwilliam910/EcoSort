import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../../firebase config/firebase";
import {useState} from "react";
import {toast, ToastContainer} from "react-toastify";

export default function ForgotPassword({onBack}: ForgotPasswordProps) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState(null);

  async function resetPassword() {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      toast.success("Please check your gmail to reset your password", {
        position: "top-center",
        autoClose: false,
        closeOnClick: true,
        draggable: true,
        theme: "dark",
      });
    } catch (error: any) {
      setError(error.code);
      console.log(error.code);
    }
  }

  return (
    <div className="">
      <ToastContainer
        position="top-center"
        autoClose={false}
        closeOnClick
        theme="dark"
      />
      <form
        className="p-5 text-white bg-transparent space-y-7 w-72 backdrop-blur-sm backdrop-brightness-50 lg:py-8 lg:w-80 "
        onSubmit={(e) => {
          e.preventDefault();
          resetPassword();
        }}
      >
        <div className="space-y-2">
          <label htmlFor="email" className="text-lg font-bold lg:text-xl">
            Please enter your email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className={`w-full p-1.5 px-3 rounded-md text-base bg-transparent border outline-none mt-2 ${
                error && "border-red-500"
              }`}
            />
          </label>

          <div className="ml-1.5">
            {error === "auth/invalid-email" && (
              <p className="text-xs text-red-500 ">Please enter valid email</p>
            )}
            {error === "auth/missing-email" && (
              <p className="text-xs text-red-500 ">
                "Please enter your email first"
              </p>
            )}
            {error === "auth/user-not-found" && (
              <p className="text-xs text-red-500 ">User not found</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p
            className="text-xs cursor-pointer hover:underline md:text-sm"
            onClick={onBack}
          >
            Back to login
          </p>
          <button
            type="submit"
            className="px-2 py-1 text-sm duration-150 bg-green-500 md:text-base hover:bg-green-600"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

interface ForgotPasswordProps {
  onBack: () => void;
}
