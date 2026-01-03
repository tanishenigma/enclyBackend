const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  original_url: {
    type: String,
    required: true,
  },
  short_url: {
    type: String,
    required: true,
    unique: true,
  },
  custom_url: {
    type: String,
    unique: true,
    sparse: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  qr: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", UrlSchema);
