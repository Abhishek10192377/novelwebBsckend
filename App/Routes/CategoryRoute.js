let express = require("express");
const upload = require('../Middelware/multer')
const {
  CategoryInsert,
  Categoryread,
  CategoryDelete,
  CategoryUpdate,
  getTotalCategorys,
  getTotalreader
} = require('../Controller/Categorycontroller');

let Categoryroutes = express.Router();

// 👉 Insert a new category
Categoryroutes.post("/insert_category",upload.single('file'),CategoryInsert);

// 👉 Read all categories
Categoryroutes.get("/read_category", Categoryread);

// 👉 Delete a category by ID
Categoryroutes.delete("/delete_category/:id", CategoryDelete);

// 👉 Update a category by ID
Categoryroutes.put("/update_category/:id",upload.single('file'), CategoryUpdate);

/// show total category ////

Categoryroutes.get("/show_Totalcategory",getTotalCategorys)

Categoryroutes.get("/category_reader/:id",getTotalreader)

module.exports = Categoryroutes;
