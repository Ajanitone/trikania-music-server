import Order from "../models/Order.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    // Extract the order data from the request body
    const { userName, products, stripeSessionId } = req.body;

    // Create a new order
    const order = await Order.create({
      userName,
      products,
      stripeSessionId,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to create order." });
  }
};

// Get all orders
export const list = async (req, res) => {
  try {
    // Retrieve all orders from the database and populate the 'productName' field in 'product' and 'username' field in 'user'
    const orders = await Order.find()
      .populate({
        path: "products._id",
        select: "name profileImage category price",
      })
      .populate({
        path: "userId",
        select: "username firstName lastName street zipCode city",
      });

    res.json({ success: true, orders }); // Wrap the orders within a success property
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to retrieve orders." });
  }
};

// Get a specific order by ID
export const findOne = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the order by ID in the database
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve order." });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { userName, products, stripeSessionId } = req.body;

    // Find and update the order in the database
    const order = await Order.findByIdAndUpdate(
      id,
      { userName, products, stripeSessionId },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Failed to update order." });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Hello deleteOrder-id", id);

    // Find and delete the order from the database
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, error: "Order not found." });
    }

    res.json({ success: true });
    console.log("Hello orderDelete successfull");
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete order." });
  }
};
