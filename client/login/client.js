const handleLogin = (e) => {
  e.preventDefault();
  
  if($("#user").val() == '' || $("#pass").val() == '') {
    handleError('RAWR! Username or password is empty');
    return false;
  }
  
  console.log($("input[name=_csrf]").val());
  
  sendAjax('POST', $('#loginForm').attr('action'), $('#loginForm').serialize(), redirect);
  
  return false;
};

const handleSignup = (e) => {
  e.preventDefault();
  
  if($("#user").val() == '' || $("#pass").val() == '' || $('#pass2').val() == '') {
    handleError('All Fields Required');
    return false;
  }
  
  if($("#pass").val() !== $('#pass2').val()) {
    handleError('Passwords must match!');
    return false;
  }
  
  sendAjax('POST', $('#signupForm').attr('action'), $('#signupForm').serialize(), redirect);
};

const handleReset = (e) => {
  e.preventDefault();
  
  if($("#oldpass").val() == '' || $("#newpass").val() == '' || $('#newpass2').val() == '') {
    handleError('All Fields Required');
    return false;
  }
  
  if($("#newpass").val() !== $('#newpass2').val()) {
    handleError('Passwords must match!');
    return false;
  }
  
  sendAjax('POST', $('#resetForm').attr('action'), $('#resetForm').serialize(), redirect);
};

const LoginWindow = (props) => {
  return (
    <form id="loginForm"
          name="loginForm"
          onSubmit = {handleLogin}
          action="/login"
          method="POST"
          className="mainForm"
      >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username"/>
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="formSubmit" type="submit" value="Sign in"/>
    
    </form>
  );
};


const SignupWindow = (props) => {
  return (
    <form id="signupForm"
          name="signupForm"
          onSubmit = {handleSignup}
          action="/signup"
          method="POST"
          className="mainForm"
      >
      <label htmlFor="username">Username: </label>
      <input id="user" type="text" name="username" placeholder="username"/>
      <label htmlFor="pass">Password: </label>
      <input id="pass" type="password" name="pass" placeholder="password"/>
      <label htmlFor="pass2">Password: </label>
      <input id="pass2" type="password" name="pass2" placeholder="retype password"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="formSubmit" type="submit" value="Sign up"/>
    
    </form>
  );
};

const ResetWindow = (props) => {
  return (
    <form id="resetForm"
          name="resetForm"
          onSubmit = {handleReset}
          action="/reset"
          method="POST"
          className="mainForm"
      >
      <label htmlFor="oldpass">Current: </label>
      <input id="oldpass" type="password" name="oldpass" placeholder="password"/>
      <label htmlFor="newpass">New: </label>
      <input id="pass" type="password" name="newpass" placeholder="password"/>
      <label htmlFor="newpass2">New: </label>
      <input id="pass2" type="password" name="newpass2" placeholder="retype password"/>
      <input type="hidden" name="_csrf" value={props.csrf}/>
      <input className="formSubmit" type="submit" value="Reset"/>
    
    </form>
  );
};

const createResetWindow = (csrf) => {
  ReactDOM.render(
    <ResetWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createLoginWindow = (csrf) => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const createSignupWindow = (csrf) => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const setup = (csrf) => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");
  
  if(!loginButton || !signupButton){
    createResetWindow(csrf);
    return;
  }
  
  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  
  createLoginWindow(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});