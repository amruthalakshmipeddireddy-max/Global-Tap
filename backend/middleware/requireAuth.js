// Protects routes that need a logged-in user.
// The frontend sends "Authorization: Bearer <token>" where the token is
// the Supabase access token it received at login.

const { publicClient } = require('../supabaseClient');

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Not logged in. Please log in first.' });
  }

  const { data, error } = await publicClient.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  req.user = data.user;
  req.token = token;
  next();
}

module.exports = requireAuth;
