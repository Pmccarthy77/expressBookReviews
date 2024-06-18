const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  
    if (req.body.username){
        if(isValid(req.body.username)) {
            users[req.body.username] = req.body.password;
            res.send("The user" + (' ')+ (req.body.username) + " Has been added!");
        }
        else {
            res.send("User not added due to unforseen circumstances");
        }
    }
    
  return res.status(300).json({message: "1 Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
  // return res.status(300).json({message: "1 Implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  // return res.status(300).json({message: "2 Yet to be implemented"});
 });



// Get all books based on title using Promise callbacks
public_users.get('/title/:title', function (req, res) {
    const userTitle = req.params.title;
    new Promise((resolve, reject) => {
        let booksByTitle = [];
        for (let key in books) {
            if (books[key].title === userTitle) {
                booksByTitle.push(books[key]);
            }
        }
        if (booksByTitle.length > 0) {
            resolve(booksByTitle);
        } else {
            reject("No books found with this title");
        }
    })
    .then(data => {
        res.send(data);
    })
    .catch(error => {
        res.status(404).json({ message: error });
    });
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {

    const userAuthor = req.params.author;

    // array of 1-10 keys for book object
    let keys = Object.keys(books);
    let booksByAuthor = [];

    // iterate through object keys to find author matches
    for(i = 1; i <= keys.length; i++) {
           if(books[i].author == userAuthor) {
            booksByAuthor.push(books[i]);
        }
    }

    res.send(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  
    const userTitle = req.params.title;

    // array of 1-10 keys for book object
    let keys = Object.keys(books);
    let booksByTitle = [];

    // iterate through object keys to find author matches
    for(i = 1; i <= keys.length; i++) {
           if(books[i].title == userTitle) {
            booksByTitle.push(books[i]);
        }
    }

    res.send(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    let isbn = req.params.isbn;
    res.send(books[isbn].reviews);

  return res.status(300).json({message: "5 Yet to be implemented"});
});

module.exports.general = public_users;
