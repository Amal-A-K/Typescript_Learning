import mongoose from "mongoose";

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    image: [{
        type: String
    }],
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cartData: {
        type: Map,
        of: Number,
        default: {}
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    blockedAt: {
        type: Date
    },
    blockReason: {
        type: String
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
},{
    timestamps: true
});
const User = mongoose.model("User", userSchema);
export default User;