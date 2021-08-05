const express = require("express");

const userController = require("../controllers/users");
const router = express.Router();

// adding user - post request
router.post("/signup", userController.signup);

// login - check if email exists, compare the password to the hashed password
// use jwt tokens to send authentication token
router.post("/login", userController.login);

module.exports = router;
