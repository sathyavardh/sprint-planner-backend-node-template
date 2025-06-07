const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserDesignation = require('../models/UserDesignation');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const signup = async (req, res) => {
  const { username, userEmail, userDesignation, userCompany, userPassword, userPhno } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ 
    $or: [{ userEmail }, { username }] 
  });
  
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists with this email or username' });
  }

  // Validate designation
  const designation = await UserDesignation.findById(userDesignation);
  if (!designation) {
    return res.status(400).json({ message: 'Invalid designation' });
  }

  // Create user
  const user = await User.create({
    username,
    userEmail,
    userDesignation,
    userCompany,
    userPassword,
    userPhno
  });

  const token = generateToken(user._id);
  
  res.status(201).json({
    message: 'User created successfully',
    token,
    user: {
      id: user._id,
      username: user.username,
      userEmail: user.userEmail,
      userDesignation: designation.designationName
    }
  });
};

const login = async (req, res) => {
  const { userEmail, userPassword } = req.body;
  console.log('Login attempt:', { userEmail, userPassword });

  const user = await User.findOne({ userEmail })
    .select('+userPassword')
    .populate('userDesignation', 'designationName');

  console.log('Found user:', user ? user.username : 'No user found');
  
  if (user) {
    console.log('Stored hash:', user.userPassword);
    console.log('Input password:', userPassword);
    
    const isMatch = await user.comparePassword(userPassword);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } else {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      username: user.username,
      userEmail: user.userEmail,
      userDesignation: user.userDesignation.designationName
    }
  });
};

const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('userDesignation', 'designationName description');
  
  res.json({ user });
};

module.exports = { signup, login, getProfile };