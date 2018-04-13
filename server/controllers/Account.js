const models = require('../models');

const Account = models.Account;

// render login page
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

// logout of the app
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// attempt to login to the app
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'GRRR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/recipeMaker' });
  });
};


// upgrade the user to member status
const upgrade = (request, response) => {
  const req = request;
  const res = response;

  if (req.session.account.premium) {
    return res.status(400).json({ error: 'Already Premium user!' });
  }

  return Account.AccountModel.upgradeUser(req.session.account.username, (err, val) => {
    if (err || !val) {
      return res.status(400).json({ error: 'An error occured' });
    }

    req.session.account.premium = true;

    return res.json({ redirect: '/recipeMaker' });
  });
};

// signup the user, create an account
const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'GRRR! All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'GRRR! passwords gott match yo!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/recipeMaker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

// returns csrf token and the users member status if available
const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  if (req.session.account) csrfJSON.isMember = req.session.account.premium;

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.getToken = getToken;
module.exports.upgrade = upgrade;
