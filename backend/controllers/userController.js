import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import generateToken from '../utils/generateToken.js';

//@Desc   Auth user & get Token(login)
//@route GET /api/users
// @access public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const { _id, email, name, isAdmin } = user;
    res.json({
      _id,
      name,
      email,
      isAdmin,
      token: generateToken(_id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

//@Desc   Get User Profile
//@route GET /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { _id, email, name, isAdmin } = user;
  if (user) {
    res.json({ _id, name, email, isAdmin });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@Desc   Update User Profile
//@route PUT /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { _id, email, name, isAdmin } = user;

  if (user) {
    user.name = req.body.name || name;
    user.email = req.body.email || email;
    if (req.body.password) {
      user.password = req.body.password;
    }
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@Desc   Register User
//@route POST /api/users
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

//@Desc   Get All user
//@route GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});

  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error('Users not found');
  }
});

//@Desc   Get user By ID
//@route GET /api/users/:id
// @access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@Desc   Update User
//@route PUT /api/users/:id
// @access private/admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  const { email, name, isAdmin } = user;

  if (user) {
    user.name = req.body.name || name;
    user.email = req.body.email || email;
    user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

//@Desc   Delete User
//@route DELETE /api/users
// @access Private/admin
const deleteUsers = asyncHandler(async (req, res) => {
  console.log('id', req.params.id);
  const user = await User.findById(req.params.id);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('Users not found');
  }
});

export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUsers,
  getUserById,
  updateUser,
};
