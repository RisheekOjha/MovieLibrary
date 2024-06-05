import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import CreateList from "./pages/CreateList";
import AddList from "./pages/AddList";
import ListDetail from "./pages/ListDetail";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/create-list" element={<CreateList />}></Route>
        <Route path="/add-list" element={<AddList />}></Route>
        <Route path="/list/:listId" element={<ListDetail />} />
      </Routes>
    </Router>
  );
}

export default App;