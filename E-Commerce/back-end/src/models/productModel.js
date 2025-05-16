import mongoose from "mongoose";
import User from "./userModel.js";
const Schema = mongoose.Schema;
const productSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true,
        enum: {
            values: ['electronics', 'clothing', 'home', 'books'],
            message: 'Invalid category'
        }
    },
    stock : {
        type : Number,
        required : true,
        default : 0
    },
    image : [{
        type :String,
        required : true
    }],
    createdBy : {
        type : Schema.Types.ObjectId,
        ref: User,
        required : true
    }
},
{
    timestamps : true
});

productSchema.index({ name: 'text', description: 'text', category: 'text' });
const Product = mongoose.model("Product",productSchema);

export default Product;