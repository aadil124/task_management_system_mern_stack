import React from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NavBar = () => {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");

    navigate("/login", { replace: true });
  };

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "U",
    )}&background=3b82f6&color=fff&size=32`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          Task Manager
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Tasks
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/add-task">
                    Add Task
                  </Link>
                </li>

                <li className="nav-item ms-2">
                  <Link
                    to="/profile"
                    className="d-flex align-items-center text-decoration-none"
                  >
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="rounded-circle border border-2 border-white me-2"
                      style={{
                        width: 34,
                        height: 34,
                        objectFit: "cover",
                      }}
                    />
                    <span className="text-white fw-semibold">{user.name}</span>
                  </Link>
                </li>

                <li className="nav-item ms-2">
                  <button
                    className="btn btn-outline-light btn-sm fw-semibold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
