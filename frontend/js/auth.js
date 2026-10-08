// Shared login/signup helpers for the Global Travel frontend.
//
// API_BASE: where the backend runs. If you deploy the backend somewhere
// else, change this one line to its address.
var GT_API_BASE = 'http://localhost:5000';

// The saved login session (a Supabase access token).
function gtToken() {
  return localStorage.getItem('gt_token');
}

// Small wrapper around fetch that talks to the backend and
// automatically attaches the login token when there is one.
async function gtApi(path, options) {
  options = options || {};
  var headers = { 'Content-Type': 'application/json' };
  var token = gtToken();
  if (token) {
    headers['Authorization'] = 'Bearer ' + token;
  }
  var res = await fetch(GT_API_BASE + path, {
    method: options.method || 'GET',
    headers: headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  var data = await res.json().catch(function () { return {}; });
  if (!res.ok) {
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}

// Sends the visitor to the login page when there is no saved session.
// Used on index.html so the app opens only for logged-in users.
function requireLogin() {
  if (!gtToken()) {
    window.location.href = 'login.html';
  }
}

// Clears the session and returns to the login page.
function signOut() {
  localStorage.removeItem('gt_token');
  window.location.href = 'login.html';
}

// Shows a message box inside a form. Pass the element id and the text.
function showFormError(id, message) {
  var el = document.getElementById(id);
  el.textContent = message;
  el.style.display = 'block';
}
