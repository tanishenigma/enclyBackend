const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/urls", require("./api/routes/urls"));
app.use("/clicks", require("./api/routes/clicks"));
app.use("/user", require("./api/routes/user"));

// Redirection Route
app.get("/:shortUrl", require("./controllers/urlController").redirectUrl);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
