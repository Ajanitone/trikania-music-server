import Newsletter from "../models/Newsletter.js";

// Create a new order
export const createNewsletter = async (req, res) => {
  try {
    // Extract the newsletter data from the request body
    const { email } = req.body;

    console.log("Hello newsletter", req.body);

    // Create a new order

    // Create a new order
    const newsletter = await Newsletter.create({
      email,
    });
    console.log("newsletter", newsletter);
    if (!newsletter) return res.send({ success: false, errorTd: 2 });

    res.status(201).json({ success: true, newsletter });
  } catch (error) {
    console.log("newsletter error", error);
    res
      .status(500)
      .json({ success: false, error: "Failed to create newsletter.", error });
  }
};

// Get all orders
export const list = async (req, res) => {
  try {
    // Retrieve all orders from the database and populate the 'productName' field in 'product' and 'username' field in 'user'
    const newsletters = await Newsletter.find();

    res.json({ success: true, newsletters }); // Wrap the orders within a success property
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
export const updateNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    const { email } = req.body;
    console.log("update newsletter-id,email", id, email);

    // Find and update the order in the database
    const newsletter = await Newsletter.findByIdAndUpdate(
      id,
      { email },
      { new: true }
    );

    if (!newsletter) {
      return res
        .status(404)
        .json({ success: false, error: "Order not found." });
    }

    res.json({ success: true, newsletter });
    console.log("new-newsletter", newsletter);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to update newsletter." });
  }
};

// Delete an order
export const deleteNewsletter = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Hello deleteNewsletter-id", id);

    // Find and delete the order from the database
    const newsletter = await Newsletter.findByIdAndDelete(id);

    if (!newsletter) {
      return res
        .status(404)
        .json({ success: false, error: "Newsletter not found." });
    }

    res.json({ success: true });
    console.log("Hello newsletterDelete successfull");
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to delete newsletter." });
  }
};
