require("dotenv").config();
const express = require("express");
const authRoutes = require("./modules/auth/auth.routes");
const partnerRoutes = require("./modules/partner/partner.routes");
const orderRoutes = require("./modules/order/order.routes");
const broadcastRoutes = require("./modules/broadcast/broadcast.routes");
const otpRoutes = require("./modules/otp/otp.routes");
const errorMiddleware = require("./middleware/errorMiddleware");
const ApiError = require("./utils/apiError");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/partner", partnerRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/broadcast", broadcastRoutes);
app.use("/api/v1/otp", otpRoutes);

app.get("/api/v1/ping", (_, res) => {
  res.json({ message: "Ping accepted!" });
});

app.get("/", (req, res) => {
  res.json({ message: "Dhoond Backend is running" });
});

// 404 Not Found Handler
app.use((req, res, next) => {
  next(new ApiError(404, "Route not found"));
});

// Global Error Middleware (Must be last)
app.use(errorMiddleware);

module.exports = app;
