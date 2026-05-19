import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token missing.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/auth/verify-email?token=${token}`,
        );

        const data = await res.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message);
        } else if (data.expired) {
          setStatus("expired");
          setMessage(data.message);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch {
        setStatus("error");
        setMessage("Something went wrong.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "80vh" }}
    >
      <div
        className="card shadow border-0 p-5 text-center"
        style={{ maxWidth: "440px", borderRadius: "20px" }}
      >
        {status === "verifying" && (
          <>
            <div className="spinner-border text-primary mx-auto mb-3" />
            <h5>Verifying your email...</h5>
          </>
        )}

        {status === "success" && (
          <>
            <div style={{ fontSize: "4rem" }}>✅</div>
            <h4 className="fw-bold text-success mt-2">Email Verified!</h4>
            <p className="text-muted">{message}</p>

            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate("/login", { replace: true })}
            >
              Go to Login
            </button>
          </>
        )}

        {status === "expired" && (
          <>
            <div style={{ fontSize: "4rem" }}>⏰</div>
            <h4 className="fw-bold text-warning mt-2">
              Verification Link Expired
            </h4>
            <p className="text-muted">{message}</p>

            <button
              className="btn btn-warning mt-2"
              onClick={() => navigate("/login", { replace: true })}
            >
              Go to Login & Resend Email
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <div style={{ fontSize: "4rem" }}>❌</div>
            <h4 className="fw-bold text-danger mt-2">Verification Failed</h4>
            <p className="text-muted">{message}</p>

            <button
              className="btn btn-outline-primary mt-2"
              onClick={() => navigate("/signup", { replace: true })}
            >
              Sign up again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
