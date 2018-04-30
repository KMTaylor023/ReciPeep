//handles sending a recipe request
const handleRecipe = (e) => {
  e.preventDefault();
   
  
  if($("#recipeNameField").val() == '' || $("#recipeDescField").val() == '') {
    handleError("All fields are required");
    return false;
  }
  
  //TODO validate step fields
  
  sendAjax('POST', $("#recipeForm").attr('action'), $("#recipeForm").serialize(), function() {
    location.reload();
  });
  return false;
};

//selects a recipe to view in full
const setSelectedRecipe = (e) => {
  e.preventDefault();
  let div = e.target;
  
  while (!div.classList.contains('recipe')){
    div = div.parentElement;
  }
  const recipeDiv = $(div);
  
  if(recipeDiv.hasClass('selectedRecipe')){
    recipeDiv.removeClass('selectedRecipe');
    recipeDiv.find('.recipeFullInfo').slideUp();
    return false;
  }
  
  const selected = $(".selectedRecipe");
  if(selected) {
    selected.removeClass('selectedRecipe');
    selected.find('.recipeFullInfo').slideUp();;
  }
  
  recipeDiv.addClass('selectedRecipe');
  recipeDiv.find('.recipeFullInfo').slideDown();
  
  return false;
};



const moveUpInput = (input) => {
  let children = Array.from(input.parentElement.childNodes);
  
  let index = children.indexOf(input);
  
  if(index === 0) return;
  
  input.parentElement.insertBefore(input,children[index - 1]);
};

const moveDownInput = (input) => {
  let children = Array.from(input.parentElement.childNodes);
  
  let index = children.indexOf(input);
  
  if(index === children.length - 2) return;
  
  input.parentElement.insertBefore(input,children[index + 2]);
};

const removeInput = (input) => {
  let children = input.parentElement.childNodes;
  
  if(children.length <= 2) return;
  
  $(input).remove();
};

//adds field to the recipe maker form
const addFieldOnClick = (e,max) => {
  let text = '<div class="recipeInput">'
  text += '<div class="moveButtons">';
  text += '<input type="button" class="moveUpInput" onclick="moveUpInput(this.parentElement.parentElement)" value="↑"/>';
  text += '<input type="button" class="moveDownInput" onclick="moveDownInput(this.parentElement.parentElement)" value="↓"/>';
  text += "</div>";
  
  
  if(e.target.id === "addStepField"){
    text += '<input class="stepField" type="text" name="steps" maxlength="' + max + '" placeholder="step"/>';
  } else {
    text += '<input class="ingredientField" type="text" name="ingredients" maxlength="' + max + '" placeholder="ingredient"/>';
  }
  
  text += '<input type="button" class="removeInput" onclick="removeInput(this.parentElement)" value="❌"/>';
  const newInput = $(text);
  $(e.target).before(newInput);
};

