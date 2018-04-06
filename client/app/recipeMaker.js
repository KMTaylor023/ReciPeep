const handleRecipe = (e) => {
  e.preventDefault();
  
  //$("#errorMessage").animate({width:'hide'}, 350);
  
  if($("#recipeNameField").val() == '' || $("#recipeDescField").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  
  let good = false;
  $(".ingredientField").each( () => {
    if(this.val() !== '') good=true;
  });
  
  //TODO validate step fields
  
  if(!good){
    handleError("RAWR! All fields are required");
    return false;
  }
  sendAjax('POST', $("#recipeForm").attr('action'), $("#recipeForm").serialize(), function() {
    loadRecipesFromServer();
  });
  return false;
};

const setSelectedRecipe = (e) => {
  e.preventDefault();
  let div = e.target;
  
  while (div.nodeName !== 'DIV'){
    div = div.parentElement;
  }
  const recipeDiv = $(div);
  
  if(recipeDiv.hasClass('selectedRecipe')){
    recipeDiv.removeClass('selectedRecipe');
    recipeDiv.addClass('unselectedRecipe');
    return false;
  }
  
  const recipe = $(".selectedRecipe");
  recipe.removeClass('selectedRecipe');
  recipe.addClass('unselectedRecipe');
  
  recipeDiv.removeClass('unselectedRecipe');
  recipeDiv.addClass('selectedRecipe');
  
  return false;
}

const addFieldOnClick = (e,max) => {
  let count = +e.target.getAttribute('count');
  if(e.target.id === "addStepField"){
    e.target.before(`<input class="ingredientField" type="text" name="ingredients" maxlength="${max}" placeholder="ingredient"/>`);
  } else {
    e.target.before(`<input class="stepField" type="text" name="steps" maxlength="${max}" placeholder="ingredient"/>`);
  }
};

const RecipeForm = (props) => {
  return (
    <form id="recipeForm"
          onSubmit={handleRecipe}
          name="recipeForm"
          action="/recipeMaker"
          method="POST"
          className="recipeForm"
      >
      <label htmlFor="name">Name: </label>
      <input id="recipeNameField" type="text" name="name" maxlength={props.maxName} placeholder="Recipe Name"/>
      <label htmlFor="desc">Description: </label>
      <input id="recipeDescField" type="text" name="desc" maxlength={props.maxDesc} placeholder="Recipe Description"/>
      <fieldset id="ingredientsFieldset">
        <legend>Ingredients</legend>
        <input className="ingredientField" type="text" name="ingredients" maxlength={props.maxName} placeholder="ingredient"/>
        <input type="button" id="addIngredientField" class="addFieldButton" count="1" onClick={(e) => addFieldOnClick(e,props.maxName)} value="Add Ingredient"/>
      </fieldset>
      <fieldset id="stepFieldset">
        <legend>Steps</legend>
        <input className="stepField" type="text" name="steps" maxlength={props.maxDesc} placeholder="ingredient"/>
        <input type="button" id="addStepField" class="addFieldButton" count="1" onClick={(e) => addFieldOnClick(e,props.maxDesc)} value="Add Step"/>
      </fieldset>
      <input type="hidden" id="csrf" name="_csrf" value={props.csrf}/>
      <input className="makeRecipeSubmit" type="submit" value="Make Recipe"/>
    </form>
  );
};


const RecipeList = function(props) {
  if(props.recipes.length === 0) {
    return (
      <div className="recipeList">
        <h3 className="emptyRecipe">No Recipes Yet</h3>
      </div>
    );
  }
  
  const recipeNodes = props.recipes.map(function(recipe) {
    const ingredientNodes = recipe.ingredients.map(function(ingredient) {
      return (
        <li className="ingredient">{ingredient}</li>
      );
    });
    
    const stepNodes = recipe.steps.map(function(step) {
      return (
        <li className="steps">{step}</li>
      );
    });
    
    return (
      <div key={recipe._id} className="recipe" onClick={setSelectedRecipe}>
        <h3 className="recipeName">{recipe.name}</h3>
        <h3 className="recipeDesc">{recipe.desc}</h3>
        <ul id="ingredients">
            {ingredientNodes}
        </ul>
        <ol id="steps">
            {stepNodes}
        </ol>
      </div>
    );
  });
  
  return (
    <div className="recipeList">
      {recipeNodes}
    </div>
  );
};

const loadRecipesFromServer = () => {
  sendAjax('GET', '/getRecipes', null, (data) => {
    ReactDOM.render(
      <RecipeList recipes={data.recipes}/>,document.querySelector("#recipes")
    );
  });
};

const setup = function(csrf) {
  ReactDOM.render(
    <RecipeForm csrf={csrf} />, document.querySelector("#makeRecipe")
  );
  ReactDOM.render(
    <RecipeList recipes={[]} />, document.querySelector("#recipes")
  );
  
  loadRecipesFromServer();
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});