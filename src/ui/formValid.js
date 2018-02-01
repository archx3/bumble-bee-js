/**
 * Modified by ARCH on 07/06/2016.
 */

/** the actual parameters of the methods whose return values are assigned to
*@PRE: a form is required
*@PRE: the actual parameters of the DOM methods are assigned to each field type as a CLASS (selector) in the HTML form
*@USE: the variables are used to define categorised fieldTypes
*@POST: null;
* */
var allFields = document.getElementsByClassName("inp");
var alphaFields = document.getElementsByClassName("txtField");
var numericFields = document.getElementsByClassName("numField");
var phoneFields = document.getElementsByClassName("phoneFields");
var alphaNumericFields = document.getElementsByClassName("alphaNumField");

var nameFields = document.querySelectorAll(".nameField");

var chkBXs = document.getElementsByClassName("chkBx");
var radBtns = document.getElementsByClassName("radBtn");
var comboBxs = document.getElementsByClassName("comboBox");

/**<si> prefixes imply single instance or elements that are not a node list(array)
*@USE: used when a fieldType occurs only once in a page;
* */
var siAlphaFields = document.querySelector(".siAlpha");
var siPhoneField = document.querySelector(".phoneField");
var siNumericField = document.getElementsByClassName("siNumField");
var siAlphaNumericField = document.querySelector(".siAlphaNumField");
// passwords, confirm passwords, usernames and email fields always occur once per form
var emailField = document.querySelector(".emailField");
var userNameField = document.querySelector(".uNfield");
var passwordField = document.querySelector(".pwdField");
var dobField = document.querySelector(".dobField");
var confirmPasswordField = document.querySelector(".cfmPwdField");

var errMsg = document.getElementById("errMsg");// this is the element that takes the error msg

