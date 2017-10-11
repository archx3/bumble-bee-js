/**
 * Created by ARCH on 27/07/2016.
 * Copyright (C) 2016 Barge Studios <bargestd@gmail.com>
 */
var styleToSwitch = document.querySelector("#subjStyle");

function newSetActiveStyleSheet(newStyle)
{
   styleToSwitch.setAttribute("href", newStyle);
   styleToSwitch.setAttribute("data-title", newStyle);
   //console.log(styleToSwitch.getAttribute("data-title"));
}


function getActiveStyleSheet() {
   var i, a;
   for(i=0; (a = document.getElementsByTagName("link")[i]); i++) {
      if(a.getAttribute("rel").indexOf("style") != -1 && a.getAttribute("data-title") && !a.disabled) return a.getAttribute("data-title");
   }
   return null;
}

function getPreferredStyleSheet() {
   var i, a;
   for(i=0; (a = document.getElementsByTagName("link")[i]); i++)
   {
      if(a.getAttribute("rel").indexOf("style") !== -1
         && a.getAttribute("rel").indexOf("alt") === -1
         && a.getAttribute("data-title")
      ) return a.getAttribute("data-title");
   }
   return null;
}

function createCookie(name,value,days)
{
   if (days)
   {
      var date = new Date();
      date.setTime(date.getTime()+(days*24*60*60*1000));
      var expires = "; expires="+date.toGMTString();
   }
   else expires = "";
   document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name)
{
   let nameEQ = name + "=";
   var ca = document.cookie.split(';');
   for(var i=0;i < ca.length;i++)
   {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
   }
   return null;
}

window.onload = function(e)
{
   var cookie = readCookie("style");
   var title = cookie ? cookie : getPreferredStyleSheet();
   newSetActiveStyleSheet(title);
};

window.onunload = function(e)
{
   var title = styleToSwitch.getAttribute("data-title");
   //console.log("reloaded");
   createCookie("style", title, 365);
};

var cookie = readCookie("style");
//var title = cookie ? cookie : getPreferredStyleSheet();
newSetActiveStyleSheet(getPreferredStyleSheet());