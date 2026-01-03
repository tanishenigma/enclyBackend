const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    let user = await User.findOne({ uid: userId });

    if (!user) {
      // Create user if not exists (lazy creation)
      user = new User({
        uid: userId,
        email: req.user.email,
        name: req.user.name || "User",
      });
      await user.save();
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { profile_picture } = req.body;

    let user = await User.findOne({ uid: userId });
    if (!user) {
      user = new User({
        uid: userId,
        email: req.user.email,
        name: req.user.name || "User",
      });
    }

    if (profile_picture) {
      user.profile_picture = profile_picture;
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
