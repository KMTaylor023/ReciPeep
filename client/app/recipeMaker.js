const handleRecipe = (e) => {
  e.preventDefault();
  
  //$("#errorMessage").animate({width:'hide'}, 350);
  
  if($("#recipeNameField").val() == '' || $("#domoAge").val() == '') {
    handleError("RAWR! All fields are required");
    return false;
  }
  sendAjax('POST', $("#domoForm").attr('action'), $("#domoForm").serialize(), function() {
    loadDomosFromServer();
  });
  return false;
};


const addFieldOnClick = (e) => {
  let count = +e.target.getAttribute('count');
  if(e.target.id === "addStepField"){
    
  } else {
    
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
        <input class="ingredientField" type="text" name="ingredient-0" maxlength={props.maxName} placehoder="ingredient"/>
        <input type="button" id="addIngredientField" class="addFieldButton" count="1" onClick={} value="Add Ingredient"/>
      </fieldset>
      <fieldset id="stepFieldset">
        <legend>Steps</legend>
        <input class="stepField" type="text" name="step-0" maxlength={props.maxDesc} placehoder="ingredient"/>
        <input type="button" id="addStepField" class="addFieldButton" count="1" onClick={} value="Add Step"/>
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
    return (
      <div key={recipe._id} className="recipe" onClick={() => recipeClick(e,recipe._id)}>
        <h3 className="recipeName">{recipe.name}</h3>
        <h3 className="recipeDesc">{recipe.desc}</h3>
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