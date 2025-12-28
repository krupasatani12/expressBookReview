const express = require("express");
const books = require("./booksdb");
const { authenticatedUser, generalUser } = require("./users");

const app = express();
app.use(express.json());

// Get all books
app.get("/books", (req, res) => {
    res.json(books);
});

// Get book by ISBN
app.get("/books/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    res.json(books[isbn]);
});

// Get books by author
app.get("/books/author/:author", (req, res) => {
    const author = req.params.author;
    let result = {};
    for (let key in books) {
        if (books[key].author === author) {
            result[key] = books[key];
        }
    }
    res.json(result);
});

// Get books by title
app.get("/books/title/:title", (req, res) => {
    const title = req.params.title;
    let result = {};
    for (let key in books) {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    }
    res.json(result);
});

// Get book review
app.get("/books/review/:isbn", (req, res) => {
    res.json(books[req.params.isbn].reviews);
});

// Add / modify review
app.put("/auth/review/:isbn", (req, res) => {
    const { username, review } = req.body;
    books[req.params.isbn].reviews[username] = review;
    res.json({ message: "Review added successfully" });
});

// Delete review
app.delete("/auth/review/:isbn", (req, res) => {
    const { username } = req.body;
    delete books[req.params.isbn].reviews[username];
    res.json({ message: "Review deleted successfully" });
});

app.use("/", generalUser);

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});