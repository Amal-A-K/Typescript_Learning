import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    otp: String,
    otpExpiresAt: Date,
});
const User = mongoose.model('User', userSchema);
export default User;
// module.exports = mongoose.model('User', userSchema);
