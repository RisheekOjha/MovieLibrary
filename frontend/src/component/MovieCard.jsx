import React from "react";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function MovieCard({ movie, onDelete, isEditing }) {
  return (
    <Card
      style={{
        display: "flex",
        width: "60vw",
        margin: "20px",
        backgroundColor: "rgb(252, 245, 229)",
        border:"2px solid black",
        boxShadow:"4px 4px 4px black",
        borderRadius: "12% 40% 0% 12%",
      }}
    >
      <div>
        {movie.Poster && (
          <img
            src={movie.Poster}
            alt={movie.Title}
            style={{ width: "100px", height: "auto" }}
          />
        )}
      </div>
      <div style={{ flexGrow: 1 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {movie.Title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Year: {movie.Year}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Type: {movie.Type}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            IMDB ID: {movie.imdbID}
          </Typography>
        </CardContent>
      </div>
      {isEditing && (
        <IconButton onClick={() => onDelete(movie.imdbID)} color="secondary">
          <DeleteIcon />
        </IconButton>
      )}
    </Card>
  );
}

export default MovieCard;
