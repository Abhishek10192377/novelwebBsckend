const Book = require('../Models/Book');
const cloudinary = require("../config/cloudinary")
// 👉 GET books by category
const getBooksByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id.trim(); // remove extra space/newlines
    const books = await Book.find({ category: categoryId }).populate('category');
    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books by category:", error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching books by category',
      error: error.message,
    });
  }
};

// 👉 INSERT new book
const insertBook = async (req, res) => {
  try {
    const { title, author, details,  category, isPopular } = req.body;
    const result = await cloudinary.uploader.upload(req.file.path,{
      folder:'novelWeb'
    })
    const newBook = new Book({
      title,
      author,
      details,
      image:result.secure_url,
      category,
      isPopular: isPopular ?? true,
    });

    const savedBook = await newBook.save();

    res.status(201).json({
      success: true,
      message: 'Book inserted successfully',
      data: savedBook,
    });
  } catch (error) {
    console.error("Error inserting book:", error.message);
    res.status(500).json({
      success: false,
      message: 'Error inserting book',
      error: error.message,
    });
  }
};

// 👉 GET all books
const getAllBooks = async (req, res) => {
  try {
    const { isPopular } = req.query;
    const filter = isPopular ? { isPopular: true } : {};
    const books = await Book.find(filter).sort({ createdAt: -1 }).populate('category');
    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Error fetching all books:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching books",
      error: error.message,
    });
  }
};

// 👉 DELETE book by ID
const BookDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Book.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        status: 0,
        message: "Book not found",
      });
    }
    res.status(200).json({
      status: 1,
      message: "Book deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error while deleting book",
      error: error.message,
    });
  }
};

// 👉 UPDATE book by ID
const UpdateBook = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, author, details, category, isPopular } = req.body;

    const books = await Book.findById(id);
    if (!books) {
      return res.status(404).json({
        status: 0,
        message: "Book not found",
      });
    }

    let imageUrl = books.image; // use existing image if no new file uploaded

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "novelWeb"
      });
      imageUrl = result.secure_url; // update with new image URL
    }

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, details, category, image:imageUrl, isPopular },
      { new: true }
    );

    res.status(200).json({
      status: 1,
      message: "Book updated successfully",
      data: updatedBook,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error while updating book",
      error: error.message,
    });
  }
};


// 👉 GET all popular books
const getPopularBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPopular: true }).populate('category');
    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.error("Error fetching popular books:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching popular books",
      error: error.message,
    });
  }
};


// 👉 Placeholder for new book insert (if needed later)
const  newBookShow = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }).limit(10); 
    res.status(200).json({ success: true, data: books });
} catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch new books", error });
}
};


/////////// get total numbar of books /////////////
const getTotalBooks = async(req,res)=>{
  try {
    const count = await Book.countDocuments();
    res.json({totalBooks:count});
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' }); 
  }
}

///  bokk show over the time /////

const getBooksOverTime = async (req,res)=>{
  try {
    const data = await Book.aggregate([
      {
      $group:{
        _id:{$month:"$createdAt"},
        books:{$sum:1}
      }
    },
    {
      $sort: { "_id": 1 }
    }
    ])
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const result = data.map(item => ({
      name: monthNames[item._id - 1],  
      books: item.books
    }))
    
    res.json({ bookData: result });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch books over time" });
  }
}

module.exports = {
  getBooksByCategory,
  insertBook,
  getAllBooks,
  BookDelete,
  UpdateBook,
  getPopularBooks, 
  newBookShow,
  getTotalBooks,
  getBooksOverTime,
};

