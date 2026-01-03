const Click = require("../models/Click");
const Url = require("../models/Url");

exports.getClicks = async (req, res) => {
  try {
    const userId = req.user.uid;

    // Find all URLs for this user
    const userUrls = await Url.find({ user_id: userId }).select("_id");
    const urlIds = userUrls.map((url) => url._id);

    // Find clicks for these URLs
    const clicks = await Click.find({ url_id: { $in: urlIds } });
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getClicksForUrl = async (req, res) => {
  try {
    const { urlId } = req.params;
    const clicks = await Click.find({ url_id: urlId });
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.storeClick = async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const { city, country, device } = req.body;

    // Find the URL
    const url = await Url.findOne({
      $or: [{ short_url: shortUrl }, { custom_url: shortUrl }],
    });

    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    const newClick = new Click({
      url_id: url._id,
      city,
      country,
      device,
    });

    await newClick.save();

    res.json({ original_url: url.original_url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
