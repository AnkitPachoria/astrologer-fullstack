
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const morgan = require("morgan");
// const db = require("./db");
// const bestSolutionRoutes = require('./routes/bestSolutionRoutes');
// const contactRoutes = require('./routes/contactRoutes');

// const app = express(); 
// // ✅ Ensure upload directories exist 
// const uploadDirs = {
//   cities: path.join(__dirname, "Uploads", "city-image"),
//   categories: path.join(__dirname, "Uploads", "category-image"),
//   services: path.join(__dirname, "Uploads", "service-image"),
//   homeImage: path.join(__dirname, "Uploads", "home-image"),
//   about: path.join(__dirname, 'Uploads', 'about-image'),
//   banner: path.join(__dirname, 'Uploads', 'bannerimage'),
//    testimonials: path.join(__dirname, 'Uploads', 'testimonial-image'),
//   blogs: path.join(__dirname, "Uploads", "blogimage"),
//     bestSolution: path.join(__dirname, "Uploads", "best-solution-image"),
  
// };

// Object.values(uploadDirs).forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });
    
// // ✅ Configure multer for file Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (req.path.includes("cities")) {
//       cb(null, uploadDirs.cities);
//     } else if (req.path.includes("categories")) {
//       cb(null, uploadDirs.categories);
//     } else if (req.path.includes("services")) {
//       cb(null, uploadDirs.services);
//     } else {
//       cb(new Error("Invalid upload path"), null);
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith("image/")) {
//       return cb(new Error("Only image files are allowed"), false);
//     }
//     cb(null, true);
//   },
// });

// // ✅ Enable CORS (for frontend requests)
// app.use(cors({ origin: "http://localhost:3000" }));

// // ✅ Clean request logging
// app.use(morgan("dev")); // or 'tiny'

// // ✅ Body parser
// app.use(express.json()); 
 
// // ✅ Serve static images
// app.use("/Uploads/city-image", express.static(uploadDirs.cities));
// app.use("/Uploads/category-image", express.static(uploadDirs.categories));
// app.use("/Uploads/service-image", express.static(uploadDirs.services));
// app.use(
//   "/Uploads/awards-image",
//   express.static(path.join(__dirname, "Uploads", "awards-image"))
// );
// app.use("/Uploads/home-image", express.static(uploadDirs.homeImage));
// app.use("/Uploads/about-image", express.static(uploadDirs.about));
// app.use("/Uploads/bannerimage", express.static(uploadDirs.banner));
// app.use("/Uploads/testimonial-image", express.static(uploadDirs.testimonials)); 
// app.use("/Uploads/blogimage", express.static(path.join(__dirname, "Uploads", "blogimage")));
// app.use("/Uploads/best-solution-image", express.static(uploadDirs.bestSolution));

// // ✅ Routes
// app.use("/api/cities", require("./routes/cityRoutes"));
// app.use("/api/categories", require("./routes/categoryRoutes"));
// app.use("/api/services", require("./routes/serviceRoutes"));
// app.use("/api/awards", require("./routes/awardRoutes"));
// app.use("/api/home-setting", require("./routes/homeSettingRoutes"));
// app.use('/api/about', require('./routes/about')); // Added about route
// app.use('/api/banner', require('./routes/bannerRoutes'));
// app.use("/api/testimonials", require("./routes/testimonialRoutes"));
// app.use("/api/blogs", require("./routes/blogRoutes"));
// app.use('/api/best_solution', require("./routes/bestSolutionRoutes"));
// app.use('/api/contacts', require("./routes/contactRoutes"));
// app.use('/api/appointments', require('./routes/appointmentForms'));
// // ✅ Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(`[${new Date().toISOString()}] Error:`, err);
//   if (
//     err.message === "Only image files are allowed" ||
//     err instanceof multer.MulterError
//   ) {
//     return res.status(400).json({ error: err.message });
//   }
//   res.status(500).json({ error: "Internal server error" });
// });

// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });




 







































require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const db = require("./db");
const app = express();

// Ensure upload directories exist
const uploadDirs = {
  cities: path.join(__dirname, "Uploads", "city-image"),
  categories: path.join(__dirname, "Uploads", "category-image"),
  services: path.join(__dirname, "Uploads", "service-image"),
  homeImage: path.join(__dirname, "Uploads", "home-image"),
  about: path.join(__dirname, "Uploads", "about-image"),
  banner: path.join(__dirname, "Uploads", "bannerimage"),
  testimonials: path.join(__dirname, "Uploads", "testimonial-image"),
  blogs: path.join(__dirname, "Uploads", "blogimage"),
  bestSolution: path.join(__dirname, "Uploads", "best-solution-image"),
  
};

Object.values(uploadDirs).forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer for file Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.path.includes("cities")) {
      cb(null, uploadDirs.cities);
    } else if (req.path.includes("categories")) {
      cb(null, uploadDirs.categories);
    } else if (req.path.includes("services")) {
      cb(null, uploadDirs.services);
    } else {
      cb(new Error("Invalid upload path"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
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

// Define allowed origins (hardcoded for reliability, including your frontend IPs/domains)
const allowedOrigins = [
  "http://localhost:3000",
  "http://82.25.77.213",
  "http://loveastrosolutions.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow same-origin or if in allowed list, and reflect the origin
      callback(null, origin || allowedOrigins[0]);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Request logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Parse cookies
app.use(cookieParser());
  
// Parse JSON body 
app.use(express.json());

app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));

// Serve static images
// Object.keys(uploadDirs).forEach((key) => {
//   app.use(`/Uploads/${key}`, express.static(uploadDirs[key]));
// });
 
// Routes
app.use("/api/cities", require("./routes/cityRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/awards", require("./routes/awardRoutes"));
app.use("/api/home-setting", require("./routes/homeSettingRoutes"));
app.use("/api/about", require("./routes/about"));
app.use("/api/banner", require("./routes/bannerRoutes"));
app.use("/api/testimonials", require("./routes/testimonialRoutes"));
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use("/api/best_solution", require("./routes/bestSolutionRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/appointments", require("./routes/appointmentForms"));
app.use('/api/seo',require("./routes/seoRoutes") );
// Admin routes with login etc
app.use("/api/admin", require("./routes/admin"));
 app.use("/api/menu", require("./routes/menu-route"));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err);
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: err.message });
  }
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS error: Access denied" });
  }
  res.status(500).json({ error: "Internal server error" });
}); 

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

























// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const morgan = require('morgan');
// const db = require('./db');

// const app = express();

// // Ensure upload directories exist
// const uploadDirs = {
//   cities: path.join(__dirname, 'Uploads', 'city-image'),
//   categories: path.join(__dirname, 'Uploads', 'category-image'),
//   services: path.join(__dirname, 'Uploads', 'service-image'),
//   awards: path.join(__dirname, 'Uploads', 'awards-image'),
//   home: path.join(__dirname, 'Uploads', 'home-image'),
// };

// Object.values(uploadDirs).forEach((dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// });

// // Configure multer for file Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     if (req.path.includes('cities')) {
//       cb(null, uploadDirs.cities);
//     } else if (req.path.includes('categories')) {
//       cb(null, uploadDirs.categories);
//     } else if (req.path.includes('services')) {
//       cb(null, uploadDirs.services);
//     } else if (req.path.includes('awards')) {
//       cb(null, uploadDirs.awards);
//     } else if (req.path.includes('home-setting')) {
//       cb(null, uploadDirs.home);
//     } else {
//       cb(new Error('Invalid upload path'), null);
//     }
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     if (!file.mimetype.startsWith('image/')) {
//       return cb(new Error('Only image files are allowed'), false);
//     }
//     cb(null, true);
//   },
// });

// // Enable CORS
// app.use(cors({ origin: 'http://localhost:3000' }));

// // Clean request logging
// app.use(morgan('dev'));

// // Body parser
// app.use(express.json());

// // Serve static images
// Object.entries(uploadDirs).forEach(([key, dir]) => {
//   app.use(`/Uploads/${key}-image`, express.static(dir));
// });

// // Routes
// app.use('/api/cities', require('./routes/cityRoutes'));
// app.use('/api/categories', require('./routes/categoryRoutes'));
// app.use('/api/services', require('./routes/serviceRoutes'));
// app.use('/api/awards', require('./routes/achievementRoutes'));
// app.use('/api/home-setting', require('./routes/homeSettingRoutes'));

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(`[${new Date().toISOString()}] Error:`, err);
//   if (err.message === 'Only image files are allowed' || err instanceof multer.MulterError) {
//     return res.status(400).json({ error: err.message });
//   }
//   res.status(500).json({ error: 'Internal server error' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });




























// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');
// const adminRoutes = require('./routes/admin');
// const cityRoutes = require('./routes/cityRoutes');

// const app = express();

// // Ensure Uploads/city-image directory exists
// const uploadDir = path.join(__dirname, 'Uploads', 'city-image');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure multer for file Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// const upload = multer({ storage });

// // Enable CORS
// app.use(cors({ origin: 'http://localhost:3000' }));

// // Body parser
// app.use(express.json());

// // Serve uploaded images statically
// app.use('
// ', express.static(uploadDir));

// // Routes
// app.use('/api/admin', adminRoutes);
// app.use('/api/cities', upload.single('image'), cityRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
