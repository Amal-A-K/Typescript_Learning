import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type: String,
        required: true, 
        minlength : 3, 
        maxlength: 30
    },
    email:{
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 200, 
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    },
},
{
    timestamps: true,
});

const userModel = mongoose.model("User", userSchema);
export default userModel;