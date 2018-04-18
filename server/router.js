const controllers = require('./controllers');
const mid = require('./middleware');

// route incoming calls
const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);
  app.get('/getPublicRecipes', mid.requiresLogin, controllers.Recipe.getPublicRecipes);
  app.get('/upgrade', mid.requiresLogin, controllers.Account.upgrade);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/recipeMaker', mid.requiresLogin, controllers.Recipe.recipeMakerPage);
  app.post('/recipeMaker', mid.requiresLogin, controllers.Recipe.makeRecipe);
  app.get('/public', mid.requiresLogin, controllers.Recipe.publicRecipesPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*',mid.requiresSecure, controllers.Account.notFound);
};

module.exports = router;
