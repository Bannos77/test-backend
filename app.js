import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import User from './models/User.js';
import testRoute from './routes/test.js';
import indexRoute from './routes/index.js';
import messagesRoute from './routes/messages.js';
import userRoute from './routes/user.js';
import mongoStore from 'connect-mongo';

dotenv.config();

const app = express();

app.use(express.json());

// Configure session middleware
app.use(
  session({
    store: mongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  }),
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://back-end-rrmj.onrender.com/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails[0]?.value;
    if (!email) {
      return done(new Error('No email found in profile'), null);
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: email,
      });
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialize and deserialize user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to database'));

// Routes
app.use('/', indexRoute);
app.use('/test', testRoute);
app.use('/messages', messagesRoute);
app.use('/users', userRoute);

// Google Authentication Routes
app.get('/auth/google', (req, res, next) => {
  const redirectUri = req.query.redirectUri;

  const authOptions = {
    scope: ['profile', 'email'],
    state: JSON.stringify({ redirectUri }), // Encode redirectUri in state
  };

  passport.authenticate('google', authOptions)(req, res, next);
});

app.get('/auth/google/callback', (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/' }, (err, user) => {
    if (err) {
      console.error("Authentication error:", err);
      return res.status(500).json({ error: "Authentication failed" });
    }

    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    let redirectUri = null;
    try {
      const state = JSON.parse(req.query.state || '{}');
      redirectUri = state.redirectUri;
    } catch (error) {
      console.error("Error parsing state:", error);
    }

    const fallbackUri = 'exp://localhost:19000';
    const isValidUrl = (url) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    if (!isValidUrl(redirectUri)) {
      redirectUri = fallbackUri;
    }

    const userInfo = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const redirectUrl = `${redirectUri}?user=${encodeURIComponent(JSON.stringify(userInfo))}`;
    res.redirect(redirectUrl);
  })(req, res, next);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
