const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const User = require("../model/userSchema");
const router = express.Router();
const MovieList = require("../model/movieListSchema");

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ msg: "Email Id already exists", status: false });
    }

    // Hash password using bcrypt-nodejs
    const hashedPassword = bcrypt.hashSync(password);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save user to database
    await newUser.save();

    res.json({ msg: "Sign up successfull", status: true });
  } catch (err) {
    console.log(err);
    res.json({ msg: "Error in Sign Up", status: false });
  }
};

module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: false, msg: "Email does not exist" });
    }

    // Compare password using bcrypt-nodejs
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid email or password", status: false });
    }

    res.json({
      msg: "Login successful",
      status: true,
      username: user.username,
    });
  } catch (err) {
    console.error(err);
    res.json({ msg: "Unable to login Refresh the page", status: false });
  }
};

module.exports.addlist = async (req, res) => {
  try {
    // Extract data from the request body
    const { email, listName, visibility, movies } = req.body;

    // Find the user based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the user already has a movie list
    let movieList = await MovieList.findOne({ userId: user._id });

    if (!movieList) {
      // If no movie list exists, create a new one
      movieList = new MovieList({
        userId: user._id,
        lists: [{ listName, visibility, movies }],
      });

      // Save the movie list to the database
      const savedList = await movieList.save();

      // Respond with success message and the saved list
      return res.status(200).json({
        success: true,
        message: "Movie list added successfully",
        list: savedList,
      });
    }

    // Update the existing movie list by appending the new list
    movieList.lists.push({ listName, visibility, movies });

    // Save the updated movie list to the database
    const updatedList = await movieList.save();

    // Respond with success message and the updated list
    res.status(200).json({
      success: true,
      message: "Movie list updated successfully",
      list: updatedList,
    });
  } catch (error) {
    // Handle errors
    console.error("Error adding movie list:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while adding the movie list",
    });
  }
};

module.exports.checklist = async (req, res) => {
  const { listName, email } = req.body;
  try {
    // Find user by email to get user ID
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if any list with the given name exists for the user
    const existingList = await MovieList.findOne({
      userId: user._id,
      "lists.listName": listName, // Adjusted to match the 'listName' key in lists array
    });

    if (existingList) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking list name:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports.getlist = async (req, res) => {
  try {
    // Fetch the email from the request headers
    const email = req.headers.email;

    // Retrieve the user ID using the email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch user's movie lists based on the user ID
    const movieList = await MovieList.findOne({ userId: user._id });
    if (!movieList) {
      return res.status(404).json({ error: "Movie lists not found" });
    }

    res.json({ lists: movieList.lists });
  } catch (error) {
    console.error("Error fetching user lists:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.deletemovie = async (req, res) => {
  const { email, imdbID, listName } = req.body;

  try {
    // Find the user based on the email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the movie list in the database by removing the specified movie
    await MovieList.updateOne(
      { userId: user._id, "lists.listName": listName },
      { $pull: { "lists.$.movies": { imdbID } } }
    );

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.singlelist = async (req, res) => {
  const { email, listName } = req.body;

  try {
    // Find the user based on the email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the list based on the user ID and list name
    const movieList = await MovieList.findOne({
      userId: user._id,
      "lists.listName": listName,
    });

    if (!movieList) {
      return res.status(404).json({ message: "List not found" });
    }

    // Get the movies from the found list
    const movies = movieList.lists.find(
      (list) => list.listName === listName
    ).movies;

    res.status(200).json({ movies });
  } catch (error) {
    console.error("Error fetching single list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.deletelist = async (req, res) => {
  const { email, listName } = req.body;

  try {
    // Find the user based on the email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the movie list document for the user
    const movieListDoc = await MovieList.findOne({ userId: user._id });

    if (!movieListDoc) {
      return res.status(404).json({ message: "Movie list not found" });
    }

    // Find the index of the list to delete
    const listIndex = movieListDoc.lists.findIndex(
      (list) => list.listName === listName
    );

    if (listIndex === -1) {
      return res.status(404).json({ message: "List not found" });
    }

    // Remove the list from the document
    movieListDoc.lists.splice(listIndex, 1);

    // Save the updated document
    await movieListDoc.save();

    res.status(200).json({ message: "List deleted successfully" });
  } catch (error) {
    console.error("Error deleting list:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
