/**
 * Created by ARCH on 19/05/2016.
 *  * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <admin@bargestd.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Barge Studios Eula
 *  you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 *     http://www.bargestudios.com/bumblebee/licence
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function (Bu)
{
   /**
    * Where the text will be inserted
    * @type {null | Element<INPUT>}
    */
   var inputTargetEl     = null,

       /**
        * this is the internal clipboard
        * @type {string}
        * * @ignore
        * @deprecated no more used due to ability to manage selection w/ {@link Bu.}
        */
       selectionBuffer   = "",

       /**
        * @type {boolean}
        */
       isEditableInputEl = false,

       /**
        *
        * @type {boolean}
        */
       notNumericInput   = true,

       /**
        * iteration counter
        * @type {number}
        * @ignore
        * @deprecated no more used due to intro of event management w/o looping
        */
       i                 = 0,

       /**
        * iterable length cache
        * @type {number}
        * @ignore
        * @deprecated no more used due to intro of event management w/o looping
        */
       len               = 0;

      /**
       * All the keyBoard keys
       * @type {NodeList}
       */
   var keys     = document.querySelectorAll("#osk .key"),

       /**
        * All the keyBoard shift keys
        * @type {NodeList}
        */
       shiftKey = document.querySelectorAll("#osk .shiftKey"),
       /**
        * the capsLock key
        * @type {Element}
        */
       capsLock = document.querySelector("#capsLock");

   //modifier keys activation flag
      /**
       *
       * @type {boolean}
       */
   var capsLockOn = false,
       /**
        *
        * @type {boolean}
        */
       shiftPressed = false,

       /**
        *
        * @type {boolean}
        */
       ctrlPressed = false,

       /**
        *
        * @type {boolean}
        */
       altPressed = false;

   /**
    *
    * @returns {string}
    * @deprecated
    */
   var getSelectionText = function ()
   {
      var text = '';

      if (window.getSelection)
      {
         text = window.getSelection().toString();
         return text;
      }
      else if (document.selection && document.selection.type !== 'Control')
      {
         text = document.selection.createRange().text;
      }
      return text;
   };

   /**
    *
    * @type {Barge.Event.EventManager}
    */
   var Be = new Barge.Event.EventManager();

   /**
    *
    * @type {NodeList}
    */
   var inputEls = document.getElementsByTagName("INPUT");

   if (inputEls)
   {
      //add a mouse down evt to all the input Els
      //TODO mk sure

      Be.bindOnAll(inputEls, 'mousedown', function (event)
      {
         //console.log("resize");//console.log(event.button);//console.log(event.which);
         inputTargetEl = event.target;
         notNumericInput = inputTargetEl.getAttribute("data-type") !== "number,*";

         inputTargetEl = inputTargetEl ? inputTargetEl : document.body;
         isEditableInputEl = !!(inputTargetEl.tagName.toLowerCase() === "textarea" ||
         ( inputTargetEl.tagName.toLowerCase() === "input" && inputTargetEl.type === "text"));

      });

   }

   /**
    *
    * @type {NodeList}
    */
   var textAreaEls = document.getElementsByTagName("TEXTAREA");

   if (textAreaEls)
   {

      Be.bindOnAll(textAreaEls, "mousedown", function (event)
      {//console.log("resize");//console.log(event.button);//console.log(event.which);

         inputTargetEl = event.target;
         notNumericInput = inputTargetEl.getAttribute("data-type") !== "number,*";

         inputTargetEl = inputTargetEl ? inputTargetEl : document.body;

         isEditableInputEl =
            (inputTargetEl.tagName.toLowerCase() === "textarea" ||
             ( inputTargetEl.tagName.toLowerCase() === "input" && inputTargetEl.type === "text"));
      });
   }

   /*var srcInputEl = document.querySelector("#inpee");*/

   //console.log(keys[0]);

   Be.bindOnAll(keys, "mouseup", function (event)
   {
      /*srcInputEl.focus();*/
      if ((inputEls[0] !== undefined || textAreaEls[0] !== undefined) && inputTargetEl !== null)
      {

         var inputVal = null;
         if (inputTargetEl.tagName.toLowerCase() === "textarea")
         {
            inputVal = inputTargetEl.innerHTML;
         }
         else
         {
            inputVal = inputTargetEl.value;
            //console.log(srcInputEl);
         }

         var btnNormalVal = this.getAttribute("data-normalKey");
         var btnShiftVal = this.getAttribute("data-shiftKey");
         var btnId = this.id;

         var gcp = Bu.getCaretPosition(inputTargetEl);
         //console.log(gcp);

         if (event.button === 0 || event.which === 1)
         {
            /*console.log(isEditableInputEl);
             console.log(srcInputEl.classList.contains("noKbd"));
             console.log(this.classList.contains("disabled"));*/
            if (isEditableInputEl && !this.classList.contains("disabled") && !inputTargetEl.classList.contains("noKbd") && inputTargetEl.readOnly === false)
            {
               if (btnId === "capsLock")
               {
                  /*if(!srcInputEl.getAttribute("data-type") == "number,*")
                   {*/
                  console.log(inputTargetEl.getAttribute("data-type") !== "number,*");

                  Bu.changeBackgroundPosition(capsLock, -368, -332);

                  if (!capsLockOn && notNumericInput)
                  {
                     capsLockOn = true;
                     //console.log("capsLock px is " + notNumericInput);
                     //Bu.changeBackgroundPosition(capsLock, -368, -332);

                     if (shiftPressed)
                     {
                        shiftPressed = false;
                        return false;
                     }
                     //console.log("capsLockOn is " + capsLockOn);
                     return false;
                  }
                  capsLockOn = false;
                  //console.log("capsLock px is " + notNumericInput);

                  //console.log("capsLockOn is " + capsLockOn);
                  return false;
                  //}
               }

               else if (this.className.indexOf("shiftKey") > -1)
               {
                  // TODO shift pressed when caps is on
                  if (!shiftPressed)
                  {
                     if (capsLockOn)
                     {
                        shiftPressed = false;
                        // console.log("shiftKey pressed is " + shiftPressed);
                        return false;
                     }
                     shiftPressed = true;
                     // console.log("shiftKey pressed is " + shiftPressed);
                     //Bu.addClass(this, "")TODO toggle button
                     return false;
                  }
                  shiftPressed = false;
                  // console.log("shiftKey pressed is " + shiftPressed);
               }

               else if (btnId === "backSpace")//TODO clear highlighted if any [DONE]
               {
                  if (inputTargetEl.selectionEnd > inputTargetEl.selectionStart)
                  {
                     console.log("selected");
                     console.log(window.getSelection());
                     var it = inputVal;
                     var it1 = it.substring(0, inputTargetEl.selectionStart);
                     var it2 = it.substring(inputTargetEl.selectionEnd, it.length);
                     inputVal = it1 + it2;

                     if (inputTargetEl.tagName.toLowerCase() === "textarea")
                     {
                        inputTargetEl.innerHTML = inputVal;
                     }
                     else
                     {
                        inputTargetEl.value = inputVal;
                        //console.log(srcInputEl);
                     }
                  }
                  else
                  {
                     // console.log("not selected");
                     Bu.deleteAtCaret(inputTargetEl);
                     inputTargetEl.focus();
                     Bu.setCaretPosition(inputTargetEl, gcp - 1);
                  }
               }
               else if (btnId === "spaceBar")
               {
                  Bu.insertAtCaret(inputTargetEl, " ");
                  inputTargetEl.focus();
                  Bu.setCaretPosition(inputTargetEl, gcp + 1);
               }
               else if (btnId === "tabKey")// TODO real tab char [DONE]
               {
                  inputTargetEl.focus();
                  Bu.insertAtCaret(inputTargetEl, "\t");
                  Bu.setCaretPosition(inputTargetEl, gcp + 4);
               }
               else if (btnId === "enterKey")// FIXME real enter char [DONE]
               {
                  inputTargetEl.focus();
                  Bu.insertAtCaret(inputTargetEl, "\r");
                  if (window["showHint"] !== undefined)
                  {
                     window["showHint"]();
                  }
                  Bu.setCaretPosition(inputTargetEl, gcp);
               }
               else if (btnId === "backKey")
               {
                  Bu.setCaretPosition(inputTargetEl, gcp - 1);
               }
               else if (btnId === "fwdKey")
               {
                  Bu.setCaretPosition(inputTargetEl, gcp + 1);
               }
               else if (btnId === "upKey")
               {
                  Bu.setCaretPosition(inputTargetEl, inputVal.length);
               }
               else if (btnId === "downKey")
               {
                  Bu.setCaretPosition(inputTargetEl, 0);
               }
               /*todo enter key [Partially done]
                todo ctrl and alt keys
                nsdnlksd */

               else
               {
                  if (capsLockOn)
                  { // when caps lock is on
                     //console.log("shiftKey pressed is now" + shiftDown);
                     if (this.className.indexOf("noCaps") < 0)
                     {
                        Bu.insertAtCaret(inputTargetEl, btnShiftVal);

                        Bu.setCaretPosition(inputTargetEl, gcp + 1);
                        shiftPressed = false;
                        return false;
                     }

                     if (inputTargetEl.getAttribute("data-type") === "number")
                     {
                        if (this.parentElement.classList.contains("numRowKeys"))
                        {
                           Bu.insertAtCaret(inputTargetEl, btnNormalVal);
                           Bu.setCaretPosition(inputTargetEl, gcp + 1);
                           return false;
                        }
                        else
                        {
                           event.preventDefault();
                        }
                     }
                     Bu.insertAtCaret(inputTargetEl, btnNormalVal);
                     Bu.setCaretPosition(inputTargetEl, gcp + 1);
                     return false;
                  }

                  if (shiftPressed)
                  {
                     //console.log("shiftKey pressed is now" + shiftPressed);
                     if ((inputTargetEl.getAttribute("data-type") !== "number,*") || inputTargetEl.getAttribute("data-type") === "number,*" && btnShiftVal === "*")
                     {
                        Bu.insertAtCaret(inputTargetEl, btnShiftVal);
                        Bu.setCaretPosition(inputTargetEl, gcp + 1);
                        shiftPressed = false;
                     }

                     return false;
                  }

                  //console.log(srcInputEl.getAttribute("data-type"));
                  if (inputTargetEl.getAttribute("data-type") === "number" || inputTargetEl.getAttribute("data-type") === "number,*")
                  {
                     shiftPressed = false;
                     capsLockOn = false;
                     if (this.parentElement.classList.contains("numRowKeys") || this.classList.contains("metaKey"))
                     {
                        if ((inputTargetEl.getAttribute("data-maxLen") === null) || (( inputTargetEl.value.toString().length < parseInt(inputTargetEl.getAttribute("data-maxLen"))) && inputTargetEl.getAttribute("data-maxLen") !== null))
                        {
                           Bu.insertAtCaret(inputTargetEl, btnNormalVal);
                           Bu.setCaretPosition(inputTargetEl, gcp + 1);

                           if (inputTargetEl.getAttribute("data-max") !== null && inputTargetEl.getAttribute("data-max") !== "")
                           {
                              if (parseFloat(inputTargetEl.value) > parseFloat(inputTargetEl.getAttribute("data-max")))
                              {
                                 inputTargetEl.value = "";
                                 inputTargetEl.style.border = 1 + "px solid #ff0000";
                              }
                              else
                              {
                                 inputTargetEl.style.borderColor = "";
                              }

                           }

                           if (inputTargetEl.getAttribute("data-min") !== null && inputTargetEl.getAttribute("data-min") != "")
                           {
                              if (parseFloat(inputTargetEl.value) < parseFloat(inputTargetEl.getAttribute("data-min")))
                              {
                                 inputTargetEl.value = "";
                                 inputTargetEl.style.border = 1 + "px solid #ff0000";
                              }
                              else
                              {
                                 inputTargetEl.style.borderColor = "";
                              }
                           }
                           return false;
                        }
                     }
                     else
                     {
                        event.preventDefault();
                     }
                  }
                  else if (inputTargetEl.getAttribute("data-type") === "alpha")
                  {
                     if (this.parentElement.classList.contains("alphaRowKeys") || this.classList.contains("metaKey"))
                     {
                        if (inputTargetEl.getAttribute("data-maxLen") !== null && (parseInt(inputTargetEl.getAttribute("data-maxLen"))) === "number")
                        {
                           if ((inputTargetEl.value.toString().length < parseInt(inputTargetEl.getAttribute("data-maxLen"))))
                           {
                              Bu.insertAtCaret(inputTargetEl, btnNormalVal);
                              Bu.setCaretPosition(inputTargetEl, gcp + 1);
                           }
                           else
                           {
                              event.preventDefault();
                           }
                        }
                        Bu.insertAtCaret(inputTargetEl, btnNormalVal);
                        Bu.setCaretPosition(inputTargetEl, gcp + 1);
                        return false;
                     }
                     else
                     {
                        event.preventDefault();
                     }
                  }

                  else
                  {
                     if ((inputTargetEl.getAttribute("data-maxLen") === null) ||
                        (( inputTargetEl.value.toString().length <
                        parseInt(inputTargetEl.getAttribute("data-maxLen"))) &&
                        inputTargetEl.getAttribute("data-maxLen") !== null))
                     {

                        Bu.insertAtCaret(inputTargetEl, btnNormalVal);
                        Bu.setCaretPosition(inputTargetEl, gcp + 1);
                     }
                     else
                     {
                        event.preventDefault();
                     }
                  }
               }
            }

         }

      }
      else
      {
         event.preventDefault();
      }
   });

})(Barge.utils);

/*
 *TODO : Add support for multiple language kbd layouts {can be done by inserting layout HTML from Php}
 *TODO : Insert keys from json, object or an array (numeric ad meta keys are static)
 *TODO : Add support for modifier keys and the ability to execute keyboard shortcuts
 *       when a text input box isn't the item in focus
 * */
/**
 * @changeLog
 * replaced inline event add looping with event Manager
 */


