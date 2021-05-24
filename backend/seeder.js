import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './data/users.js';
import products from './data/products.js';
//Model
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';

// Connect DB
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    // deleting
    await User.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    //Importing
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => ({
      ...product,
      user: adminUser,
    }));
    await Product.insertMany(sampleProducts);
    console.log('DATA IMPORTED');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log('DATA DESTROYED');
    process.exit();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
