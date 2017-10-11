/**
 * Created by arch on 06/18/16.
 * @Copyright (C) 2016 Barge Studios <bargestd@gmail.com>
 * @Version 1.7.2
 */
var Barge = Barge || {};

(function(Bu)
{
   /**
    * @deprecated
    * @type {{t}}
    */
   Barge.Dialog =
   {
      /**
       *this API creates a light themed confirm dialog that redirects to a certain page
       * @param title Dialog Title {string}
       * @param loc
       * @param msg
       * @param btn1Text button Label {string}
       * @param btn2Text button Label {string}
       * @param icon warning|info|question|ok {string}
       * @deprecated
       */
      lightRedirectConfirm : function (title, loc, msg, btn1Text, btn2Text,icon)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderBoolConfirm('light',title, loc, msg, btn1Text,btn2Text,icon));
         }
      },
      /**
       *this API creates a dark themed confirm dialog that redirects to a certain page
       * @param title Dialog Title {string}
       * @param loc
       * @param msg
       * @param btn1Text button Label {string}
       * @param btn2Text button Label {string}
       * @param icon warning|info|question|ok {string}
       * @deprecated
       */
      darkRedirectConfirm : function (title, loc, msg, btn1Text, btn2Text,icon)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderBoolConfirm('dark',title, loc, msg, btn1Text,btn2Text,icon));
         }

      },

      lightRedirectAlert : function (title, loc, btn1Text, btn2Text)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderBoolAlert('light',title, loc, btn1Text,btn2Text));
         }

      },
      darkRedirectAlert : function (title, loc, btn1Text, btn2Text)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderBoolAlert('dark', title, loc, btn1Text, btn2Text));
         }
      },
      /**
       * @use this API creates a light themed alert dialog
       * @param title Dialog Title{string}
       * @param btnText button Label {string}
       * @param handler name of function to execute {string}
       * @deprecated
       */
      lightAlert : function(title, btnText, handler)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderAlert('light',title, btnText, handler));
         }
      },
      /**
       * this API creates a dark themed alert dialog
       * @param title Dialog Title{string}
       * @param btnText button Label {string}
       * @param handler name of function to execute {string}
       * @deprecated
       */
      darkAlert : function(title, btnText, handler)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderAlert('dark', title, btnText, handler));
         }
      },
      /** @USE: the following method creates an confirm dialog
      *@PRE: takes as srcInputEl, a string dialog title(may be the message),
      *@PRE: then a string dialog message,
      * two optional string button label, and the name of a function that should be executed(a string without parenthesis)
      */
      /**
       *this API creates a light themed confirm dialog
       * @param title Dialog Title {string}
       * @param msgText Message to display {string}
       * @param btn1Text button Label {string}
       * @param btn1Handler function name{string}
       * @param btn2Text button Label {string}
       * @param btn2Handler unction name {string}
       * @param icon warning|info|question|ok {string}
       * @deprecated
       */
      lightConfirm : function(title, msgText, btn1Text, btn1Handler, btn2Text, btn2Handler,icon)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderConfirm('light', title, msgText, btn1Text, btn1Handler, btn2Text, btn2Handler,icon));
         }
      },
      /**
       *this API creates a dark themed confirm dialog
       * @param title Dialog Title {string}
       * @param msgText Message to display {string}
       * @param btn1Text button Label {string}
       * @param btn1Handler function name{string}
       * @param btn2Text button Label {string}
       * @param btn2Handler unction name {string}
       * @param icon warning|info|question|ok {string}
       * @deprecated
       */
      darkConfirm : function(title, msgText, btn1Text, btn1Handler, btn2Text, btn2Handler,icon)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderConfirm('dark', title, msgText, btn1Text, btn1Handler, btn2Text, btn2Handler,icon));
         }
      },
      /**
       *this API creates a light themed confirm dialog
       * @param title Dialog Title {string}
       * @param msgText Message to display {string}
       * @param btn1Text button Label {string}
       * @param btn1Handler function name{string}
       * @param btn2Text button Label {string}
       * @param btn2Handler unction name {string}
       * @returns {*}
       */
      lightPrompt : function(title, msgText, btn1Text, btn1Handler, btn2Text, btn2Handler)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderPrompt('light', title, msgText, btn1Text, btn1Handler));
            console.log(_("msgInput").value);
            return Bu.gebi("msgInput").value;
         }
      },
      /**
       *this API creates a dark themed confirm dialog
       * @param title Dialog Title {string}
       * @param msgText Message to display {string}
       * @param btn1Text button Label {string}
       * @param btn1Handler function name{string}
       * @param btn2Text button Label {string}
       * @param btn2Handler unction name {string}
       * @returns {*}
       */
      darkPrompt : function(title, msgText, btn1Text, btn1Handler, btn2Text, btn2Handler)
      {
         if(!Bu.gebi("msgBx"))
         {
            document.body.appendChild(_generateOverlay());
            document.body.appendChild(_renderPrompt('dark', title, msgText, btn1Text, btn1Handler));
            console.log(Bu.gebi("msgInput").value);
            return Bu.gebi("msgInput").value;
         }
      }
   };
   //region LightCss
   var whiteCss = "section{ width: 100%; height: 100%; overflow: hidden;}"+
      ".overlay{z-index: 200; position: absolute; top:0;  background-color: #fff;  opacity: .8; display: none;}"+
      "#msgBx{min-width: 350px; height:auto; position: absolute; top:20%; left:40%; z-index: 201; /*cursor:move;*/  background-color:#fff; border:1px solid #ccc; border-radius:3px; box-shadow: 0 2px 6px rgba(46, 50, 61," +
      " 0.36); margin:0 auto; text-align:"+ " center;  overflow:hidden; user-select:none -moz-user-select:none; -webkit-user-select:none;}"+
      "#msgTitle, #msgFoot{   width:100%; height:50px;overflow:inherit;}"+
      "#msgTitle{height:35px;text-align:left;border-bottom:1px solid #e6e6e6;pointer-events: none;}"+
      "#msgTitle h1{display:inline-block;font-weight: normal;margin-left: 10px; font-size: 19px;line-height: 1.7;}"+
      ".closeBtn{height: 24px;width: 24px;float:right;background: transparent;font-size: 20px;cursor: pointer;opacity: .5;border: none;padding: 0;margin-right: 0; pointer-events:all;}"+

      ".closeBtn:hover{opacity:1; box-shadow:none;}"+
      "#msgContent{clear:both;width:100%;height:auto;border-bottom:1px solid #e6e6e6;padding:5px;}"+
      "#msgContent p{margin: 10px 0; height: auto; min-height:25px; max-height: 50px;}"+
      "#msgContent #msgContentIconDiv{width:60px; float:left;}"+
      "#msgContent div{height:100%}"+
      "#msgContent #msgContentTextDiv{width: calc(100% - 60px);}"+
      "#msgContent srcInputEl{width:100%;border:1px solid #ccc;border-radius:3px;padding:4px;margin-bottom: 3px;background-color: #ccc;}"+
      "#msgContent .msgIcon{font-family: 'segoe mdl2 Assets', sans-serif;vertical-align: middle;font-size: 35px;width: auto;height: auto;border-radius: 50%;}"+
      "#msgContent .msgIconQues{color: #00a5ff;background-color: #e7f8ff;padding: 5px;font-size: 20px;border: 2px solid #00a5ff;margin-right: 15px; font-weight:600;}"+
      "#msgFoot{background-color: #fcfcfc;}"+
      ".msgBxBtns{height: 30px;width: auto;min-width: 80px;padding: 0 8px;margin: 9px;border:1px solid #ddd;border-radius:3px;background-color:#F5F5F5;color: #444;font-size: 15px;font-weight: bold;cursor:pointer;}"+
      ".msgBxBtns:hover{border:2px solid #444;}.defaultBtn{/*background-color:#0062f5;*/}.defaultBtn:hover{/*background-color:#1fa0f5;*/}" +
      "button.primary{border:2px solid #0078ff}";
   //endregion

   //region dark css
   var blackCss = "section{width: 100%;height: 100%;overflow: hidden;}"+
      ".overlay{z-index: 200;position: absolute;top:0;background-color: #000;opacity: .7;display: none;}"+
      "#msgBx{min-width: 350px;height:auto;position: absolute;top:25%;left:40%;z-index: 201; /*cursor:move;*/ background-color:#1C2126;border:1px solid #000000;border-radius:4px;margin:0 auto;text-align: center;overflow:hidden; user-select:none; -moz-user-select:none; -webkit-user-select:none;}"+
      "#msgTitle, #msgFoot{width:100%;height:50px;overflow:inherit;}"+
      "#msgTitle{height:35px;text-align:left;border-bottom:1px solid #171717;pointer-events: none;}"+
      "#msgFoot{border-top:1px solid #343c45;}"+
      "#msgTitle h1{display:inline-block;font-size:20px;font-weight: normal;margin-left: 10px;color:#aaa;}"+
      ".closeBtn{height: 24px;width: 24px;float:right;background: transparent;font-size: 20px;cursor: pointer;opacity: .5;color: #fff;padding: 0;margin-right: 0;margin-bottom: 0; border:0; pointer-events:all;}"+
      ".closeBtn:hover{opacity:1;}"+
      "#msgContent{clear:both;width:100%;height:auto;border-top:1px solid #343c45;border-bottom: 1px solid #171717;padding:5px;}"+
      "#msgContent p{margin: 10px 0; height: auto; min-height:25px; max-height: 50px; color:#fff;}"+
      "#msgContent srcInputEl{width:100%;border:1px solid #171717;border-radius:3px;padding:4px;margin-bottom: 3px;background: #a2a5a7;}"+
      "#msgContent #msgContentIconDiv{width:60px; float:left;}"+
      "#msgContent div{height:100%}"+
      "#msgContent #msgContentTextDiv{width: calc(100% - 60px);}"+
      "#msgContent .msgIcon{font-family: 'segoe mdl2 Assets', sans-serif;vertical-align: middle; font-size: 35px;width: auto;height: auto;border-radius: 50%;}"+
      "#msgContent .msgIconQues{color: #00a5ff;background-color: #e7f8ff;padding: 5px;font-size: 20px;border: 2px solid #00a5ff;margin-right: 15px; font-weight:600;}"+
      ".msgBxBtns{height: 100%;width:49.3%;min-width: 80px; margin:0;/*padding: 0 8px;*//*margin-top: 9px;*//*border:1px solid #ddd;*//*border-radius:3px;*/background-color: transparent;font-size: 15px;font-weight: bold;color:#f3f3f3;cursor:pointer;}"+
      ".msgBxBtns:hover{background-color: #444;}"+
      ".defaultBtn{ /*background-color:#0062f5;*/ }"+
      ".defaultBtn:hover{ /*background-color:#1fa0f5;*/}" +
      "button.primary{border:1px solid #0078ff}";
   //endregion
   function _generateOverlay()
   {
      var msgBackTint = document.createElement("section");
      msgBackTint.style.display = "block";
      msgBackTint.id = "msgBxOverlay";
      msgBackTint.className = "overlay";

      msgBackTint.onmousedown = function (e)
      {
        e.preventDefault();
      };

      return msgBackTint;
   }

   function _closeDialogBox(btn)
   {
      Bu.closeWin(btn.parentElement.parentElement, "remove", true);
      Bu.closeWin(Bu.gebi("msgBxOverlay"), "remove", true);
      Bu.closeWin(Bu.gebi("dialogStyle"), "remove", true);
      window.removeEventListener("keydown",_closeDialogBox, false)
   }

   function _generateHeading(title)
   {
      var msgTitleDiv = document.createElement("div");
      msgTitleDiv.id = "msgTitle";

      var msgHeading = document.createElement("h1");
      msgHeading.innerHTML = title.toString();

      var msgCloseBtn = document.createElement("button");
      msgCloseBtn.className = "closeBtn";
      msgCloseBtn.innerHTML = "&times;";
      msgCloseBtn.addEventListener("click", function()
      {
         _closeDialogBox(this);
      });

      msgTitleDiv.appendChild(msgHeading);
      msgTitleDiv.appendChild(msgCloseBtn);

      window.addEventListener("keyup", function (e)
      {
       if(e.keyCode == 27)// escape key
       {
          msgCloseBtn.click();
       }
      });
      return msgTitleDiv;
   }

   /**
    *
    * @param icon
    * @param lod
    * @returns {string}
    * @private
    */
   function _gererateIcon(icon, lod)
   {
      var myIcon = "";
      if(icon === "warning" || icon === "alert")
      {
         if(lod !== undefined && lod === "dark")
         {
            myIcon = "<span class='msgIcon' style='color: #fff;'>&#xE814;</span>";
         }
         else
         {
            myIcon = "<span class='msgIcon' style='color: #f00;'>&#xE814;</span>";
         }
      }
      else if(icon === "info")
      {
         myIcon = "<span class='msgIcon' style='color: #00a5ff;'>&#xE946;</span>";
      }
      else if(icon === "question")
      {
         /*msgContentPara.innerHTML = "<span class='msgIcon msgIconQues' style='color: #00a5ff; background-color: #e7f9ff;'>&#xE11B;</span>" + message.toString();*/
         myIcon = "<span class='msgIcon msgIconQues' style='color: #ffc600; background-color: rgba(255, 253, 209, 1);border-color: #ffc600'>&#xE11B;</span>";
      }
      else if(icon === "ok")
      {
         myIcon = "<span class='msgIcon' style='color: #04e704; background-color: #e8ffe7'>&#xE930;</span>";
      }
      else if(icon === "failure")
      {
         myIcon = "<span class='msgIcon' style='color: #f00; background-color: #ffe7e7'>&#xEA39;</span>";
      }
      else if(icon === "delete")
      {
         myIcon = "<span class='msgIcon' style='color: #f00; background-color: #ffe7e7'>&#xE74D;</span>";
      }
      else
      {
         myIcon = "";
      }

      return myIcon;
   }

   function _generateMsgContent(message, prompt, icon, lod)
   {
      var msgContentDiv = document.createElement("div");
      msgContentDiv.id = "msgContent";

      var msgContentPara = null, content;
      if(message)
      {
         // msgContentPara = document.createElement("p");

         if(icon)
         {
            content = "<div id='msgContentIconDiv'>" + _gererateIcon(icon, lod) +"</div>" +
                      " <div id='msgContentTextDiv'> <p>"+ message+"</p></div>";

            msgContentDiv.innerHTML = content;

         }
         else
         {
            msgContentPara = document.createElement("p");
            msgContentPara.innerHTML = message;

            msgContentDiv.appendChild(msgContentPara);
         }
         //imhere
      }
      else
      {

         throw new Error ("missing message");
      }
      //
      if(prompt && prompt === "prompt")
      {
         var msgInput = document.createElement("srcInputEl");
         msgInput.type = "text";
         msgInput.id = "msgInput";
         msgContentDiv.appendChild(msgInput);
         msgInput.setAttribute("draggable","false");
      }
      return msgContentDiv;
   }

   function _generateFoot(lod, btn1Text, btn1Handler, btn2Text, btn2Handler, redi , loc)
   {  //todo button handlers to exec
      var msgFootDiv = document.createElement("div");
      msgFootDiv.id = "msgFoot";

         var msgButton1 =  Bu.createEl('button',
            { id:'msgButton1',   className : "msgBxBtns",   innerHTML : btn1Text ? btn1Text : "OK"},
            { width : (lod && lod == 'light' ? 40 + "%" : 100 + "%") });

      /*document.createElement("button");
         msgButton1.id = "msgButton1";
         msgButton1.innerHTML = btn1Text ? btn1Text : "OK";
         msgButton1.className = "msgBxBtns";



         if(lod == "light")
         {
            msgButton1.style.width = 40 + "%";
         }
         else
         {
            msgButton1.style.width = 100 + "%";
         }*/
         msgFootDiv.appendChild(msgButton1);

         /*msgButton1.autofocus = true;
         msgButton1.focus();
         document.activeElement = msgButton1;
         document.hasFocus = msgButton1;*/
         //console.log(document.activeElement);

         msgButton1.onclick = function()
         {
            if(!redi)
            {
               _buttonHandler(this,btn1Handler);
            }
            else
            {
               _buttonHandler(this,false,true, loc);
            }
         };

         var msgButton2 = document.createElement("button");
      if(redi)
      {
         msgButton2.className = "msgBxBtns";
         if(lod == "light")
         {
            msgButton1.style.width = 37 + "%";
            msgButton2.style.width = 37 + "%";
         }
         else
         {
            msgButton1.style.width = 49.3 + "%";
            msgButton2.style.width = 49.3 + "%";
         }

         msgButton2.innerHTML = btn2Text ?  btn2Text : "CANCEL";
         msgButton1.classList.add("primary");
         msgFootDiv.appendChild(msgButton2);
         msgButton2.onclick = function()
         {
            if(!redi)
            {
               _buttonHandler(this,btn2Handler);
            }
            else
            {
               _buttonHandler(this,false,false, '');
            }
         };
      }
      else if(btn2Text)
      {
         msgButton2.className = "msgBxBtns";
         if(lod == "light")
         {
            msgButton1.style.width = 37 + "%";
            msgButton2.style.width = 37 + "%";
         }
         else
         {
            msgButton1.style.width = 49.3 + "%";
            msgButton2.style.width = 49.3 + "%";
         }

         msgButton2.innerHTML = btn2Text ?  btn2Text : "CANCEL";
         msgFootDiv.appendChild(msgButton2);
         msgButton2.onclick = function()
         {
            if(!redi)
            {
               _buttonHandler(this,btn2Handler);
            }
            else
            {
               _buttonHandler(this,false,true, loc);
            }
         };
      }

      window.addEventListener("keydown", function (e)
      {

         if(e.keyCode == 13)// enter key
         {
            e.preventDefault();
            if(msgButton2.classList.contains("primary"))
            {
               msgButton2.click();
               //window.removeEventListener("keydown", el);
            }
            else if(msgButton1.classList.contains("primary"))
            {
               msgButton1.click();
               //window.removeEventListener("keydown", el)
            }
            //document.hasFocus.click();
            console.log("enter key pressed");
         }
         else if(e.keyCode == 37 || e.keyCode == 40)// left and down key
         {
            e.preventDefault();
            if(!msgButton1.classList.contains("primary"))
            {
               msgButton1.classList.add("primary");
            }
            if(msgButton2.classList.contains("primary"))
            {
               msgButton2.classList.remove("primary");
            }
         }
         else if(e.keyCode == 39 || e.keyCode == 38) // right n up key
         {
            e.preventDefault();
            if(!msgButton2.classList.contains("primary"))
            {
               msgButton2.classList.add("primary");
            }
            if(msgButton1.classList.contains("primary"))
            {
               msgButton1.classList.remove("primary");
            }
         }
      });

      return msgFootDiv;
   }

   function _renderAlert(lod, title, btn1Text, btn1Handler)
   {
      _renderLightOrDarkCss(lod);
      var msgBx = document.createElement("div");
      msgBx.id = "msgBx";
      var dragObject1 = new Barge.Drag.Movable( msgBx);

      msgBx.appendChild(_generateHeading(title));
      msgBx.appendChild(_generateFoot(lod, btn1Text, btn1Handler));

      return msgBx;
   }
   function _renderPrompt(lod, title, messageText, btn1Text, btn1Handler)
   {
      _renderLightOrDarkCss(lod);
      var msgBx = document.createElement("div");
      msgBx.id = "msgBx";
      var dragObject2 = new Barge.Drag.Movable( msgBx);

      msgBx.appendChild(_generateHeading(title));
      msgBx.appendChild(_generateMsgContent(messageText, "prompt"));
      msgBx.appendChild(_generateFoot(lod, btn1Text, btn1Handler));

      return msgBx;
   }

   function _renderConfirm(lod, title, messageText, btn1Text, btn1Handler, btn2Text, btn2Handler,icon)
   {
      _renderLightOrDarkCss(lod);
      var msgBx = document.createElement("div");
      msgBx.id = "msgBx";
      var dragObject3 = new Barge.Drag.Movable( msgBx);

      msgBx.appendChild(_generateHeading(title));
      msgBx.appendChild(_generateMsgContent(messageText,false,icon,lod));
      msgBx.appendChild(_generateFoot(lod, btn1Text, btn1Handler, btn2Text, btn2Handler));

      return msgBx;
   }
   /**
    *
    * @param lod
    * @param title
    * @param loc
    * @param msg
    * @param btn1Text
    * @param btn2Text
    * @param icon
    * @returns {Element}
    * @private
    */
   function _renderBoolConfirm(lod, title, loc, msg,  btn1Text ,btn2Text, icon)//todo this is where i am
   {
      _renderLightOrDarkCss(lod);
      var msgBx = document.createElement("div");
      msgBx.id = "msgBx";
      var dragObject4 = new Barge.Drag.Movable( msgBx);
      msgBx.appendChild(_generateHeading(title));
      msgBx.appendChild(_generateMsgContent(msg, false, icon));
      msgBx.appendChild(_generateFoot(lod, btn1Text, false, btn2Text, false, true, loc));

      return msgBx;
   }
   function _renderBoolAlert(lod, title, loc, btn1Text ,btn2Text)//todo this is where i am
   {
      _renderLightOrDarkCss(lod);
      var msgBx = document.createElement("div");
      msgBx.id = "msgBx";
      var dragObject4 = new Barge.Drag.Movable( msgBx);
      msgBx.appendChild(_generateHeading(title));
      msgBx.appendChild(_generateFoot(lod, btn1Text, false, btn2Text, false, true, loc));

      return msgBx;
   }

   function _renderLightOrDarkCss(lod)
   {
      var dialogStyle = document.createElement("style");
      dialogStyle.id = "dialogStyle";
      if(lod == "light")
      {
         dialogStyle.innerHTML = whiteCss;
         document.head.appendChild(dialogStyle);
         return false;
      }
      else
      {
         dialogStyle.innerHTML = blackCss;
         document.head.appendChild(dialogStyle);
      }
   }
   //
   /**
    * @use handles button click events
    * @param btn
    * @param btnHandler
    * @param redirect
    * @param loc
    * @returns {boolean}
    * @private
    */
   function _buttonHandler(btn, btnHandler, redirect, loc)
   {

      if((redirect && redirect !== undefined) && (typeof loc === "string" && loc !== ""))
      {
         window.location.assign(loc);// todo test
         _closeDialogBox(btn);
         return false;
      }
      else if(btnHandler !== undefined && typeof (btnHandler) === "string")
      {
         window[btnHandler](); // todo test
         _closeDialogBox(btn);
         return false;
      }
      _closeDialogBox(btn);

}
})(Barge.utils);

//_makeDraggable("msgBx");

/**
 * @Change-Log
 * @Date  15-08-16 : Implemented correct Redirect Confirm from refactoring
 * @since V.1.3
 * @Date  21-08-16 : Added Icons
 * @Date  27-08-16 : Enter button support for primary button
 * @Date  07-09-16 : Added delete Icon to icon set
 * @Date  08-09-16 : made the html generator functions private
 * @Date  08-09-16 : fixed issue with body and foot drag on move instead of head only[DONE]
 * @Date  25-09-16 : Wrapped code in IIFE to avoid namespace collision
 * @Date  29-09-16 : Added Full Keyboard Support for Dialog including escape key for closing and arrow keys for switching pri btn
 * @Date  01-10-16 : Fixed issue with no fade if any button except the close button is pressed
 * @Date  02-10-16 : Fixed issue with scrolling elements in main body when arrow keys are pressed {PROBLEMATIC}
 * Finished by Arch on 02/10/16.
 */

/*TODO externalise css to avoid typing light and dark in front of fn name
* TODO Make the options and object instead of having to type long, evasive params
* TODO Fix issues with icon and  message co-existence [-> partially DONE]
* */