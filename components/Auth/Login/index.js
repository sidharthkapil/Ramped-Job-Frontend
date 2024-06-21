import { useState, useEffect } from "react";
import Router from "next/router";
import { loginUser } from "../../../lib/auth";
import { removeToken } from "../../../lib/token";
import axios from 'axios';
export function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Remove the User's token which saved before.
    removeToken();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setIsLoading(true);

      axios.post('http://127.0.0.1:8000/api/auth/login', {
        email: username,
        password: password
      })
      .then(function (response) {
        console.log(response);
      
          window.localStorage.setItem("token", response.data.access_token);
        setTimeout(() => {
          Router.push("/dashboard");
        }, 1000);
      })
      .catch(function (error) {
        console.log(error.response.data.detail.msg);
        setErrorMessage(error.response.data.detail[0].msg);
      });
      // API call end
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset>
        <legend className="h1">Login</legend>
        <div className="mb-3">
          <label htmlFor="usernameInput" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="usernameInput"
            className="form-control"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="passwordInput" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="passwordInput"
            className="form-control"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="RememberMeInput"
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="RememberMeInput">
              Remember Me
            </label>
          </div>
        </div>
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {errorMessage}
          </div>
        )}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          Login
        </button>
      </fieldset>
    </form>
  );
}
