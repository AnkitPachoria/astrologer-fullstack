const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const controller = require("../controllers/awardController");
const router = express.Router();

const uploadDir = path.join(__dirname, "../Uploads/awards-image");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  }
});

router.get("/", controller.getAllAwards);
router.post("/", upload.single("image"), controller.createAward);
router.put("/:id", upload.single("image"), controller.updateAward);
router.delete("/:id", controller.deleteAward);

module.exports = router;
