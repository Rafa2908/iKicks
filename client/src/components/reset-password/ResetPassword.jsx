import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./ResetPassword.css";
import {
  generateCode,
  resetPassword,
  verifyCode,
} from "../../service/user.service";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("email");
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const codeRefs = useRef([]);

  const stepIndex = { email: 0, verify: 1, reset: 2, done: 3 }[step];

  /* ── Step 1: send code ─────────────────────────── */
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    const res = await generateCode(email);
    if (res) {
      setUserId(res?.userId);
    }
    console.log(res);

    setTimeout(() => {
      setLoading(false);
      setStep("verify");
    }, 0);
  };

  /* ── Step 2: verify code ───────────────────────── */
  const handleCodeChange = (val, idx) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    setError("");
    if (digit && idx < 5) codeRefs.current[idx + 1]?.focus();
  };

  const handleCodeKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (code[idx]) {
        const next = [...code];
        next[idx] = "";
        setCode(next);
      } else if (idx > 0) {
        codeRefs.current[idx - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) codeRefs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) codeRefs.current[idx + 1]?.focus();
  };

  const handleCodePaste = (e) => {
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;
    e.preventDefault();
    const next = [...code];
    pasted.split("").forEach((ch, i) => {
      next[i] = ch;
    });
    setCode(next);
    codeRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    if (code.join("").length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    const userData = {
      userId: Number(userId),
      resetCode: code.join(""),
    };
    const res = await verifyCode(userData);

    if (res) {
      console.log(res);
    }
    setTimeout(() => {
      setLoading(false);
      setStep("reset");
    }, 0);
  };

  const handleResend = async () => {
    setCode(["", "", "", "", "", ""]);
    setError("");
    codeRefs.current[0]?.focus();
    await generateCode(email);
  };

  /* ── Step 3: new password ──────────────────────── */
  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    if (passwords.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    const passwordData = {
      newPassword: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
    };
    setLoading(true);
    await resetPassword(passwordData);
    setTimeout(() => {
      setLoading(false);
      setStep("done");
    }, 0);
  };

  return (
    <div className="rp-overlay">
      <div className="rp-card">
        <button
          className="rp-close"
          onClick={() => navigate(-1)}
          aria-label="Close"
        >
          ×
        </button>

        {/* ── Header ──────────────────────────────── */}
        <div className="rp-header">
          <h1 className="rp-brand">iKicks</h1>

          {step !== "done" && (
            <div className="rp-stepper">
              {["Email", "Verify", "Reset"].map((label, i) => (
                <div key={i} className="rp-step">
                  <div
                    className={`rp-step-bubble${
                      stepIndex > i
                        ? " rp-step-bubble--done"
                        : stepIndex === i
                          ? " rp-step-bubble--active"
                          : ""
                    }`}
                  >
                    {stepIndex > i ? (
                      <i className="fa-solid fa-check" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span className="rp-step-label">{label}</span>
                  {i < 2 && (
                    <div
                      className={`rp-step-line${stepIndex > i ? " rp-step-line--done" : ""}`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="rp-subtitle">
            {step === "email" && "Enter your email to receive a reset code"}
            {step === "verify" && (
              <>
                We sent a 6-digit code to <strong>{email}</strong>
              </>
            )}
            {step === "reset" && "Create a new password for your account"}
            {step === "done" && "You're all set!"}
          </p>
        </div>

        {/* ── Error banner ────────────────────────── */}
        {error && (
          <div className="rp-error-banner">
            <i className="fa-solid fa-circle-exclamation" />
            {error}
          </div>
        )}

        {/* ── Step 1: Email ───────────────────────── */}
        {step === "email" && (
          <form className="rp-form" onSubmit={handleSendCode} noValidate>
            <div className="rp-field">
              <label htmlFor="rp-email">Email Address</label>
              <input
                id="rp-email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                autoFocus
              />
            </div>
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner rp-spinner" /> Sending…
                </>
              ) : (
                "Send Reset Code"
              )}
            </button>
          </form>
        )}

        {/* ── Step 2: Verify ──────────────────────── */}
        {step === "verify" && (
          <form className="rp-form" onSubmit={handleVerify} noValidate>
            <div className="rp-code-row" onPaste={handleCodePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (codeRefs.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(e.target.value, i)}
                  onKeyDown={(e) => handleCodeKeyDown(e, i)}
                  className={`rp-code-box${digit ? " rp-code-box--filled" : ""}`}
                  autoFocus={i === 0}
                  autoComplete="off"
                />
              ))}
            </div>
            <button type="submit" className="rp-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner rp-spinner" /> Verifying…
                </>
              ) : (
                "Verify Code"
              )}
            </button>
            <p className="rp-resend-row">
              Didn&apos;t receive it?{" "}
              <button
                type="button"
                className="rp-resend-btn"
                onClick={handleResend}
              >
                Resend code
              </button>
            </p>
          </form>
        )}

        {/* ── Step 3: New password ─────────────────── */}
        {step === "reset" && (
          <form className="rp-form" onSubmit={handleReset} noValidate>
            <div className="rp-field">
              <label>New Password</label>
              <div className="rp-pw-wrap">
                <input
                  type={showNext ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={passwords.newPassword}
                  onChange={(e) => {
                    setPasswords((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }));
                    setError("");
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  className="rp-pw-toggle"
                  onClick={() => setShowNext((v) => !v)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid fa-eye${showNext ? "-slash" : ""}`} />
                </button>
              </div>
            </div>
            <div className="rp-field">
              <label>Confirm Password</label>
              <div className="rp-pw-wrap">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={passwords.confirmPassword}
                  onChange={(e) => {
                    setPasswords((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }));
                    setError("");
                  }}
                />
                <button
                  type="button"
                  className="rp-pw-toggle"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                >
                  <i
                    className={`fa-solid fa-eye${showConfirm ? "-slash" : ""}`}
                  />
                </button>
              </div>
            </div>

            {passwords.newPassword?.length > 0 && (
              <div className="rp-strength-row">
                {["Length", "Uppercase", "Number", "Symbol"].map((rule, i) => {
                  const checks = [
                    passwords.newPassword?.length >= 8,
                    /[A-Z]/.test(passwords.newPassword),
                    /\d/.test(passwords.newPassword),
                    /[^A-Za-z0-9]/.test(passwords.newPassword),
                  ];
                  return (
                    <div
                      key={rule}
                      className={`rp-strength-item${checks[i] ? " rp-strength-item--ok" : ""}`}
                    >
                      <i
                        className={`fa-solid fa-${checks[i] ? "check" : "xmark"}`}
                      />
                      {rule}
                    </div>
                  );
                })}
              </div>
            )}

            <button type="submit" className="rp-submit" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner rp-spinner" /> Updating…
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        )}

        {/* ── Step 4: Done ────────────────────────── */}
        {step === "done" && (
          <div className="rp-done">
            <div className="rp-done-icon">
              <i className="fa-solid fa-check" />
            </div>
            <p className="rp-done-title">Password Updated</p>
            <p className="rp-done-sub">
              Your password has been changed successfully. You can now log in
              with your new credentials.
            </p>
            <button className="rp-submit" onClick={() => navigate("/profile")}>
              Go to Profile
            </button>
            <Link to="/login" className="rp-text-link">
              Back to Login
            </Link>
          </div>
        )}

        {step === "email" && (
          <p className="rp-footer">
            Remember your password? <Link to="/login">Log in</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
