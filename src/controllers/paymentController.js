import stripe from "stripe";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

async function createCheckoutSession(req, res) {
  try {
    const { products, userName, email } = req.body;

    // Retrieve the user ID from the decoded token in the request object
    const token = req.cookies["trikania-herbs"];
    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decrypted.id;

    if (!Array.isArray(products)) {
      throw new Error(
        "Invalid products data. Please provide an array of products."
      );
    }

    // Retrieve item information from your MongoDB collection
    const lineItems = await Promise.all(
      products.map(async (product) => {
        const item = await Product.findById(product._id);

        if (!item) {
          throw new Error(`Product not found for _id: ${product._id}`);
        }

        return {
          price_data: {
            currency: "eur",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100, // Price in cents
          },
          quantity: product.count,
        };
      })
    );

    // Create a Stripe session
    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      mode: "payment",
      success_url: "http://localhost:3000/checkout/success",
      cancel_url: "http://localhost:3000",
      line_items: lineItems,
    });

    // Save the order details and session ID to your MongoDB collection
    const order = await Order.create({
      userName,
      products,
      stripeSessionId: session.id,
      userId, // Include the userId in the order data
    });

    res.json({ sessionId: session.id, orderId: order._id }); // Send the orderId back to the client
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    res.status(500).json({
      error: "Failed to create checkout session. Please try again later.",
    });
  }
}

export { createCheckoutSession };
