import React, {lazy, Suspense, useEffect, useState} from "react";
import school_logo from "../assets/png/school_logo.png";
import smartseg_logo from "@/assets/png/smartseg_logo.png";
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
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import {BiLoader} from "react-icons/bi";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";

const ForgotPassword = lazy(() => import("../components/Login/ForgotPassword"));

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
        isChecked ? browserLocalPersistence : browserSessionPersistence,
      );
      await signInWithEmailAndPassword(auth, userForm.email, userForm.password);
      navigate("/", {replace: true, state: {fromLogin: true}});
    } catch (error: any) {
      if (error.code === "auth/wrong-password") setError("password");
      else if (error.code === "auth/user-not-found") setError("email");
      else setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user)
        navigate("/dashboard", {replace: true, state: {fromLogin: false}});
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
    });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .ss-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f0f4f0;
        }

        /* ── LEFT PANEL ── */
        .ss-left {
          flex: 0 0 480px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 60px 56px;
          background: #fff;
          position: relative;
          z-index: 2;
          box-shadow: 8px 0 40px rgba(0,0,0,0.06);
          overflow-y: auto;
        }

        .ss-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 52px;
        }

        .ss-brand-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.5rem;
          color: #1a3a1a;
          letter-spacing: -0.5px;
        }
        .ss-brand-name span { color: #2d8c2d; }

        .ss-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2.4rem;
          line-height: 1.1;
          color: #0f1f0f;
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .ss-subheading {
          color: #6b7c6b;
          font-size: 0.95rem;
          margin-bottom: 40px;
          font-weight: 400;
        }

        .ss-field { margin-bottom: 20px; }

        .ss-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #3a4f3a;
          margin-bottom: 8px;
        }

        .ss-input-wrap { position: relative; }

        .ss-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e0e8e0;
          border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: #1a2e1a;
          background: #f8fbf8;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .ss-input:focus {
          border-color: #2d8c2d;
          background: #fff;
          box-shadow: 0 0 0 4px rgba(45,140,45,0.10);
        }
        .ss-input.error {
          border-color: #e05252;
          background: #fff8f8;
        }

        .ss-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #7a9a7a;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }
        .ss-eye:hover { color: #2d8c2d; }

        .ss-error-msg {
          font-size: 0.78rem;
          color: #e05252;
          margin-top: 5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ss-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 8px 0 28px;
        }

        .ss-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: #4a6a4a;
          cursor: pointer;
          user-select: none;
        }
        .ss-remember input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #2d8c2d;
          cursor: pointer;
        }

        .ss-forgot {
          font-size: 0.85rem;
          color: #2d8c2d;
          font-weight: 600;
          cursor: pointer;
          background: none;
          border: none;
          text-decoration: none;
          transition: color 0.2s;
        }
        .ss-forgot:hover { color: #1a5e1a; text-decoration: underline; }

        .ss-btn {
          width: 100%;
          padding: 15px;
          background: #2d8c2d;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(45,140,45,0.25);
        }
        .ss-btn:hover:not(:disabled) {
          background: #1e6e1e;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(45,140,45,0.35);
        }
        .ss-btn:active { transform: translateY(0); }
        .ss-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        /* ── RIGHT PANEL ── */
        .ss-right {
          flex: 1;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a1f0a;
        }

        /* School seal — very faint watermark */
        .ss-right-bg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.07;
        }

        /* FIX #3 — dark gradient overlay so text is always readable */
        .ss-right-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            145deg,
            rgba(8, 28, 8, 0.78) 0%,
            rgba(18, 72, 18, 0.65) 55%,
            rgba(28, 90, 28, 0.78) 100%
          );
          z-index: 1;
        }

        .ss-circle {
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.08);
          z-index: 1;
        }
        .ss-circle-1 { width: 500px; height: 500px; top: -100px; right: -100px; }
        .ss-circle-2 { width: 320px; height: 320px; bottom: 60px; left: 40px; }

        .ss-right-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 28px;
          padding: 40px;
          text-align: center;
        }

        .ss-logo-img {
          width: 200px;
          height: 200px;
          object-fit: contain;
          filter: drop-shadow(0 16px 40px rgba(0,0,0,0.7));
          animation: float 4s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        /* Frosted text card — FIX #3 continued */
        .ss-tagline-card {
          background: rgba(0, 0, 0, 0.40);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 16px;
          padding: 24px 32px;
          max-width: 360px;
        }

        .ss-tagline-card h2 {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 2rem;
          color: #ffffff;
          letter-spacing: -0.5px;
          margin-bottom: 10px;
          line-height: 1.2;
          text-shadow: 0 2px 16px rgba(0,0,0,0.5);
        }

        .ss-tagline-card p {
          font-size: 0.92rem;
          color: rgba(255,255,255,0.82);
          line-height: 1.6;
        }

        .ss-badges {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .ss-badge {
          background: rgba(0,0,0,0.40);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.20);
          border-radius: 100px;
          padding: 7px 16px;
          font-size: 0.80rem;
          color: #ffffff;
          font-weight: 500;
          text-shadow: 0 1px 6px rgba(0,0,0,0.4);
        }
    

        /* ── RESPONSIVE ── */

        @media (max-width: 1024px) {
          .ss-left { flex: 0 0 400px; padding: 50px 36px; }
          .ss-logo-img { width: 160px; height: 160px; }
          .ss-tagline-card h2 { font-size: 1.7rem; }
        }

        /* FIX #2 — Mobile layout overhaul */
        @media (max-width: 768px) {
          .ss-root { flex-direction: column; }

          /* Compact top banner */
          .ss-right {
            flex: 0 0 auto;
            min-height: 200px;
          }

          .ss-circle-1 { width: 260px; height: 260px; top: -50px; right: -50px; }
          .ss-circle-2 { display: none; }

          .ss-right-content {
            flex-direction: row;
            align-items: center;
            gap: 18px;
            padding: 20px 24px;
            text-align: left;
          }

          .ss-logo-img {
            width: 84px;
            height: 84px;
            flex-shrink: 0;
            animation: none;
          }

          /* On mobile strip, drop the frosted card — use inline styling */
          .ss-tagline-card {
            background: transparent;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            border: none;
            padding: 0;
            max-width: none;
          }

          .ss-tagline-card h2 {
            font-size: 1.25rem;
            margin-bottom: 5px;
          }

          .ss-tagline-card p {
            font-size: 0.80rem;
          }

          .ss-badges { display: none; }

          /* Form panel: full width, starts right away */
          .ss-left {
            flex: 1;
            padding: 32px 24px 48px;
            box-shadow: none;
            justify-content: flex-start;
          }

          .ss-brand { margin-bottom: 28px; }
          .ss-heading { font-size: 2rem; }
          .ss-subheading { margin-bottom: 28px; }
        }

        @media (max-width: 400px) {
          .ss-left { padding: 24px 16px 40px; }
          .ss-heading { font-size: 1.7rem; }
          .ss-right-content { padding: 16px 16px; gap: 12px; }
          .ss-logo-img { width: 68px; height: 68px; }
          .ss-tagline-card h2 { font-size: 1.1rem; }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div className="ss-root">
        {/* ── LEFT: Login Form ── */}
        <div className="ss-left">
          <div className="ss-brand">
            <img
              src={smartseg_logo}
              alt="SmartSeg Logo"
              id="logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <span className="ss-brand-name">
              Smart<span>Seg</span>
            </span>
          </div>

          <Suspense fallback={<div>Loading...</div>}>
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
          </Suspense>
        </div>

        {/* ── RIGHT: Visual Panel ── */}
        <div className="ss-right">
          {/* BulSU seal — subtle watermark behind everything */}
          <img src={school_logo} alt="" className="ss-right-bg" />

          {/* Dark overlay — guarantees text readability (FIX #3) */}
          <div className="ss-right-overlay" />

          <div className="ss-circle ss-circle-1" />
          <div className="ss-circle ss-circle-2" />

          <div className="ss-right-content">
            <img src={smartseg_logo} alt="SmartSeg" className="ss-logo-img" />

            <div className="ss-tagline-card">
              <h2>
                Smart Waste.
                <br />
                Smarter Future.
              </h2>
              <p>Waste segregation system for a cleaner, greener tomorrow.</p>
            </div>

            {/* FIX #1 — "AI-Powered" replaced with BulSU context */}
            <div className="ss-badges">
              <span className="ss-badge">♻️ Eco-Friendly</span>
              <span className="ss-badge">🎓 BulSU – COS</span>
              <span className="ss-badge">🌿 Sustainable</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── LOGIN FORM ── */
interface LoginFormProps {
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  userForm: FormState;
  error: string;
  handleUserForm: (e: {target: {name: any; value: any}}) => void;
  onForgotPasswordClick: () => void;
  isChecked: boolean;
  setIsChecked: (v: boolean) => void;
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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <h1 className="ss-heading">
        Welcome
        <br />
        back 👋
      </h1>
      <p className="ss-subheading">Sign in to your SmartSeg account</p>

      <form onSubmit={handleLogin} noValidate>
        <div className="ss-field">
          <label className="ss-label" htmlFor="email-input">
            Email address
          </label>
          <div className="ss-input-wrap">
            <input
              id="email-input"
              className={`ss-input${error === "email" ? " error" : ""}`}
              type="email"
              name="email"
              value={userForm.email}
              onChange={handleUserForm}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          {error === "email" && (
            <p className="ss-error-msg">⚠ No account found with this email</p>
          )}
        </div>

        <div className="ss-field">
          <label className="ss-label" htmlFor="password-input">
            Password
          </label>
          <div className="ss-input-wrap">
            <input
              id="password-input"
              className={`ss-input${error === "password" ? " error" : ""}`}
              type={showPassword ? "text" : "password"}
              name="password"
              value={userForm.password}
              onChange={handleUserForm}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              style={{paddingRight: 44}}
            />
            <span
              className="ss-eye"
              onClick={() => setShowPassword(!showPassword)}
              role="button"
              aria-label="Toggle password"
            >
              {showPassword ? (
                <AiOutlineEye size={20} />
              ) : (
                <AiOutlineEyeInvisible size={20} />
              )}
            </span>
          </div>
          {error === "password" && (
            <p className="ss-error-msg">⚠ Incorrect password</p>
          )}
        </div>

        <div className="ss-row">
          <label className="ss-remember">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            Remember me
          </label>
          <span
            className="ss-forgot"
            onClick={onForgotPasswordClick}
            role="button"
          >
            Forgot password?
          </span>
        </div>

        <button type="submit" className="ss-btn" disabled={loading}>
          {loading ? (
            <BiLoader
              size={22}
              style={{animation: "spin 1s linear infinite"}}
            />
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </>
  );
}
