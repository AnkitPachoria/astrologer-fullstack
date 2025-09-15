const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/adminController");
const verifyToken = require('../middleware/verifyToken');

router.post("/login", loginAdmin);

// protected route
router.get("/dashboard", verifyToken, (req, res) => {
  res.status(200).json({ message: "Welcome to the admin dashboard!" });
});

module.exports = router;
  