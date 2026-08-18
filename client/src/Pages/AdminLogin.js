import { useState } from "react";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "https://roof-estimator-backend-wl3z.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem(
        "adminToken",
        data.token
      );

      onLogin();
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-login-card">
        <p className="eyebrow">Admin Portal</p>

        <h1>Roof Estimator</h1>

        <p className="subtitle">
          Sign in to manage your estimator.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>

            <input
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="Admin username"
            />
          </div>

          <div className="field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="Password"
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary-button full-width"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;