// require("dotenv").config();
// const express = require("express");
// const cookieParser = require("cookie-parser");
// const cors = require('cors')
// const { env, connectDB } = require("./config");
// const authRoutes = require("./routes/auth.route");
// const productRoutes = require("./routes/product.route");

// const app = express();

// app.use(express.json());
// // app.use(cors());
// app.use(
//     cors({
//         origin: [
//       "http://localhost:3000",
//       "https://vrs-black.vercel.app",
//     ],
//         credentials: true,
//     })
// );

// app.get("/", (req, res) => {
//     res.json({
//         message: "API is running",
//     });
// });

// const startServer = async () => {
//     await connectDB();

// };

// app.use("/auth", authRoutes);
// app.use("/product", productRoutes);

// app.listen(env.port, () => {
//     console.log(`Server running on port ${env.port}`);
// });


// startServer();



require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { env, connectDB } = require("./config");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:3000",
  "https://vrs-black.vercel.app",
];

app.use(
  cors({
    origin(origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());



app.use("/auth", authRoutes);
app.use("/product", productRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : err.message,
  });
});

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });

    const shutdown = (signal) => {
      console.log(`${signal} received, closing server`);
      server.close(() => process.exit(0));
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();