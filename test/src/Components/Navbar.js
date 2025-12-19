import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          MyApp
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link active" aria-current="page">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/login" className="nav-link active" aria-current="page">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/register"
                className="nav-link active"
                aria-current="page"
              >
                Register
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/post" className="nav-link active" aria-current="page">
                Post
              </Link>
            </li>

            <li className="nav-item">
              <Link
                to="/events"
                className="nav-link active"
                aria-current="page"
              >
                Events
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
