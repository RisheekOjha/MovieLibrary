// src/pages/Signup.js
import React, { useEffect, useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Link,
} from "@mui/material";
import { signup } from "../utils/APIRoute";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "../component/Navbar";


function Signup() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1500,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    style: {
      backgroundColor: "#0E3386", // Blue color
      color: "#ffffff", // White text
    },
  };

  const navigate=useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let formErrors = {};
    if (!formData.username) {
      formErrors.username = "Username is required";
    } else if (formData.username.length <= 3) {
      formErrors.username = "Username must be greater than 3 characters";
    }

    if (!formData.email) {
      formErrors.email = "Email is required";
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
    } else if (formData.password.length <= 3) {
      formErrors.password = "Password must be greater than 3 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
  
        const response = await axios.post(signup, formData);

        if (response.data.status===true) {
            console.log("Successfully registered");
            toast.success(
            response.data.msg || "Successfully registered",
            toastOptions
          );
         navigate("/login");
          
        } else {
             toast.error(
            response.data.msg || "User not registered",
            toastOptions
          );
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
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={formData.username}
                onChange={handleChange}
                error={Boolean(errors.username)}
                helperText={errors.username}
                className="outline"
                style={{ border: "1px solid black" }}
              />
            </Grid>
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
                helperText={errors.password}
                style={{ border: "1px solid black" }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
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
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <span style={{ fontFamily: "cursive" }}>
                Already have an account?{" "}
              </span>
              <Link href="/login" variant="body2">
                Sign In
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
    </>
  );
}

export default Signup;
