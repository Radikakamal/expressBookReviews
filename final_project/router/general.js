const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const getBooks = async () => {
  return await Promise.resolve(books);
};

public_users.post("/register", async (req, res) => {
  const {username, password} = req.body;

  if (!username || !password) {
    return res.status(400).json({message: "Username and password required"});
  }

  if (isValid(username)) {
    return res.status(409).json({message: "User already exists"});
  }

  users.push({username, password});
  return res.status(200).json({message: "User successfully registered. Now you can login"});
});

public_users.get('/', async (req, res) => {
  const data = await getBooks();
  return res.status(200).json(data);
});

public_users.get('/isbn/:isbn', async (req, res) => {
  const data = await getBooks();
  const book = data[req.params.isbn];

  if (book) {
    return res.status(200).json(book);
  }

  return res.status(404).json({message: "Book not found"});
});

public_users.get('/author/:author', async (req, res) => {
  const data = await getBooks();
  const result = {};

  for (const isbn in data) {
    if (data[isbn].author.toLowerCase() === req.params.author.toLowerCase()) {
      result[isbn] = data[isbn];
    }
  }

  return res.status(200).json(result);
});

public_users.get('/title/:title', async (req, res) => {
  const data = await getBooks();
  const result = {};

  for (const isbn in data) {
    if (data[isbn].title.toLowerCase() === req.params.title.toLowerCase()) {
      result[isbn] = data[isbn];
    }
  }

  return res.status(200).json(result);
});

public_users.get('/review/:isbn', async (req, res) => {
  const data = await getBooks();
  const book = data[req.params.isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
