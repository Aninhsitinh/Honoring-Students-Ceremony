const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authController = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: 'error.auth.missing_credentials' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'error.auth.invalid' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: 'error.auth.invalid' });
      }

      const accessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role, campus: user.campus },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' } // Short lived access token
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' } // Long lived refresh token
      );

      // Set refresh token in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      res.json({
        message: 'auth.login_success',
        token: accessToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          campus: user.campus,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },

  async refresh(req, res) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res.status(401).json({ message: 'No refresh token provided' });
      }

      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const accessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role, campus: user.campus },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      res.json({ token: accessToken });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
  },

  async logout(req, res) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });
    res.json({ message: 'Logged out successfully' });
  },

  async me(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'error.user_not_found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'error.server' });
    }
  },
};

module.exports = authController;
