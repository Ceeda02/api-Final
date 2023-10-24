const { Router } = require("express");
const { validateToken } = require("../middlewares/authMiddleware.js");

const {
  homeAuth,
  loginAuth,
  signupAuth,
  forgotPasswordAuth,
  resetPasswordAuth,
} = require("../controllers/authControllers.js");

const authRouter = Router();

authRouter.get("/", validateToken, homeAuth);
authRouter.post("/login", loginAuth);
authRouter.post("/signup", signupAuth);
authRouter.get("/forgotPassword", forgotPasswordAuth);
authRouter.put("/resetPassword/:id", resetPasswordAuth);

module.exports = authRouter;
