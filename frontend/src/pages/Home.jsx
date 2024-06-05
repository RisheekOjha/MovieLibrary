import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MovieCard from "../component/MovieCard";
import { Link,useNavigate } from "react-router-dom";
import ShowList from "../component/ShowList";
import NavBar from "../component/Navbar";

function Home() {

const [username,setUserName]=useState('');
const navigate=useNavigate();
useEffect(()=>{

    const userdata = JSON.parse(localStorage.getItem("userdata"));
    if(!userdata)return;

    setUserName(userdata.username);
      
  },[])

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  return (
    <>
      <NavBar />
      <Container >
        <div style={{ float: "right" }}>
          <h2
            style={{
              fontFamily: "cursive",
              textTransform: "capitalize",
                         
              }}
          >
            Welcome <span style={{color:"white"}}>{username}</span> !
          </h2>
        </div>
        <Typography
          variant="h4"
          gutterBottom
          style={{
            fontFamily: "fantasy",
            textAlign: "center",
            fontSize: "50px",
            marginLeft:"2rem"
          }}
        >
          Movie Library
        </Typography>
        <ShowList />
        <Grid container spacing={2} style={{ marginTop: "1rem" }}>
          <Grid item xs={12}>
            <TextField
              label="Search for movies"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
              color="secondary"
              onClick={handleClear}
              style={{ marginTop: "10px", marginLeft: "10px" }}
            >
              Clear
            </Button>

            <Button
              component={Link}
              to="/create-list"
              variant="outlined"
              color="secondary"
              style={{ margin: "10px 0 0 1rem", border: "2px solid black" }}
            >
              Create New List
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
                <Grid
                  item
                  xs={12}
                  key={index}
                  style={{ display: "inline-block" }}
                >
                  <MovieCard movie={movie} />
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Container>
    </>
  );
}

export default Home;
