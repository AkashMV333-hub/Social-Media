const fs = require('fs');
const { Blob } = require('buffer');
const { DOMParser } = require('xmldom');
const zip = require('@zip.js/zip.js');

exports.verifyAadhaarFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const shareCode = req.body.shareCode?.trim();
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

    const name = poi?.getAttribute('name') || 'Unknown';
    const dob = poi?.getAttribute('dob') || 'Unknown';
    let careOf = poa?.getAttribute('careof') || 'Unknown';

    // If careOf has format "S/O: Someone", split by ":" and take right part
    if (careOf.includes(':')) careOf = careOf.split(':')[1].trim();

    // Return JSON
    res.json({
      success: true,
      verified: false, // signature verification not implemented yet
      data: { name, dob, co: careOf },
    });

  } catch (error) {
    console.error('Error processing Aadhaar file:', error);
    res.status(500).json({ success: false, message: error.message, fullError: error.stack });
  } finally {
    if (req.file) fs.unlinkSync(req.file.path); // cleanup uploaded file
  }
};
