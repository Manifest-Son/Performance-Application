// components/Header.jsx
// eslint-disable-next-line no-unused-vars
import React from "react";
// import { useAuth } from '../context/AuthContext'; // Assuming you have auth context
import "./Header.css";

const Header = () => {
  //   const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="logo">
        <h1>MUT-Performa</h1>
      </div>

      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>

      <div className="auth-section">
        {/*         {user ? (
          <div className="user-info">
            <img 
              src={user.avatar || '/default-avatar.png'} 
              alt="User avatar" 
              className="avatar"
            />
            <span className="greeting">Hi, {user.name}</span>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        ) : ( */}
        <div className="auth-buttons">
          <button className="login-btn">Login</button>
          <button className="signup-btn">Sign Up</button>
        </div>
        {/* )} */}
      </div>
    </header>
  );
};

export default Header;
