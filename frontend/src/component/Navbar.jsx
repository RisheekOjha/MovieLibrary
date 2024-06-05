import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import Logout from "../component/Logout";
import { FaHome } from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";

const NavBar = () => {

  const userdata=localStorage.getItem("userdata");
  
  return (
    <AppBar position="static" className="my-nav" sx={{ bgcolor: "black" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            <FaHome style={{ fontSize: "25px" }} />
          </Button>
        </Typography>
        {userdata ? (
          <Logout />
        ) : (
          <Button component={Link} to="/login" style={{ fontSize: "35px",color:"white" }}>
            {" "}
            <RiLoginCircleLine />
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
