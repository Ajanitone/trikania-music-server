import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: String,
    phone: String,
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    zipCode: String,
    country: String,
    gender: String,
    verified: {
      type: Boolean,
      default: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },
    cart: [
      {
        quantity: Number,
        product: { type: Schema.Types.ObjectId, ref: "Product" },
      },
    ],
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
