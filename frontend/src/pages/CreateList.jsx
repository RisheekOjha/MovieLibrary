import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Box,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { checklist } from "../utils/APIRoute";
import NavBar from "../component/Navbar";


function CreateList() {

  const [listName, setListName] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleVisibilityChange = (event) => {
    setVisibility(event.target.value);
  };

  const handleCreateList = async () => {
    if (listName.trim() === "") {
      setError("Please fill in the list name.");
      return;
    }

    try {
      const userdata = JSON.parse(localStorage.getItem("userdata"));
      if(!userdata)
          return toast.error("Please login to continue");
      
      const email=userdata.email;

      const response = await axios.post(checklist, {
        listName,
        email,
      });
      if (response.data.exists) {
        toast.error("Name already exists, choose another name.");
        return;
      }

      // Clear any previous error
      setError("");

      // Navigate to AddList component with the list name and visibility
      navigate("/add-list", { state: { listName, visibility } });
    } catch (error) {
      console.error("Error checking list name:", error);
      toast.error(
        "An error occurred while checking list name. Please try again."
      );
    }
  };

  const handleListNameChange = (e) => {
    setListName(e.target.value);
    if (error) {
      setError("");
    }
  };

  return (
    <>
      <NavBar />
      <Container
        sx={{
          padding: 4,
          maxWidth: 600,
          margin: "40px auto",
          backgroundColor: "#f0f0f0",
          borderRadius: 2,
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        <ToastContainer position="bottom-right" autoClose={1000} />
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#333",
            textAlign: "center",
          }}
        >
          Create a new list
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          sx={{
            color: "#666",
            textAlign: "center",
          }}
        >
          List your movie, TV & celebrity picks.
        </Typography>
        <Box
          sx={{
            maxWidth: 400,
            margin: "20px auto",
          }}
        >
          <TextField
            label="List Name"
            variant="outlined"
            fullWidth
            value={listName}
            onChange={handleListNameChange}
            sx={{
              marginBottom: 2,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
            error={Boolean(error)}
            helperText={error}
          />

          <FormControl component="fieldset">
            <FormLabel component="legend">Visibility</FormLabel>
            <RadioGroup
              aria-label="visibility"
              name="visibility"
              value={visibility}
              onChange={handleVisibilityChange}
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="Public"
                sx={{
                  marginBottom: 2,
                }}
              />
              {visibility === "public" && (
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{
                    color: "#666",
                  }}
                >
                  Your list will be visible to everyone.
                </Typography>
              )}
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="Private"
              />
              {visibility === "private" && (
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{
                    color: "#666",
                  }}
                >
                  Only you will be able to see your list.
                </Typography>
              )}
            </RadioGroup>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateList}
            sx={{
              marginTop: 2,
              padding: "12px 24px",
              fontSize: 16,
              fontWeight: "bold",
              borderRadius: 2,
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            Create List
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default CreateList;
