// eslint-disable-next-line no-unused-vars
import React from "react"
import "./Login.css"
import * as Yup from "yup"
import { useFormik } from "formik"
import { useState } from "react"


const validationSchema = Yup.object({
    emailAddress: Yup.string().required("Email Address cannot be empty").email("Enter a valid Email Address"),
    password: Yup.string().required("Passoword cannot be empty.").min(5,"Password should be more than 5 characters.").max(15,"Password should be less than 15 characters.")
})

const Login = () => {
    const [loading, setLoading] = useState(false) 
const initialValues = {
    emailAddress: "",
    password: ""
}

const onSubmit = async () => {
    setLoading(true)
    
}

const formik = useFormik({
    initialValues, onSubmit, validationSchema
})
return(
    <>
    <section className="login-wrapper">
        <div className="login-container">
        <div className="login-card">
            <h1>Welcome Back</h1>
            <p className="subtitle">Please enter your details.</p>
            <form onSubmit={formik.handleChange} className="form_input">
                <div className="form-group">
                    <label>Email Address:</label>
                    <input type="email" name="emailAddress" id="emailAddress" value={formik.values.emailAddress} onChange={formik.handleChange} onBlur={formik.handleBlur} required/>
                    {formik.touched.emailAddress && formik.errors.emailAddress && (<p className="error-message">{formik.errors.emailAddress}</p>) }
        
                    </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input type="password" name="password" id="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} required/>
                    {formik.touched.password && formik.errors.password && (<p className="error-message">{formik.errors.password}</p>) }
                    </div>
                <div className="form-options">
                    <label className="remeber-me">
                        <input type="checkbox"/> Remember Me
                    </label>
                    <a className="forgot-password" href="">Forgot Password?</a>
                </div>
                <button className="login-button" type="submit" disabled={loading}>
                    {loading ? "Loging In..." : "Log In"}
                </button>
                <p className="signup-link">
          Don&#x27;t have an account? <a href="/signin">Sign In</a>
        </p>
            </form>
        </div>
            </div>    
    </section>
    </>
)
} 

export default Login