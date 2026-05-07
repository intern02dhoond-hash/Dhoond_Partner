const admin = require("../config/firebase");

/**
 * Middleware to verify Firebase ID Token
 * Expects header: Authorization: Bearer <token>
 */
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      success: false, 
      message: "No token provided. Authorization denied." 
    });
  }

  const token = authHeader.split(" ")[1];

  // --- MOCK TOKEN HANDLING ---
  if (token.startsWith("mock-token-")) {
    const phone = token.replace("mock-token-", "");
    req.user = {
      uid: phone, // using phone as uid
      phone_number: `+91${phone}`,
      // email: `${phone}@mock.com`,
      email: `mock@mock.com`,
      name: `User ${phone}`
    };
    return next();
  }
  // ---------------------------

  try {
    // Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach user info to request object
    // decodedToken contains: uid, email, phone_number, etc.
    req.user = decodedToken;
    
    next();
  } catch (error) {
    console.error("Firebase Auth Error:", error.message);
    
    let message = "Invalid token";
    if (error.code === "auth/id-token-expired") {
      message = "Token has expired";
    }

    return res.status(403).json({ 
      success: false, 
      message: message 
    });
  }
};

module.exports = verifyFirebaseToken;
