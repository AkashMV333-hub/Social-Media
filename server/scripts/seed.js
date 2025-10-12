require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Tweet = require('../models/Tweet');
const Follow = require('../models/Follow');
const connectDB = require('../config/db');

/**
 * Seed script to populate database with test data
 * Run with: npm run seed
 */

const users = [
  {
    name: 'Sudeep',
    email: 'sudeep@example.com',
    username: 'sudeep',
    password: 'password123',
    bio: 'Software developer and tech enthusiast',
    location: 'San Francisco, CA',
  },
  {
    name: 'Shreyas R A',
    email: 'shreyas@example.com',
    username: 'shreyas',
    password: 'password123',
    bio: 'Designer and creative thinker',
    location: 'New York, NY',
  },
  {
    name: 'Satish R',
    email: 'satish@example.com',
    username: 'satish',
    password: 'password123',
    bio: 'Entrepreneur and startup founder',
    location: 'Austin, TX',
  },
  {
    name: 'Rakshith M',
    email: 'rakshith@example.com',
    username: 'rakshith',
    password: 'password123',
    bio: 'Product manager and agile coach',
    location: 'Seattle, WA',
  },
  {
    name: 'Ullas D',
    email: 'ullas@example.com',
    username: 'ullas',
    password: 'password123',
    bio: 'Data scientist and AI researcher',
    location: 'Boston, MA',
  },
];

const tweets = [
  'Just launched my new portfolio website! Check it out and let me know what you think.',
  'Working on an exciting new feature today. Can\'t wait to share it with everyone!',
  'Coffee first, code later. That\'s my morning routine.',
  'Attending an amazing tech conference today. Learning so much!',
  'Just hit 10k followers! Thank you all for the support.',
  'Debugging is like being a detective in a crime movie where you are also the murderer.',
  'The best error message I\'ve seen today: "Something went wrong. We don\'t know what."',
  'Remember: Code never lies, comments sometimes do.',
  'Finally fixed that bug that\'s been haunting me for days!',
  'Weekend project time! Building something cool with React.',
  'Tips for junior developers: Write code that your future self will thank you for.',
  'Just pushed a major update to production. Fingers crossed!',
  'Learning a new programming language is like learning to think in a different way.',
  'Good code is its own best documentation.',
  'The only way to learn a new programming language is by writing programs in it.',
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Tweet.deleteMany({});
    await Follow.deleteMany({});

    console.log('Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} users`);

    console.log('Creating tweets...');
    const tweetPromises = [];
    createdUsers.forEach((user, index) => {
      // Each user creates 3 tweets
      for (let i = 0; i < 3; i++) {
        const tweetIndex = (index * 3 + i) % tweets.length;
        tweetPromises.push(
          Tweet.create({
            author: user._id,
            text: tweets[tweetIndex],
          })
        );
      }
    });

    const createdTweets = await Promise.all(tweetPromises);
    console.log(`Created ${createdTweets.length} tweets`);

    // Update user tweet counts
    for (const user of createdUsers) {
      await User.findByIdAndUpdate(user._id, {
        tweetsCount: 3,
      });
    }

    console.log('Creating follow relationships...');
    const followPromises = [];
    // User 0 follows users 1, 2, 3
    followPromises.push(
      Follow.create({ follower: createdUsers[0]._id, following: createdUsers[1]._id }),
      Follow.create({ follower: createdUsers[0]._id, following: createdUsers[2]._id }),
      Follow.create({ follower: createdUsers[0]._id, following: createdUsers[3]._id })
    );

    // User 1 follows users 0, 2
    followPromises.push(
      Follow.create({ follower: createdUsers[1]._id, following: createdUsers[0]._id }),
      Follow.create({ follower: createdUsers[1]._id, following: createdUsers[2]._id })
    );

    // User 2 follows users 0, 1, 3, 4
    followPromises.push(
      Follow.create({ follower: createdUsers[2]._id, following: createdUsers[0]._id }),
      Follow.create({ follower: createdUsers[2]._id, following: createdUsers[1]._id }),
      Follow.create({ follower: createdUsers[2]._id, following: createdUsers[3]._id }),
      Follow.create({ follower: createdUsers[2]._id, following: createdUsers[4]._id })
    );

    await Promise.all(followPromises);
    console.log(`Created ${followPromises.length} follow relationships`);

    // Update follower/following counts
    for (const user of createdUsers) {
      const followingCount = await Follow.countDocuments({ follower: user._id });
      const followersCount = await Follow.countDocuments({ following: user._id });
      await User.findByIdAndUpdate(user._id, {
        followingCount,
        followersCount,
      });
    }

    console.log('\nSeed completed successfully!');
    console.log('\nTest credentials:');
    console.log('Email: john@example.com | Password: password123');
    console.log('Email: jane@example.com | Password: password123');
    console.log('Email: bob@example.com | Password: password123');
    console.log('Email: alice@example.com | Password: password123');
    console.log('Email: charlie@example.com | Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
