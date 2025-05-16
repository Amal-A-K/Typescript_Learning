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
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    cartData: {
        type: Object
    }
},{
    timestamps: true
});
const User = mongoose.model("User", userSchema);
export default User;