function unifiedValidator(form)
{
   var returnValue = true;
   if(allFields)
   {
      validateAllFields(allFields);
      if(!validateAllFields(allFields))
      {
         return false;
      }
   }
   if(alphaFields)
   {
      validateField(alphaFields, /^[A-Z]+[a-z]+$/i, "must contain only letters", 2);
      if(!validateField(alphaFields, /^[A-Z]+[a-z]+$/i, "must contain only letters", 2))
      {
         return false;
      }
   }
   if(nameFields !== undefined)//todo fix the regex for the name fields
   {
      // console.log(nameFields[0]);
      // console.log(nameFields[1]);
      
      validateField(nameFields, /^[A-Z]?[a-z]+ {0,1}-?[A-Z]?[a-z]*$/, "must contain only letters and at most one space or dash in between", 2);
      if(!validateField(nameFields, /^[A-Z]?[a-z]+ {0,1}-?[A-Z]?[a-z]*$/, "must contain only letters and at most one space or dash in between", 2))
      {
         return false;
      }
   }
   if(dobField)//todo fix theAnjnd-hhklk regex for the dob fields
   {
      validateSingleInstace(dobField, /\d{2,}-\d{2,}-\d{4,}|\d{4,}-\d{2,}-\d{2,}/, "must be of the format \"DD-MM-YYYY\" or \"YYY-MM-DD\"", 4);
      if(!validateSingleInstace(dobField, /\d{2,}-\d{2,}-\d{4,}|\d{4,}-\d{2,}-\d{2,}/, "must be of the format \"DD-MM-YYYY\" or \"YYY-MM-DD\"", 4))
      {
         return false;
      }
   }
   if(userNameField)
   {
      validateSingleInstace(userNameField, /^\w{4,}$/, "must contain at least 4 characters (only letters, numbers and underscores)", 4);
      if(!validateSingleInstace(userNameField, /^\w{4,}$/, "must contain at least 4 characters (only letters, numbers and underscores)", 4))
      {
         return false;
      }
   }
   if(siAlphaNumericField)
   {
      validateSingleInstace(siAlphaNumericField,/^\w+$/, "can only contain letters, numbers and underscores!");
      if(!validateSingleInstace(siAlphaNumericField,/^\w+$/, "can only contain letters, numbers and underscores!"))
      {
         return false;
      }
   }
   if(alphaNumericFields)
   {
      validateField(alphaNumericFields, /^\w+$/, "can only contain letters, numbers and underscores!");
      if(!validateField(alphaNumericFields, /^\w+$/, "can only contain letters, numbers and underscores!"))
      {
         return false;
      }
   }

   if(emailField) // this is where we validate a single instance email field
   {//console.log(emailField);// todo cater for multiple instance emails
      validateSingleInstace(emailField, /^[a-z]{2,}@[a-z]{2,}/i, "must be of the format abc@xyz.ghi");//todo fix exception for dots in email id
      validateSingleInstace(emailField, /\./i, "missing dot (.)");
      if(!validateSingleInstace(emailField,/^[a-z]{2,}@[a-z]{2,}/i, "must be of the format abc@xyz.ghi"))
      {
         return false;
      }
      else if(!validateSingleInstace(emailField,/\./i, "missing dot (.)xxx"))
      {
         return false;
      }else if(!validateSingleInstace(emailField,/[a-z]+$/i, "missing domain(.com | .co.uk)"))
      {
         return false;
      }
   }
   /*if(siPhoneField) // this is where we validate a single instance phone number
   {//console.log(phoneField); // todo cater for multiple instance phone numbers
      validateSingleInstace(siPhoneField, /^\+\d+$/i, "must be of the format (+233) 123 456 789", 11, 16);
      // todo validateSingleInstace(phoneField, / ?/, "must be of the format (+233) 123 456 789", 13);
      if(!validateSingleInstace(siPhoneField,/^\+\d+$/i, "must be of the format (+233) 123 456 789", 11, 16))
      {
         return false;
      }
      //else if(!validateSingleInstace(phoneField,/ ?/, "must be of the format (+233) 123 456 789", 13))
      //{ //todo unfortunately the phone number regex allows letters but spaces won't be tested too if that is disabled
        // return false; //todo so spaces are disabled for now
      //}
   }*/
   if(passwordField)
   { //console.log("here");
      validateSingleInstace(passwordField, /^\w{6,}$/, "must be al least 6 characters long(no spaces)", 6);
      // validateSingleInstace(passwordField, /[A-Z]/, "must have at least 1 upper Case Letter", 3);
      // validateSingleInstace(passwordField, /[a-z]/, "must have at least 1 lower Case Letter", 3);
      if(!validateSingleInstace(passwordField,/^\w{6,}$/, "must be al least 6 characters long(no spaces)", 6))
      {
         return false;
      }
      /*else if(!validateSingleInstace(passwordField,/[A-Z]/, "must have at least 1 upper Case Letter", 6))
      {
         return false;
      }
      else if(!validateSingleInstace(passwordField,/[a-z]/, "must have at least 1 lower Case Letter", 6))
      {
         return false;
      }*/
   }
   if(/*passwordField && */confirmPasswordField)
   {
      /*if(!validateUniqueFields(passwordField, confirmPasswordField, "e", "must be equal"))
      {
         return false;
      }*/
      if(passwordField.value !== confirmPasswordField.value)
      {
         errMsg.style.color = "#ff0000";
         errMsg.innerHTML = "Password and Confirm Password must be equal";
         confirmPasswordField.focus();
         return false;
      }
      return true;
   }
   if(passwordField && userNameField)
   {//console.log(userNameField);
      validateUniqueFields(passwordField, userNameField, "u", "cannot be the same");
   }
   else
   {
      //errMsg.style.color = "transparent";
      //errMsg.innerHTML = "Good";
      form.submit();
      return returnValue;
   }
   form.submit();
   return returnValue;
}

