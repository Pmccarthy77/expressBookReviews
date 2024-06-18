const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    { username: "Powell M", password: "yo" }
];

const SECRET_KEY = 'access';

const isValid = (username)=>{ //returns boolean
    if(users[username] != null) {
        return false;
    }

    return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // check if user exists
    if(users[username] != null) {
        return false;
    }
    // check if username matches password
    else if(users[username].password != password) {
        return false;
    }
    // if username exists and password matches, return true
    else {
        return true;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {

    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ msg: "Missing username or password" });
    }

    let storedPassword = users[username];

    if (!storedPassword || storedPassword !== password) {
        return res.status(401).json({ msg: "Bad username or password" });
    }

    const token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: '1h' });
    req.session.authorization = {
        accessToken: token
    };
    return res.status(200).json({ accessToken: token });
    
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.body;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is missing" });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully", reviews: book.reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Assuming username is stored in req.user from authentication middleware

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for this ISBN
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    // Delete the review
    delete books[isbn].reviews[username];

    // Return success response
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
