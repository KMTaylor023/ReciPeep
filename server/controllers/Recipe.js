const models = require('../models');

const Recipe = models.Recipe;

const recipeMakerPage = (req, res) => {
  Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
  });
};

const makeRecipe = (req, res) => {
  if (!req.body.name || !req.body.desc || !req.body.steps || !req.body.ingredients) {
    return res.status(400).json({ error: 'GRR! name and age required' });
  }
  
  let ingredients = req.body.ingredients;
  
  if(!Array.isArray(ingredients)) ingredients = [ingredients];
  
  let steps = req.body.steps
  
  if(!Array.isArray(steps)) steps = [steps];
  
  const recipeData = {
    name: req.body.name,
    description: req.body.desc,
    ingredients: ingredients,
    steps: steps,
    owner: req.session.account._id,
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

module.exports.recipeMakerPage = recipeMakerPage;
module.exports.makeRecipe = makeRecipe;
module.exports.getRecipes = getRecipes;
//module.exports.updateRecipe = updateRecipe;