/* the following functions validates fieldTypes defined by a fieldType array or single instance variable
* looks for every instance of the field type that doesn't conform to the field rules i.e:
* the format(testes with a regular expression), minimum string length and maximum string length
* */
function validateAllFields(allFields)
{
   for(var i = 0; i < allFields.length; i++)
   {
      if(allFields[i].value === "" || allFields[i].value === " ")
      {//console.log(allFields[i]);
         allFields[i].focus();
         errMsg.style.color = "#ff0000";
         errMsg.innerHTML = "Error: " + allFields[i].getAttribute("data-label") +  " cannot be null";
         return false;
      }
   }
   return true;
}

function validateField(fieldType, re, fieldInfo, minLen, maxLen)
{   //console.log("called");
   for(var t = 0; t < fieldType.length; t++)
   {
     if(!re.test(fieldType[t].value))
      { //console.log(re.toString());
         fieldType[t].focus();
          errMsg.style.color = "#ff0000";
         errMsg.innerHTML = "Error: " + fieldType[t].getAttribute("data-label") + " " + fieldInfo;
         return false;
      }

      if(minLen && (fieldType[t].value.length < minLen))
      {
         fieldType[t].focus();
         errMsg.style.color = "#ff0000";
         errMsg.innerHTML = "Error: " + fieldType[t].getAttribute("data-label");
         errMsg.innerHTML += " expects at least " + minLen + " characters";
         return false;
      }
      else if(maxLen && (fieldType[t].value.length > maxLen))
      {
         fieldType[t].focus();
         errMsg.style.color = "#ff0000";
         errMsg.innerHTML = "Error: " + fieldType[t].getAttribute("data-label");
         errMsg.innerHTML += " expects at most " + maxLen + " characters";
         return false;
      }
      else
      {
          errMsg.style.color = "#0fba0f"; // green color
          errMsg.innerHTML = "Good";
      }
   }
   return true;
}

function validateSingleInstace(fieldType, re, fieldInfo, minLen, maxLen)
{console.log("called");
   if(!re.test(fieldType.value))
   {
      fieldType.focus();
      errMsg.style.color = "#ff0000"; // red color
      errMsg.innerHTML = "Error: " + fieldType.getAttribute("data-label") + " " + fieldInfo;
      return false;
   }
   if(minLen && (fieldType.value.length < minLen))
   {
      fieldType.focus();
      errMsg.style.color = "#ff0000";
      errMsg.innerHTML = "Error: " + fieldType.getAttribute("data-label");
      errMsg.innerHTML += " expects at least " + minLen + " characters";
      return false;
   }
   else if(maxLen && (fieldType.value.length > maxLen))
   {
      fieldType.focus();
      errMsg.style.color = "#ff0000";
      errMsg.innerHTML = "Error: " + fieldType.getAttribute("data-label");
      errMsg.innerHTML += " expects at most " + maxLen + " characters";
      return false;
   }
   else
   {
      errMsg.style.color = "#0fba0f"; // green color
      errMsg.innerHTML = "Good";
   }
   return true;
}
/*this function compares the values of two
* fields arrays to see determine whether any of their members'
* values coincide
* Takes as params, the two fields and compares the with the uOe(unique or equal) command , u || e
* */
function validateUniqueFields(field1, field2, uOe, fieldInfo)
{  //console.log(field1 + " " + field2);
   if(uOe === "u")
   {
      if (field1.value === field2.value)
      {
         field2.focus();
         errMsg.style.color = "#ff0000";
         errMsg.innerHTML = "Error: " + field1.getAttribute("data-label") + " and ";
         errMsg.innerHTML  += field2.getAttribute("data-label") + " " + fieldInfo;
      }
      return false;
   }
   if(uOe === "e")
   {
      if (field1.value !== field2.value)
      {
         field2.focus();
         errMsg.style.color = "#ff0000";
         errMsg.innerHTML = "Error: " + field1.getAttribute("data-label") + " and ";
         errMsg.innerHTML += field2.getAttribute("data-label") + " " + fieldInfo;
      }
      return false;
   }
}
//!important todo validating check boxes and radio buttons
//!important todo validating radio buttons
//!important todo deal with select boxes


//***** todo could be enhanced with double not (!!) checks instead of nested ifs for performance