const express = require("express");
const jwt = require("jsonwebtoken");
let users = [];

const authenticatedUser = express.Router();
const generalUser = express.Router();

const isValid = (username) => {
    return users.some((user) => user.username === username);
};

const authenticated = (username, password) => {
    return users.some(
        (user) => user.username === username && user.password === password
    );
};

// Register
generalUser.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ username, password });
            return res.json({ message: "User registered successfully" });
        }
        return res.status(400).json({ message: "User already exists" });
    }
    return res.status(400).json({ message: "Username and password required" });
});

// Login
generalUser.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (authenticated(username, password)) {
        let accessToken = jwt.sign({ username }, "access", {
            expiresIn: 60 * 60,
        });
        req.session = { authorization: { accessToken } };
        return res.json({ message: "Login successful" });
    }
    return res.status(401).json({ message: "Invalid credentials" });
});

module.exports = { authenticatedUser, generalUser };