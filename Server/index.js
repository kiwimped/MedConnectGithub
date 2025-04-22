const express = require("express");
const multer = require("multer");
const dotenv = require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const OpenAI = require("openai");

const app = express();
const router = express.Router();

// Environment Variables
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 8000;

// Log environment values (optional, remove in production)
//console.log(MONGO_URL, JWT_SECRET, EMAIL_USER, OPENAI_API_KEY);

// OpenAI Setup
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// AI Chat Route
router.post("/chat", async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages should be a non-empty array" });
  }

  const validMessages = messages
    .filter((m) => m && typeof m.text === "string" && m.text.trim() !== "")
    .map((m) => ({
      role: m.role === "model" ? "assistant" : m.role,
      content: m.text,
    }));

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...validMessages,
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "AI response failed", details: error.message });
  }
});

// Custom Routes
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/Appointments"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/", require("./routes/posts"));
app.use("/", require("./routes/notify"));
app.use("/", require("./routes/bookAppointmentRoute"));
app.use("/", require("./routes/search"));
app.use("/", require("./routes/doctor"));
app.use("/api", router); // AI Chat route

// MongoDB Connection
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log("Database connection error:", err));

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
