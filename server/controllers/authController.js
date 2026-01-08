// Updated authController.js with field-specific error handling:

const fs = require("fs");
const axios = require('axios');
const FormData = require('form-data'); 
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
    
    // ✅ STEP 1: Verify Aadhaar XML via /verify API
     const formData = new FormData();
    // use a stream so large files are handled efficiently
    formData.append('file', fs.createReadStream(req.file.path), { filename: req.file.originalname });
    formData.append('password', shareCode);

    const headers = formData.getHeaders(); // important: contains boundary

    const resp = await axios.post('https://n73q0bjt-3001.inc1.devtunnels.ms/verify', formData, { headers, timeout: 30000 });
    const verifyResult = resp.data;

    if (!verifyResult.verified) {
      fs.unlinkSync(req.file.path); // cleanup
      console.log("Zip file incorrect :", verifyResult.message);
      return res.status(400).json({
        success: false,
        message: 'Aadhaar verification failed: ' + verifyResult.message,
        details: verifyResult.errors
      });
    } else {
      console.log("Zip file verified successfully:", verifyResult.message, verifyResult.details);
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

// ✅ LOGIN (verify password + Aadhaar hash) with field-specific errors
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
        fieldErrors: {
          username: "Username entered value is wrong, please try again"
        }
      });
    }

    // Step 2: Verify password
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        fieldErrors: {
          password: "Password entered value is wrong, please try again"
        }
      });
    }

    // Step 3: Recreate Aadhaar hash
    const loginHash = createAadhaarHash(name, dob, careOf);

    // Step 4: Compare Aadhaar hash and provide field-specific errors
    if (loginHash !== user.aadhaarIdentifier) {
      // Check which specific field is wrong by comparing individual components
      const storedFields = user.aadhaarIdentifier.split('|');
      const loginFields = loginHash.split('|');
      
      const fieldErrors = {};
      
      // Compare name (first component of hash)
      if (storedFields[0] !== loginFields[0]) {
        fieldErrors.name = "Name entered value is wrong, please try again";
      }
      
      // Compare dob (second component of hash)
      if (storedFields[1] !== loginFields[1]) {
        fieldErrors.dob = "Date of birth entered value is wrong, please try again";
      }
      
      // Compare careOf (third component of hash)
      if (storedFields[2] !== loginFields[2]) {
        fieldErrors.careOf = "Care of entered value is wrong, please try again";
      }

      return res.status(401).json({
        success: false,
        fieldErrors
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

// ✅ FORGOT PASSWORD (XML verification)
const forgotPassword = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your XML file',
      });
    }

    // Read file from memory storage
    let xmlText;
    const fileData = req.file.buffer;
    
    try {
      // Check if it's a ZIP file or direct XML
      if (req.file.mimetype === 'application/zip' || req.file.originalname.endsWith('.zip')) {
        // Handle ZIP file
        const blob = new Blob([fileData]);
        const reader = new zip.ZipReader(new zip.BlobReader(blob), { password: req.body.shareCode });
        const entries = await reader.getEntries();
        
        const xmlEntry = entries.find((e) => e.filename.endsWith('.xml'));
        if (!xmlEntry) {
          await reader.close();
          return res.status(400).json({ success: false, message: 'No XML found inside ZIP' });
        }

        xmlText = await xmlEntry.getData(new zip.TextWriter());
        await reader.close();
      } else {
        // Handle direct XML file
        xmlText = fileData.toString('utf8');
      }

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

      // Create hash from XML data
      const xmlHash = createAadhaarHash(name, dob, careOf);

      // Find user by XML hash
      const user = await User.findOne({ aadhaarIdentifier: xmlHash });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this XML file',
        });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
      await user.save();

      res.json({
        success: true,
        message: 'XML verified successfully. You can now reset your password.',
        user: {
          name: user.displayName,
          username: user.username,
        },
        resetToken,
      });
    } catch (parseError) {
      console.error('XML parsing error:', parseError);
      
      return res.status(400).json({
        success: false,
        message: 'Invalid XML file format. Please ensure it contains valid Aadhaar data.',
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing XML file',
    });
  }
};

// ✅ RESET PASSWORD
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide reset token and new password',
      });
    }

    // Hash token and find user
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Generate new JWT
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Password reset successful',
      token,
      user: {
        id: user._id,
        name: user.displayName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  logout,
  forgotPassword,
  resetPassword,
};