//creates a recipe maker form
const RecipeForm = (props) => {
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
    if($("#recipeForm").css('display') === 'none')
      $("#recipeForm").slideDown();
    else
      $("#recipeForm").slideUp();
  }
  
  return (
    <div>
    <h1 onClick={toggleForm}>Click To Make A Recipe!
      <span>Fill in the information below and click 'Make Recipe'</span>
    </h1>
      <form id="recipeForm"
            onSubmit={handleRecipe}
            name="recipeForm"
            action="/recipeMaker"
            method="POST"
            className="recipeForm"
        >
        <div className="recipeFormSection"><span>1</span>Recipe Information</div>
        <div className="innerWrap">
          <label htmlFor="name">Name: 
            <input id="recipeNameField" type="text" name="name" maxlength={props.maxName} placeholder="Recipe Name"/>
          </label>
          <label htmlFor="desc">Description: 
            <input id="recipeDescField" type="text" name="desc" maxlength={props.maxDesc} placeholder="Recipe Description"/>      
          </label>
          <label htmlFor="public">Public (members only): 
            <input id="publicCheckBox" type="checkbox" name="public" value="public"/>  
          </label>
        </div>
        <div className="recipeFormSection"><span>2</span>Ingredients</div>
        <div className="innerWrap">
          <div className="recipeInput">
            <div className="moveButtons">
              <input type="button" className="moveUpInput" onClick={doUp} value="↑"/>
              <input type="button" className="moveDownInput" onClick={doDown} value="↓"/>
            </div>
            <input className="ingredientField" type="text" name="ingredients" maxlength={props.maxName} placeholder="ingredient"/>
            <input type="button" className="removeInput" onClick={doRemove} value="❌"/>
              
          </div>
          <input type="button" id="addIngredientField" class="addFieldButton" onClick={(e) => addFieldOnClick(e,props.maxName)} value="Add Ingredient"/>
        </div>
        <div className="recipeFormSection"><span>3</span>Directions</div>
        <div className="innerWrap">
          <div className="recipeInput">
            <div className="moveButtons">
              <input type="button" className="moveUpInput" onClick={doUp} value="↑"/>
              <input type="button" className="moveDownInput" onClick={doDown} value="↓"/>
            </div>
            <input className="stepField" type="text" name="steps" maxlength={props.maxDesc} placeholder="step"/>
            <input type="button" className="removeInput" onClick={doRemove} value="❌"/>
          </div>
          <input type="button" id="addStepField" class="addFieldButton" onClick={(e) => addFieldOnClick(e,props.maxDesc)} value="Add Step"/>
        </div>
        <input type="hidden" id="csrf" name="_csrf" value={props.csrf}/>
        <div class="button-section">
          <input className="makeRecipeSubmit" type="submit" value="Make Recipe"/>
        </div>
      </form>
    </div>
  );
};

//makes the recipe list
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
    
    const stepNodes = recipe.steps.map(function(step, number) {
      return (
        <li className="direction">{step}</li>
      );
    });
    
    const privateH3 = function() {return (
      <h3 className="private">Private</h3>
    )};
    
    return (
      <div key={recipe._id} className='recipe' onClick={setSelectedRecipe}>
        <div className="recipeQuickLook">
          <img className="recipeImg" src="/assets/img/recipe.png" alt="recipe image"></img>
          <h1 className="recipeName">{recipe.name}</h1>
          {(recipe.public ? '' : privateH3())}
        </div>
        <div className="recipeFullInfo">
          <h3 className="recipeDesc">{recipe.description}</h3>
          <h3 className="ingredientsLabel">Ingredients</h3>
          <ul className="ingredients">
              {ingredientNodes}
          </ul>
          <h3 className="directionsLabel">Directions</h3>
          <ol className="directions">
              {stepNodes}
          </ol>
        </div>
      </div>
    );
  });
  
  return (
    <div className="recipeList">
      {recipeNodes}
    </div>
  );
};

//loads recipes from serrver
const loadRecipesFromServer = (csrf) => {
  let getMsg = '/getRecipes';
  if(!csrf) getMsg = '/getPublicRecipes';
  
  sendAjax('GET', getMsg, null, (data) => {
    ReactDOM.render(
      <RecipeList recipes={data.recipes}/>,document.querySelector("#recipes")
    );
  });
};

//sets up the page
const setup = function(csrf, member) {
  if(csrf){
    ReactDOM.render(
      <RecipeForm csrf={csrf} />, document.querySelector("#makeRecipe")
    );
    
    if(!member) {
      $("#publicCheckBox").prop('checked', true);
      $("#publicCheckBox").prop('disabled', true);
    }
  }
  
  if(member) $("#upgradeButton").hide();
    
  ReactDOM.render(
    <RecipeList recipes={[]} />, document.querySelector("#recipes")
  );
  
  loadRecipesFromServer(csrf);
};

//gets csrf token and member status
const getToken = (val) => {
  sendAjax('GET', '/getToken', null, (result) => {
    if(val)
      return setup(result.csrfToken, result.isMember);
    return setup(undefined, result.isMember);
  });
};

$(document).ready(function() {
  $('#upgradeButton').click(() => sendAjax('GET', '/upgrade', null, redirect));
  
  //blocks emter key use on page
  $(window).keydown(function(event){
    if(event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  });
  
  if(document.querySelector("#makeRecipe")){
    getToken(true); 
  } else {
    getToken(false);
  }
});