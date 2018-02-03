/*(function ()
{*/

var Barge = Bee || {};
(function ()
{
	"use strict";

	var justLoaded = true;
	var sb = document.querySelector("#sidebar");
	var sb2 = document.querySelector("#sidebar2");

	var tc = document.querySelector("#desktop");
	var tcRow = document.querySelectorAll("#desktop .row");
	var sc = document.querySelectorAll("#desktop .scrollableContainer .teacherSubjectList");


	//Bee.toolBox = Bee.toolBox || {};
	Bee.toolBoxMenu = {
		show : function (element, user, id)
		{
			id = id || element.id;

			var elChil = null;

			if (element.style.display === "block")
			{
				element.style.display = "none";
				Bee.utils.css(element.previousElementSibling, {
					backgroundColor : ''
				});

				/*if(element.previousElementSibling.children)
				 {
				 elChil = element.previousElementSibling.children;
				 Bee.Array.forEach(elChil, function (node)
				 {
				 Bee.utils.css(node,{ color : '' });
				 })
				 }*/

				if (user)
				{
					localStorage.setItem(user + id + "MenuSetDisplayState", "off");
				}
				return false;
			}
			else
			{
				// console.log("else part called");
				Bee.utils.css(element.previousElementSibling, { backgroundColor : 'var(--menuItemHoverColor)' });
				element.style.display = "block";

				/*if(element.previousElementSibling.children)
				 {
				 elChil = element.previousElementSibling.children;
				 Bee.Array.forEach(elChil, function (node)
				 {
				 Bee.utils.css(node,{ color : 'var(--useInfoTextColor)' });
				 })
				 }*/
				if (user)
				{
					localStorage.setItem(user + id + "MenuSetDisplayState", "on");
				}
			}

			if (Bee.utils.defined(Ps))
			{
				Ps.update(sb);
				Ps.update(sb2);
			}

		},

		toggleFull : function (user)
		{

			if (dXOffSet)
			{
				dXOffSet = 0;
			}

			justLoaded = false;
			if (user)
			{
				localStorage.setItem(user + "lastVisibleTooBox", "full");
				//Bee.utils.setCookie(user + "lastVisibleTooBox", "full", 365*2);
			}

			if (sb2.style.display == "block")
			{
				//tc.setAttribute("style", ' transition: all .4s');
				Bee.utils.swapElsDisplay(sb, sb2);
				sb.setAttribute("style", "animation: grow 0.4s forwards;");
				tc.setAttribute("style", 'width: calc(100% - 250px); margin-left: 250px;transition: all .4s');
				if (tcRow[0] != undefined && tcRow[1] != undefined)
				{
					tcRow[0].style.textAlign = "left";
					tcRow[1].style.textAlign = "left";
				}
				if (sc[0] != undefined)
				{
					sc[0].style.textAlign = "left";
				}
				return false;
			}
			else
			{
				sb.style.display = "none";
				// return false;
			}

			if (Bee.utils.defined(Ps))
			{
				Ps.update(sb);
			}
		},

		toggleMini : function (user)
		{
			// myVar =  new Bee.Barbecue.modernTip(200);

			//dXOffSet = 200;

			if (user)
			{
				localStorage.setItem(user + "lastVisibleTooBox", "mini");
				//Bee.utils.setCookie(user + "lastVisibleTooBox", "mini", 365*2);
			}
			sb.style.animation = "none";

			if (sb.style.display != "block")
			{
				Bee.utils.swapElsDisplay(sb, sb2);
				//tc.style.marginLeft = 100 + "px";transition: all .4s

				/*if(justLoaded)
				 {
				 tc.setAttribute("style", 'width: 96.3%; margin-left: 50px; transition: all .4s');
				 }
				 else
				 {*/
				tc.setAttribute("style", 'width: calc(100% - 40px); margin-left: 40px;');
				//}
				justLoaded = false;
				if (tcRow[0] != undefined && tcRow[1] != undefined)
				{
					tcRow[0].style.textAlign = "center";
					tcRow[1].style.textAlign = "center";
				}
				if (sc[0] != undefined)
				{
					sc[0].style.textAlign = "center";
				}

				// return false;
			}
			else
			{
				Bee.utils.swapElsDisplay(sb, sb2);
				tc.style.marginLeft = 100 + "px";
				tc.setAttribute("style", 'width: calc(100% - 40px); margin-left: 40px;');
				if (tcRow)
				{
					tcRow.style.textAlign = "center";
				}
				// return false;
			}

			if (Bee.utils.defined(Ps))
			{
				Ps.update(sb2);
			}
		},

	};
})();


	var getPushDownDisplayState = function (user, id)
	{
		// console.log(user); // console.log(id);
		var key = user + id +  "MenuSetDisplayState";
		// console.log(key);
		return localStorage.getItem(key);
	};

	function getItemDisplayState(user, id, setId)
	{
		var key = user + id +  setId;
		return localStorage.getItem(key);
	}

// Ps.initialize(sb);
// Ps.initialize(sb2);
//})()

var tm = Bee.toolBoxMenu;
