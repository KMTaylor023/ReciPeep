"use strict";

var handleRecipe = function handleRecipe(e) {
  e.preventDefault();

  //$("#errorMessage").animate({width:'hide'}, 350);

  if ($("#recipeNameField").val() == '' || $("#recipeDescField").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  //TODO validate step fields

  sendAjax('POST', $("#recipeForm").attr('action'), $("#recipeForm").serialize(), function () {
    loadRecipesFromServer(true);
  });
  return false;
};

var setSelectedRecipe = function setSelectedRecipe(e) {
  e.preventDefault();
  var div = e.target;

  while (div.nodeName !== 'DIV') {
    div = div.parentElement;
  }
  var recipeDiv = $(div);

  if (recipeDiv.hasClass('selectedRecipe')) {
    recipeDiv.removeClass('selectedRecipe');
    recipeDiv.addClass('unselectedRecipe');
    return false;
  }

  var recipe = $(".selectedRecipe");
  recipe.removeClass('selectedRecipe');
  recipe.addClass('unselectedRecipe');

  recipeDiv.removeClass('unselectedRecipe');
  recipeDiv.addClass('selectedRecipe');

  return false;
};

var addFieldOnClick = function addFieldOnClick(e, max) {
  var count = +e.target.getAttribute('count');
  if (e.target.id === "addStepField") {
    var newInput = $('<input class="ingredientField" type="text" name="ingredients" maxlength="' + max + '" placeholder="ingredient"></input>');
    $(e.target).before(newInput);
  } else {
    var _newInput = $('<input class="stepField" type="text" name="steps" maxlength="' + max + '" placeholder="ingredient"/>');
    $(e.target).before(_newInput);
  }
};

var RecipeForm = function RecipeForm(props) {
  return React.createElement(
    "form",
    { id: "recipeForm",
      onSubmit: handleRecipe,
      name: "recipeForm",
      action: "/recipeMaker",
      method: "POST",
      className: "recipeForm"
    },
    React.createElement(
      "label",
      { htmlFor: "name" },
      "Name: "
    ),
    React.createElement("input", { id: "recipeNameField", type: "text", name: "name", maxlength: props.maxName, placeholder: "Recipe Name" }),
    React.createElement(
      "label",
      { htmlFor: "desc" },
      "Description: "
    ),
    React.createElement("input", { id: "recipeDescField", type: "text", name: "desc", maxlength: props.maxDesc, placeholder: "Recipe Description" }),
    React.createElement(
      "fieldset",
      { id: "ingredientsFieldset" },
      React.createElement(
        "legend",
        null,
        "Ingredients"
      ),
      React.createElement("input", { className: "ingredientField", type: "text", name: "ingredients", maxlength: props.maxName, placeholder: "ingredient" }),
      React.createElement("input", { type: "button", id: "addIngredientField", "class": "addFieldButton", count: "1", onClick: function onClick(e) {
          return addFieldOnClick(e, props.maxName);
        }, value: "Add Ingredient" })
    ),
    React.createElement(
      "fieldset",
      { id: "stepFieldset" },
      React.createElement(
        "legend",
        null,
        "Steps"
      ),
      React.createElement("input", { className: "stepField", type: "text", name: "steps", maxlength: props.maxDesc, placeholder: "ingredient" }),
      React.createElement("input", { type: "button", id: "addStepField", "class": "addFieldButton", count: "1", onClick: function onClick(e) {
          return addFieldOnClick(e, props.maxDesc);
        }, value: "Add Step" })
    ),
    React.createElement("input", { type: "hidden", id: "csrf", name: "_csrf", value: props.csrf }),
    React.createElement("input", { className: "makeRecipeSubmit", type: "submit", value: "Make Recipe" })
  );
};

var RecipeList = function RecipeList(props) {
  if (props.recipes.length === 0) {
    return React.createElement(
      "div",
      { className: "recipeList" },
      React.createElement(
        "h3",
        { className: "emptyRecipe" },
        "No Recipes Yet"
      )
    );
  }

  var recipeNodes = props.recipes.map(function (recipe) {
    var ingredientNodes = recipe.ingredients.map(function (ingredient) {
      return React.createElement(
        "li",
        { className: "ingredient" },
        ingredient
      );
    });

    var stepNodes = recipe.steps.map(function (step) {
      return React.createElement(
        "li",
        { className: "steps" },
        step
      );
    });

    return React.createElement(
      "div",
      { key: recipe._id, className: "recipe", onClick: setSelectedRecipe },
      React.createElement(
        "h3",
        { className: "recipeName" },
        recipe.name
      ),
      React.createElement(
        "h3",
        { className: "recipeDesc" },
        recipe.description
      ),
      React.createElement(
        "ul",
        { id: "ingredients" },
        ingredientNodes
      ),
      React.createElement(
        "ol",
        { id: "steps" },
        stepNodes
      )
    );
  });

  return React.createElement(
    "div",
    { className: "recipeList" },
    recipeNodes
  );
};

var loadRecipesFromServer = function loadRecipesFromServer(reload) {
  sendAjax('GET', '/getRecipes', null, function (data) {
    ReactDOM.render(React.createElement(RecipeList, { recipes: data.recipes }), document.querySelector("#recipes"));

    if (reload) {
      ReactDOM.render(React.createElement("p", null), document.querySelector("#makeRecipe"));
      ReactDOM.render(React.createElement(RecipeForm, { csrf: csrf }), document.querySelector("#makeRecipe"));
    }
  });
};

var setup = function setup(csrf) {
  ReactDOM.render(React.createElement(RecipeForm, { csrf: csrf }), document.querySelector("#makeRecipe"));
  ReactDOM.render(React.createElement(RecipeList, { recipes: [] }), document.querySelector("#recipes"));

  loadRecipesFromServer(false);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

var handleError = function handleError(message) {
  // $("#errorMessage").text(message);
  alert(message);
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
