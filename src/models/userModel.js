import mongoose from 'mongoose';
 
export default mongoose.model('users',{
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    isAdmin: Boolean,
    userPic: String,
    telephone: String,
});