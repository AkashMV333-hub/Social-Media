const express = require('express');
const multer = require('multer');
const { verifyAadhaarFile } = require('../controllers/aadhaarController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // store uploaded file temporarily

router.post('/verify', upload.single('file'), verifyAadhaarFile);

module.exports = router;

