function validateForm()
{
   //"use strict";
   var returnValue = true;
   var stud_Id = document.getElementById("stud_id");
   var fN = document.getElementById("fname");
   var lN = document.getElementById("lname");
   var dob = document.getElementById("dob");
   var male = document.getElementById("m");
   var female = document.getElementById("f");
   var Academics = document.getElementById("level");
   var errMsg = document.getElementById("errMsg");
   
   if(stdForm.stud_id.value == "")
   {
	   errMsg.innerHTML = "Error: Please enter Student ID!";
	   return false;
   }
  
    if(stdForm.fname.value == "")
	{
      errMsg.innerHTML = "Error: Please enter First name!";
	   return false;
	}
	re = /^\w+$/;
    if(!re.test(stdForm.fname.value)) 
	{
      errMsg.innerHTML = "Error: First name must contain only letters, numbers and underscores!";
	  document.stdForm.fName.focus();
	  return false;
    }
    if(stdForm.lname.value == "")
	{
      errMsg.innerHTML = "Error:Please enter your Last name!";
	return false;
	}
	re = /^\w+$/;
    if(!re.test(stdForm.lname.value)) 
	{
      errMsg.innerHTML = "Error: Last name must contain only letters";
	  return false;
    }
	if( (male.checked == false) &&(female.checked == false) )
	{
      errMsg.innerHTML = "Please choose your Gender!";
	document.stdForm.gender.focus();
	return false;
	}
	if(stdForm.demo1.value == "")
	{
      errMsg.innerHTML = "Error:Please enter your Date of Birth!";
	return false;
	}
	if(Academics.selectedIndex < 0)
	{
      errMsg.innerHTML = "Error:Please choose a level";
	return false;
	}

   showNextInterface('#f1', '#f2');
   setActive('#bc2', '', 'active');
   console.log("has been validated");
    return returnValue;
}

function showPreviewForm()
{
    showNextInterface('#f2', '#preview');
    setActive('#bc3', '', 'active');
}



document.addEventListener("mouseover", function()
{
   console.log("anonymous function called");
   var lvl = parseInt(document.getElementById("level").value);
   var nur = document.getElementById("nur");
   var pri  = document.getElementById("pri");
   var sec = document.getElementById("sec");

   showLevel2(lvl, nur, pri, sec);

});



function showLevel2 (element1, element2, element3, element4)
{

   if (element1 == 1)
   {
      element2.style.display = "inline-block";
      element3.style.display = "none";
      //element3.childNodes[1].disabled = true;
      element4.style.display = "none";
   }
   else if( element1 == 2)
   {
      element2.style.display = "none";
      element3.style.display = "inline-block";
      element4.style.display = "none";
   }
   else if(element1 == 3)
   {
      element2.style.display = "none";
      element3.style.display = "none";
      element4.style.display = "inline-block";
   }
   else if(element1 == 4)
   {
      element2.style.display = "none";
      element3.style.display = "none";
      element4.style.display = "inline-block";
   }
   else
   {
      element2.style.display = "inline-block";
      element3.style.display = "none";
      element4.style.display = "none";
   }
}


function showNextInterface(curI, nextI)
{
   var x = document.querySelector(curI);
   console.log("x declared and is of type: " + typeof (x));
   var y = document.querySelector(nextI);
   console.log("y declared and is of type: " + typeof (y));

   if(x.style.display == "block")
   {
      x.style.display = "none";
      y.style.display = "block";
      return false;
   }

}

function setActive(e, cc, ac)
{
   var el = document.querySelector(e);
   var pel = el.parentNode;
   var Items = pel.children;

   for (var i = 0; i < Items.length; i++)
   {
      Items[i].className = cc;
   }

   el.className = ac;
}
