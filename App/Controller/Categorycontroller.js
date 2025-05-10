const CategoryModel = require("../Models/CategoryModel");
const cloudinary = require("../config/cloudinary")
// 👉 INSERT category
const CategoryInsert = async (req, res) => {
  try {
    const { title, category_description,} = req.body;
   
    const result = await cloudinary.uploader.upload(req.file.path,{
      folder:'novelWeb'
    })
    const newCategory = new CategoryModel({
      title,
      image:result.secure_url,
      category_description,
    });

    await newCategory.save();

    res.status(201).json({
      status: 1,
      message: "Category inserted successfully",
      data: newCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error while inserting category",
      error: error.message,
    });
  }
};


// 👉 READ all categories
const Categoryread = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.status(200).json({
      status: 1,
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error while fetching categories",
      error: error.message,
    });
  }
};


// 👉 DELETE category by ID
const CategoryDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await CategoryModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: 0,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Category deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error while deleting category",
      error: error.message,
    });
  }
};


// 👉 UPDATE category by ID
const CategoryUpdate = async (req, res) => {
  try {
    const id = req.params.id;
    const { title,  category_description } = req.body;
    
    const category = await CategoryModel.findById(id);
    if(!category){
      return res.status(404).json({
        status:0,
        message:"category not found "
      })
    }
     let imageUrl = category.image

     if(req.file){
      const result =await cloudinary.uploader.upload(req.file.path,{
        folder:"novelWeb",
      })
      imageUrl = result.secure_url;
     }
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { title, image:imageUrl, category_description },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        status: 0,
        message: "Category not found",
      });
    }

    res.status(200).json({
      status: 1,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error while updating category",
      error: error.message,
    });
  }
};

//////////// show total book category/////

const getTotalCategorys = async(req,res)=>{
  try {
    const count = await CategoryModel.countDocuments()
    res.json({totalCategorys:count})
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' }); 
  }
}

const getTotalreader = async(req,res)=>{
  try {
    const {id} = req.params
    const categorys = await CategoryModel.findById(id)

    if(!categorys){
      return res.status(404).json({
        message:"category not found"
      })
    }
    categorys.views += 1;
    await categorys.save()
    res.status(200).json({
      data:categorys
    })

  } catch (error) {
    res.status(400).json({
      message:error.message
    })
  }
}

module.exports = {
  CategoryInsert,
  Categoryread,
  CategoryDelete,
  CategoryUpdate,
  getTotalCategorys,
  getTotalreader
};
