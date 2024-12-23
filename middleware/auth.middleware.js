const mongoose = require('mongoose');

module.exports = (req, res, next) => {
  // Bypass authentication for all requests
    req.user = {userId : new mongoose.Types.ObjectId('65809056e39c75186a3c7d98')};
    // Set a dummy user ID as ObjectId
  next();
};