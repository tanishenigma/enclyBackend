const Url = require("../models/Url");
const Click = require("../models/Click");
const UAParser = require("ua-parser-js");
const axios = require("axios");

exports.createShortUrl = async (req, res) => {
  try {
    const { originalUrl, customUrl, title, qr } = req.body;
    const userId = req.user.uid;

    const shortUrl = customUrl || Math.random().toString(36).substring(2, 8);

    const newUrl = new Url({
      original_url: originalUrl,
      short_url: shortUrl,
      custom_url: customUrl || null,
      user_id: userId,
      title: title,
      qr: qr,
    });

    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserUrls = async (req, res) => {
  try {
    const userId = req.user.uid;
    const urls = await Url.find({ user_id: userId });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.uid;

    const url = await Url.findOneAndDelete({ _id: id, user_id: userId });

    if (!url) {
      return res.status(404).json({ message: "URL not found or unauthorized" });
    }

    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getLongUrl = async (req, res) => {
  // This might be public or private depending on use case.
  // If it's for redirection, it should be public.
  // If it's for editing, it should be private.
  // Assuming this is for the dashboard details view.
  try {
    const { id } = req.params;
    const url = await Url.findById(id);
    if (!url) return res.status(404).json({ message: "URL not found" });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({
      $or: [{ short_url: shortUrl }, { custom_url: shortUrl }],
    });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Track Click
    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    const device = result.device.type || "desktop";

    let city = "Unknown";
    let country = "Unknown";

    try {
      const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
      // Simple check to avoid querying for localhost
      if (
        ip &&
        ip !== "::1" &&
        ip !== "127.0.0.1" &&
        !ip.startsWith("192.168")
      ) {
        // Using the token found in frontend code
        const response = await axios.get(
          `https://ipinfo.io/${ip}/json?token=fb1c37b543d2e1`
        );
        if (response.data) {
          city = response.data.city || "Unknown";
          country = response.data.country || "Unknown";
        }
      }
    } catch (err) {
      console.error("IP Info Error:", err.message);
    }

    await Click.create({
      url_id: url._id,
      city,
      country,
      device,
    });

    return res.redirect(url.original_url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
