// Login, sign-up and session routes.
//
// Sign-up uses Supabase Auth, which sends the verification email and
// generates the verification code/link itself, so this backend does not
// create any codes by hand. Turn on "Confirm email" in the Supabase
// dashboard (Authentication -> Providers -> Email) to require verification
// before the first login.

const express = require('express');
const { publicClient, adminClient } = require('../supabaseClient');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// POST /api/auth/signup
// Body: { full_name, email, phone, home_country, password }
router.post('/signup', async (req, res) => {
  const { full_name, email, phone, home_country, password } = req.body || {};

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }
  if (String(password).length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const { data, error } = await publicClient.auth.signUp({
    email: email,
    password: password,
    options: { data: { full_name: full_name } },
  });
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Store the extra information in the profiles table.
  const userId = data.user && data.user.id;
  if (userId) {
    const { error: profileError } = await adminClient.from('profiles').insert({
      id: userId,
      full_name: full_name,
      email: email,
      phone: phone || null,
      home_country: home_country || 'IN',
      home_currency: 'INR',
    });
    if (profileError) {
      return res.status(500).json({ error: 'Account created, but saving the profile failed: ' + profileError.message });
    }
  }

  res.json({
    message: 'Account created. Please check your email to verify it, then log in.',
    needsVerification: true,
  });
});

// POST /api/auth/login
// Body: { email, password } -> { token, user }
// If "Confirm email" is on in Supabase, login is blocked until the user
// clicks the verification link in their email.
router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const { data, error } = await publicClient.auth.signInWithPassword({ email, password });
  if (error) {
    return res.status(401).json({ error: error.message });
  }

  res.json({
    token: data.session.access_token,
    user: { id: data.user.id, email: data.user.email },
  });
});

// GET /api/auth/me (login required) -> the user plus their stored profile.
router.get('/me', requireAuth, async (req, res) => {
  const { data, error } = await adminClient
    .from('profiles')
    .select('full_name, email, phone, home_country, home_currency, created_at')
    .eq('id', req.user.id)
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ user: { id: req.user.id, email: req.user.email }, profile: data });
});

// POST /api/auth/logout (login required).
router.post('/logout', requireAuth, async (req, res) => {
  await publicClient.auth.signOut();
  res.json({ message: 'Logged out.' });
});

module.exports = router;
