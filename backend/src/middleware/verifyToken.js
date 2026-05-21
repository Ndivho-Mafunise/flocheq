import Jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
  try {
    const decoded = Jwt.verify(token, process.env.SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
