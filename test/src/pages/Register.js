import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    check: false,
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password || !form.check) {
      return setError("All fields are required");
    } else {
      navigate("/home");
    }

    if (!form.email.includes("@")) {
      return setError("Invalid email format");
    } else {
      navigate("/home");
    }

    setError("");
    console.log("Form submitted:", form);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="container mt-4"
      style={{ maxWidth: "400px" }}
    >
      <div className="mb-3">
        <label htmlFor="username" className="form-label">
          Username
        </label>
        <input
          name="username"
          type="text"
          className="form-control"
          id="username"
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="exampleInputEmail1" className="form-label">
          Email address
        </label>
        <input
          name="email"
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          onChange={handleChange}
        />
        <div id="emailHelp" className="form-text">
          We'll never share your email with anyone else.
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="exampleInputPassword1" className="form-label">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          onChange={handleChange}
        />
      </div>

      <div className="mb-3 form-check">
        <input
          name="check"
          type="checkbox"
          className="form-check-input"
          id="exampleCheck1"
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="exampleCheck1">
          I agree to terms and conditions
        </label>
      </div>

      <button type="submit" className="btn btn-primary">
        Register
      </button>
      <h6>{error}</h6>
    </form>
  );
};

// onChange={(e) => setForm({ ...form, check: e.target.value })}
