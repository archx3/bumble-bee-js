/**
 * Created by ARCH on 24/02/2016.
 */

(function (Bu,Ba,Bs,Bd)
{
   var ctxMenu         = document.querySelector("#ctxMenu"),
       ul              = ctxMenu.childNodes[0],
       srcEl           = null,
       selectionBuffer = "", //this is the internal clipboard
       isEditableEl    = false,
       canShow         = false;

   var posX = 0,
       posY = 0;

   /**
    *
    * @param itemID {String}
    * @param iconPosition {Number}
    * @param menuItemText {String}
    * @param shortCutText {String}
    * @param divide {boolean}
    */
   function _addContextMenuItem(itemID, iconPosition, menuItemText, shortCutText, divide)
   {
      var li = document.createElement("li");
      li.classList.add("menuIs");
      li.id = itemID;
      var icon = document.createElement("span");
      icon.className = "iconItem";
      icon.setAttribute("style", "background-position:" + iconPosition + "px center;");

      var menuText = document.createElement("p");
      menuText.innerHTML = menuItemText;
      var shortCut = document.createElement("span");
      shortCut.className = "shortCut";
      shortCut.innerHTML = shortCutText;

      li.appendChild(icon);
      li.appendChild(menuText);
      li.appendChild(shortCut);

      if (divide)
      {
         var divider = document.createElement("li");
         divider.className = "menuIs";
         divider.classList.add("divider");
         document.querySelector("#ctxMenu ul").appendChild(divider);
      }

      console.log(document.querySelector("#ctxMenu ul"));
      return li;
   }

   function _showCtxMenu(el)
   {
      // this is where we do the hiding and showing of the div
      if (Bu.defined(ctxMenu))
      {
         Bu.openWin(ctxMenu);
      }
      else
      {
         return;
      }
      el.style.left = posX + "px";
      el.style.top = posY + "px";
      Bu.dynamicSpaceElPositioner(ctxMenu, false);

      if (el.style.top < 0)
      {
         Bu.css(el, { overflowY : 'scroll' });
         // el.style.overflowY
      }
   }

   function _hideCtxMenu(event, el, elc)
   {
      if (Bu.getDisplayState(ctxMenu) == 1)
      {
         if (event.target != el || event.target.parentNode != elc || event.target != "<li>")
         {
            Bu.closeWin(ctxMenu, false, false);
         }
      }
   }

   ///// TO BE DONE //////
   //todo determine whether menu will have enaf space on the right or bottom to show [DONE]
   //whether child menu will have enaf space on the right to show.

   document.addEventListener("click", function (event)
   {
//       console.log(event.button);//console.log(event.which);
      srcEl = event.target;
      console.log(srcEl);

      if (event.button == 2 || event.which == 3)
      {
         Bu.getMouseCoordinates(event);
         _showCtxMenu(ctxMenu);

         srcEl = srcEl ? srcEl : document.body;
         if (srcEl.classList.contains("noCtxMenu") || srcEl.classList.contains("key"))
         {
            //console.log(true);
            Bu.setDisplayState(ctxMenu, "none");
         }

         return false;
      }

      if (event.button == 0 || event.which == 1)
      {
         _hideCtxMenu(event, ctxMenu, ul);
         return false;
      }
   });

   document.addEventListener("contextmenu", function (evt)
   {  //console.log(evt.defaultStatus);
      var coords = Bu.getMouseCoordinates(evt);
      posX = coords.x;
      posY = coords.y;
      _showCtxMenu(ctxMenu);
      evt.preventDefault();
      srcEl = evt.target; //FIXME #2000 issue with srcEl not getting set [FIXED]

      isEditableEl = !!(srcEl.tagName.toLowerCase() == "textarea" ||
      ( srcEl.tagName.toLowerCase() == "input" && srcEl.type == "text"));

      //region hide and show
      //dealing with the cut menu item
      if (!isEditableEl || (isEditableEl && Bee.CopyCat.getSelectedInputText(srcEl) == ""))
      {
         document.getElementById("cutToCB").classList.add("disabledMenuItem");

      }
      else
      {
         document.getElementById("cutToCB").classList.remove("disabledMenuItem");
      }

      //dealing with the clear srcInputEl selected text menu item
      if (!isEditableEl || (isEditableEl && srcEl.value == ""))
      {
         document.getElementById("clearText").classList.add("disabledMenuItem");
      }
      else
      {
         document.getElementById("clearText").classList.remove("disabledMenuItem");
      }
      //dealing with the clear srcInputEl selected text menu item
      if (!isEditableEl || (isEditableEl && srcEl.value == ""))
      {
         document.getElementById("selAllToCB").classList.add("disabledMenuItem");
      }
      else
      {
         document.getElementById("selAllToCB").classList.remove("disabledMenuItem");
      }

      // dealing with the paste button
      if (selectionBuffer == "" || !isEditableEl)
      {
         document.getElementById("pasteFromCB").classList.add("disabledMenuItem");
      }
      else
      {
         document.getElementById("pasteFromCB").classList.remove("disabledMenuItem");
      }

      //dealing with the copy menu item
      if ((isEditableEl && Bee.CopyCat.getSelectedInputText(srcEl) == "") ||
          (!isEditableEl && Bee.CopyCat.getSelectionText() == ""))
      {
         document.getElementById("copyToCB").classList.add("disabledMenuItem");
      }
      else
      {
         document.getElementById("copyToCB").classList.remove("disabledMenuItem");
      }
      //endregion

      srcEl = srcEl ? srcEl : document.body;

      canShow = isEditableEl && (srcEl.tagName.toLowerCase() == "td" ||
         ( srcEl.tagName.toLowerCase() == "li"));

      console.log(canShow);

      if ((srcEl.classList.contains("noCtxMenu") ||
         srcEl.classList.contains("key")) && !canShow)
      {
         //console.log(true);
         Bu.setDisplayState(ctxMenu, "none");
      }
   });

   var menuIs = document.querySelectorAll(".menuIs:not(.divider)");

//what should happen if a core menu Item is clicked
   for (var i = 0; i < menuIs.length; i++)
   {
      menuIs[i].addEventListener("click", function (e)
      {
         //var targetEL = e.target;//console.log(targetEL);

         var isEditableInputEl = !!(srcEl.tagName.toLowerCase() == "textarea" || ( srcEl.tagName.toLowerCase() == "input" && srcEl.type == "text"));
         if (!this.classList.contains("disabledMenuItem"))
         {
            if (this.id == "copyToCB")
            {
               if (isEditableInputEl)
               {
                  if (srcEl.selectionStart != srcEl.selectionEnd)
                  {
                     selectionBuffer = Bee.CopyCat.getSelectedInputText(srcEl);
                     Bee.CopyCat.copySelectionText();
                     //document.execCommand("copy");
                  }
               }
               else
               {
                  selectionBuffer = Bee.CopyCat.getSelectionText();
                  //console.log(selectionBuffer);
                  Bee.CopyCat.copySelectionText();
                  //document.execCommand("copy");
               }
            }
            else if (this.id == "pasteFromCB")
            {
               if (isEditableInputEl && !srcEl.readOnly)
               {
                  //console.log(targetEL);//console.log(srcEl.tagName);
                  if (selectionBuffer != "")
                  {
                     Bu.insertAtCaret(srcEl, selectionBuffer);
                  }
                  else
                  {
                     /*console.log(window.clipboardData.getData('Text'));
                      Bu.insertAtCaret(srcEl, document.execCommand("paste"));*/
                     var theme = document.body.getAttribute("data-theme") != "" ?
                                 document.body.getAttribute("data-theme") : "light";
                     if (theme == "dark")
                     {
                        Bee.Dialog.darkConfirm("Sorry", "Pasting from System Clipboard is not allowed", "OK", false, false, false, "failure");
                     }
                     else
                     {
                        Bee.Dialog.lightConfirm("Sorry", "Pasting from System Clipboard is not allowed",
                                                "OK", false, false, false, "failure");

                     }
                  }
               }
            }

            else if (this.id == "cutToCB")
            {
               if (isEditableInputEl)
               {
                  selectionBuffer = Bee.CopyCat.getSelectedInputText(srcEl);
                  Bee.CopyCat.copySelectionText();
                  Bu.deleteSelectedText(srcEl);
               }
            }
            else if (this.id == "selAllToCB")
            {
               if (isEditableInputEl)
               {
                  srcEl.select();
                  Bee.CopyCat.selectALl();
               }
            }
            else if (this.id == "clearText")
            {
               if (isEditableInputEl)
               {
                  Bee.Input.clear(srcEl);
               }
            }
         }
         else
         {  //console.log(e.target);
            e.preventDefault();
         }
      }, false);
   }

})(Bee.utils, Bee.Array, Bee.String, Bee.Dom);

//TODO : showing submenus with js instead of css (requires dom recursive traversing)
//TODO : issue with creating enough room for sub menus to show (on the opposite side of the menus)
//TODO : Inserting and showing sub menus from temporary menu items
//FIXME: issue #201 with pasting from system clipboard
//FIXME: issue #203 with inserting and removing(after hiding [all temporary items list]) context Menu item from srcEl
//TODO : Show only when there is has-context menu attrib on srcEL
//TODO : ADD all menu items from context(aka src el) bundle all edit-menus() in one directive b4 showing menu
//TODO : e.g data-hasctxmenu="edit|
//                                 78,Show all,link or function to call,CTRL+U,divideB4|
//                                 &#7759;,Hide all,link or function to call,CTRL+ALT+H,false",
// should cr8 menu with eidt items and the remaining custom items
//TODO : IF space on right of menu is not enough to show submenu, position sub menu on left
//TODO: Remove all menu Items after ctx menu hide


