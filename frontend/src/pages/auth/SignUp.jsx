import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (formData.password.trim().length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Account created successfully!");
        navigate("/login", { replace: true });
      } else {
        toast.error(data.message || "Signup failed.");
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
      style={{
        minHeight: "90vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: "100%",
          maxWidth: "460px",
          borderRadius: "20px",
        }}
      >
        <h2 className="text-center mb-1 fw-bold text-primary">
          Create Account
        </h2>

        <p className="text-center text-muted mb-4">Sign up to get started</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>

            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email Address</label>

            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>

            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Min. 6 characters"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-semibold"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center text-muted mt-3 mb-0">
          Already have an account?{" "}
          <Link to="/login" className="text-primary fw-semibold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
