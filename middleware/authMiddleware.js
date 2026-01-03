const admin = require("firebase-admin");
const dotenv = require("dotenv");

dotenv.config();

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    try {
      const serviceAccount = require("../serviceAccountKey.json");
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } catch (error) {
      // Fallback to default (requires GOOGLE_APPLICATION_CREDENTIALS env var pointing to file)
      console.warn(
        "Warning: serviceAccountKey.json not found and FIREBASE_SERVICE_ACCOUNT not set. Attempting default credentials."
      );
      admin.initializeApp();
    }
  }
}

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    console.log("No token provided. Headers:", req.headers);
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;
