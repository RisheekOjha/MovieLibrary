const mongoose = require("mongoose");

// Define schema for user's movie list
const movieListSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
    required: true,
  },
  lists: [
    {
      listName: {
        type: String,
        required: true,
      },
      visibility: {
        type: String,
        required: true,
      },
      movies: [
        {
          // Define the structure for each movie entry in the list
          Title: {
            type: String,
            required: true,
          },
          Year: {
            type: String,
          },
          Type: {
            type: String,
          },
          imdbID: {
            type: String,
          },
          Poster: {
            type: String,
          },
        },
      ],
    },
  ],
});

// Create model from schema
const MovieList = mongoose.model("MovieList", movieListSchema);

module.exports = MovieList;
