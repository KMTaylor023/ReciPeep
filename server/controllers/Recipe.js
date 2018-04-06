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
  if (!req.body.name || !req.body.age || !req.body.nature) {
    return res.status(400).json({ error: 'GRR! name and age required' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    nature: natureCheck,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => {
    res.json({ redirect: '/maker' });
  });

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return domoPromise;
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