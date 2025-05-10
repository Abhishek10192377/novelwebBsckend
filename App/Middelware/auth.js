// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();  

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');  // Extract the token without 'Bearer ' prefix

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');  
  }
  try {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();  
  } catch (err) {
    return res.status(400).send('Invalid token');  // Return 400 if the token is invalid
  }
};
