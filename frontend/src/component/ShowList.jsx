import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getlist, deletelist } from "../utils/APIRoute";
import {
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Button,
  } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";

function ShowList() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // State for the dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchLists = async () => {
      setLoading(true);
      try {
        const email = localStorage.getItem("userdata")
          ? JSON.parse(localStorage.getItem("userdata")).email
          : "";
        const response = await axios.get(getlist, {
          headers: { email },
        });
        setLists(response.data.lists);
        setError(null);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, []);

  const handleListClick = (list) => {
    navigate(`/list/${list._id}`, { state: { listName: list.listName } });
  };

  const handleDelete = async (listId, listName) => {
    try {
      const tellme = await Swal.fire({
        title: "Are you sure?",
        text: "Are you sure you want to Delete the list ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
        width: "25rem",
      });
      if (!tellme.value) return;
      const email = JSON.parse(localStorage.getItem("userdata")).email;
      setLists(lists.filter((list) => list._id !== listId));

      await axios.post(deletelist, { email, listName });
    } catch (error) {
      console.error("Error deleting list:", error);
    }
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <h2 style={{ fontFamily: "cursive" }}>{error}</h2>
      ) : (
        <>
          {/* Button to show lists (always visible) */}

          <Button
            variant="contained"
            onClick={handleClick}
            style={{
              background: "linear-gradient(120deg,yellow,orange 10%,yellow)",
              color: "black",
            }}
          >
            <span style={{ fontWeight: "bolder" }}>Show Lists</span>
          </Button>

          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
                >
            {lists.length > 0 ? (
              lists.map((list) => (
                <MenuItem key={list._id}>
                  <ListItemText
                    primary={list.listName}
                    onClick={() => handleListClick(list)}
                    style={{ cursor: "pointer",width:"140px" }}
                  />
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(list._id, list.listName)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No lists available</MenuItem>
            )}
          </Menu>
        </>
      )}
    </div>
  );
}

export default ShowList;
