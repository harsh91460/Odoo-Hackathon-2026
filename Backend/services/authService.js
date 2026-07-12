const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for a user
 * @param {string} id - User ID
 * @returns {string} - JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'TransitOpsSuperSecretKeyKeyKey123!', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} - Registered user data and token
 */
const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('User already exists');
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

/**
 * Login a user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} - User data and token
 */
const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Please provide email and password');
  }

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  };
};

/**
 * Get profile of a user by ID
 * @param {string} userId - User ID
 * @returns {Object} - User details
 */
const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Get available roles for the platform
 * @returns {Array<string>} - Roles list
 */
const getAvailableRoles = () => {
  return ['Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  generateToken,
  getAvailableRoles,
};
