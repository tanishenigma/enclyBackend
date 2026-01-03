const mongoose = require("mongoose");

const ClickSchema = new mongoose.Schema({
  url_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Url",
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  city: String,
  country: String,
  device: String,
});

module.exports = mongoose.model("Click", ClickSchema);
