"use strict";

var handleRecipe = function handleRecipe(e) {
  e.preventDefault();

  if ($("#recipeNameField").val() == '' || $("#recipeDescField").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }

  //TODO validate step fields

  sendAjax('POST', $("#recipeForm").attr('action'), $("#recipeForm").serialize(), function () {
    location.reload();
  });
  return false;
};

var setSelectedRecipe = function setSelectedRecipe(e) {
  e.preventDefault();
  var div = e.target;

  while (!div.classList.contains('recipe')) {
    div = div.parentElement;
  }
  var recipeDiv = $(div);

  if (recipeDiv.hasClass('selectedRecipe')) {
    recipeDiv.removeClass('selectedRecipe');
    recipeDiv.find('.recipeFullInfo').slideUp();
    return false;
  }

  var selected = $(".selectedRecipe");
  if (selected) {
    selected.removeClass('selectedRecipe');
    selected.find('.recipeFullInfo').slideUp();;
  }

  recipeDiv.addClass('selectedRecipe');
  recipeDiv.find('.recipeFullInfo').slideDown();

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
    "div",
    null,
    React.createElement(
      "h1",
      null,
      "Make A Recipe!",
      React.createElement(
        "span",
        null,
        "Fill in the information below and click submit"
      )
    ),
    React.createElement(
      "form",
      { id: "recipeForm",
        onSubmit: handleRecipe,
        name: "recipeForm",
        action: "/recipeMaker",
        method: "POST",
        className: "recipeForm"
      },
      React.createElement(
        "div",
        { className: "recipeFormSection" },
        React.createElement(
          "span",
          null,
          "\u25CB"
        ),
        "Recipe Information"
      ),
      React.createElement(
        "div",
        { className: "innerWrap" },
        React.createElement(
          "label",
          { htmlFor: "name" },
          "Name:",
          React.createElement("input", { id: "recipeNameField", type: "text", name: "name", maxlength: props.maxName, placeholder: "Recipe Name" })
        ),
        React.createElement(
          "label",
          { htmlFor: "desc" },
          "Description:",
          React.createElement("input", { id: "recipeDescField", type: "text", name: "desc", maxlength: props.maxDesc, placeholder: "Recipe Description" })
        )
      ),
      React.createElement(
        "div",
        { className: "recipeFormSection" },
        React.createElement(
          "span",
          null,
          "\u25CB"
        ),
        "Ingredients"
      ),
      React.createElement(
        "div",
        { className: "innerWrap" },
        React.createElement("input", { className: "ingredientField", type: "text", name: "ingredients", maxlength: props.maxName, placeholder: "ingredient" }),
        React.createElement("input", { type: "button", id: "addIngredientField", "class": "addFieldButton", count: "1", onClick: function onClick(e) {
            return addFieldOnClick(e, props.maxName);
          }, value: "Add Ingredient" })
      ),
      React.createElement(
        "div",
        { className: "recipeFormSection" },
        React.createElement(
          "span",
          null,
          "\u25CB"
        ),
        "Directions"
      ),
      React.createElement(
        "div",
        { className: "innerWrap" },
        React.createElement("input", { className: "stepField", type: "text", name: "steps", maxlength: props.maxDesc, placeholder: "ingredient" }),
        React.createElement("input", { type: "button", id: "addStepField", "class": "addFieldButton", count: "1", onClick: function onClick(e) {
            return addFieldOnClick(e, props.maxDesc);
          }, value: "Add Step" })
      ),
      React.createElement("input", { type: "hidden", id: "csrf", name: "_csrf", value: props.csrf }),
      React.createElement(
        "div",
        { "class": "button-section" },
        React.createElement("input", { className: "makeRecipeSubmit", type: "submit", value: "Make Recipe" })
      )
    )
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

    var stepNodes = recipe.steps.map(function (step, number) {
      return React.createElement(
        "li",
        { className: "direction" },
        step
      );
    });

    return React.createElement(
      "div",
      { key: recipe._id, className: "recipe", onClick: setSelectedRecipe },
      React.createElement(
        "div",
        { className: "recipeQuickLook" },
        React.createElement("img", { className: "recipeImg", src: "/assets/img/recipe.png", alt: "recipe image" }),
        React.createElement(
          "h1",
          { className: "recipeName" },
          recipe.name
        ),
        React.createElement(
          "h3",
          { className: "recipeDesc" },
          recipe.description
        )
      ),
      React.createElement(
        "div",
        { className: "recipeFullInfo" },
        React.createElement(
          "h3",
          { className: "ingredientLabel" },
          "Ingredients"
        ),
        React.createElement(
          "ul",
          { className: "ingredients" },
          ingredientNodes
        ),
        React.createElement(
          "h3",
          { className: "directionsLabel" },
          "Directions"
        ),
        React.createElement(
          "ol",
          { className: "directions" },
          stepNodes
        )
      )
    );
  });

  return React.createElement(
    "div",
    { className: "recipeList" },
    recipeNodes
  );
};

var loadRecipesFromServer = function loadRecipesFromServer() {
  sendAjax('GET', '/getRecipes', null, function (data) {
    ReactDOM.render(React.createElement(RecipeList, { recipes: data.recipes }), document.querySelector("#recipes"));
  });
};

var setup = function setup(csrf) {
  if (csrf) {
    ReactDOM.render(React.createElement(RecipeForm, { csrf: csrf }), document.querySelector("#makeRecipe"));
  }
  ReactDOM.render(React.createElement(RecipeList, { recipes: [] }), document.querySelector("#recipes"));

  loadRecipesFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  if (document.querySelector("#makeRecipe")) {
    getToken();
  } else {
    setup(undefined);
  }
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
