require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const { env, connectDB } = require("./config");
const authRoutes = require("./routes/auth.route");
const productRoutes = require("./routes/product.route");

const app = express();

app.use(express.json());
// app.use(cors());
app.use(
    cors({
        origin: [
    //   "http://localhost:3000",
      "https://vrs-black.vercel.app",
    ],
        credentials: true,
    })
);

app.get("/", (req, res) => {
    res.json({
        message: "API is running",
    });
});

const startServer = async () => {
    await connectDB();

};

app.use("/auth", authRoutes);
app.use("/product", productRoutes);

app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
});


startServer();
