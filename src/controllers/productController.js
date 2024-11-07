import Product from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    console.log("Hello from product add", req.body);
    if (req.file) req.body.profileImage = req.file.path;

    const newProduct = await Product.create(req.body);

    console.log("newProduct", newProduct);
    if (!newProduct) return res.send({ success: false, errorTd: 2 });

    res.send({ success: true, product: newProduct });
  } catch (error) {
    console.log("product.add-error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const listProduct = async (req, res) => {
  try {
    const skip = req.query.skip === undefined ? 0 : Number(req.query.skip);

    console.log("Hello from product list");

    const products = await Product.find().skip(skip).limit(1000).sort("-_id");
    console.log("product-list", products);

    const total = await Product.countDocuments();

    console.log("module list total", total);
    res.send({ success: true, products, total });
  } catch (error) {
    console.log("product.list-error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    console.log("Hello from product delete", req.params);

    const deletedProduct = await Product.findByIdAndDelete(req.params._id);

    console.log("Module.exports deleteProduct", deletedProduct);

    if (!deletedProduct) return res.send({ success: false, errorId: 1 });

    res.send({ success: true });
  } catch (error) {
    console.log("Error delete user", error.message);
    res.send({ success: false, error: error.message });
  }
};

export const findone = async (req, res) => {
  try {
    console.log("🚀 ~ product findone hello", req.query);

    const product = await Product.findOne(req.query).select("-__v");
    console.log("🚀 ~ module.exports.findone= ~ product", product);

    res.send({ success: true, product });
  } catch (error) {
    console.log("🚀 ~ product findone error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const editProduct = async (req, res) => {
  try {
    console.log("🚀 ~ product edit hello", req.body);

    const { _id, ...product } = req.body;
    console.log("🚀 ~ _id, product", _id, product);

    product.image = req.file.filename;
    console.log("🚀 ~ req.file", req.file);

    // // findByIdAndUpdate({filter}, {updated resource}, {options})
    const newProduct = await Product.findByIdAndUpdate(
      { _id },
      { ...product },
      { new: true }
    );
    console.log("🚀 ~ module.exports.edit= ~ newProduct", newProduct);

    if (!newProduct) return res.send({ success: false, errorId: 1 });

    res.send({ success: true, product: newProduct });
  } catch (error) {
    console.log("🚀 ~ product edit error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const searchProduct = async (req, res) => {
  try {
    console.log("---------------------------------- ");
    console.log("🚀 ~ product search hello", req.body);

    const filter = {};

    if (req.body.name) {
      const regExp = new RegExp(req.body.name, "i");
      // console.log("🚀 ~ module.exports.search= ~ regExp", regExp)

      filter.name = regExp;
    }

    if (req.body.minPrice > 0 || req.body.maxPrice > 0) {
      filter.price = {
        $gte: req.body.minPrice,
        $lte: req.body.maxPrice,
      };
    }
    console.log("----------------------------");
    console.log("🚀 ~ module.exports.search= ~ filter", filter);

    const products = await Product.find(filter);

    // const products = await Product.find({
    //     name: regExp,
    //     price: {
    //         $gte: req.body.minPrice,
    //         $lte: req.body.maxPrice
    //     }

    // })
    console.log("🚀 ~ module.exports.search= ~ products", products);

    res.send({ success: true, products });
  } catch (error) {
    console.log("🚀 ~ product search error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const searchProduct1 = async (req, res) => {
  try {
    console.log("---------------------------------- ");
    console.log("🚀 ~ product search hello", req.params);

    const filter = {};

    if (req.params.name) {
      const regExp = new RegExp(req.params.name, "i");
      filter.name = regExp;
    }

    if (req.query.minPrice > 0 || req.query.maxPrice > 0) {
      filter.price = {
        $gte: req.query.minPrice,
        $lte: req.query.maxPrice,
      };
    }
    console.log("----------------------------");
    console.log("🚀 ~ module.exports.search= ~ filter", filter);

    const products = await Product.find(filter);

    console.log("🚀 ~ module.exports.search= ~ products", products);

    res.send({ success: true, products });
  } catch (error) {
    console.log("🚀 ~ product search error", error.message);

    res.send({ success: false, error: error.message });
  }
};

