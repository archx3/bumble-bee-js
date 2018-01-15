 //document.getElementsByClassName("hidden").style.display = "none";

var studLvl = document.getElementById("studLvl");
console.log("prd decalred and assigned and is of type " + typeof(studLvl));

/*studLvl.addEventListener("mouseout", function()
{
	console.log(" anonymous function called");
	showLevel();
	
}); */

form.addEventListener("mouseover", function()
{
	console.log(" anonymous function called");
	showLevel();
	
});

function showLevel () {
console.log("showLevel called");

var ray = document.getElementById("StudentLevel");
//console.log("ray decalred and assigned and is of type " + typeof(ray));
var rayv = parseInt(document.getElementById("StudentLevel").value);
console.log("rayv declared and assigned and is of type " + typeof(rayv));
//console.log(ray);
		
	if (rayv == 1)
	{
	 	console.log("now now in if statement");
	 	//console.log("ray is now of type " + typeof(ray));
	 	//document.getElementById("sec").disabled = true;
	 	//document.getElementById("pri").disabled = false;
		 	
	 	document.getElementById("sec").style.display = "none";
	 	document.getElementById("pri").style.display = "inline-block";
    }
	else
    {
	 	console.log("now now in if statement");
	 	//console.log("ray is now of type " + typeof(ray));
	 	//document.getElementById("sec").disabled = false;
	 	//document.getElementById("pri").disabled = true;

	 	document.getElementById("sec").style.display = "inline-block";
	 	document.getElementById("pri").style.display = "none";
	}
}

