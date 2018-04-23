const models = require('../models');

const Recipe = models.Recipe;

// load the recipe maker page, with the users recipes visible
const recipeMakerPage = (req, res) => {
  Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
  });
};

// load the page of public recipes
const publicRecipesPage = (req, res) => {
  Recipe.RecipeModel.findByPublic((err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('public', { recipes: docs });
  });
};

// create a recipe for the user
const makeRecipe = (req, res) => {
  if (!req.body.name || !req.body.desc || !req.body.steps || !req.body.ingredients) {
    return res.status(400).json({ error: 'GRR! name and age required' });
  }

  let ingredients = req.body.ingredients;

  if (!Array.isArray(ingredients)) ingredients = [ingredients];

  let steps = req.body.steps;

  if (!Array.isArray(steps)) steps = [steps];

  const recipeData = {
    name: req.body.name,
    description: req.body.desc,
    ingredients,
    steps,
    owner: req.session.account._id,
  };

  if (req.session.account.premium && !req.body.public) {
    recipeData.public = false;
  }

  const newRecipe = new Recipe.RecipeModel(recipeData);

  const recipePromise = newRecipe.save();

  recipePromise.then(() => {
    res.json({ redirect: '/recipeMaker' });
  });

  recipePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return recipePromise;
};

// get recipes from the user
const getRecipes = (request, response) => {
  const req = request;
  const res = response;

  return Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.sataus(400).json({ error: 'An error occured' });
    }
    return res.json({ recipes: docs });
  });
};

// get all public recipes
const getPublicRecipes = (request, response) => {
  const req = request;
  const res = response;

  // i needed to use req...
  if (!req.session.account) return res.sataus(400).json({ error: 'Not logged in' });

  return Recipe.RecipeModel.findByPublic((err, docs) => {
    if (err) {
      console.log(err);
      return res.sataus(400).json({ error: 'An error occured' });
    }
    return res.json({ recipes: docs });
  });
};

module.exports.recipeMakerPage = recipeMakerPage;
module.exports.makeRecipe = makeRecipe;
module.exports.getRecipes = getRecipes;
module.exports.getPublicRecipes = getPublicRecipes;
module.exports.publicRecipesPage = publicRecipesPage;
// module.exports.updateRecipe = updateRecipe;
