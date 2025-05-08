import mongoose from "mongoose";
const Schema = mongoose.Schema;
const chatSchema = new Schema({
    members:Array,
},{timestamps: true});

const chatModel = mongoose.model("Chat",chatSchema);
export default chatModel;