import React, { useState } from "react";
import digitalized from "../assets/digitalized.jpg";
import logo from "../assets/logo.png";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

interface FormState {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string>("");

  function handleForm(e: { target: { name: any; value: any } }) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);

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
          form={form}
          error={error}
          onChange={handleForm}
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
          form={form}
          onChange={handleForm}
          error={error}
        />

        <p
          className={`ml-2 text-red-500 text-xs -mt-3 ${
            error === "password" ? "block" : "hidden"
          }`}
        >
          Password is incorrect
        </p>
        <div className="self-end">
          <a
            href="#"
            className="text-xs text-blue-400 underline hover:text-blue-500"
          >
            Forgot Password?
          </a>
        </div>
        <button
          type="submit"
          className="p-2 mt-2 font-bold duration-150 bg-green-500 hover:bg-green-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}

interface FormState {
  [key: string]: string;
}

interface InputProps {
  type: string;
  label: string;
  form: FormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string;
}

function Input({ type, label, form, onChange, error }: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={label} className="text-sm lg:text-base">
        {label}
      </label>
      <input
        type={type}
        required
        className={`w-full p-1.5 px-3 rounded-md bg-transparent border outline-none ${
          error === type && "border-red-500"
        }`}
        name={type}
        value={form[type]}
        onChange={onChange}
        autoComplete="on"
      />
    </div>
  );
}
