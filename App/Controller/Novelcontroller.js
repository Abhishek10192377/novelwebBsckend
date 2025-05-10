const Novel = require('../Models/NovelModel');

// Insert a new novel
const novelInsert = async (req, res) => {
    try {
        const {  message, Book } = req.body;
        const newNovel = new Novel({  message, Book });
        const savedNovel = await newNovel.save();

        res.status(201).json({
            success: true,
            message: 'Novel inserted successfully',
            data: savedNovel,
        });
    } catch (error) {
        console.error("Error inserting novel:", error.message);
        res.status(500).json({ success: false, message: 'Error inserting novel', error });
    }
};

// Read all novels related to a specific Book ID
const novelRead = async (req, res) => {
    try {
        const bookId = req.params.id?.trim();
        const novels = await Novel.find({ Book: bookId }).populate('Book');

        res.status(200).json({
            success: true,
            data: novels,
        });
    } catch (error) {
        console.error("Error fetching novels by book:", error.message);
        res.status(500).json({ success: false, message: 'Error fetching novels by book', error });
    }
};

// Read all novels
const readAllNovels = async (req, res) => {
    try {
        const novels = await Novel.find().populate('Book');

        res.status(200).json({
            success: true,
            data: novels,
        });
    } catch (error) {
        console.error("Error fetching all novels:", error.message);
        res.status(500).json({ success: false, message: 'Error fetching all novels', error });
    }
};

const  novelUpdate = async(req,res)=>{
   try {
    const id = req.params.id
    const {message} = req.body
    const updateNovel = await Novel.findByIdAndUpdate(
        id,
     {message},
     { new: true }
    )
    res.status(200).json({
        status: 1,
        message: "Category updated successfully",
        data: updateNovel})
   } catch (error) {
    res.status(500).json({
        status: 0,
        message: "Server error while updating category",
        error: error.message,
      });
   }
}

////////////////// novelDelete ///////////////////////////

const novelDelete = async (req,res)=>{
    try {
        const id = req.params.id;
        const deleted = await Novel.findByIdAndDelete(id);
        res.status(200).json({
            status: 1,
            message: "book deleted successfully",
            data: deleted
          });
    } catch (error) {
        res.status(500).json({
            status: 0,
            message: "Server error while deleting category",
            error: error.message,
          });
    }
  
}

module.exports = { novelInsert, novelRead, readAllNovels , novelUpdate,novelDelete};

