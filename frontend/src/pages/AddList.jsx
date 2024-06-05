import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MovieCard from "../component/MovieCard";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {addlist} from "../utils/APIRoute";
import { useLocation,useNavigate } from "react-router-dom";
import NavBar from "../component/Navbar";

function AddList() {

  const email = JSON.parse(localStorage.getItem("userdata")).email;
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { listName, visibility } = location.state || {};

  const navigate=useNavigate();

  const handleSearch = () => {
    setLoading(true);
       const API_KEY = import.meta.env.VITE_API_KEY;
    const encodedQuery = encodeURIComponent(searchQuery);

    fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodedQuery}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.Response === "True") {
          setSearchResults(data.Search || []);
          setError(null);
        } else {
          setSearchResults([]);
          setError(
            "No results found. Please try again with a different query."
          );
        }
      })
      .catch(() => {
        setError(
          "An error occurred while fetching data. Please try again later."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMovieSelection = (movie) => {
    setSelectedMovies((prevSelectedMovies) =>
      prevSelectedMovies.includes(movie)
        ? prevSelectedMovies.filter((m) => m !== movie)
        : [...prevSelectedMovies, movie]
    );
  };

  const handleAddToList = () => {
    if (selectedMovies.length === 0) {
      toast.error("Please select at least one movie.", {
        autoClose: 1000,
        position: "bottom-right",
      });
      return;
    }

    const dataToSend = {
      listName,
      visibility,
      movies: selectedMovies,
      email
    };

    axios
      .post(addlist, dataToSend)
      .then(() => {
        toast.success("Movies added to the list successfully!", {
          autoClose: 1000,
          position: "bottom-right",
        });
        setSelectedMovies([]); // Clear the selected movies
        setTimeout(()=>{
          navigate("/");
        },2000)
      })
      .catch(() => {
        toast.error("An error occurred while adding movies to the list.", {
          autoClose: 1000,
          position: "bottom-right",
        });
      });
  };

  return (
    <>
      <NavBar/>
      <Container>
        <ToastContainer />
        <Typography variant="h4" gutterBottom>
          <span style={{ fontFamily: "fantasy" }}>Add Movies To Your List</span>
        </Typography>
        {listName && visibility && (
          <Typography
            variant="h6"
            gutterBottom
            style={{ fontFamily: "cursive" }}
          >
            List Name: {listName} {<br />}
          </Typography>
        )}
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Search for movies"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "50%" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              startIcon={<SearchIcon />}
              onClick={handleSearch}
              style={{ marginTop: "10px", marginLeft: "10px" }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleAddToList}
              style={{ margin: "12px 0 0 20px" }}
            >
              Add to List
            </Button>
          </Grid>
          {loading ? (
            <Grid item xs={12}>
              <CircularProgress style={{ margin: "20px auto" }} />
            </Grid>
          ) : (
            <>
              {error && (
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    color="error"
                    style={{ marginTop: "10px" }}
                  >
                    {error}
                  </Typography>
                </Grid>
              )}
              {searchResults.map((movie, index) => (
                <Grid item xs={12} key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedMovies.includes(movie)}
                        onChange={() => handleMovieSelection(movie)}
                      />
                    }
                    label={<MovieCard movie={movie} />}
                    style={{ width: "100%" }}
                  />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default AddList;
