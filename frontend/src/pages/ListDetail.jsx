import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import MovieCard from "../component/MovieCard";
import { Typography, Box, Button } from "@mui/material";
import { singlelist, deletemovie } from "../utils/APIRoute";
import NavBar from "../component/Navbar";


function ListDetail() {
  const location = useLocation();
  const { listName } = location.state || {};
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const email = JSON.parse(localStorage.getItem("userdata")).email;
        const response = await axios.post(singlelist, { email, listName });

        console.clear(); // Clear the console
        console.log("Movies:", response.data.movies); // Log movies to the console

        setMovieList(response.data.movies);
        setError(null);
      } catch (error) {
        setError("Error fetching movies");
      } finally {
        setLoading(false);
      }
    };

    if (listName) {
      fetchMovies();
    }
  }, [listName]);

  const handleDelete = async (imdbID) => {
    try {
      const email = JSON.parse(localStorage.getItem("userdata")).email;
      await axios.post(deletemovie, { email, imdbID, listName });

      // Update the movie list in the state
      setMovieList(movieList.filter((movie) => movie.imdbID !== imdbID));
    } catch (error) {
      console.error("Error deleting movie:", error);
      // Handle error
    }
  };

  return (
    <>
      <NavBar />
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        {listName}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
      
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsEditing(!isEditing)}
        sx={{ marginBottom: 2 }}
      >
        {isEditing ? "Done" : "Edit"}
      </Button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {movieList.length > 0 ? (
            movieList.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                onDelete={() => handleDelete(movie.imdbID)}
                isEditing={isEditing}
              />
            ))
          ) : (
            <h2 style={{fontFamily:"cursive"}}>List is empty</h2>
          )}
        </Box>
      )}
    </Box>
    </>
  );
}

export default ListDetail;
