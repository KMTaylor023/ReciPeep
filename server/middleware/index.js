// require a user be logged in
const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

// require a user be logged out
const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/recipeMaker');
  }
  return next();
};

// requires https connection
const requireSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

// bypass security
const bypassSecure = (req, res, next) => {
  next();
};

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requireSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
