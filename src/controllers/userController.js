import User from "../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import email from "../utilities/email.js";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  try {
    console.log("hello register ", req.body);

    const salt = await bcryptjs.genSalt(SALT_ROUNDS);

    const hashedPass = await bcryptjs.hash(req.body.password, salt);
    console.log("register ~ hashedPass", hashedPass);

    req.body.password = hashedPass;

    const isAdmin = req.isAdmin || false;

    const user = await User.create(req.body);
    console.log("register ~ user", user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    email(token, "welcome");

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ register ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};
export const login = async (req, res) => {
  try {
    console.log("🚀 ~ hello login ", req.body);

    // const errors = validationResult(req);
    // console.log("🚀 ~ errors", errors);

    // if (!errors.isEmpty()) {
    //   // !errors.isEmpty() => there are errors
    //   return res.send({ success: false, errors: errors.array() });
    // }
    const user = await User.findOne({
      $or: [
        { username: req.body.emailOrUsername },
        { email: req.body.emailOrUsername },
      ],
    }).select("-password-__v");

    console.log("logging in ~ user", user);

    if (!user) return res.send({ success: false, errorId: 404 });

    const passMatch = await bcryptjs.compare(req.body.password, user.password);
    console.log("login ~ passMatch", passMatch);

    if (!passMatch) return res.send({ success: false, errorId: 401 });

    const newUser = user.toObject();

    delete newUser.password;

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log("token",token);
    console.log("secret",process.env.JWT_SECRET);

    res.cookie("trikania-music", token, { sameSite: "none", secure: true });
console.log("cookie",token);
    res.send({ success: true, user: newUser, token:token });
  } catch (error) {
    console.log("login ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const emailConfirm = async (req, res) => {
  try {
    const token = req.body.token;

    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    console.log("emailConfirm ~ decrypted", decrypted);

    const user = await User.findByIdAndUpdate(
      { _id: decrypted.id },
      { verified: true },
      { new: true }
    );
    console.log("emailConfirm ~ user", user);

    res.send({ success: true });
  } catch (error) {
    console.log("emailConfirm ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const forgotPass = async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [
        { username: req.body.emailOrUsername },
        { email: req.body.emailOrUsername },
      ],
    });
    console.log("forgotPass ~ user", user);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    email(token, "forgotpass");

    res.send({ success: true });
  } catch (error) {
    console.log("forgotPass ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const changePass = async (req, res) => {
  try {
    console.log("hello changePass ", req.body);

    const decrypted = jwt.verify(req.body.token, process.env.JWT_SECRET);
    console.log("changePass ~ decrypted", decrypted);

    const salt = await bcryptjs.genSalt(SALT_ROUNDS);

    const hashedPass = await bcryptjs.hash(req.body.password, salt);
    console.log("changePass ~ hashedPass", hashedPass);

    await User.findByIdAndUpdate(
      decrypted.id,
      { password: hashedPass },
      { new: true }
    );

    res.send({ success: true });
  } catch (error) {
    console.log("changePass ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("hello logout ");

    res.clearCookie("trikaniamusic");
    res.json({ success: true }).status(200);

    // res.send({ success: true });
  } catch (error) {
    console.log("logout ~ error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    console.log("hello updateProfile ", req.body);
    console.log("hello updateProfile FILE: ", req.file);
   
    if (req.file) req.body.profileImage = req.file.path;
    const userId = req.params.userId;
    console.log("hello updateProfile User: ", userId);

    const user = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    }).select("-password -__v");

    console.log("updateProfile ~ user:", user);

    if (!user) return res.send({ success: false, errorId: 404 }); // user not found

    res.send({ success: true, user });
  } catch (error) {
    console.log("updateProfile ~ error:", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("hiu from get profile ");
    const user = await User.findById(id);

    console.log("getProfile ~ user:", user);

    if (!user) return res.send({ success: false, errorId: 404 }); // user not found
    res.send({ success: true, user });
  } catch (error) {
    console.log("err", error.message);
    res.send({ success: false, error: error.message });
  }
};

export const updateCover = async (req, res) => {
  try {
    console.log("hello updateCover ", req.body);
    console.log("hello updateCover FILE: ", req.file);

    if (req.file) req.body.coverImage = req.file.path;

    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
    }).select("-password -__v");

    console.log("updateCover ~ user:", user);

    if (!user) return res.send({ success: false, errorId: 404 }); // user not found

    res.json({ success: true, coverImage: user.coverImage }).status(200);
  } catch (error) {
    console.log("updateCover ~ error:", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    console.log("Hello from delete", req.params);

    const deletedUser = await User.findByIdAndDelete(req.params._id);

    console.log("Module.exports deleteUser", deletedUser);

    if (!deletedUser) return res.send({ success: false, errorId: 1 });

    res.send({ success: true });
  } catch (error) {
    console.log("Error delete user", error.message);
    res.send({ success: false, error: error.message });
  }
};

export const updateUsername = async (req, res) => {
  try {
    console.log("hello updateUsername ", req.body);

    const user = await User.findByIdAndUpdate(req.user, req.body, {
      new: true,
    }).select("-password -__v");
    // .populate({
    //   path: "user",
    //   select: "username",
    // });

    console.log("updateUsername ~ user:", user);

    if (!user) return res.send({ success: false, errorId: 404 }); // user not found

    res.send({ success: true, user });
  } catch (error) {
    console.log("updateUsername ~ error:", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    console.log("Hello from add to wishlist", req.body);

    const user = await User.findByIdAndUpdate(
      { _id: req.body.user }, // filter
      {
        // updating
        $push: {
          wishlist: req.body.product,
        },
      },
      { new: true } // options
    );
    console.log("🚀 ~ module.exports.addToWishlist= ~ user", user);

    res.send({ success: true });
  } catch (error) {
    console.log("🚀 ~ add to wishlist error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    console.log("Hello from remove from wishlist", req.body);

    const user = await User.findById(req.body.user); // step 1 find the user

    const wishlist = user.wishlist.filter((item) => {
      // step 2 filter the wishlist array
      return item.toString() !== req.body.product;
    });

    console.log("🚀 ~ module.exports.removeFromWishlist= ~ wishlist", wishlist);

    // step 3 update the user in the db

    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.body.user },
      { wishlist },
      { new: true }
    );
    console.log(
      "🚀 ~ module.exports.removeFromWishlist= ~ updatedUser",
      updatedUser
    );

    res.send({ success: true, wishlist });
  } catch (error) {
    console.log("🚀 ~ remove from wishlist error", error.message);

    res.send({ success: false, error: error.message });
  }
};

export const listWishlist = async (req, res) => {
  try {
    console.log("Hello from list wishlist", req.params);

    const user = await User.findById(req.params.user).populate({
      path: "wishlist",
      select: "-__v",
    });

    console.log("🚀 ~ module.exports.listWishlist= ~ user", user);

    res.send({ success: true, products: user.wishlist });
  } catch (error) {
    console.log("🚀 ~ list wishlist error", error.message);

    res.send({ success: false, error: error.message });
  }
};
export const searchUser = async (req, res) => {
  try {
    const name = req.params;
    console.log("hello from exports search", name);
    const user = await User.findOne(name).select("-password -__v");

    if (!user) {
      return res.send({ success: false, message: "User not found" });
    }

    res.send({ success: true, user });
  } catch (error) {
    res.send({ success: false, error: error.message });
    console.log("Error in user search", error.message);
  }
};
export const listUser = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    console.log("Hello from user list", req.user);

    console.log("users from list", users);
    res.send({ success: true, users });
  } catch (error) {
    res.send({ success: false, error: error.message });
    console.log("Error in user list", error.message);
  }
};
