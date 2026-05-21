import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const NavBar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully");

    navigate("/login", { replace: true });
  };

  const avatarSrc =
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || "U",
    )}&background=3b82f6&color=fff&size=64`;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container-fluid px-4">
        <Link className="navbar-brand fw-bold fs-4" to="/">
          TaskFlow
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user ? (
            <>
              <ul className="navbar-nav mx-auto gap-lg-2">
                <li className="nav-item">
                  <NavLink to="/dashboard" className="nav-link fw-semibold">
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/" className="nav-link fw-semibold">
                    Tasks
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/board" className="nav-link fw-semibold">
                    Board
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/calendar" className="nav-link fw-semibold">
                    Calendar
                  </NavLink>
                </li>

                {/* <li className="nav-item">
                  <NavLink to="/add-task" className="nav-link fw-semibold">
                    Add Task
                  </NavLink>
                </li> */}
              </ul>

              <div className="d-flex align-items-center gap-3">
                <Link
                  to="/profile"
                  className="text-decoration-none d-flex align-items-center gap-2"
                >
                  <img
                    src={avatarSrc}
                    alt="avatar"
                    className="rounded-circle border border-2 border-white"
                    style={{
                      width: "42px",
                      height: "42px",
                      objectFit: "cover",
                    }}
                  />

                  <span className="text-white fw-semibold d-none d-md-inline">
                    {user.name}
                  </span>
                </Link>

                <button
                  className="btn btn-light btn-sm fw-semibold px-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
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
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
