import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    user = null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "User",
    )}&background=0d6efd&color=fff`;

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className="navbar navbar-expand-lg bg-white shadow-sm sticky-top"
      style={{
        borderBottom: "1px solid #e9ecef",
        zIndex: 1000,
      }}
    >
      <div className="container">
        {/* LOGO */}
        <Link
          className="navbar-brand fw-bold fs-4 text-primary"
          to="/dashboard"
        >
          TaskFlow
        </Link>

        {/* MOBILE TOGGLER */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          {user ? (
            <>
              {/* CENTER NAV */}
              <ul className="navbar-nav mx-auto align-items-lg-center">
                <li className="nav-item">
                  <Link
                    className={`nav-link fw-semibold ${
                      isActive("/dashboard") ? "text-primary" : "text-dark"
                    }`}
                    to="/dashboard"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className={`nav-link fw-semibold ${
                      isActive("/") ? "text-primary" : "text-dark"
                    }`}
                    to="/"
                  >
                    Tasks
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link fw-semibold text-dark"
                    to="/dashboard"
                  >
                    Analytics
                  </Link>
                </li>

                <li className="nav-item">
                  <span
                    className="nav-link text-muted fw-semibold"
                    style={{ cursor: "not-allowed" }}
                  >
                    Kanban
                  </span>
                </li>
              </ul>

              {/* RIGHT SECTION */}
              <div className="d-flex align-items-center gap-3 flex-column flex-lg-row mt-3 mt-lg-0">
                {/* ADD TASK BUTTON */}
                <button
                  className="btn btn-primary fw-semibold px-4"
                  style={{
                    borderRadius: "12px",
                  }}
                  onClick={() => navigate("/add-task")}
                >
                  + Add Task
                </button>

                {/* NOTIFICATION PLACEHOLDER */}
                <button
                  className="btn btn-light border rounded-circle"
                  style={{
                    width: "42px",
                    height: "42px",
                  }}
                  disabled
                  title="Notifications coming soon"
                >
                  🔔
                </button>

                {/* PROFILE */}
                <div className="dropdown">
                  <button
                    className="btn btn-light border dropdown-toggle d-flex align-items-center gap-2"
                    data-bs-toggle="dropdown"
                    style={{
                      borderRadius: "14px",
                    }}
                  >
                    <img
                      src={avatarSrc}
                      alt="avatar"
                      className="rounded-circle"
                      style={{
                        width: "36px",
                        height: "36px",
                        objectFit: "cover",
                      }}
                    />
                    <span className="fw-semibold d-none d-md-inline">
                      {user.name}
                    </span>
                  </button>

                  <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        👤 Profile
                      </Link>
                    </li>

                    <li>
                      <button
                        className="dropdown-item text-danger"
                        onClick={handleLogout}
                      >
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link fw-semibold" to="/login">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="btn btn-primary ms-lg-3 px-4"
                  to="/signup"
                  style={{
                    borderRadius: "12px",
                  }}
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
