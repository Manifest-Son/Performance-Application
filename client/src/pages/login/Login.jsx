// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./Login.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { apiURL } from "../../config/config";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
import { useAuthStore } from "../../stores/store";

const validationSchema = Yup.object({
  email: Yup.string()
    .required("Email Address cannot be empty")
    .email("Enter a valid Email Address"),
  password: Yup.string()
    .required("Password cannot be empty.")
    .min(5, "Password should be more than 5 characters.")
    .max(15, "Password should be less than 15 characters."),
});

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser, setToken } = useAuthStore()
  const navigate = useNavigate();
  
  const initialValues = {
    email: "",
    password: "",
  };

  const onSubmit = async (formState) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formState, rememberMe }),
        credentials: "include",
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast("Login Successful", { theme: "success", duration: 2000 });
      
      setUser(data.data)
      setToken(data.token)

      const roleRedirects = {
        admin: "/admin",
        lecturer: "/lecturer",
        student: "/student",
        default: "/staff"
      };

      const userRole = data.data.role.toLowerCase();
      navigate(roleRedirects[userRole] || roleRedirects.default);
      
    } catch (err) {
      toast(err.message, { theme: "failure", duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <section className="login-wrapper">
      <div className="login-container">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="subtitle">Please enter your details.</p>
          <form onSubmit={formik.handleSubmit} className="form_input">
            <div className="form-group">
              <label htmlFor="email">Email Address:</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className="error-message">{formik.errors.email}</p>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <p className="error-message">{formik.errors.password}</p>
              )}
            </div>
            
            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>
              <a className="forgot-password" href="/forgot-password">
                Forgot Password?
              </a>
            </div>
            
            <button
              className="login-button"
              type="submit"
              disabled={loading || !formik.isValid}
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
            
            <p className="signup-link">
              Don&#x27;t have an account? <a href="/signin">Sign Up</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;