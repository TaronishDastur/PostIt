const jwt = require("jsonwebtoken");

// middleware to verify that the token passed is correct based on the user info
module.exports = (req, res, next) => {
  try {
    //   Split and 1 because the auth token contains bearer ...
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "thisIsMySuperSecretCode");
    // add userid to the request here => get it from the token
    req.user = { userId: decodedToken.userId };
    next();
  } catch {
    res.status(401).json({
      message: "authentication failed",
    });
  }
};
