const isAdminMiddleware = (req, res, next) => {
  // Check if the user has administrative privileges
  if (req.user && req.user.isAdmin) {
    // User is an admin, allow the registration to proceed
    next();
  } else {
    // User is not an admin, send an error response
    res.status(403).json({ error: "Unauthorized" });
  }
};
export default isAdminMiddleware;
