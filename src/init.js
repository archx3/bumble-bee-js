/**
 * Created by ARCH on 19/07/2016.
 */
window.onload = function ()
{
   let Bu = Barge.utils,
       Ba = Barge.Array,
       Bd = Barge.Dom,
       Be = new Barge.Event.EventManager();

   var theme      = document.body.getAttribute("data-theme") !== "" ? document.body.getAttribute("data-theme") : "light",
       i = 0, len = 0;

   var allInputEls = Barge.utils.getElementsByName("input");

   /*function _isTextInput(input)
    {
    return input.type.toLowerCase() == "text";
    }*/

   //var textInputExists = false;

   //textInputExists =

   Barge.KEYBOARD_CAN_SHOW = Barge.utils.someOf(allInputEls, function _isTextInput(input)
   {
      return input.type.toLowerCase() === "text";
   });

   if (Bd.getEl("#bdayWishCloseBtn") !== undefined)
   {
      let bdayCloseBtn = Bd.getEl("#bdayWishCloseBtn");

      Be.bindOnce(bdayCloseBtn, "click", function (e)
      {
         Bd.closeWin(e.target.parentElement.parentElement, true, true);

         Barge.Cookies.set("birthdayWishSeen", true);
      });
   }

   if (Barge.utils.gebi("helpAbout") !== undefined)
   {
      var abt = Barge.utils.gebi("helpAbout");
      var abtImg = Barge.utils.gebi("helpAboutImg");
      var dragObject8 = new Barge.Drag.Movable(abt);
      var acBtn = Barge.utils.gebi("aboutCloseBtn");

      /*if(Barge.utils.gebi("showMeAbout") !== undefined)
       {
       var sma = Barge.utils.gebi("showMeAbout");
       sma.onclick = function()
       {
       Barge.utils.toggleDisplay(abt);
       };
       }*/

      if (Barge.utils.gebi("showMeAboutD") !== undefined)
      {
         var smaD = Barge.utils.gebi("showMeAboutD");
         smaD.onclick = function ()
         {
            Barge.utils.toggleDisplay(abt);
         };
      }

      acBtn.onclick = function ()
      {
         Barge.utils.closeWin(abt, false, false);
      };

      abtImg.onmousedown = function (e)
      {
         var evt = e || window.event;
         evt.preventDefault()
      };

      window.addEventListener("mouseup", function (e)
      {
         if (Barge.utils.getDisplayState(abt) === 1)
         {
            if (abt.contains(e.target) === false && e.target !== abt)
            {
               Barge.utils.closeWin(abt);
               // document.removeEventListener("click");
            }
         }
      });
   }

   if (Barge.utils.gebi("osk") !== undefined)
   {
      if (Barge.utils.gebi("oskButD") !== undefined || Barge.utils.gebi("oskBut") !== undefined)
      {
         var dma = Barge.utils.gebi("oskButD");
         var mma = Barge.utils.gebi("oskBut");

         var osk = Barge.utils.gebi("osk");
         var dragObject9 = new Barge.Drag.Movable(osk);
         var oskClBtn = Barge.utils.gebi("oskCloseBtn");

         dma.onclick = function ()
         {
            if (!this.classList.contains("disabled"))
            {
               if (Barge.KEYBOARD_CAN_SHOW)
               {
                  Bu.toggleDisplay(osk);
               }
               else
               {
                  Barge.DiceyDialog.confirm({
                                               t : "Virtual keyboard failed to launch",
                                               m : "No text input control on current interface",
                                               i : "f",
                     primaryBtnNumber : 1
                                            });
               }
            }
         };

         if (mma)
         {
            mma.onclick = function ()
            {
               if (!this.classList.contains("disabled"))
               {
                  if (textInputExists)
                  {
                     Bu.toggleDisplay(osk);
                  }
                  else
                  {
                     Barge.DiceyDialog.confirm({
                                                  t : "Sorry, virtual keyboard failed to launch",
                                                  m : "No text input control on current interface", i : "f"
                                               });

                  }
               }
            };
         }

         oskClBtn.onclick = function ()
         {
            Bd.closeWin(osk, false, false);
         };
      }
   }

   /*if(document.querySelectorAll("button[type='submit']")[0] != undefined)
    {
    var submitButtons = document.querySelectorAll("button[type='submit']");
    for (var z = 0; z < submitButtons.length; z++)
    {
    (function (i)
    {
    submitButtons[i].addEventListener("click", function ()
    {
    console.log("clicked");
    submitButtons[i].innerHTML = "Please Wait...";
    // submitButtons[i].disabled = true;
    submitButtons[i].classList.add("disabled");

    console.log(submitButtons[i].innerHTML);
    })
    })(z);

    }
    }*/

   var restrictions = [
      "data-max",
      "data-maxLen",
      "data-type",
      "data-tooltip",
      "data-hint",
      "data-modernToolTip"];

   //looping through arr to call the appropriate method or instantiate the appropriate constructor

   Ba.forEach(restrictions, function (restriction, i)
   {
      let myVar = null;
      if (Bd.getElementsByAttribute(restriction, true) !== undefined)
      {

         switch (restriction)
         {
            case "data-max" :
            {
               myVar = Barge.Input.dataMax();
               break;
            }
            case "data-maxLen" :
            {
               myVar = Barge.Input.dataMaxLength();
               break;
            }
            case "data-type":
            {
               myVar = Barge.Input.dataType();
               break;
            }
            case "data-tooltip":
            {
               myVar = new Barge.Barbecue.tip();
               break;
            }
            case "data-hint":
            {
               myVar = new Barge.Barbecue.hint();
               break;
            }
            case "data-modernToolTip":
            {
               var barbecue = new Barge.Barbecue.modernTip(0, -12);
               // delete Barge.Barbecue.modernTip();
               break;
            }
            default :
            {
               myVar = null;
            }

            //reassigning the myVar variable bcos data will not kpt i
         }

      }
   });

   if (document.images[0] !== undefined)
   {
      if (Barge.Bursty !== undefined)
      {
         //if(!im)
         //{
         //console.log(theme);
         //Barge.Bursty.BulgeImage(theme.toString());
         Barge.Bursty.PopImage(theme.toString());
         //}

         var xx = new Barge.Bursty.window();
      }

      if (Barge.Image !== undefined)
      {
         Barge.Image.insertGenericAvatar("../../uploads/defaultImage.png", "../../uploads/defaultAvatar.png");
      }
   }

   if (document.getElementsByClassName("styleSwitchBtn") !== undefined)
   {
      var styleSwitchBtns = document.getElementsByClassName("styleSwitchBtn");

      for (i = 0; i < styleSwitchBtns.length; i++)
      {
         styleSwitchBtns[i].addEventListener("click", function ()
         {
            var theme = this.getAttribute("data-theme") !== "" ? this.getAttribute("data-theme") : "cssWhiteTheme";
            if (this.classList.contains("gridBtn") && this.classList.contains("btnWhite"))
            {
               newSetActiveStyleSheet('../' + theme + '/mySubjectsGrid.css');
               Bd.addClass(this, "btnInvert");
               Bd.removeClass(this, "btnWhite");
               Bd.addClass(styleSwitchBtns[1], "btnWhite");
               Bd.removeClass(styleSwitchBtns[1], "btnInvert");
            }
            else if (this.classList.contains("listBtn") && this.classList.contains("btnWhite"))
            {
               newSetActiveStyleSheet('../' + theme + '/mySubjectsList.css');
               Bd.addClass(this, "btnInvert");
               Bd.removeClass(this, "btnWhite");
               Bd.addClass(styleSwitchBtns[0], "btnWhite");
               Bd.removeClass(styleSwitchBtns[0], "btnInvert");
            }
         })
      }
   }

   // for turning off and on, the save grades button
   var me = document.getElementById("savG");
   //if(document.getElementById("savG") !== null)
   //{
   //   window.addEventListener("mouseover", function ()
   //   {   //console.log("change");
   //      for (var g = 0; g < grades.length; g++)
   //      {
   //         if(grades[g].value == "" || grades[g].value == " " ||
   //            grades[g].value == 0 || midTerms[g].value == "" ||
   //            midTerms[g].value == " " || exams[g].value == "" ||
   //            exams[g].value == " ")
   //         {
   //            me.disabled = true;
   //            if(!me.classList.contains("disabled"))
   //            {
   //               me.classList.add("disabled");
   //            }
   //            break;
   //         }
   //         else
   //         {
   //            me.disabled = false;
   //            me.classList.remove("disabled");
   //         }
   //      }
   //   });
   //}

   let dlgEls = Bd.getElementsByAttribute("data-dlg");

   //for dialogs that redirect
   if (Bu.defined(dlgEls[0]))
   {
      Bu.forEach(dlgEls, function (el, i)
      {
         let props = el.getAttribute("data-dlg").split(",");
         el.addEventListener("click", function (e)
         {
            //[0]->title, [1]->message, [2]->url, [3]->icon, [4]->ajax {Boolean<true|1>}, [5]->show loading screen {Boolean<true|1>}
            //console.log(props);
            Barge.DiceyDialog.confirm({
                                         t    : props[0] ? props[0] : "",
                                         m  : props[1] ? props[1] : "",
                                         onAffirm : function ()
                                         {
                                            if (Bu.defined(props[2]))
                                            {
                                               Bu.redirectTo(props[2]);
                                            }
                                         },
                                         i     : props[3] ? props[3] : ""
                                      })
         });

         el.removeAttribute("data-dlg");
      });

   }

   let redirEls = Bd.getElementsByAttribute("data-redir");

   if (Bu.defined(redirEls[0]))
   {
      Bu.forEach(redirEls, function (el, i)
      { let url = el.getAttribute("data-redir");
         el.addEventListener("click", function (e)
         {
            Bu.redirectTo(url);
         });

         el.removeAttribute("data-redir");
      });

   }

   //for ajax popup image and the special kind popup image div
   var attribute = Bu.gebi("desktop").getAttribute("data-ax");
   if (attribute !== null && attribute === "true")
   {
      var winEl = Bu.gebi("popupImageDiv");
      var winEl2 = Bu.gebi("popImageDiv");

      if (winEl)
      {
         Bd.removeEl(winEl);
      }
      if (winEl2)
      {
         Bd.removeEl(winEl2);
      }
   }

   if (Bu.defined(Bd.getElementsByAttribute("data-sbtn")[0]))
   {
      var sbtn = new Bd.surrogateButton();
   }

   //var useSidebar = document.head.getAttribute('data-toolboxtype');
   //
   //if(useSidebar === "sidebar")
   //{
   //   var sb = document.querySelector("#sidebar");
   //   var sb2 = document.querySelector("#sidebar2");
   //
   //   Ps.initialize(sb, {suppressScrollX : true});
   //   Ps.initialize(sb2, {suppressScrollX : true});
   //}

   /*var sc = Barge.utils.gebi("logListscrollableContainer");
    console.log(sc);
    if(Barge.utils.defined(sc))
    {
    Ps.initialize(sc, {suppressScrollX : true});
    }*/
};

/*http://jetbrains.tencent.click*/