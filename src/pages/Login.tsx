import React, { useEffect, useState } from "react";
import digitalized from "../assets/digitalized.jpg";
import logo from "../assets/logo.png";
import { auth } from "../config/firebase";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "../components/Login/ForgotPassword";

interface FormState {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [userForm, setUserForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  function handleUserForm(e: { target: { name: any; value: any } }) {
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await setPersistence(
        auth,
        isChecked ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, userForm.email, userForm.password);

      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setError("password");
      } else if (error.code === "auth/user-not-found") {
        setError("email");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  function handleForgotPasswordClick() {
    setIsResetting(!isResetting);
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-6 bg-center bg-cover lg:gap-12"
      style={{ backgroundImage: `url(${digitalized})` }}
    >
      {" "}
      <img
        src={logo}
        alt="Yes-O Logo"
        className="object-cover rounded-full size-28 lg:size-36"
      />
      {isResetting ? (
        <ForgotPassword onBack={handleForgotPasswordClick} />
      ) : (
        <LoginForm
          handleLogin={handleLogin}
          userForm={userForm}
          error={error}
          handleUserForm={handleUserForm}
          onForgotPasswordClick={handleForgotPasswordClick}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
        />
      )}
    </div>
  );
}

interface LoginFormProps {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  userForm: FormState;
  error: string;
  handleUserForm: (e: { target: { name: any; value: any } }) => void;
  onForgotPasswordClick: () => void;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
}
function LoginForm({
  handleLogin,
  userForm,
  error,
  handleUserForm,
  onForgotPasswordClick,
  isChecked,
  setIsChecked,
}: LoginFormProps) {
  return (
    <form
      className="flex flex-col gap-5 p-5 text-white bg-transparent w-72 backdrop-blur-sm backdrop-brightness-50 lg:py-8 lg:w-80 "
      onSubmit={handleLogin}
    >
      <h2 className="mb-2 text-lg font-bold lg:text-xl">
        Login to your account
      </h2>
      <Input
        type="email"
        label="Email"
        value={userForm.email}
        error={error === "email"}
        onChange={handleUserForm}
      />
      <p
        className={`ml-2 text-red-500 text-xs -mt-3 ${
          error === "email" ? "block" : "hidden"
        }`}
      >
        Email does not exist
      </p>

      <Input
        type="password"
        label="Password"
        value={userForm.password}
        onChange={handleUserForm}
        error={error === "password"}
      />

      <p
        className={`ml-2 text-red-500 text-xs -mt-3 ${
          error === "password" ? "block" : "hidden"
        }`}
      >
        Password is incorrect
      </p>
      <div className="flex justify-between px-1 text-xs">
        <label htmlFor="remember" className="flex items-center gap-1">
          <input
            type="checkbox"
            id="remember"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          Remember Me
        </label>
        <p
          onClick={onForgotPasswordClick}
          className="text-blue-400 underline cursor-pointer hover:text-blue-500"
        >
          Forgot Password?
        </p>
      </div>
      <button
        type="submit"
        className="p-2 mt-2 font-bold duration-150 bg-green-500 hover:bg-green-600"
      >
        Login
      </button>
    </form>
  );
}

function Input({ type, label, value, onChange, error }: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={label} className="text-sm lg:text-base">
        {label}
      </label>
      <input
        type={type}
        required
        className={`w-full p-1.5 px-3 rounded-md bg-transparent border outline-none ${
          error && "border-red-500"
        }`}
        name={type}
        value={value}
        onChange={onChange}
        autoComplete="on"
      />
    </div>
  );
}

interface InputProps {
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
}
