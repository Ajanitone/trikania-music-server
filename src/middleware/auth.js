import jwt from "jsonwebtoken";




export default function auth(req, res, next) {
  try {
    console.log(" hello auth ");
   /*  console.log(req.headers); */

    const token = req.cookies["trikania-music"];
   
    console.log("🦩 ~ token:", token);

    if (!token) {
      return res.status(401).send({ success: false, error: "Authentication failed" });
    }

    const decrypted = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decrypted", decrypted);
    console.log("secret", process.env.JWT_SECRET);

      // Fetch the user from the database using the decoded user ID
      

 

    req.user = decrypted;
    console.log("User ID in auth middleware:", req.user);

    next();
  } catch (error) {
    console.log("auth ~ error", error.message);

    res.status(401).send({ success: false, error: "Invalid token" });
  }
}
