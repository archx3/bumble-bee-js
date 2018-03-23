/**
 * @Author Created by Arch on 14/08/2016.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence MIT
 *
 *        \__/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 *
 *    @fileOverview This file helps to manage form input
 *    @requires {@link Bee.Utils, @link Bee.Array, @link Bee.Dom (DOM_CORE)}
 *    @requires{@link Bee.String, @link Bee.Keyboard}
 *    @requires{@link Bee.Event, @link Bee.Keyboard.KeyCodes}
 *
 *    @version 3.15
 */


//var Bee = Bee || {};
(function (Bu, Ba, Bs, Bd, Bk)
{
   let Be = new Bee.Event.EventManager();
   let KC = Bee.Keyboard.KeyCodes;
   Bee.Input = Bee.Input || {};

   Bee.Input = {
      /**
       *
       * @param e {Event}
       * @returns {boolean}
       */
      isModifierKey         : function (e)
      {
         return e.shiftKey || e.ctrlKey || e.altKey;
      },
      /**
       *
       * @param key {Event}
       * @returns {boolean}
       */
      isAlphaKey            : function (key)
      {
         return key.keyCode >= 65 && key.keyCode <= 90;
      },
      /**
       *
       * @param key {Event}
       * @returns {boolean}
       */
      isNumericKey          : function (key)
      {
         return key.keyCode >= 48 && key.keyCode <= 57;
      },
      /**
       *
       * @param key {Event}
       * @returns {boolean}
       */
      isArrowKey            : function (key)
      {
         return key.keyCode >= 37 && key.keyCode <= 40;
      },
      /**
       *
       * @param className {String} Group ClassName
       * @param max maximum checks for group
       */
      restrictCheckBoxTicks : function (className, max)
      {
         var numChecked = 0;

         //var rChbX = Bu.getElementsByAttribute(attribute);
         var rChbX = document.getElementsByClassName(className);
         for (var i = 0; i < rChbX.length; i++)
         {
            if (rChbX[i].checked === true)//count how many have been checked when page loads
            {
               numChecked++;
               //console.log(numChecked);
            }

            rChbX[i].addEventListener("change", function ()
            {
               if (numChecked < max + 2)
               {
                  if (this.checked === false)
                  {
                     numChecked--;
                  }
                  else
                  {
                     numChecked++;
                  }
               }
               //console.log(numChecked);

               if (this.checked === true && numChecked > max)
               {
                  this.checked = false;// dont check if numChecked > max
                  numChecked--;// maintain the count
               }
            });

         }
      },
      /**
       *@use returns the index of the caret position in an editable HTML element
       * @param el {Element} {object}
       * @returns {Number}
       */
      getCaretPosition      : function n(el)
      {
         var val = el.value;
         return val.slice(0, el.selectionStart).length;
      },
      /**
       *@use for moving caret in an editable element to a new position
       * @param el {Element}
       * @param newPos {Number}
       * @returns {boolean}
       */
      setCaretPosition      : function (el, newPos)
      {
         if (el.setSelectionRange)
         {
            el.focus();
            el.setSelectionRange(newPos, newPos);
         }
         else if (el.createTextRange)
         {
            var range = el.createTextRange();
            range.collapse(true);
            range.moveEnd('character', newPos);
            range.moveStart('character', newPos);
            range.select();
         }
      },
      /**
       *inserts a string val in the editable element
       * @param el {Element} editable HTML element
       * @param val {string}
       */
      insertAtCaret         : function (el, val)
      {
         let self = this;
         if (document.selection)    //IE support
         {
            el.focus();
            var sel = document.selection.createRange();
            sel.text = val;
         }
         else if (el.selectionStart || el.selectionStart === 0)    //MOZILLA and others
         {
            el.focus();
            var startPos = el.selectionStart;
            var endPos = el.selectionEnd;

            console.log(el.selectionStart);
            if (el.tagName.toLowerCase() !== "input")
            {
               el.innerHTML = el.innerHTML.substring(0, startPos) + val +
                              el.innerHTML.substring(endPos, el.innerHTML.toString().length);
            }
            else
            {
               let str = el.value.split("");
               //Bee.String
               console.log("str", str);
               console.log("val", val);

               console.log(self.getCaretPosition(el));

               //console.log("startStr", str.substring(0, startPos-1));
               console.log("start", el.value.substring(0, startPos - 1));
               //console.log("endStr", str.substring(endPos, el.value.length-1));
               console.log("end", el.value.substring(endPos, el.value.length - 1));

               el.value = el.value.substring(0, startPos) + val + el.value.substring(endPos, el.value.length);

               console.log(el.value);
            }
         }
         else
         {
            //console.log(el.selectionStart);
            //console.log(el.selectionEnd);
            if (el.tagName.toLowerCase() !== "input")
            {
               el.innerHTML = el.innerHTML.trim() + val;
            }
            else
            {
               el.value = el.value + val;
            }
         }
      },
      /**
       *deletes a number of chars at the caret position from an editable element
       * @param el {Element} editable HTML element {object}
       * @param numOfChars {number}
       * @returns {boolean}
       */
      deleteAtCaret         : function (el, numOfChars)
      {
         var it = el.value;
         var gcp = this.getCaretPosition(el);
         if (gcp < it.length)
         {
            if (numOfChars !== undefined)
            {
               var it1 = it.substring(0, gcp - numOfChars);
               var it2 = it.substring(gcp, it.length);
               if (el.tagName.toLowerCase() === "textarea")
               {
                  el.innerHTML = it1 + it2;
               }
               else
               {
                  el.value = it1 + it2;
               }
            }
            else
            {
               var it11 = it.substring(0, gcp - 1);
               var it22 = it.substring(gcp, it.length);
               if (el.tagName.toLowerCase() === "textarea")
               {
                  el.innerHTML = it11 + it22;
               }
               else
               {
                  el.value = it11 + it22;
               }
            }
            return false;
         }
         else
         {
            if (el.tagName.toLowerCase() === "textarea")
            {
               el.innerHTML = it.substring(-1, it.length - 1);
            }
            else
            {
               el.value = it.substring(-1, it.length - 1);
            }
         }
      },
      deleteSelectedText    : function (input /*offset*/)
      {
         // var os = offset ? offset : 0;
         var str = input.value;
         var iSubStr = str.substring(0, input.selectionStart);
         var uSubStr = str.substring(input.selectionEnd, str.length);
         input.value = iSubStr + uSubStr;
      },

      changeNumericValue : function (inputEl, increase)
      {
         if (increase)
         {
            if (inputEl.value === " " || inputEl.value === "")
            {
               inputEl.value = 0;
            }
            else
            {
               if (inputEl.getAttribute("data-max") != undefined)
               {
                  if (inputEl.value < parseFloat(inputEl.getAttribute("data-max")))
                  {
                     inputEl.value++;
                  }
                  else
                  {
                     inputEl.value += "";
                  }
               }
               else
               {
                  inputEl.value++;
               }
            }
         }
         else
         {
            if (inputEl.value === " " || inputEl.value === "")
            {
               inputEl.value = 0;
            }
            else
            {
               if (inputEl.getAttribute("data-min") !== undefined)
               {
                  if (inputEl.value > parseFloat(inputEl.getAttribute("data-min")))
                  {
                     inputEl.value--;
                  }
                  else
                  {
                     inputEl.value += "";
                  }
               }
               /*else
                {
                inputEl.value --;
                }*/
            }
         }

      }
   };

   /**
    *
    * @param options {{headCheckboxClass: string, checkBoxesClass: string, bdTable: Bee.Widget.Table, maxChecks: Number|string}}
    * @constructor
    */
   Bee.Input.Checkbox = function (options)
   {
      /**
       *
       * @type {{headCheckboxClass: string,
       * checkBoxesClass: string,
       * bdTable: Bee.Widget.Table,
       * maxChecks: Number|string,
       * editableRow : Boolean,
         inputSet : Array<Array<INPUT>>
       * }}
       */
      this.options = {
         headCheckboxClass : "fatherCheckBx",
         checkBoxesClass   : "checkBx",

         bdTable : null,

         maxChecks   : "all",
         editableRow : false,
         inputSet    : null
      };

      this.options = Bu.extend(this.options, options);
   };

   /**
    *
    * @param className {NodeList|String<className>}
    * @param maxChecks
    */
   Bee.Input.Checkbox.prototype.restrictChecks = function (className, maxChecks)
   {
      let self       = this,
          numChecked = 0;

      maxChecks = Bu.defined(maxChecks) ? maxChecks : self.options.maxChecks;

      let rChbXs = Bu.defined(className) ?
                   !Bu.isString(className) && Bu.isArrayLike(className) ?
                   className : document.getElementsByClassName(className) :
                   document.getElementsByClassName(self.options.checkBoxesClass);

      let i = 0, len = rChbXs.length;

      for (; i < len; i++)
      {
         if (rChbXs[i].checked === true)//count how many have been checked when page loads
         {
            numChecked++;
         }

         rChbX[i].addEventListener("change", function ()
         {
            if (numChecked < maxChecks + 2)
            {
               if (this.checked === false)
               {
                  numChecked--;
               }
               else
               {
                  numChecked++;
               }
            }

            if (maxChecks !== "all" && this.checked === true && numChecked > Bu.pInt(maxChecks))
            {
               this.checked = false;// dont check if numChecked > max
               numChecked--;// maintain the count
            }
         });
      }
   };

   /**
    *
    * @param options {{headCheckboxClass: string, checkBoxesClass: string,
    bdTable: Bee.Widget.Table,  maxChecks: Number|string,
    * onAllChecked : fn, onSomeChecked : fn, onNoneChecked : fn, countChecks : Boolean}}
    * @param parentEl {Element}
    */
   Bee.Input.Checkbox.prototype.manageCheckboxGroup = function (options = null, parentEl = false)
   {
      let self = this;

      if (options)
      {
         this.options = Bu.extend(this.options, options);
      }

      //console.log(this.options.onAllChecked);

      let checkboxes, fatherCheckBx, numberOfCheckBoxes;
      let numChecked = 0;

      if (!parentEl)
      {
         checkboxes = Bee.Dom.getEl("." + this.options.checkBoxesClass, true);
         fatherCheckBx = Bee.Dom.getEl("." + this.options.headCheckboxClass);
      }
      else
      {
         checkboxes = parentEl.querySelectorAll("." + this.options.checkBoxesClass);
         fatherCheckBx = parentEl.querySelector("." + this.options.headCheckboxClass);
      }

      //console.log(parentEl);
      //console.log(checkboxes);
      //console.log(fatherCheckBx);

      if (Bu.defined(this.options.countChecks))
{
   if (this.options.countChecks === true)
   {
      numberOfCheckBoxes = checkboxes.length;

      Ba.forEach(checkboxes, function (checkbox, i)
      {
         if (checkbox.checked === true)//count how many have been checked when page loads
         {
            numChecked++;
         }
      });
         }
      }

      function highlight(row)
      {
         //Bee.Dom.css(row, { transition : "background-color .6s"});
         Bee.Dom.addClass(row, "highlighted");
      }

      function unHighlight(row)
      {
         //Bee.Dom.css(row, {transition : "" });
         Bee.Dom.removeClass(row, "highlighted");
      }

      fatherCheckBx.addEventListener("click", function (e)
      {
         let checked = this.checked, rows;
         //console.log("chkd");
         if (Bu.defined(self.options.bdTable))
         {
            rows = self.options.bdTable.getRows();
         }

         Bee.Utils.forEach(checkboxes, function (checkBox)
         {
            checkBox.checked = checked;
         });

         if (Bu.defined(rows))
         {
            if (checked)
            {
               //console.log(self.options.editableRow, self.options.inputSet);

               Bee.Utils.forEach(rows, function (row, i)
               {
                  highlight(row);

                  if (self.options.editableRow === true && self.options.inputSet !== null)
                  {
                     Bee.Utils.forEach(self.options.inputSet, function (input, j)
                     {
                        if (Bu.defined(input[i]))
                        {
                           input[i].readOnly = false;
                        }
                     });
                  }
               });

               if (Bu.defined(self.options.onAllChecked) && Bu.isFunction(self.options.onAllChecked))
               {
                  self.options.onAllChecked();
               }
            }
            else
            {
               Bee.Utils.forEach(rows, function (row, i)
               {
                  unHighlight(row);

                  if (self.options.editableRow === true && self.options.inputSet !== null)
                  {
                     Bee.Utils.forEach(self.options.inputSet, function (input, j)
                     {
                        if (Bu.defined(input[i]))
                        {
                           input[i].readOnly = true;
                        }
                     });
                  }
               });

               if (Bu.defined(self.options.onNoneChecked) && Bu.isFunction(self.options.onNoneChecked))
               {
                  self.options.onNoneChecked();
               }
            }
         }

         if (checked && Bee.Dom.hasClass(this, "someChecked"))
         {
            Bee.Dom.addClass(this, "allChecked");
            Bee.Dom.removeClass(this, ["someChecked", "noneChecked"]);

            if(Bu.defined(self.options.countChecks) && self.options.countChecks === true)
            {
               numChecked = numberOfCheckBoxes;
            }
         }
         else if (checked && Bee.Dom.hasClass(this, "noneChecked"))
         {
            Bee.Dom.addClass(this, "allChecked");
            Bee.Dom.removeClass(this, ["someChecked", "noneChecked"]);

            if(Bu.defined(self.options.countChecks) && self.options.countChecks === true)
            {
               numChecked = numberOfCheckBoxes;
            }
         }
         else if (!checked && Bee.Dom.hasClass(this, "someChecked"))
         {
            Bee.Dom.addClass(this, "noneChecked");
            Bee.Dom.removeClass(this, ["someChecked", "allChecked"]);

            if(Bu.defined(self.options.countChecks) && self.options.countChecks === true)
            {
               numChecked = 0;
            }
         }

         rows = checked = null;

         if(Bu.defined(self.options.countChecks) && self.options.countChecks === true)
         {
            return numChecked;
         }
      });

      Be.bindOnAll(checkboxes, "click", function (e)
      {
         let checked = this.checked,
             row     = this.parentElement.parentElement.parentElement;

         row = row.tagName === "TR" || row.tagName === "LI" ? row : this.parentElement.parentElement;
         //console.log(row.tagName !== "TR" || row.tagName !== "LI");
         if (checked)
         {
            highlight(row);

            if (self.options.editableRow === true && self.options.inputSet !== null)
            {
               let i = 0;
               Bee.Utils.forEach(self.options.inputSet, function (input, j)
               {
                  if (Bu.defined(input[i]))
                  {
                     input[row.rowIndex - 1].readOnly = false;
                  }
               });
            }
         }
         else
         {
            unHighlight(row);

            if (self.options.editableRow === true && self.options.inputSet !== null)
            {
               let i = 0;
               Bee.Utils.forEach(self.options.inputSet, function (input, j)
               {
                  if (Bu.defined(input[i]))
                  {
                     input[row.rowIndex - 1].readOnly = true;
                  }
               });
            }
         }

         let allChecked, noneChecked, someChecked;

         checkboxes = Bee.Array.toArray(checkboxes);

         someChecked = Bee.Array.someOf(checkboxes, function (checkBox)
         {
            return checkBox.checked === true;
         });

         noneChecked = Bee.Array.someOf(checkboxes, function (checkBox)
         {
            return checkBox.checked === false;
         });

         allChecked = Bee.Array.allOf(checkboxes, function (checkBox)
         {
            return checkBox.checked === true;
         });

         if (allChecked)
         {
            Bee.Dom.removeClass(fatherCheckBx, ["someChecked", "noneChecked"]);
            Bee.Dom.addClass(fatherCheckBx, "allChecked");

            if (Bu.defined(self.options.onAllChecked) && Bu.isFunction(self.options.onAllChecked))
            {
               self.options.onAllChecked();
            }
         }
         else if (someChecked)
         {
            Bee.Dom.addClass(fatherCheckBx, "someChecked");
            Bee.Dom.removeClass(fatherCheckBx, ["allChecked", "noneChecked"]);

            if (fatherCheckBx.checked === false)
            {
               fatherCheckBx.checked = true;
            }

            if (Bu.defined(self.options.onSomeChecked) && Bu.isFunction(self.options.onSomeChecked))
            {
               self.options.onSomeChecked();
            }
         }
         else if (noneChecked)
         {
            Bee.Dom.removeClass(fatherCheckBx, ["someChecked", "allChecked"]);
            Bee.Dom.addClass(fatherCheckBx, "noneChecked");

            if (fatherCheckBx.checked === true)
            {
               fatherCheckBx.checked = false;
            }

            if (Bu.defined(self.options.onNoneChecked) && Bu.isFunction(self.options.onNoneChecked))
            {
               self.options.onNoneChecked();
            }
         }
      });
   };

   /**
    * HTML INPUT elements :not(radio or check types) [Single or Array]
    * @param inputs {NodeList|String<className>}
    *
    * HTML INPUT elements of type button or BUTTON els [Single or Array]
    * @param buttons {Button|Array<Button>|String<className>}
    *
    * see if any of the inputs is empty when the page is first loaded
    * @param checkOnLoad {Boolean}
    * @param callback {fn}
    *
    * Add a blur event to the els [false by default]
    * @param checkOnBlur {Boolean}
    */
   Bee.Input.manageRequiredInput = function (inputs, buttons = null, checkOnLoad = true, callback = null, checkOnBlur = false)
   {
      inputs = !Bu.isString(inputs) ? inputs : Bd.getEl("." + inputs, true);

      buttons = !Bu.isString(buttons) ? buttons : Bd.getEl("." + buttons, true);

      //cast the nodeLists to an array
      inputs = Ba.toArray(inputs);
      buttons = Ba.toArray(buttons);

      /**
       *
       * @param inputs
       * @param buttons
       * @param callback
       */
      function makeEmptinessCheck(inputs, buttons, callback)
      {
         let allFilled = false;

         allFilled = Ba.allOf(inputs, function (inp)
         {
            return !Bs.isEmpty(inp.value);
         });

         if (buttons)
         {
            //making check once, checking at each run of the loop is a bad idea
            if (allFilled)
            {
               Ba.forEach(buttons, function (button)
               {
                  Bd.enable(button);
               });
            }
            else
            {
               Ba.forEach(buttons, function (button)
               {
                  Bd.disable(button);
               });
            }
         }

         if (callback && Bu.isFunction(callback))
         {
            callback(allFilled);
         }
      }

      if (checkOnLoad)
      { //at fn call check if the inputs don't already have values
         makeEmptinessCheck(inputs, buttons, callback);
      }

      Be.bindOnAll(inputs, "keyup", function ()
      {
         makeEmptinessCheck(inputs, buttons, callback);
      });

      Be.bindOnAll(inputs, "change", function ()
      {
         makeEmptinessCheck(inputs, buttons, callback);
      });

      if (checkOnBlur)
      {
         Be.bindOnAll(inputs, "blur", function (e)
         {
            //if(Bee.String.isEmpty(this.value))
            //{
            //   Bd.css(this, {borderColor : "#ff0000"})
            //}
            //else
            //{
            //   Bd.css(this, {borderColor : ""})
            //}
            makeEmptinessCheck(inputs, buttons, callback);
         });
      }
   };

   /**
    *
    * @param {Array<INPUT>|HTMLCollection<INPUT>} clrInpEls
    * @param {Boolean} [hasRequiredInput]
    * @param {Array<BUTTON>|HTMLCollection<BUTTON>} [buttons]
    * @param {fn} [callback]
    */
   Bee.Input.manageClearable = function (clrInpEls, hasRequiredInput = false, buttons, callback = null)
   {
      Be.bindOnAll(clrInpEls, "click", function ()
      {
         let myInputEl = Bd.getEl("#" + this.getAttribute("data-inputel"));

         if (!Bs.isEmpty(myInputEl.value))
         {
            Bee.Input.clear(myInputEl);

            if (hasRequiredInput && Bu.defined(buttons))
            {
               buttons = Ba.toArray(buttons);

               Ba.forEach(buttons, function (button)
               {
                  Bd.disable(button);
               });
            }

            if (callback && Bu.isFunction(callback))
            {
               callback(allFilled);
            }
         }
      });
   };

   /**
    *
    * @param passInputEl
    * @param confirmPassInputEl
    * @param policy {{
    minLength : Number,
    mustHaveCap : Boolean,
    mustHaveNumber : Boolean,
    mustHaveSpecialChar : Boolean,
    mustNotEqual : Array<INPUT> }}
    * @param callback {fn}
    */
   Bee.Input.managePasswordPolicy = function (passInputEl, confirmPassInputEl, policy, callback)
   {
      let passwordOk     = false,
          passVal        = passInputEl.value,
          confirmPassVal = confirmPassInputEl.value;

      //no need to check if the main el or the confirmEl is empty
      //or the pass val is not the same as the confirmPassVal
      if (!Bs.isEmpty(passVal) && !Bs.isEmpty(confirmPassVal) && Bs.isEqual(passVal, confirmPassVal))
      {
         let re;
         //check length first
         if(!passVal.length < policy.minLength && !confirmPassVal.length < policy.minLength)
         {
            //test if there's a capital letter

         }
         else
         {

         }

         re = /([A-Z]+)+/;
         if(re.test(passVal))
         {

         }
         else
         {

         }
      }
   };

   /**
    *
    * @param tempShowPassBtns{HTMLCollection|Array<Element<INPUT>>}
    */
   Bee.Input.managePasswordPreview = function (tempShowPassBtns)
   {
      let passwordEls = [];
      Ba.forEach(tempShowPassBtns, function (button)
      {
         passwordEls.push(Bd.getEl("#" + button.getAttribute("data-passel")));
      });

      Be.bindOnAll(tempShowPassBtns, "mousedown", function ()
      {
         let myPassEl = Bd.getEl("#" + this.getAttribute("data-passel"));
         myPassEl.type = "text";
         myPassEl = null;
      });

      //let's make sure that element.type returns to password,
      //no matter the area of the screen where they let go of the mouse
      //if it's done only near the el, functionality is compromised
      Be.bind(window, "mouseup", function ()
      {
         Ba.forEach(passwordEls, function (el)
         {
            if (el.type !== "password")
            {
               el.type = "password";
            }
         });
      });
   };

   Bee.Input.manageImagePreviewBtns = function (imgInputEl, imageEl, editBtns)
   {
      if(Bs.isEmpty(imageEl.style.backgroundImage))
      {
         editBtns[1].classList.add("disabled");
         editBtns[2].classList.add("disabled");
      }
      else {
         editBtns[0].classList.add("disabled");
      }

      Be.bind(imgInputEl, "change", function ()
      {
         if (this.value !== null)
         {
            editBtns[0].classList.add("disabled");
            editBtns[1].classList.remove("disabled");
            editBtns[2].classList.remove("disabled");
         }
      });

      Be.bind(editBtns[1], "click", function ()
      {
         if (!this.classList.contains("disabled"))
         {
            if (this.classList.contains("remove-control-set"))
            {
               this.classList.add("disabled");
               editBtns[0].classList.remove("disabled");
               editBtns[2].classList.add("disabled");

               imgInputEl.value = null;
               Bee.Dom.css(imageEl, { backgroundImage : "" });
            }
         }
      });
   };

   /**
    *
    * @param groupClassName {String}
    * @param maxTextLength {Number}
    */
   Bee.Input.manageTextBoxGroup = function (groupClassName, maxTextLength)
   {
      let textBoxes = Ba.toArray(Bd.getEl("." + groupClassName, true)),
          numberOfTextBoxes = textBoxes.length;

      Be.bindOnAll(textBoxes, "paste", function (e)
      {
         console.log(e);
         console.log("pasted");
      });

      Be.bindOnAll(textBoxes, "keyup", function (e)
      {
         let index = textBoxes.indexOf(this);

         if(this.value.length === maxTextLength && (index + 1 < numberOfTextBoxes))
         {
            if(Bee.Keyboard.isAlphaKey(e) || Bee.Keyboard.isNumericKey(e))
            {
               textBoxes[++index].focus();
            }
         }
         if (Bee.Keyboard.isBackSpaceKey(e) && this.value.length === 0 && (index !== 0))
         {
            textBoxes[--index].focus();
         }
      });

      Be.bindOnAll(textBoxes, "keydown", function (e)
      {
         let index = textBoxes.indexOf(this);

         if(this.value.length >= maxTextLength)
         {
            if(Bee.Keyboard.isAlphaKey(e) || Bee.Keyboard.isNumericKey(e))
            {
               e.preventDefault();
            }
         }


         if(Bee.Keyboard.isArrowKey(e))
         {
            if(Bee.Keyboard.isRightArrowKey(e) &&
               (Bee.Input.getCaretPosition(this) === this.value.length) && (index + 1 < numberOfTextBoxes))
            {
               textBoxes[++index].focus();
            }
            else if(Bee.Keyboard.isLeftArrowKey(e) &&
                    ((Bee.Input.getCaretPosition(this) === 0)) && (index !== 0))
            {
               textBoxes[--index].focus();
            }
         }
      });
   };
   
   /**
    * @param imgInputEl {Object}
    * @param imgPreviewEl  {Object}
    * @type {preview}
    */
   Bee.Input.makeImagePreviewable = function (imgInputEl, imgPreviewEl)
   {

      let typeRegEx = /^([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.tiff|.gif|.ico|.svg)$/;

      if (imgInputEl && imgPreviewEl)
      {
         if (typeof imgInputEl === 'string')
         {
            imgInputEl = Bu.gebi(imgInputEl);
         }

         if (typeof imgPreviewEl === 'string')
         {
            imgPreviewEl = Bu.gebi(imgPreviewEl);
         }

         let URL = window.URL || window.webkitURL,
             uploadedImageURL;

         if (URL)
         {
            imgInputEl.onchange = function ()
            {
               let files = this.files;
               let file;

               if (files && files.length)
               {
                  file = files[0];

                  if (/^image\/\w+/.test(file.type))
                  {
                     if (uploadedImageURL)
                     {
                        URL.revokeObjectURL(uploadedImageURL);
                     }
                  }

                  if (typeRegEx.test(imgInputEl.value.toLowerCase()))
                  {
                     //if (Bu.defined(file.type))
                     //{
                     //   console.log(file.type);
                     //}
                     //MSG this is where the selected file is inserted into img src
                     // imgPreviewEl.src =  URL.createObjectURL(file);

                     imgPreviewEl.style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
                     /*for(var i in imgPreviewEl.src)
                      {
                      console.log(i, imgPreviewEl.src[i]);
                      }*/
                  }
                  else
                  {
                     Bee.DiceyDialog.confirm({
                                                  t : 'Selected file type not supported',
                                                  m : 'Please choose an image file.',
                                                  i : 'f'
                                               });

                  }

               }
               else
               {
                  Bee.DiceyDialog.confirm({ t : 'Selected file type not supported', m : 'Please choose an image file.', i : 'f' });

               }

               file = files = null;
            };
         }
         else
         {
            Bee.DiceyDialog.confirm({
                                         t : '...well this is embarrassing',
                                         m : 'Your image has been loaded but previewing is not supported by your browser.',
                                         i : 'w'
                                      });
         }
         //URL = uploadedImageURL = null;
      }
      else
      {
         throw new Error("Missing params imgInputEl and/or imgPreviewEl");
      }

      //imgInputEl = imgPreviewEl = typeRegEx = null;
   };

   /**
    * @use restricts input into an el with data-type attr to a specific data-type only
    * @constructor
    */
   Bee.Input.dataType = function ()
   {

      var dataTypeEls = Bu.getElementsByAttribute("data-type");

      Be.bindOnAll(dataTypeEls, 'keydown', function (e)
      {
         var Bi  = Bee.Input,
             gcp = Bi.getCaretPosition(this);

         if (this.getAttribute("data-type").match(/number,?((([\w]*)+)?((,?[\W]*)*)?((,?[\w]*)+)?)*/))
         {
            /*console.log(this.getAttribute("data-type"));*/
            var tokens = this.getAttribute("data-type").toString().split(",");
            var hasWildCard = tokens.length > 1;
            let wilCards = tokens.join(" ").replace(tokens[0], "");
            var keyChar = String.fromCharCode(e.keyCode).toLowerCase();

            //console.log(Bk.checkKey(e));
            //console.log(keyChar);
            //console.log(wilCards);

            if (e.keyCode === 8)
            {
               e.preventDefault();

               if (!Bd.disabled(this))
               {
                  if (this.selectionEnd > this.selectionStart)
                  {

                     Bi.deleteSelectedText(this);
                     this.focus();
                     Bi.setCaretPosition(this, gcp);
                  }
                  else
                  {
                     Bi.deleteAtCaret(this);
                     Bi.setCaretPosition(this, gcp - 1);
                  }
               }
            }
            else if (hasWildCard && e.shiftKey)
            {
               if (wilCards.indexOf("*") > 0 && (e.keyCode === KC.EIGHT))
               {

               }

               //else if((wilCards.indexOf("-") > 0 && (e.keyCode === KC.DASH)) ||
               //        (wilCards.indexOf(".") > 0 && (e.keyCode === Bee.Keyboard.KeyCodes.PERIOD)))
               //{
               //
               //}
               //else if(wilCards.indexOf(".") > 0 && (e.keyCode === Bee.Keyboard.KeyCodes.PERIOD))
               //{
               //
               //}
               //console.log(hasWildCard);
            }
            else if (((Bi.isNumericKey(e))|| e.keyCode === 37 || e.keyCode === 39 || e.keyCode === 9) && !e.shiftKey)
            {  /*|| Bi.isArrowKey(e)*///console.log(hasWildCard);
               if (!Bd.disabled(this))
               {
                  // insertKeyBoardValue(this, gcp);
                  Bk.insertKeyBoardValue(this, gcp);
               }
            }
            else if (e.keyCode === 38)
            {
               //console.log("here");
               e.preventDefault();

               Bi.changeNumericValue(this, true);
            }
            else if (e.keyCode === 40)
            {
               Bi.changeNumericValue(this, false);
            }
            else
            {
               e.preventDefault();
            }
         }
         if (this.getAttribute("data-type").match(/alpha,?((([\w]*)+)?((,?[\W]*)*)?((,?[\w]*)+)?)*/))
         {

            if (e.keyCode === 8)
            {
               e.preventDefault();
               if (this.selectionEnd > this.selectionStart)
               {
                  console.log("selected");

                  Bi.deleteSelectedText(this);
                  this.focus();

                  Bi.setCaretPosition(this, gcp);
               }
               else
               {
                  Bi.deleteAtCaret(this);
                  Bi.setCaretPosition(this, gcp - 1);
               }
            }
            if ((Bi.isAlphaKey(e)) || Bi.isArrowKey(e) ||
                e.keyCode === 32 || e.keyCode === 9 || (Bi.isModifierKey(e) && !Bi.isNumericKey(e)) ||
                (Bi.isModifierKey(e) && Bi.isArrowKey(e)))
            {
               if (!Bd.disabled(this))
               {
                  Bk.insertKeyBoardValue(this, gcp);
               }
            }
            else
            {
               e.preventDefault();
            }
         }
      });

      //
      //   /*(function (i) FIXME copy and paste caused a security flaw
      //    {
      //    dataTypeEls[i].addEventListener("change", function (/!*evt*!/)
      //    {
      //    /!*var self = this;
      //    var e = evt ? evt : window.event;*!/
      //
      //    if(this.getAttribute("data-type")=="number" || this.getAttribute("data-type")=="number,*")
      //    {  console.log("changed");
      //    if(!Number.isNan(dataTypeEls[i].value))
      //    {
      //    dataTypeEls[i].value = "";
      //    dataTypeEls[i].style.border = 1 + "px solid #ff0000";
      //    }
      //    }
      //    });
      //
      //    })(z)*/
      //}
   };

   /**
    * @use restricts input into an el with data-max attr to
    * the data-max value
    * only work on els with data-type="number,*" | data-type="number" attrs
    * @constructor
    */
   Bee.Input.dataMax = function ()
   {
      /**
       *
       * @type {Array}
       */
      var dMax = Bu.getElementsByAttribute("data-max");
      for (var i = 0; i < dMax.length; i++)
      {
         (function (j)
         {

            //issue #01
            // using bindOnAll causes js error that makes else part
            // of a conditional execute even when condition is true in FF
            //
            // P.S haven't tested for CHROME and other
            // I feel there's no need FF is our base browser
            // and also it wont matter if the bug doesn't exist in other browsers since
            // we still have to eep support for FF
            dMax[j].addEventListener("change", function ()
            {
               if (Bu.pInt(this.value) > Bu.pInt(this.getAttribute("data-max")))
               {
                  dMax[j].value = "";
                  dMax[j].style.border = 1 + "px solid #ff0000";
               }
               else
               {
                  dMax[j].style.borderColor = "";
               }
            });
         })(i);

      }
   };

   /**
    * @use restricts input into an el with data-min attr to
    * the data-min value and not less
    * only work on els with data-type="number,*" | data-type="number" attrs
    * @constructor
    */
   Bee.Input.dataMin = function ()
   {
      var dMin = Bu.getElementsByAttribute("data-min");
      for (var i = 0; i < dMin.length; i++)
      {
         (function (j)
         {
            dMin[j].addEventListener("keyup", function ()
            {
               if (parseFloat(dMin[j].value) < parseFloat(dMin[j].getAttribute("data-min")))
               {
                  dMin[j].value = "";
                  dMax[j].style.border = 1 + "px solid #ff0000";
               }
               else
               {
                  dMax[j].style.borderColor = "";
               }
            });
         })(i);
      }
   };

   /**
    * @use restricts length of char input into an el with data-maxLen attr to
    * the data-maxLen value
    * @constructor
    */
   Bee.Input.dataMaxLength = function ()
   {
      var dMin = Bu.getElementsByAttribute("data-maxLen");

      Be.bindOnAll(dMin, 'keydown', function (e)
      {
         var gcp = Bu.getCaretPosition(this);
         if (typeof (parseInt(this.getAttribute("data-maxLen"))) === "number")
         {   /*console.log(this.getAttribute("data-type"));*/
            if (e.keyCode === 8)
            {
               e.preventDefault();
               if (this.selectionEnd > this.selectionStart)
               {
                  console.log("selected");

                  if (!Bu.defined(this.getAttribute("data-type")))
                  {
                     Bee.Input.deleteSelectedText(this);
                     this.focus();
                     Bee.Input.setCaretPosition(this, gcp);
                  }
               }
               else
               {
                  if (!Bu.defined(this.getAttribute("data-type")))
                  {
                     Bee.Input.deleteAtCaret(this);

                     Bee.Input.setCaretPosition(this, gcp - 1);
                  }

               }
            }
            if ((this.value.toString().length < parseInt(this.getAttribute("data-maxLen"))) ||
                e.keyCode === 37 || e.keyCode === 39)
            {
               if (!Bd.disabled(this))
               {
                  Bee.Keyboard.insertKeyBoardValue(this, gcp);
               }
            }
            else
            {
               e.preventDefault();
            }
         }
      });

      /*for (var i = 0; i < dMin.length; i++)
       {
       dMin[i].addEventListener("keydown", function (e)
       {

       })

       }*/
   };

   /**
    * clears the content of an inputEL
    * @param inputEl {Element<INPUT>}
    * @static
    */
   Bee.Input.clear = function (inputEl)
   {

      if (inputEl.type === "file")
      {
         inputEl.value = null;
      }
      else
      {
         inputEl.value = "";
      }
   };
})(Bee.Utils, Bee.Array, Bee.String, Bee.Dom, Bee.Keyboard);

//TODO add shiftKey down multiple checkbox checking feature

