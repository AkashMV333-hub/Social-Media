require('dotenv').config();
const connectDB = require('../config/db');
const Notification = require('../models/Notification');

const run = async () => {
  try {
    await connectDB();

    // Find notifications whose message contains the word 'tweet' (case-insensitive)
    const cursor = Notification.find({ message: /tweet/i }).cursor();
    let count = 0;

    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      const old = doc.message;
      const updated = old.replace(/\btweet\b/ig, 'post');
      if (old !== updated) {
        doc.message = updated;
        await doc.save();
        count++;
      }
    }

    console.log(`Updated ${count} notification(s).`);
    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
};

run();
