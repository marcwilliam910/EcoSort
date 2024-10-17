import React, {useEffect, useState} from "react";
import digitalized from "../assets/digitalized.jpg";
import logo from "../assets/logo.png";
import {auth} from "../firebase config/firebase";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {useNavigate} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "../components/Login/ForgotPassword";
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {BiLoader} from "react-icons/bi";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false);

  function handleUserForm(e: {target: {name: string; value: string}}) {
    setUserForm({...userForm, [e.target.name]: e.target.value});
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);
      await setPersistence(
        auth,
        isChecked ? browserLocalPersistence : browserSessionPersistence
      );
      await signInWithEmailAndPassword(auth, userForm.email, userForm.password);

      navigate("/", {
        replace: true,
        state: {
          fromLogin: true,
        },
      });
    } catch (error: any) {
      if (error.code === "auth/wrong-password") {
        setError("password");
      } else if (error.code === "auth/user-not-found") {
        setError("email");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard", {
          replace: true,
          state: {
            fromLogin: false,
          },
        });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  function handleForgotPasswordClick() {
    setIsResetting(!isResetting);
  }

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from("#logo", {
      delay: 2,
      duration: 2,
      scale: 1.8,
      ease: "expo",
      y: "150%",
    }).to(
      "#overlay",
      {
        opacity: 0,
        pointerEvents: "none",
        ease: "power2.inOut",
      },
      "-=0.5"
    );
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen gap-6 bg-center bg-cover lg:gap-12"
      style={{backgroundImage: `url(${digitalized})`}}
    >
      <div id="overlay" className="absolute inset-0 z-10 bg-black/95"></div>
      <img
        src={logo}
        alt="Yes-O Logo"
        id="logo"
        className="z-20 object-cover border rounded-full size-28 lg:size-36"
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
          loading={loading}
        />
      )}
    </div>
  );
}

interface LoginFormProps {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  userForm: FormState;
  error: string;
  handleUserForm: (e: {target: {name: any; value: any}}) => void;
  onForgotPasswordClick: () => void;
  isChecked: boolean;
  setIsChecked: (isChecked: boolean) => void;
  loading: boolean;
}
function LoginForm({
  handleLogin,
  userForm,
  error,
  handleUserForm,
  onForgotPasswordClick,
  isChecked,
  setIsChecked,
  loading,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  return (
    <form
      className="flex flex-col gap-5 p-5 text-white bg-transparent w-72 backdrop-blur-md backdrop-brightness-50 lg:py-8 lg:w-80 "
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
        showPassword={showPassword}
        togglePassword={setShowPassword}
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
        className="flex items-center justify-center p-2 mt-2 font-bold duration-150 bg-green-500 hover:bg-green-600"
      >
        {loading ? <BiLoader className="size-6 animate-spin" /> : "Login"}
      </button>
    </form>
  );
}

function Input({
  type,
  label,
  value,
  onChange,
  error,
  showPassword,
  togglePassword,
}: InputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={label} className="text-sm lg:text-base">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type={type == "email" ? "email" : showPassword ? "text" : "password"}
          required
          className={`w-full p-1.5 px-3 rounded-md bg-transparent border outline-none border-white ${
            error && "border-red-500"
          }`}
          name={type}
          value={value}
          onChange={onChange}
          autoComplete="on"
        />
        {label.toLocaleLowerCase() === "password" && togglePassword && (
          <div
            className="absolute right-3 "
            onClick={() => togglePassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEye className="size-5" />
            ) : (
              <AiOutlineEyeInvisible className="size-5" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

interface InputProps {
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  showPassword?: boolean;
  togglePassword?: (showPassword: boolean) => void;
}
