import mongoose from "mongoose";
const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
