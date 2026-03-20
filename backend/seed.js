require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Bid = require('./models/Bid');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Promise.all([User.deleteMany(), Product.deleteMany(), Bid.deleteMany()]);

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@bidzone.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create regular users (use create() so pre('save') hash hook runs)
  const alice = await User.create({ name: 'Alice Johnson', email: 'alice@example.com', password: 'password123' });
  const bob   = await User.create({ name: 'Bob Smith',     email: 'bob@example.com',   password: 'password123' });

  // Create products
  const products = await Product.insertMany([
    {
      title: 'Vintage Rolex Watch',
      description: 'A beautiful 1970s Rolex Submariner in excellent condition. Original bracelet included.',
      startingBid: 500,
      currentBid: 750,
      images: ['https://placehold.co/600x400?text=Rolex+Watch'],
      owner: alice._id,
      highestBidder: bob._id,
      status: 'active',
    },
    {
      title: 'MacBook Pro 2023',
      description: 'Apple MacBook Pro M2 chip, 16GB RAM, 512GB SSD. Barely used, like new condition.',
      startingBid: 1000,
      currentBid: 1200,
      images: ['https://placehold.co/600x400?text=MacBook+Pro'],
      owner: bob._id,
      highestBidder: alice._id,
      status: 'active',
    },
    {
      title: 'Antique Wooden Desk',
      description: 'Hand-crafted oak desk from the 1920s. Perfect for a home office or study.',
      startingBid: 200,
      currentBid: 200,
      images: ['https://placehold.co/600x400?text=Antique+Desk'],
      owner: alice._id,
      status: 'active',
    },
  ]);

  // Create some bids
  await Bid.insertMany([
    { product: products[0]._id, bidder: bob._id, amount: 600 },
    { product: products[0]._id, bidder: bob._id, amount: 750 },
    { product: products[1]._id, bidder: alice._id, amount: 1100 },
    { product: products[1]._id, bidder: alice._id, amount: 1200 },
  ]);

  console.log('\n✅ Seed data created successfully!\n');
  console.log('Test Accounts:');
  console.log('  Admin  → admin@bidzone.com  / admin123');
  console.log('  User 1 → alice@example.com  / password123');
  console.log('  User 2 → bob@example.com    / password123\n');

  await mongoose.disconnect();
};

seed().catch(err => { console.error(err); process.exit(1); });
