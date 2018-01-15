/*
var x = document.getElementById("login").className = "shaker";

var txtField = getAllElementsWithAttribute("data-inputType") == "txtField";
var alphaNumericField  = getAllElementsWithAttribute("data-inputType") == "alphaNumericField";
var passwordField = getAllElementsWithAttribute("data-inputType") == "passwordField";
var confirmPasswordField = getAllElementsWithAttribute("data-inputType") == "confirmPasswordField";
var emailField = getAllElementsWithAttribute("data-inputType") == "emailField";
var phoneField = getAllElementsWithAttribute("data-inputType") == "phoneField";
var numericField = getAllElementsWithAttribute("data-inputType") == "numericField";

function unifiedValidator()
{

}
*/

/*
function getAllElementsWithAttribute(attribute)
{
   var matchingElements = [];
   var allElements = document.getElementsByTagName('*');
   for (var i = 0, n = allElements.length; i < n; i++)
   {
      if (allElements[i].getAttribute(attribute) !== null)
      {
         // Element exists with attribute. Add to array.
         matchingElements.push(allElements[i]);
      }
   }
   return matchingElements;
}



function shakeHead ()
{
   var x = document.getElementById("login").classList += " shaker";
   console.log("x assigned");
}


function formValidate()
{
  var uN = document.getElementById("userName");
  var pS = document.getElementById("Password");

  var msg = document.getElementById("mess");
  var msg2 = document.getElementById("failed");

   if(form.userName.value == "")
	{
      shakeHead();
      msg.innerHTML = "Please fill the form";
      //alert("Error: Username cannot be blank!");
      //return false;
    }
    re = /^\w+$/;
    if(!re.test(form.userName.value)) 
	{
      shakeHead();
	  msg.innerHTML = "Error: Username must contain only letters, numbers and underscores!";
	  return false;
    }

   // testing fof the right value when input is not null
    if(form.Password.value != "") 
	{
      if(form.Password.value.length < 6) 
	  {
        shakeHead();
        msg2.innerHTML = "Error: Password must contain at least six characters!";
        return false;
      }
      if(form.Password.value === form.userName.value) 
	  {
        shakeHead();
        msg2.innerHTML = "Error: Password must be different from Username!";
        return false;
      }
      re = /[0-9]/;
      if(!re.test(form.Password.value))
      {
         shakeHead();
         msg2.innerHTML = "Error: password must contain at least one number (0-9)!";
         return false;
      }
      re = /[a-z]/;
      if(!re.test(form.Password.value))
      {
         shakeHead();
         msg2.innerHTML = "Error: password must contain at least one lowercase letter (a-z)!";
        return false;
      }
      re = /[A-Z]/;
      if(!re.test(form.Password.value))
      {
         shakeHead();
         msg2.innerHTML = "Error: password must contain at least one uppercase letter (A-Z)!";
        return false;
      }
    } 
	else 
	{
      shakeHead();
      msg2.innerHTML = "Error: Please check your password!";
      return false;
    }

	msg2.innerHTML = "You entered a valid password: " + form.Password.value;
    return true;
}*/
