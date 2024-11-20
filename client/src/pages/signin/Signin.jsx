import "./Signin.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { apiURL } from "../../config/config";
import toast from "react-simple-toasts";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";


const validationSchema = Yup.object({
  fname: Yup.string()
    .required("Please enter your full name")
    .min(4, "Please enter your full name")
    .max(20, "Please enter a valid name"),
    lname: Yup.string()
    .required("Please enter your full name")
    .min(4, "Please enter your full name")
    .max(20, "Please enter a valid name"),
  email: Yup.string()
    .email("Please enter a valid Email Address")
    .required("Email Address required."),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string().required("Password required."),
});

const Signin = () => {
  const [loading, setLoading] = useState(false);
  const  navigate = useNavigate()

  const initialValues = {
    fname: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  };

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...signupData } = formData; // Remove confirmPassword from API payload
      
      const response = await fetch(`${apiURL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupData),
        credentials: "include",
      });
      console.log(response)
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Signup failed");
      }

      toast("Account created successfully!", { theme: "success", duration: 2000 });
      navigate("/login");
    } catch (err) {
      toast(err.message, { theme: "failure", duration: 3000 });
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
    <section className="signin-wrapper">
      <div className="signin-container">
        <div className="signin-card">
          <h1>Create Account</h1>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label>First Name</label>
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
              <label>Last Name</label>
              <input
                type="text"
                name="lname"
                values={formik.values.lname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.lname && formik.errors.lname && (
                <p className="error-message">{formik.errors.lname}</p>
              )}
            </div>

            <div className="form-group">
              <label>Email Address:</label>
              <input
                type="email"
                name="email"
                values={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
              />
              {formik.touched.email && formik.errors.email && (
                <p className="error-message">{formik.errors.email}</p>
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
            {/* {error ? error : ""} */}

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
