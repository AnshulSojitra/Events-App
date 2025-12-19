import { useState } from "react";

export default function Form() {
  const [form, setForm] = useState({ userName: "", email: "", phone: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.userName || !form.email || !form.phone) {
      return setError("All fields are required");
    }

    if (!form.email.includes("@")) {
      return setError("Invalid email format");
    }

    if (!/^[0-9]{10,15}$/.test(form.phone)) {
      return setError("Phone must be 10–15 digits");
    }

    setError("");
    console.log("Form submitted:", form);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Username</h3>
        <input
          placeholder="Username"
          value={form.userName}
          onChange={(e) => setForm({ ...form, userName: e.target.value })}
        />
        <br></br>

        <h3>Email</h3>
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <br></br>

        <h3>Phone:</h3>
        <input
          placeholder="Phone Number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <br></br>

        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </>
  );
}
