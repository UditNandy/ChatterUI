import React, { useState, useEffect } from "react";
import Logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register } from "../../utils/apiEndpoints";

export const Register = () => {
  const [value, setValue] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const toastOptions = {
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation()) {
      const { password, username, email } = value;
      try {
        const { data } = await axios.post(register, {
          username,
          email,
          password,
        });
        sessionStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/setAvatar");
      } catch (err) {
        toast.error(err.response.data.message, toastOptions);
      }
    }
  };

  const handleValidation = () => {
    const { password, confirmPassword, username, email } = value;
    if (password !== confirmPassword) {
      toast.error("password and confirm password should be same", toastOptions);
      return false;
    } else if (username.length < 3) {
      toast.error(
        "Ussername should be greater then 3 characters",
        toastOptions
      );
      return false;
    } else if (password.length < 8) {
      toast.error(
        "Password should be equal or greater then 8 characters",
        toastOptions
      );
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptions);
      return false;
    }
    return true;
  };

  const handleChange = (event) => {
    setValue({ ...value, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (sessionStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  }, []);

  return (
    <div>
      <FormContainer>
        <form
          onSubmit={($event) => {
            handleSubmit($event);
          }}
        >
          <div className="brand">
            <img src={Logo} />
            <h1>Chatter</h1>
          </div>
          <input
            placeholder="Username"
            name="username"
            onChange={handleChange}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={handleChange}
          />
          <button type="submit">Create user</button>
          <span>
            Already have an account ?{" "}
            <span
              className="login"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </span>
          </span>
        </form>
      </FormContainer>
      <ToastContainer />
    </div>
  );
};

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content:center;
  gap:1rem;
  align-items:center;
  background-color:#131324;

  .brand{
    display:flex;
    align-items:center;
    gap:1rem;
    img{
        height:5rem;
    }
    h1{
        color:white;
        text-transform:uppercase;
    }
  }

  form{
    display:flex;
    flex-direction:column;
    gap:2rem;
    background-color:#00000076;
    border-radius:2rem;
    padding:3rem 5rem;
    
    input{
        background-color:transparent;
        padding:1rem;
        border:0.1rem solid #4e0eff;
        border-radius:0.4rem;
        color:white;
        width:100%;
        font-size:1rem;
        &:focus{
            border:.1rem solid #997af0;
            outline:none;
        }
    }
    button{
        background-color:#997af0;
        color:white;
        padding:1rem 2rem;
        border:none;
        font-weight:bold;
        cursor:pointer;
        border-radius:0.4rem;
        font-size:1rem;
        text-transform:uppercase
        transition:0.5s ease-in-out;
        &:hover{
            backgrounf-color:#4e0eff;
        }
    }
    span{
        color:white;
        text-transform:uppercase;
        .login{
            color:#4e0eff;
            text-decoration:none;
            font-weight:bold;
        }
    }
  }
`;
