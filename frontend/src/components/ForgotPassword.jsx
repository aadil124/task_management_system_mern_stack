import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        toast.error(data.message || "Request failed");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow-lg border-0 p-4"
        style={{ maxWidth: "440px", width: "100%", borderRadius: "20px" }}
      >
        {sent ? (
          <div className="text-center py-3">
            <div style={{ fontSize: "3.5rem" }}>📧</div>
            <h4 className="fw-bold mt-2">Check your inbox</h4>
            <p className="text-muted">
              If this email is registered, a reset link has been sent. Check
              spam too.
            </p>
            <Link to="/login" className="btn btn-primary mt-2">
              Back to Login
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-center fw-bold text-primary mb-1">
              Forgot Password?
            </h2>
            <p className="text-center text-muted mb-4">
              Enter your email and we'll send a reset link.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
            </form>
            <p className="text-center text-muted mt-3 mb-0">
              <Link to="/login" className="text-primary">
                Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
