const fs = require("fs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Blob } = require('buffer');
const { DOMParser } = require('xmldom');
const zip = require('@zip.js/zip.js');
const { parseStringPromise } = require("xml2js");
const User = require("../models/User"); // not destructured
require("dotenv").config();

// Helper: generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Helper: create Aadhaar hash
const createAadhaarHash = (name, dob, careOf) => {
  const input = `${name.trim().toLowerCase()}|${dob.trim()}|${careOf.trim().toLowerCase()}`;
  return crypto.createHash("sha256").update(input).digest("hex");
};

// ✅ REGISTER (first time using Aadhaar XML)
const register = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const username = req.body.username;
    const displayName = req.body.displayName;
    const password = req.body.password;
    const shareCode = req.body.shareCode;

    if (!username || !displayName || !password || !shareCode) {
      return res.status(400).json({
        success: false,
        message:
          "Username, display name, password, Aadhaar XML, and share code are required",
      });
    }

    // Check if username exists
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    if (!shareCode) {
      return res.status(400).json({ success: false, message: 'Missing share code' });
    }

    /*

    // -----------------------------------------------------
    // 🔥 SEND FILE + SHARECODE TO YOUR EXISTING /verify API
    // -----------------------------------------------------
    const formData = new FormData();
    formData.append("file", fs.createReadStream(req.file.path));
    formData.append("shareCode", shareCode);

    const verifyRes = await fetch("http://localhost:3001/verify", {
      method: "POST",
      body: formData,
    });

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar verification failed: " + verifyData.message,
      });
    }

    // -----------------------------------------------------
    // ✔ XML is valid, NOT tampered — you receive details here
    // -----------------------------------------------------
    const aadhaarData = verifyData.data; // whatever your /verify returns
    console.log("Aadhaar Data from /verify:", aadhaarData);

    */

    // Read uploaded file
    const fileData = fs.readFileSync(req.file.path);
    const blob = new Blob([fileData]);

    // Open ZIP using zip.js
    const reader = new zip.ZipReader(new zip.BlobReader(blob), { password: shareCode });
    const entries = await reader.getEntries();

    const xmlEntry = entries.find((e) => e.filename.endsWith('.xml'));
    if (!xmlEntry) {
      await reader.close();
      return res.status(400).json({ success: false, message: 'No XML found inside ZIP' });
    }

    const xmlText = await xmlEntry.getData(new zip.TextWriter());
    await reader.close();

    // Parse XML
    const xmlDoc = new DOMParser().parseFromString(xmlText, 'application/xml');

    // Extract Poi and Poa info
    const poi = xmlDoc.getElementsByTagName('Poi')[0];
    const poa = xmlDoc.getElementsByTagName('Poa')[0];

    const name = poi?.getAttribute('name');
    const dob = poi?.getAttribute('dob');
    let careOf = poa?.getAttribute('careof');

    // If careOf has format "S/O: Someone", split by ":" and take right part
    if (careOf.includes(':')) careOf = careOf.split(':')[1].trim();

    if (!name || !dob || !careOf) {
      return res.status(400).json({
        success: false,
        message: "Invalid Aadhaar XML: missing name or DOB",
      });
    }

    // Generate Aadhaar hash
    const aadhaarHash = createAadhaarHash(name, dob, careOf);

    const aadhaarExisting = await User.findOne({ aadhaarIdentifier: aadhaarHash });
    if (aadhaarExisting) {
      return res.status(400).json({
        success: false,
        message: "Aadhaar already exists",
      });
    }

    // Save user
    const user = await User.create({
      username,
      displayName: displayName,
      name, // display name (shown publicly)
      password, // hashed by pre-save middleware
      dob,
      careOf,
      aadhaarIdentifier: aadhaarHash,
      aadhaarVerified: true,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful with Aadhaar verification",
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

// ✅ LOGIN (verify password + Aadhaar hash)
const login = async (req, res, next) => {
  try {
    const { username, password, name, dob, careOf } = req.body;

    if (!username || !password || !name || !dob || !careOf) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (username, password, name, dob, careOf) are required",
      });
    }

    // Step 1: Find user
    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please register first.",
      });
    }

    // Step 2: Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Step 3: Recreate Aadhaar hash
    const loginHash = createAadhaarHash(name, dob, careOf);

    // Step 4: Compare Aadhaar hash
    if (loginHash !== user.aadhaarIdentifier) {
      return res.status(401).json({
        success: false,
        message:
          "Aadhaar verification failed. Please enter exact details as in Aadhaar.",
      });
    }

    // Step 5: Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful with Aadhaar and password verification",
      data: {
        user: user.getPublicProfile(),
        token,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// ✅ Get current user info
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Logout (client-side token removal)
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
};
