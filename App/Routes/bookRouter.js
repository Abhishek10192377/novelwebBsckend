const express = require('express');
const Bookrouter = express.Router();
const upload = require('../Middelware/multer')

const { getBooksByCategory,getTotalBooks, insertBook, getAllBooks, BookDelete, UpdateBook, getPopularBooks, newBookShow ,getBooksOverTime} = require('../Controller/bookController');


// 👉 GET all books
Bookrouter.get('/books/allRead', getAllBooks);

// 👉 GET books by category ID
Bookrouter.get('/books/category/:id', getBooksByCategory);

// 👉 INSERT a new book
Bookrouter.post('/books/insert',upload.single('file'), insertBook);
//// SHOW POPULAR BOOK ON HOME PAGE
Bookrouter.get('/books/popular/',getPopularBooks)

Bookrouter.delete('/books/delete/:id', BookDelete);
Bookrouter.put('/books/update/:id',upload.single('file'),UpdateBook);

//////  Show new book on home page//////

Bookrouter.get('/books/shownewBook/', newBookShow )

/////   show total number of books ////////
Bookrouter.get('/books/totalbook', getTotalBooks)

/// show book over the time /////

Bookrouter.get('/books/showtime',getBooksOverTime)



module.exports = Bookrouter;
