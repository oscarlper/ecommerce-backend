const mongoose = require('mongoose');
 
module.exports = mongoose.model('Products',{
    productname: String,
    password: String,
    email: String,
    firstName: String,
    lastName: String
});
