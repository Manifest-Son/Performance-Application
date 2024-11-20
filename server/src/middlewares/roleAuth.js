// middleware/roleAuth.js
export const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: "Unauthorized access",
      });
    }
    next();
  };
};
