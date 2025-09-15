const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cityController = require("../controllers/cityController");

// Multer setup for city images
const uploadDir = path.join(__dirname, "..", "Uploads", "city-image");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
});

// Routes with multer middleware only on POST and PUT (where image can be uploaded)
router.post("/", upload.single("image"), cityController.createCity);          // Create City
router.get("/", cityController.getCities);                                   // Get All Cities
router.get("/:id", cityController.getCityById);                              // Get City By ID
router.put("/:id", upload.single("image"), cityController.updateCity);       // Update City
router.delete("/:id", cityController.deleteCity);                            // Delete City

module.exports = router;
