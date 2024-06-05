const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const User = require("../model/userSchema");
const router = express.Router();
const {
  login,
  signup,
  addlist,
  getlist,
  checklist,
  deletemovie,
  singlelist,
  deletelist
} = require("../controller/authController");


router.post("/signup",signup );

router.post("/login",login);

router.post("/addlist",addlist);

router.get("/getlist",getlist)

router.post("/checklist",checklist);

router.post("/deletemovie",deletemovie);

router.post("/singlelist",singlelist);

router.post("/deletelist",deletelist);

module.exports = router;
