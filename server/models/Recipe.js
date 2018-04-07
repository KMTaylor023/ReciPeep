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
  ingredients: {
    type: [String],
    required: true,
    validate: {
      validator: (items) => {
        for (let i = 0; i < items.length; i++) {
          if (items[i].length > MAX_RECIPE_NAME_LENGTH) return false;
        }
        return true;
      },
      message: `Ingredient names can only be ${MAX_RECIPE_NAME_LENGTH} characters long`,
    },
  },
  steps: {
    type: [String],
    required: true,
    validate: {
      validator: (steps) => {
        for (let i = 0; i < steps.length; i++) {
          if (steps[i].length > MAX_RECIPE_DESC_LENGTH) return false;
        }
        return true;
      },
      message: `Steps can only be ${MAX_RECIPE_DESC_LENGTH} characters long`,
    },
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const convertId = mongoose.Types.ObjectId;

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
