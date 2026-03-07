import {sendPasswordResetEmail} from "firebase/auth";
import {auth} from "../../firebase config/firebase";
import {useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {BiLoader} from "react-icons/bi";

export default function ForgotPassword({onBack}: ForgotPasswordProps) {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function resetPassword() {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <ToastContainer
        position="top-center"
        autoClose={false}
        closeOnClick
        theme="dark"
      />

      {/* Heading — same structure as LoginForm */}
      <h1 className="ss-heading">
        Reset
        <br />
        Password 🔑
      </h1>
      <p className="ss-subheading">
        Enter your email and we'll send you a reset link.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          resetPassword();
        }}
        noValidate
      >
        <div className="ss-field">
          <label className="ss-label" htmlFor="reset-email">
            Email address
          </label>
          <div className="ss-input-wrap">
            <input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`ss-input${error ? " error" : ""}`}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          {error === "auth/invalid-email" && (
            <p className="ss-error-msg">⚠ Please enter a valid email</p>
          )}
          {error === "auth/missing-email" && (
            <p className="ss-error-msg">⚠ Please enter your email first</p>
          )}
          {error === "auth/user-not-found" && (
            <p className="ss-error-msg">⚠ No account found with this email</p>
          )}
        </div>

        {/* Actions row */}
        <div className="ss-row" style={{marginTop: 8}}>
          <span className="ss-forgot" onClick={onBack} role="button">
            ← Back to login
          </span>
        </div>

        <button type="submit" className="ss-btn" disabled={loading}>
          {loading ? (
            <BiLoader
              size={22}
              style={{animation: "spin 1s linear infinite"}}
            />
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>
    </>
  );
}

interface ForgotPasswordProps {
  onBack: () => void;
}
