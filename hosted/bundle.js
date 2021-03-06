"use strict";

//handles sending a recipe request
var handleRecipe = function handleRecipe(e) {
  e.preventDefault();

  if ($("#recipeNameField").val() == '' || $("#recipeDescField").val() == '') {
    handleError("All fields are required");
    return false;
  }

  //TODO validate step fields

  sendAjax('POST', $("#recipeForm").attr('action'), $("#recipeForm").serialize(), function () {
    location.reload();
  });
  return false;
};

//selects a recipe to view in full
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

var moveUpInput = function moveUpInput(input) {
  var children = Array.from(input.parentElement.childNodes);

  var index = children.indexOf(input);

  if (index === 0) return;

  input.parentElement.insertBefore(input, children[index - 1]);
};

var moveDownInput = function moveDownInput(input) {
  var children = Array.from(input.parentElement.childNodes);

  var index = children.indexOf(input);

  if (index === children.length - 2) return;

  input.parentElement.insertBefore(input, children[index + 2]);
};

var removeInput = function removeInput(input) {
  var children = input.parentElement.childNodes;

  if (children.length <= 2) return;

  $(input).remove();
};

//adds field to the recipe maker form
var addFieldOnClick = function addFieldOnClick(e, max) {
  var text = '<div class="recipeInput">';
  text += '<div class="moveButtons">';
  text += '<input type="button" class="moveUpInput" onclick="moveUpInput(this.parentElement.parentElement)" value="↑"/>';
  text += '<input type="button" class="moveDownInput" onclick="moveDownInput(this.parentElement.parentElement)" value="↓"/>';
  text += "</div>";

  if (e.target.id === "addStepField") {
    text += '<input class="stepField" type="text" name="steps" maxlength="' + max + '" placeholder="step"/>';
  } else {
    text += '<input class="ingredientField" type="text" name="ingredients" maxlength="' + max + '" placeholder="ingredient"/>';
  }

  text += '<input type="button" class="removeInput" onclick="removeInput(this.parentElement)" value="❌"/>';
  var newInput = $(text);
  $(e.target).before(newInput);
};

//creates a recipe maker form
var RecipeForm = function RecipeForm(props) {
  function doUp(e) {
    moveUpInput(e.target.parentElement.parentElement);
  };

  function doDown(e) {
    moveDownInput(e.target.parentElement.parentElement);
  };

  function doRemove(e) {
    removeInput(e.target.parentElement);
  };

  function toggleForm() {
    if ($("#recipeForm").css('display') === 'none') $("#recipeForm").slideDown();else $("#recipeForm").slideUp();
  }

  return React.createElement(
    "div",
    null,
    React.createElement(
      "h1",
      { onClick: toggleForm },
      "Click To Make A Recipe!",
      React.createElement(
        "span",
        null,
        "Fill in the information below and click 'Make Recipe'"
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
          "1"
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
        ),
        React.createElement(
          "label",
          { htmlFor: "public" },
          "Public (members only):",
          React.createElement("input", { id: "publicCheckBox", type: "checkbox", name: "public", value: "public" })
        )
      ),
      React.createElement(
        "div",
        { className: "recipeFormSection" },
        React.createElement(
          "span",
          null,
          "2"
        ),
        "Ingredients"
      ),
      React.createElement(
        "div",
        { className: "innerWrap" },
        React.createElement(
          "div",
          { className: "recipeInput" },
          React.createElement(
            "div",
            { className: "moveButtons" },
            React.createElement("input", { type: "button", className: "moveUpInput", onClick: doUp, value: "\u2191" }),
            React.createElement("input", { type: "button", className: "moveDownInput", onClick: doDown, value: "\u2193" })
          ),
          React.createElement("input", { className: "ingredientField", type: "text", name: "ingredients", maxlength: props.maxName, placeholder: "ingredient" }),
          React.createElement("input", { type: "button", className: "removeInput", onClick: doRemove, value: "\u274C" })
        ),
        React.createElement("input", { type: "button", id: "addIngredientField", "class": "addFieldButton", onClick: function onClick(e) {
            return addFieldOnClick(e, props.maxName);
          }, value: "Add Ingredient" })
      ),
      React.createElement(
        "div",
        { className: "recipeFormSection" },
        React.createElement(
          "span",
          null,
          "3"
        ),
        "Directions"
      ),
      React.createElement(
        "div",
        { className: "innerWrap" },
        React.createElement(
          "div",
          { className: "recipeInput" },
          React.createElement(
            "div",
            { className: "moveButtons" },
            React.createElement("input", { type: "button", className: "moveUpInput", onClick: doUp, value: "\u2191" }),
            React.createElement("input", { type: "button", className: "moveDownInput", onClick: doDown, value: "\u2193" })
          ),
          React.createElement("input", { className: "stepField", type: "text", name: "steps", maxlength: props.maxDesc, placeholder: "step" }),
          React.createElement("input", { type: "button", className: "removeInput", onClick: doRemove, value: "\u274C" })
        ),
        React.createElement("input", { type: "button", id: "addStepField", "class": "addFieldButton", onClick: function onClick(e) {
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

//makes the recipe list
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

    var privateH3 = function privateH3() {
      return React.createElement(
        "h3",
        { className: "private" },
        "Private"
      );
    };

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
        recipe.public ? '' : privateH3()
      ),
      React.createElement(
        "div",
        { className: "recipeFullInfo" },
        React.createElement(
          "h3",
          { className: "recipeDesc" },
          recipe.description
        ),
        React.createElement(
          "h3",
          { className: "ingredientsLabel" },
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

//loads recipes from serrver
var loadRecipesFromServer = function loadRecipesFromServer(csrf) {
  var getMsg = '/getRecipes';
  if (!csrf) getMsg = '/getPublicRecipes';

  sendAjax('GET', getMsg, null, function (data) {
    ReactDOM.render(React.createElement(RecipeList, { recipes: data.recipes }), document.querySelector("#recipes"));
  });
};

//sets up the page
var setup = function setup(csrf, member) {
  if (csrf) {
    ReactDOM.render(React.createElement(RecipeForm, { csrf: csrf }), document.querySelector("#makeRecipe"));

    if (!member) {
      $("#publicCheckBox").prop('checked', true);
      $("#publicCheckBox").prop('disabled', true);
    }
  }

  if (member) $("#upgradeButton").hide();

  ReactDOM.render(React.createElement(RecipeList, { recipes: [] }), document.querySelector("#recipes"));

  loadRecipesFromServer(csrf);
};

//gets csrf token and member status
var getToken = function getToken(val) {
  sendAjax('GET', '/getToken', null, function (result) {
    if (val) return setup(result.csrfToken, result.isMember);
    return setup(undefined, result.isMember);
  });
};

$(document).ready(function () {
  $('#upgradeButton').click(function () {
    return sendAjax('GET', '/upgrade', null, redirect);
  });

  //blocks emter key use on page
  $(window).keydown(function (event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });

  if (document.querySelector("#makeRecipe")) {
    getToken(true);
  } else {
    getToken(false);
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
