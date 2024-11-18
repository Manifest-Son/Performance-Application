import "./Signin.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
// import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object({
  fname: Yup.string()
    .required("Please enter your full name")
    .min(6, "Please enter your full name")
    .max(20, "Please enter a valid name"),
  emailAddress: Yup.string()
    .email("Please enter a valid Email Address")
    .required("Email Address required."),
  role: Yup.string().required("Role Required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string().required("Password required."),
});

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // const  navigate = useNavigate()

  const initialValues = {
    fname: "",
    emailAddress: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit = (formdata) => {
    if (formdata.password !== formdata.confirmPassword) {
      setError("The password does not match");
      return;
    }
    setLoading(true);
  };
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });
  return (
    <section className="signin-wrapper">
      <div className="signin-container">
        <div className="signin-card">
          <h1>Create Account</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fname"
                values={formik.values.fname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.fname && formik.errors.fname && (
                <p className="error-message">{formik.errors.fname}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email Address:</label>
              <input
                type="email"
                name="emailAddress"
                values={formik.values.emailAddress}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.emailAddress && formik.errors.emailAddress && (
                <p className="error-message">{formik.errors.emailAddress}</p>
              )}
            </div>
            <div className="form-group">
              <label>Role:</label>
              <select
                name="role"
                id="role"
                values={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="none">--Select a role--</option>
                <option value="leturer">Lecturer</option>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              {formik.touched.role && formik.errors.role && (
                <p className="error-message">{formik.errors.role}</p>
              )}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                values={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.password && formik.errors.password && (
                <p className="error-message">{formik.errors.password}</p>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                values={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="error-message">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </div>
            {error ? error : ""}

            <button type="submit" className="signin-button" disabled={loading}>
              {loading ? "Signing In ..." : "Sign In"}
            </button>
          </form>

          <p className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Signin;
