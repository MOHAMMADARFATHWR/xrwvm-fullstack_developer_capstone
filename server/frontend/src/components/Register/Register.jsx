import React, { useState } from "react";
import "./Register.css";
import user_icon from "../assets/person.png";
import email_icon from "../assets/email.png";
import password_icon from "../assets/password.png";
import close_icon from "../assets/close.png";

const Register = () => {
  // State variables for form inputs
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect to home
  const gohome = (e) => {
    if (e) e.preventDefault();
    window.location.href = window.location.origin;
  };

  // Handle form submission
  const register = async (e) => {
    e.preventDefault();
    setLoading(true);

    let register_url = window.location.origin + "/djangoapp/register";

    try {
      const res = await fetch(register_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          password: password,
          firstName: firstName,
          lastName: lastName,
          email: email,
        }),
      });

      const json = await res.json();
      if (json.status) {
        sessionStorage.setItem("username", json.userName);
        window.location.href = window.location.origin;
      } else if (json.error === "Already Registered") {
        alert("The user with the same username is already registered.");
        window.location.href = window.location.origin;
      } else {
        alert("Registration failed. Please check your credentials and try again.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register_page_wrapper">
      <div className="register_card">
        {/* Header section */}
        <div className="register_header">
          <div className="title_box">
            <h2>Create Account</h2>
            <p className="subtitle">Join our dealership platform today</p>
          </div>
          <button className="close_btn" onClick={gohome} type="button" aria-label="Close">
            <img src={close_icon} alt="Close" />
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={register} className="register_form">
          <div className="inputs_grid">
            <div className="input_box full_width">
              <img src={user_icon} className="input_icon" alt="Username" />
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="input_field"
                required
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="input_box">
              <img src={user_icon} className="input_icon" alt="First Name" />
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                className="input_field"
                required
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="input_box">
              <img src={user_icon} className="input_icon" alt="Last Name" />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                className="input_field"
                required
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>

            <div className="input_box full_width">
              <img src={email_icon} className="input_icon" alt="Email" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="input_field"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input_box full_width">
              <img src={password_icon} className="input_icon" alt="Password" />
              <input
                name="psw"
                type="password"
                placeholder="Password"
                className="input_field"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="submit_panel">
            <button className="submit_btn" type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Register Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;