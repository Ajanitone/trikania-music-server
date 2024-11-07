import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, default: 0 },
    profileImage: String,
    description: String,
    category: String,
    genre:String,
    artistName:String,
  },
  { timestamps: true }
);
export default mongoose.model("Product", productSchema);
