// src/pages/Login.js
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Link,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {login} from "../utils/APIRoute";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../component/Navbar";


function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const toastOptions = {
      position: "bottom-right",
      autoClose: 1500,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      style: {
        backgroundColor: "#008E97",
        color: "#ffffff", // White text
      },
    };

  const [errors, setErrors] = useState({});
  
  const navigate= useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.email) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      
        const response = await axios.post(login, formData);
        if (response.data.status === true) {
          toast.success(response.data.msg, toastOptions);

          // response.data.username add it to localhost
          const userData = {
            username: response.data.username,
            email: formData.email,
          };

          localStorage.setItem("userdata",JSON.stringify(userData));

          navigate("/")

        } else {
          toast.error(response.data.msg, toastOptions);
        }
      
    } else {
      setErrors(formErrors);
    }
  };


  return (
    <>
      <NavBar />
    <Container component="main" maxWidth="xs">
      <ToastContainer />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
                helperText={errors.email}
                style={{ border: "1px solid black" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                style={{ border: "1px solid black" }}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <span style={{ fontFamily: "cursive" }}>
                Don't have an account ?{" "}
              </span>
              <Link href="/signup" variant="body2">
                Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  </>
  );
}

export default Login;
