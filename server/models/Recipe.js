const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

let RecipeModel = {};
const MAX_RECIPE_NAME_LENGTH = 40;
const MAX_RECIPE_DESC_LENGTH = 280;

const RecipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: MAX_RECIPE_NAME_LENGTH,
  },
  description: {
    type: String,
    trim: true,
    maxlength: MAX_RECIPE_DESC_LENGTH,
  },
  ingredients: [
    
  ],
  steps: {
    
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
});

RecipeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return RecipeModel.find(search).select('name description ingredients steps').exec(callback);
};

RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports.RecipeModel = RecipeModel;
module.exports.RecipeSchema = RecipeSchema;
