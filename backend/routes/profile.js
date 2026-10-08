// Reading and updating the logged-in user's stored information.

const express = require('express');
const { adminClient } = require('../supabaseClient');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// GET /api/profile (login required)
router.get('/', requireAuth, async (req, res) => {
  const { data, error } = await adminClient
    .from('profiles')
    .select('full_name, email, phone, home_country, home_currency, created_at')
    .eq('id', req.user.id)
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

// PUT /api/profile (login required)
// Body: { full_name, phone, home_country } - only sent fields are updated.
router.put('/', requireAuth, async (req, res) => {
  const { full_name, phone, home_country } = req.body || {};
  const updates = {};
  if (full_name) updates.full_name = full_name;
  if (phone !== undefined) updates.phone = phone || null;
  if (home_country) updates.home_country = home_country;

  const { data, error } = await adminClient
    .from('profiles')
    .update(updates)
    .eq('id', req.user.id)
    .select()
    .single();
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json(data);
});

module.exports = router;
