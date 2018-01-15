/**
 * @define {boolean} Overridden to true by the compiler when
 *     --process_closure_primitives is specified.
 */
var COMPILED = false;

/**
 * Base namespace for the Bumble Bee library.  Checks to see Barge is already
 * defined in the current scope before assigning to prevent clobbering if
 * Barge.Utils.js is loaded more than once.
 *
 * this should be loaded before any other file
 *
 * @const
 */
var Barge = Barge || {};

/**
 * Reference to the global context.  In most cases this will be 'window'.
 */
Barge.global = this;

/**
 * A hook for overriding the define values in uncompiled mode.
 *
 * In uncompiled mode, {@code UNCOMPILED_DEFINES} may be defined before
 * loading utils.js.  If a key is defined in {@code UNCOMPILED_DEFINES},
 * {@code utils.define} will use the value instead of the default value.  This
 * allows flags to be overwritten without compilation (this is normally
 * accomplished with the compiler's "define" flag).
 *
 * Example:
 * <pre>
 *   var UNCOMPILED_DEFINES = {'Barge.DEBUG': false};
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
Barge.global.UNCOMPILED_DEFINES;

/**
 * A hook for overriding the define values in uncompiled or compiled mode,
 * like CLOSURE_UNCOMPILED_DEFINES but effective in compiled code.  In
 * uncompiled code CLOSURE_UNCOMPILED_DEFINES takes precedence.
 *
 * Also unlike CLOSURE_UNCOMPILED_DEFINES the values must be number, boolean or
 * string literals or the compiler will emit an error.
 *
 * While any @define value may be set, only those set with goog.define will be
 * effective for uncompiled code.
 *
 * Example:
 * <pre>
 *   var CLOSURE_DEFINES = {'Barge.DEBUG': false} ;
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
Barge.global.DEFINES;

/**
 * @type {Element}
 * the head el of the document if exists
 * @const
 */
const HEAD = document ? document.head : null;

/**
 * @type {Element}
 * the body el of the document if exists
 * @const
 */
const BODY = document ? document.body : null;

/**
 * the utils objects
 * since it is the base object for all other objects
 * we don't want to instantiate it before usage
 * even tho that is possible
 *  * @type {Object}
 * @static
 */
Barge.utils = {

   posX : 0,
   posY : 0,
   self : this,

   /**
    * @use Jquery-lyk el(s) selector
    * @deprecated
    * @param query {string}
    * @param multiple {boolean}
    * @returns {*}
    */
   getEl                    : function (query, multiple)
   {

      if (query)
      {
         if (Bs.isAlphaNumeric(query.substr(1)))
         {
            if ((query.substr(0, 1) === "."))
            {
               if (multiple === true)
               {
                  return document.getElementsByClassName(query.substr(1));
               }
               else
               {
                  return document.querySelector(query);
               }
            }
            else if (query.substr(0, 1) === "#")
            {
               return document.getElementById(query.substr(1));
            }
         }
         else
         {
            return document.querySelectorAll(query);
         }
      }
      else if (!Bu.defined(query))
      {
         throw new Error("method getEl expects a query");
      }
   },
   /**
    *@use returns an element with the specified css selector
    * @param cssSelector {string}
    * @returns {Element}
    */
   qs                       : function (cssSelector)
   {
      return document.querySelector(cssSelector);
   },
   /**
    * @use returns all element with the specified css selector
    * @param cssSelector {string}
    * @returns {NodeList}
    */
   qsa                      : function (cssSelector)
   {
      return document.querySelectorAll(cssSelector);
   },
   /**
    * @use returns an element with the specified ID
    * @param id {string}
    * @returns {Element}
    */
   gebi                     : function (id)
   {
      // console.log(id);
      return id !== null && id !== /\s*/ && id !== "" ? document.getElementById(id) : null;
   },
   /**
    * @use returns an element with the specified className
    * @param className {string}
    * @returns {NodeList}
    */
   cn                       : function (className)
   {
      return document.getElementsByClassName(className);
   },
   /**
    * @use returns an array of all elements with the specified attribute Name or
    * an array of all elements with the specified attribute Name with a specified value or
    * a single element with the specified attribute Name and val
    * @param attribute {String}
    * @param single {Boolean}
    * @param value {String}
    * @param ignoreList {Array<String>}
    * @returns {Array | Element}
    */
   getElementsByAttribute   : function (attribute, single, value, ignoreList)
   {
      var matchingElements = [];
      var allElements = document.getElementsByTagName('*');
      for (var i = 0, n = allElements.length; i < n; i++)
      {
         if (allElements[i].getAttribute(attribute) !== null)
         {  // Element exists with attribute. Add to array.
            if (value)
            {
               if (single && allElements[i].getAttribute(attribute) === value)
               {
                  return allElements[i];
               }
               else if (!single && allElements[i].getAttribute(attribute) === value)
               {
                  matchingElements.push(allElements[i]);
               }
            }

            if (single)
            {
               return allElements[i];
            }
            else
            {
               matchingElements.push(allElements[i]);
            }
         }
      }
      return matchingElements;
   },
   /**
    * @use returns an array of all elements with the specified attribute Name
    * @param name
    * @returns {Array}
    */
   getElementsByName        : function (name)
   {
      var matchingElements = [];
      var allElements = document.getElementsByTagName('*');
      for (var i = 0, n = allElements.length; i < n; i++)
      {
         if (allElements[i].tagName.toLowerCase() == name)
         {  // Element exists with attribute. Add to array.
            matchingElements.push(allElements[i]);
         }
      }
      return matchingElements;
   },
   /**
    * @use works like the php $_GET function
    * @param variableName {String}
    * @returns {*}
    * @deprecated  use{@link Barge.Dom.$_GET } instead
    */
   $_GET                    : function (variableName)
   {
      try
      {
         var q = location.search.substring(1);
         var v = q.split("&");
         for (var i = 0; i < v.length; i++)
         {
            p = v[i].split("=");
            if (p[0].toUpperCase() == variableName.toUpperCase())
            {
               if (p[1].indexOf('%20') != -1)
               {
                  n = [];
                  for (var j = 0; j < p[1].split('%20').length; j++)
                  {
                     n.push(p[1].split('%20')[j]);
                  }
                  str = "";
                  for (var k = 0; k < n.length; k++)
                  {
                     str += n[k] + ' ';
                  }
                  return str.trim();
               }
               else
               {
                  return p[1];
               }
            }
         }
      }
      catch (e)
      {
         console.log(e);
      }
   },
   /**
    * @param css {string}
    * @param styleID {string}
    */
   insertDynamicCss         : function (css, styleID)
   {
      if (!document.getElementById(styleID))
      {
         var styler = document.createElement("style");
         styler.id = styleID;
         styler.innerHTML = css;
         document.head.appendChild(styler);
      }
   }
   ,
   /**
    *
    * @param elRule {Element.style}
    * @param el {Element}
    * @returns {Number}
    */
   getStyleValue            : function (elRule, el)
   {
      var self = this;
      if (Barge.utils.isString(elRule) && el)
      {
         return Barge.utils.pInt(el.style[elRule].toString().replace(/px|%|pt|em/gi, ""));
      }

      if (elRule.toString().indexOf(/px|%|pt|em/gi) > -1)
      {
         return Barge.utils.pInt(elRule.toString().replace(/px|%|pt|em/gi, ""));
      }
      return Barge.utils.pInt(elRule.toString());
   },
   /**@use: the following function returns the id of the object passed
    *@param {Element} el HTML Element
    *@returns  [string] HTML element id
    * */
   getID                    : function (el)
   {
      return el.id;
   },
   /**
    * @use for acquiring the display state of an HTML element
    * @param el {Element}
    * @returns {number}
    */
   getDisplayState          : function (el)
   {
      var _tempState = el.style.display;

      if (_tempState === "")
      {
         _tempState = "block"
      }
      if (_tempState === "none")
      {
         return 0;
      }
      return 1
   },
   /**
    * @deprecated
    * @use used to set the display of an HTML element
    * @param el {Element}
    * @param newDisplayState {string}
    */
   setDisplayState          : function (el, newDisplayState)
   {
      el.style.display = newDisplayState;
   },
   /**
    * @deprecated
    *@use for removing an element from the HTML document
    * @param winEl {Element}
    * may need to be moved to Dom to allow for testing if winEL is a descendant of pEl
    */
   removeEl                 : function (winEl)
   {
      if (Barge.utils.defined(winEl.remove))
      {
         winEl.remove();
      }
      else if (Barge.utils.defined(winEl.parentNode) && winEl.parentNode.hasChildNodes())
      {
         winEl.parentNode.removeChild(winEl);
      }
      else
      {
         throw new Error(winEl + " cannot be removed")
      }
   },
   /**
    * @deprecated
    * @use for removing all the children of a parent HTML element
    * @param parentEl {Element}
    */
   removeChildren           : function (parentEl)
   {
      while (parentEl.hasChildNodes())
      {
         parentEl.removeChild(parentEl.firstChild);
      }
   },
   /**
    * @deprecated
    *@param windowEl {Element} HTML element
    *@param rem "remove|true" {string|boolean}
    *@param fade {boolean}
    *@param delay {Number}
    * */
   closeWin                 : function (windowEl, rem, fade, delay)
   {
      if (windowEl && this.getDisplayState(windowEl) == 1)
      {//console.log(fade);
         var delayVal = delay ? delay : 12;
         if (rem && (rem === "remove" || rem == true))
         {
            if (fade == true)
            {
               this.fadeOut(windowEl, delayVal, true);
            }
            else
            {
               this.removeEl(windowEl);
            }
         }
         else
         {
            if (fade)
            {
               this.fadeOut(windowEl, delayVal);
            }
            else
            {
               if (!delay)
               {
                  this.setDisplayState(windowEl, "none");
               }
               else
               {
                  var clockOut2 = setTimeout(function ()
                                             {
                                                Barge.utils.setDisplayState(windowEl, "none");
                                                clearTimeout(clockOut2);
                                             }, delayVal);
               }
            }
         }
      }
   },
   /**
    * @deprecated
    * The following function displays an html element that may be hidden
    *@param windowEl {Element} HTML element {identifier}
    *@param delay {Number}
    **/
   openWin                  : function (windowEl, delay)
   {
      if (this.getDisplayState(windowEl) === 0)
      {
         if (delay)
         {
            var delayVal = delay ? delay : 50;
            var clockOut = setTimeout(function ()
                                      {
                                         Barge.utils.setDisplayState(windowEl, "block");
                                         clearTimeout(clockOut);
                                      }, delayVal);
         }
         else
         {
            this.setDisplayState(windowEl, "block");
         }
      }
   },
   /**
    * @deprecated
    *@use Toggles the display of the El
    * @param windowEl {Element}
    * @param delay {Number}
    */
   toggleDisplay            : function (windowEl, delay)
   {
      var delayVal = delay ? delay : 50;
      if (this.getDisplayState(windowEl) == 0)
      {
         if (!delay)
         {
            this.setDisplayState(windowEl, "block");
         }
         else
         {
            var clockOut = setTimeout(function ()
                                      {
                                         Barge.utils.setDisplayState(windowEl, "block");
                                         clearTimeout(clockOut);
                                      }, delayVal);
         }
      }
      else
      {
         if (!delay)
         {
            this.setDisplayState(windowEl, "none");
         }
         else
         {
            var clockOut2 = setTimeout(function ()
                                       {
                                          Barge.utils.setDisplayState(windowEl, "none");
                                          clearTimeout(clockOut2);
                                       }, delayVal);
         }
      }
   },
   /**
    * @deprecated
    * @use swaps the display of one of the els for the other depending on the state
    *@param el {Element}
    *@param el2 {Element}
    *@param currentAnim {string}
    *@param newAnim {string}*/
   swapElsDisplay           : function (el, el2, currentAnim, newAnim)
   {
      if (this.getDisplayState(el) == 0)
      {
         this.setDisplayState(el2, "none");
         this.setDisplayState(el, "block");
         this.toggleClass(el, currentAnim, newAnim);
         this.toggleClass(el2, currentAnim, newAnim);
         return false;
      }
      this.setDisplayState(el, "none");
      this.setDisplayState(el2, "block");
      this.toggleClass(el2, newAnim, currentAnim);
      this.toggleClass(el, newAnim, currentAnim);
   },
   /**
    *
    * @param event {Event}
    */
   getMouseCoordinates      : function (event)
   {
      // getting mouse coordinates and setting position
      if (event.pageX || event.pageY)
      {
         self.posX = event.pageX;
         self.posY = event.pageY;
      }
      else if (event.clientX || event.clientY)
      {
         this.posX = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
         this.posY = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }
      return {
         x : self.posX,
         y : self.posY
      }
   },
   /**
    * @use used to position elements by an anchor element or at the mouse position
    * @param el {Element}
    * @param anchorEl {Element}
    * @param elSite {string}
    * @param event {event}
    * @param normal {event}
    */
   setObjectPositionAt      : function (el, anchorEl, elSite, event, normal)
   {
      if (anchorEl && elSite)
      {
         console.log("using mouse");
         if (elSite == 'topLeft')
         {
            el.style.top = anchorEl.offsetTop + 'px';
            el.style.left = anchorEl.offsetLeft + 'px';
         }
         else if (elSite == 'topRight')
         {
            el.style.top = anchorEl.offsetTop + 'px';
            el.style.left = anchorEl.offsetLeft + anchorEl.offsetWidth + 'px';
         }
         else if (elSite == 'bottomLeft')
         {
            if (!normal)
            {
               el.style.top = anchorEl.offsetTop + 40 + anchorEl.offsetHeight + 'px';
               el.style.left = anchorEl.offsetLeft + 250 + 'px';
            }
            else
            {
               el.style.top = anchorEl.offsetTop + 40 + anchorEl.offsetHeight + 'px';
               el.style.left = anchorEl.offsetLeft + 20 + 'px';
            }
         }
         else if (elSite == 'bottomRight')
         {
            el.style.top = anchorEl.offsetTop + anchorEl.offsetHeight + 'px';
            el.style.left = anchorEl.offsetLeft + anchorEl.offsetWidth + 'px';
         }
      }
      else if (event)
      {
         this.getMouseCoordinates(event);
         el.style.top = (self.posY - el.offsetHeight) - document.body.scrollTop + "px";
         el.style.left = (self.posX + /*document.body.scrollLeft -*/ el.offsetWidth) + "px";
         //console.log(el.style.top);
      }
      else
      {
         throw  new Error('Missing anchor and site or event');
      }
   },
   /**
    * @use for dynamically repositioning Elements based on the space taken by the element
    * @param el {Element}
    * @param centered {boolean}
    */
   dynamicSpaceElPositioner : function (el, centered)
   {
      var spaceLeftX = window.innerWidth - (el.offsetLeft + el.offsetWidth);
      var spaceLeftY = window.innerHeight - (el.offsetTop + el.offsetHeight);
      if (spaceLeftY < 3)
      {
         el.style.top = (el.offsetTop - el.offsetHeight) + "px";
      }

      if (spaceLeftX < 3)
      {
         el.style.left = centered ? ((el.offsetLeft + spaceLeftX) - 1) + "px" : (el.offsetLeft - el.offsetWidth) + "px";
      }

      if (el.offsetTop < 0)
      {
         el.style.Top = 0;
      }

      if (el.offsetLeft < 0)
      {
         el.style.left = 0;
      }
   },
   containedInWindow        : function (el)
   {
      var spaceLeftX = window.innerWidth - (el.offsetLeft + el.offsetWidth);
      var spaceLeftY = window.innerHeight - (el.offsetTop + el.offsetHeight);
      // console.log('window.innerWidth', window.innerWidth, ' ',
      //             'el.offsetLeft', el.offsetLeft,
      //             'el.offsetWidth', el.offsetWidth,
      //             'spaceLeftX', spaceLeftX);
      /*for (i in el)
       {
       console.log(i, el[i]);
       }*/
      console.log('spaceLeftY', spaceLeftY);
      if (spaceLeftY < 3 && spaceLeftX >= 3)
      {
         return 1;//top only deficient
      }
      else if (spaceLeftY >= 3 && spaceLeftX < 3)
      {
         return 2;// left only deficient
      }
      else if (spaceLeftY < 3 && spaceLeftX < 3)
      {
         return 3;// top and left deficient
      }
      else
      {
         return 0;// none
      }
   },
   fitIntoWindow            : function (el)
   {
      if (this.containedInWindow(el) === 1)
      {
         // el.style.top = (el.offsetTop - el.offsetHeight) + "px";
         this.css(el, { top : (el.offsetTop - el.offsetHeight) + "px" })
      }
      else if (this.containedInWindow(el) === 2)
      {
         this.css(el, { left : (el.offsetLeft - el.offsetWidth) + "px" })
      }
      else if (this.containedInWindow(el) === 3)
      {
         this.css(el, { top : (el.offsetTop - el.offsetHeight) + "px" });
         this.css(el, { left : (el.offsetLeft - el.offsetWidth) + "px" });
      }
   },
   /**
    * @param el {Element}
    * @param speed {Number}
    * @param rem {boolean}
    */
   fadeOut                  : function (el, speed, rem)
   {
      var op = 1;// initial opacity
      //set interval is a time loop
      var fadeOutTimer = setInterval(function ()
                                     {
                                        if (op <= 0.1)
                                        {
                                           clearInterval(fadeOutTimer);
                                           Barge.utils.setDisplayState(el, "none");
                                           if (rem)
                                           {
                                              Barge.utils.removeEl(el);
                                           }
                                        }
                                        el.style.opacity = op;
                                        el.style.filter = 'alpha(opacity=' + (op * 100) + ")";
                                        op -= op * 0.1;
                                     }, speed);
   },
   /**@use: the following function activates(distinguishes) a new object that is a part of a list of nodes
    *@param newActiveEL {Element}
    *@param classDeactivate {string}
    *@param activeClassName {string}
    * @deprecated
    * */
   setActive                : function (newActiveEL, classDeactivate, activeClassName)
   {
      var pel = newActiveEL.parentNode; // returns single entity
      var pelChin = pel.children; //array(node list)
      for (var i = 0, len = pelChin.length; i < len; i++)
      {
         pelChin[i].classList.remove(classDeactivate);
      }
      newActiveEL.classList.add(activeClassName);
   },
   /**
    * @param el {Element}
    * @param newClassName {string}
    * @deprecated
    */
   addClass                 : function (el, newClassName)
   {
      if (Barge.utils.isString(el))
      {
         el = this.getEl(el);
      }

      if (!el.classList.contains(newClassName) || el.className === "")
      {
         el.classList.add(newClassName);
      }
      return el;
   },
   /**
    * @param el {Element}
    * @param oldClassName {string}
    * @deprecated
    */
   removeClass              : function (el, oldClassName)
   {
      if (Barge.utils.isString(el))
      {
         el = this.getEl(el);
      }

      if (el.classList.contains(oldClassName))
      {
         el.classList.remove(oldClassName);
      }
      return el;
   },
   /**
    * @use juggles an element between two  class names
    * @param el {Element}
    * @param currentElClass {string}
    * @param newElClass {string}
    * @returns {boolean}
    * @deprecated
    */
   toggleClass              : function (el, currentElClass, newElClass)
   {
      if (this.defined(el) && currentElClass && newElClass)
      {
         if (Barge.utils.isString(el))
         {
            el = this.getEl(el);
         }

         if (el.classList.contains(currentElClass))
         {
            el.classList.remove(currentElClass);
            el.classList.add(newElClass);
            return false;
         }
         else if (el.classList.contains(newElClass))
         {
            el.classList.remove(newElClass);
            el.classList.add(currentElClass);
         }
      }
      return el;
   },
   /**
    *@deprecated
    * @param el
    * @param className
    * @returns {boolean}
    */
   inClass                  : function (el, className)
   {
      return el.classList.contains(className);
   },
   /**
    * @use changes the background position of an element
    * @param el {Element}
    * @param normalPos {Number}
    * @param pos2 {Number}
    * @returns {boolean}
    */
   changeBackgroundPosition : function (el, normalPos, pos2)
   {
      var bpx = el.style.backgroundPositionX;
      var bp = el.style.backgroundPosition;
      if (this.browserDetect() == "isFfox") // for firefox only
      {
         console.log(this.browserDetect());
         if (bp == undefined || bp == null || bp == "" || bp == (normalPos.toString() + "px center"))
         {
            el.style.backgroundPosition = pos2 + "px center";
            console.log(el.style.backgroundPosition);
            return false;
         }
         else
         {
            el.style.backgroundPosition = normalPos + "px center";
         }
      }
      else // other browsers
      {
         if (bpx == undefined || bpx == null || bpx == "" || bpx == (normalPos.toString() + "px"))
         {
            el.style.backgroundPositionX = pos2 + "px";
            return false;
         }
         el.style.backgroundPositionX = normalPos + "px";
      }
   },
   /**
    *@use returns the index of the caret position in an editable HTML element
    * @param el {Element} {object}
    * @returns {Number}
    */
   getCaretPosition         : function n(el)
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
   setCaretPosition         : function (el, newPos)
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
   insertAtCaret            : function (el, val)
   {
      if (document.selection)    //IE support
      {
         el.focus();
         var sel = document.selection.createRange();
         sel.text = val;
      }
      else if (el.selectionStart || el.selectionStart == '0')    //MOZILLA and others
      {
         el.focus();
         var startPos = el.selectionStart;
         var endPos = el.selectionEnd;
         if (el.tagName.toLowerCase() == "textarea")
         {
            el.innerHTML = el.innerHTML.substring(0, startPos) + val + el.innerHTML.substring(endPos, el.value.length);
         }
         else
         {
            el.value = el.value.substring(0, startPos) + val + el.value.substring(endPos, el.value.length);
         }
      }
      else
      {
         if (el.tagName.toLowerCase() == "textarea")
         {
            el.innerHTML = el.innerHTML + val;
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
   deleteAtCaret            : function (el, numOfChars)
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
   deleteSelectedText       : function (input /*offset*/)
   {
      // var os = offset ? offset : 0;
      var str = input.value;
      var iSubStr = str.substring(0, input.selectionStart);
      var uSubStr = str.substring(input.selectionEnd, str.length);
      input.value = iSubStr + uSubStr;
   },

   /**
    * @use for performing a fisher yates shuffle on an array
    * @returns {Array}
    */
   shuffle : function (arr)
   {
      var i = arr.length, j, temp;
      while (--i > 0)
      {
         j = Math.floor(Math.random() * (i + 1));
         temp = arr[j];
         arr[j] = arr[i];
         arr[i] = temp;
      }
      return arr;
   },

   /**
    * @use for browser detection
    * @returns {*}
    */
   browserDetect : function ()
   {
      var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf("OPR/") > 0;
      var isFfox = typeof InstallTrigger !== "undefined";
      var isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
      var isIE = /*@cc_onl@*/false || !!document.documentMode;
      var isEdge = !isIE && !!window.StyleMedia;
      var isChrome = !!window.chrome && !!window.chrome.webstore;
      var isBlink = (isChrome || isOpera) && !!window.css;
      if (isOpera)
      {
         return "isOpr";
      }
      else if (isFfox)
      {
         return "isFfox"
      }
      else if (isIE)
      {
         return "isIE"
      }
      else if (isSafari)
      {
         return "isSafari"
      }
      else if (isChrome)
      {
         return "isChrome"
      }
      else if (isEdge)
      {
         return "isEdge"
      }
      else if (isBlink)
      {
         return "isBlink"
      }
      else
      {
         return navigator.userAgent;
      }
   },

   /**
    * @use for redirecting to another page
    * @param loc {string}
    * @param after {number}
    */
   redirectTo : function (loc, after)
   {
      if (after && !(Number.isNaN(after)))
      {
         setTimeout(function ()
                    {
                       window.location.assign(loc);
                    }, after);
      }
      else
      {
         window.location.assign(loc);
      }
   },
   /**
    *
    * @param key
    * @param value
    * @param days
    */
   setCookie  : function (key, value, days)
   {
      if (days)
      {
         var date = new Date();
         date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
         var expires = "; expires=" + date.toGMTString();
      }
      else
      {
         expires = "";
      }
      document.cookie = key + "=" + value + expires + "; path=/";
   },

   /**
    *
    * @param key
    * @returns {*}
    */
   getCookie : function (key)
   {
      var keyEQ = key + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++)
      {
         var c = ca[i];
         while (c.charAt(0) == ' ')
         {
            c = c.substring(1, c.length);
         }
         if (c.indexOf(keyEQ) == 0)
         {
            return c.substring(keyEQ.length, c.length);
         }
      }
      return null;
   },

   toggleCookie : function (key, value, days)
   {
      if (this.getCookie(key) == false || this.getCookie(key) == '')
      {
         this.setCookie(key, value, days)
      }
      else
      {
         this.setCookie(key, '', days)
      }
   },

   /**
    * casts a nodeList to an Array
    * @param nodeList {HTMLCollection}
    * @param exception {String}
    * @returns {Array}
    */
   nodeListToArray : function (nodeList, exception)
   {
      if (nodeList !== null)
      {
         var nodeArray = [];
         for (var i = 0, len = nodeList.length; i < len; i++)
         {
            if (exception && typeof exception == "string")
            {
               if (!nodeList[i].classList.contains(exception))
               {
                  nodeArray.push(nodeList[i]);
               }
            }
            else
            {
               nodeArray.push(nodeList[i]);
            }
         }
         return nodeArray
      }
      else
      {
         throw new Error("nodeListToArray method expects a nodeList")
      }
   },
   /**
    * Extend an object with the members of another
    * @param dest {Object}
    * @param src {Object}
    * @param {Boolean} [strict]
    * @returns {*}
    */
   extend : function (dest, src, strict)
   {
      var key;
      if (!dest)
      {
         dest = {};
      }
      for (key in src)
      {
         if (strict)
         {
            if (src.hasOwnProperty(key))
            {
               dest[key] = src[key];
            }
         }
         else
         {
            dest[key] = src[key];
         }
      }

      return dest;
   },
   /**
    *
    * @param s {*}
    * @param radix {Number}|magnitude
    * @returns {Number}
    */
   pInt   : function (s, radix)
   {
      return parseInt(s, radix || 10);
   },
   /**
    *
    * @param s {*}
    * @returns {Number}
    */
   pFt    : function (s)
   {
      return parseFloat(s);
   },
   //region TYPE tests
   type   : function (obj)
   {
      if (!obj)
      {
         return obj + "";
      }
      return typeof obj === "object" || typeof obj === "function" ?
             class2type[toString.call(obj)] || "object" :
             typeof obj;
   },

   /**
    * predicate that Returns true if the specified value is not undefined.
    * @WARNING: Do not use this to test if an object has a property. Use the {@code in} operator instead.
    * @param obj {Object}
    * @returns {boolean}
    */
   defined : function (obj)
   {
      // void 0 always evaluates to undefined and hence we do not need to depend on
      // the definition of the global variable named 'undefined'.
      // return obj !== void 0;
      return obj !== undefined && obj !== null; //legacy check
   },

   /**
    * Removes all key value pairs from the object/map/hash.
    *
    * @param {Object} obj The object to clear.
    */
   destroy : function (obj)
   {
      for (var i in obj)
      {
         delete obj[i];
      }
   },

   /**
    *
    * @param s
    * @returns {boolean}
    */
   isString : function (s)
   {
      return typeof s === 'string';
   },

   /**
    * Check for If obj is an array
    * @param {Object} obj
    *///* @param {Boolean} strict Also checks that the object is not an array
   isArray : function (obj)
   {
      if (Array.isArray())
      {
         return Array.isArray(obj);
      }
      var str = Object.prototype.toString.call(obj);
      return str === '[object Array]' || str === '[object Array Iterator]';
   },

   /**
    *
    * @param obj {Object}
    * @returns {boolean}
    */
   isArrayLike : function (obj)
   {
      var type = typeof(obj);
      // We do not use isObject here in order to exclude function values.
      return type === 'array' || (type === 'object' && typeof obj.length === 'number');
   },

   /**
    *
    * @param obj {Object}
    * @param strict {boolean}
    * @returns {*|boolean}
    */
   isObject : function (obj, strict)
   {
      return obj && typeof obj === 'object' && (!strict || !this.isArray(obj));
   },

   /**
    *
    * @param obj {Object}
    * @returns {boolean}
    */
   isEmptyObject : function (obj)
   {
      for (var name in obj)
      {
         if (obj.hasOwnProperty(name))
         {
            return false;
         }
      }
      return true;
   },

   /**
    * Determine if variable is an array-like wrapped jQuery,
    * Zepto or similar element, or even a NodeList etc.
    * NOTE: HTMLFormElements also have a length.
    * @param obj
    * @returns {*|boolean}
    */
   isWrapped : function (obj)
   {
      return obj
             && this.isNumber(obj.length)
             && !this.isString(obj)
             && !this.isFunction(obj)
             && !this.isNode(obj)
             && (obj.length === 0 || this.isNode(obj[0]));
   },

   /**
    *
    * @param n
    * @returns {boolean}
    */
   isNumber : function (n)
   {
      return typeof n === 'number' && !isNaN(n);
   },

   /**
    *
    * @param variable
    * @returns {*|Number}
    */
   isNode : function (variable)
   {
      return variable && variable.nodeType;
   },

   /**
    *
    * @param obj
    * @returns {*|boolean}
    */
   isWindow : function (obj)
   {
      /* jshint eqeqeq: false */
      return obj && obj === obj.window;
   },

   isFunction : function (obj)
   {
      return Object.prototype.toString.call(obj) === "[object Function]";
   },
   //endregion
   /**
    * @deprecated
    * Set CSS on a given element
    * @param {Object} el
    * @param {Object} styles Style object with camel case property names
    */
   css        : function (el, styles)
   {
      if (el && typeof el === "object")
      {
         if (styles && typeof styles === "object")
         {
            if (styles.opacity !== undefined)
            {
               styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
            }
            this.extend(el.style, styles);
         }
         else
         {
            throw new Error('method css expects an HTML Object')
         }
      }
      else
      {
         throw new Error('method css expects an HTML Object');
      }
   },

   /**
    * @deprecated
    * @param tag
    * @param properties
    * @param styles
    * @returns {Element}
    */
   createEl : function (tag, properties, styles)
   {
      if (tag && typeof tag === "string")
      {
         var el = document.createElement(tag);
         if (properties && typeof properties === "object")
         {
            if ('classList' in properties)
            {
               if (typeof properties.classList === "object")
               {
                  for (var className in properties.classList)
                  {
                     el.classList.add(properties.classList.className);
                  }

                  delete properties['classList'];
               }
            }
            Barge.utils.extend(el, properties);
         }
         if (styles && typeof styles === "object")
         {
            Barge.utils.css(el, styles);
         }
      }
      else
      {
         throw new Error('createEl method expects at least a tag')
      }
      return el;
   },

   /**
    * Utility for iterating over an array.
    * @param arr {Array}
    * @param fn {Function}
    * @param ctx {Function}
    */
   forEach : function (arr, fn, ctx)
   { // modern browsers
      if (!Array.prototype.forEach)
      {
         this.forEach = function (arr, fn, ctx)
         {
            // legacy
            var i   = 0,
                len = arr.length;
            for (; i < len; i++)
            {
               if (fn.call(ctx, arr[i], i, arr) === false)
               {
                  return i;
               }
            }
         };
      }
      else
      {
         return Array.prototype.forEach.call(arr, fn, ctx);
      }
   },

   /**
    * @deprecated
    * @param arr {Array}
    * @param fn {Function}
    * @returns {*|Array|{shadow}}
    */
   map : function (arr, fn)
   {
      return arr.map(fn);
   },

   /**
    *
    * @param arr {Array}
    * @param fn {Function}
    * @returns {boolean}
    */
   someOf : function (arr, fn)
   {
      if (this.defined(arr[0]))
      {
         return arr.some(fn);
      }
      else
      {
         return false;
      }
   },

   bind : function (fn, selfObj, var_args)
   {
      // TODO(nicksantos): narrow the type signature.
      return this.bind.apply(null, arguments);
   },

   /**
    * Like bind(), except that a 'this object' is not required. Useful when
    * the target function is already bound.
    *
    * Usage:
    * var g = partial(f, arg1, arg2);
    * g(arg3, arg4);
    *
    * @param {Function} fn A function to partially apply.
    * @param {...*} var_args Additional arguments that are partially applied to fn.
    * @return {!Function} A partially-applied form of the function partial()
    *     was invoked as a method of.
    */
   partial     : function (fn, var_args)
   {
      var args = Array.prototype.slice.call(arguments, 1);

      return function ()
      {
         // Clone the array (with slice()) and append additional arguments
         // to the existing arguments.
         var newArgs = args.slice();
         newArgs.push.apply(newArgs, arguments);
         return fn.apply(this, newArgs);
      };
   },
   /**
    * Builds an object structure for the provided namespace path, ensuring that
    * names that already exist are not overwritten. For example:
    * "a.b.c" -> a = {};a.b={};a.b.c={};
    * Used by utils.provide and utils.exportSymbol.
    * @param {string} name name of the object that this file defines.
    * @param {*=} opt_object the object to expose at the end of the path.
    * @param {Object=} opt_objectToExportTo The object to add the path to; default
    *     is |Barge.global|.
    * @private
    */
   _exportPath : function (name, opt_object, opt_objectToExportTo)
   {
      var parts = name.split('.');
      var cur = opt_objectToExportTo || Barge.global;

      // issue Internet Explorer exhibits strange behavior when throwing errors from
      // methods externed in this manner.  See the testExportSymbolExceptions in
      // base_test.html for an example.
      if (!(parts[0] in cur) && cur.execScript)
      {
         cur.execScript('var ' + parts[0]);
      }

      // Certain browsers cannot parse code in the form for((a in b); c;);
      // This pattern is produced by the JSCompiler when it collapses the
      // statement above into the conditional loop below. To prevent this from
      // happening, use a for-loop and reserve the init logic as below.

      // Parentheses added to eliminate strict JS warning in Firefox.
      for (var part; parts.length && (part = parts.shift());)
      {
         if (!parts.length && this.defined(opt_object))
         {
            // last part and we have an object; use it
            cur[part] = opt_object;
         }
         else if (cur[part])
         {
            cur = cur[part];
         }
         else
         {
            cur = cur[part] = {};
         }
      }
   },

   /**
    * Defines a named value. In uncompiled mode, the value is retrieved from
    * CLOSURE_DEFINES or CLOSURE_UNCOMPILED_DEFINES if the object is defined and
    * has the property specified, and otherwise used the defined defaultValue.
    * When compiled the default can be overridden using the compiler
    * options or the value set in the BARGE_DEFINES object.
    *
    * @param {string} name The distinguished name to provide.
    * @param {string|number|boolean} defaultValue
    */
   googDefine    : function (name, defaultValue)
   {
      var value = defaultValue;
      if (!COMPILED)
      {
         if (Barge.global.UNCOMPILED_DEFINES &&
             Object.prototype.hasOwnProperty.call(Barge.global.UNCOMPILED_DEFINES, name))
         {
            value = Barge.global.UNCOMPILED_DEFINES[name];
         }
         else if (Barge.global.DEFINES && Object.prototype.hasOwnProperty.call(Barge.global.DEFINES, name))
         {
            value = Barge.global.DEFINES[name];
         }
      }
      this._exportPath(name, value);
   },

   /**
    *
    * @param namespaceString
    * @returns {{}}
    */
   define : function (namespaceString)
   {
      let parts = namespaceString.split('.'),
          parent = Barge,
          i;

      // strip redundant leading global
      if (parts[0] === "Barge")
      {
         parts = parts.slice(1);
      }

      for (i = 0; i < parts.length; i += 1)
      {
         // create a property if it doesn't exist
         if (typeof parent[parts[i]] === "undefined")
         {
            parent[parts[i]] = {};
         }
         parent = parent[parts[i]];
      }
      return parent;
   },
   /*require : function () //TODO try and implement this
    {

    }*/
   matches   : function (el, query)
   {
      if (typeof el.matches !== 'undefined')
      {
         return el.matches(query);
      }
      else
      {
         if (typeof el.matchesSelector !== 'undefined')
         {
            return el.matchesSelector(query);
         }
         else if (typeof el.webkitMatchesSelector !== 'undefined')
         {
            return el.webkitMatchesSelector(query);
         }
         else if (typeof el.mozMatchesSelector !== 'undefined')
         {
            return el.mozMatchesSelector(query);
         }
         else if (typeof el.msMatchesSelector !== 'undefined')
         {
            return el.msMatchesSelector(query);
         }
         else
         {
            if (el)
            {
               query = query.split('.');

               var tag = query.shift().toUpperCase(),
                   re  = new RegExp('\\s(' + query.join('|') + ')(?=\\s)', 'g');

               return ((tag === '' || el.nodeName.toUpperCase() === tag) &&
                       (!query.length || ((' ' + el.className + ' ').match(re) ||
                                          []).length === query.length)
               );
            }

            return false;
         }
      }
   },
   /**
    *
    * @param num {Number}
    * @param range {{min:Number, max:Number}}
    * @return {boolean}
    * @deprecated
    */
   isBetween : function (num, range)
   {
      return num > range.min && num < range.max
   },

   /**
    *
    * @param num {Number}
    * @param range {{min:Number, max:Number}}
    * @return {boolean}
    * @deprecated
    */
   isBetweenInclusive : function (num, range)
   {
      return num >= range.min && num <= range.max
   },

   /**
    *
    * @param condition {Boolean <true>}
    * @param message = '' {String]
    * @param callback {fn}
    */
   assert : function (condition, message = '', callback)
   {
      if (!condition)
      {
         if(callback) {callback()}
         throw new Error(message);
      }
   },

   // Callback array of objects.
   //ready : function (libraries, callback)
   //{
   //
   //}
   /**
    * domready (c) Dustin Diaz 2014 - License MIT
    * @param fns {Function | Array<Function>}
    * @returns {Function}
    */
   ready : function (fns)
   {
      var self   = this,
          listener,
          hack   = document.documentElement.doScroll,
          loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState);

      if (!loaded)
      {
         document.addEventListener('DOMContentLoaded', listener = function ()
         {
            document.removeEventListener('DOMContentLoaded', listener);
            loaded = 1;

            if (self.isArray(fns))
            {
               while (listener = fns.shift())
               {
                  listener();
               }
            }
            else
            {
               fns();
            }
         });
      }

      return function (fn)
      {
         fns = [];
         loaded ? setTimeout(fn, 0) : fns.push(fn);
      }
   },
   provide : function (x)
   {
      //do sth
   }
};

/**
 * @define {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces Bumble Bee to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define Barge.TRUSTED_SITE=false" to the JSCompiler.
 */
Barge.utils.define('Barge.TRUSTED_SITE', true);

/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 */
Barge.utils.now = (Barge.TRUSTED_SITE && Date.now) || (function ()
   {
      // Unary plus operator converts its operand to a number which in
      // the case of
      // a date is done by calling getTime().
      return +new Date();
   });

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * goog.inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 */
Barge.utils.inherits = function (childCtor, parentCtor)
{
   /** @constructor */
   function tempCtor()
   {
   }
   tempCtor.prototype = parentCtor.prototype;
   childCtor.superClass_ = parentCtor.prototype;
   childCtor.prototype = new tempCtor();
   /** @override */
   childCtor.prototype.constructor = childCtor;

   /**
    * Calls superclass constructor/method.
    *
    * This function is only available if you use Barge.utils.inherits to
    * express inheritance relationships between classes.
    *
    * NOTE: This is a replacement for goog.base and for superClass_
    * property defined in childCtor.
    *
    * @param {!Object} me Should always be "this".
    * @param {string} methodName The method name to call. Calling
    *     superclass constructor can be done with the special string
    *     'constructor'.
    * @param {...*} var_args The arguments to pass to superclass
    *     method/constructor.
    * @return {*} The return value of the superclass method/constructor.
    */
   childCtor.base = function (me, methodName, var_args)
   {
      // Copying using loop to avoid deop due to passing arguments object to
      // function. This is faster in many JS engines as of late 2014.
      var args = new Array(arguments.length - 2);
      for (var i = 2; i < arguments.length; i++)
      {
         args[i - 2] = arguments[i];
      }
      return parentCtor.prototype[methodName].apply(me, args);
   };
};

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.Array.Observable'] = factory(global));
      });
   }
   else if (typeof exports === 'object')
   {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory(global);
   }
   else
   {
      global['Barge.Array.Observable'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";
   //let's  create the namespace to house the observable array factory object
   Barge.Array = Barge.Array || {};
   //region protected globals
   //let Bu = Barge.utils, Ba = Barge.Array;

   //endregion

   /**
    * The Observable Array class
    * @param config {{}|null} <T>
    * @constructor
    */
   function Observable(config = null)
   {
      this.observerArray = [];
   }

   /**
    *
    * @param obj
    */
   Observable.prototype.add = function (obj)
   {
      this.observerArray.push(obj);
   };

   /**
    *
    * @param index
    */
   Observable.prototype.remove = function (index)
   {
      this.observerArray.splice(index,  1);
   };

   /**
    *
    * @returns {Number}
    */
   Observable.prototype.count = function ()
   {
      return this.observerArray.length;
   };

   /**
    *
    * @param obj
    */
   Observable.prototype.indexOf = function (obj)
   {
      let i = 0, len = this.observerArray.length;
      for (; i < len; i++)
      {
         if (this.observerArray[i] === obj){
            return i;
         }
      }

   };

   /**
    *
    * @param index
    * @returns {*}
    */
   Observable.prototype.getObj = function (index)
   {
      return this.observerArray[index]
   };

   /**
    * The Subject Interface
    * simulating an interface (even tho it keeps state in addition to the methods)
    * interface
    * @constructor
    */
   function SubjectInterface()
   {
      this.observers = new Observable();
   }

   /**
    *
    * @param observer
    */
   SubjectInterface.prototype.subscribe = function (observer)
   {
     this.observers.add(observer);
   };

   /**
    *
    * @param observer
    */
   SubjectInterface.prototype.addSubscriber = function (observer)
   {
     this.observers.add(observer);
   };

   /**
    *
    * @type {SubjectInterface.subscribe|*}
    */
   SubjectInterface.prototype.addObserver = SubjectInterface.prototype.subscribe;

   /**
    *
    * @param observer
    */
   SubjectInterface.prototype.removeObserver = function (observer)
   {

     this.observers.remove(this.observers.indexOf(observer));
   };

   /**
    *
    * @param ctx
    */
   SubjectInterface.prototype.publish = function (ctx)
   {
     let i = 0, len = this.observers.count();
     for (; i < len; i++)
     {
        //msg the update method will be implemented on any observer object created
        // the new
      this.observers.getObj(i).update(ctx)
     }
   };

   SubjectInterface.prototype.notify = SubjectInterface.prototype.publish;

   /**
    * @interface
    */
   function ObserverInterface() {}

   /**
    * @override
    * @param val
    */
   ObserverInterface.prototype.update = function (val)
   {
      /*Implement in the concrete observer*/
   };

    Barge.Observable =  SubjectInterface;

   //public methods object
   //Barge.Array.ObservableArray = {
   //
   //};
   //going public whoop! whoop! lol
   //return ObservableArray;

});

(function (Bu)
{
   /**
    * @static
    * @type {{f}}
    */
   Barge.Array = {

      /**
       * Utility for iterating over an array.
       * Calls a function for each element in an array. Skips holes in the array.
       * See {@link http://tinyurl.com/developer-mozilla-org-array-foreach}
       *
       * @param arr {Array}
       * @param fn {Function}
       * @param ctx {Function}
       */
      forEach : function (arr, fn, ctx)
      { // modern browsers
         let arr2 = !Bu.isArray(arr) ? Barge.Array.toArray(arr) : arr;

         if (!Array.prototype.forEach)
         {
            this.forEach = function (arr, fn, ctx)
            { // legacy
               var i    = 0,
                   len  = arr.length;

               for (; i < len; i++)
               {
                  if (fn.call(ctx, arr2[i], i, arr) === false) //has side effects
                  {
                     return i;
                  }
               }
            };
         }
         else
         {
            return Array.prototype.forEach.call(arr2, fn, ctx);
         }
      },

      /**
       * Calls a function for each element in an array, starting from the last
       * element rather than the first.
       *
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this: S, T, number, ?): ?} fn The function to call for every
       *     element. This function
       *     takes 3 arguments (the element, the index and the array). The return
       *     value is ignored.
       * @param {S=} context The object to be used as the value of 'this'
       *     within f.
       * @template T,S
       */
      forEachRight : function (arr, fn, context)
      {
         var l = arr.length;  // must be fixed during loop... see docs
         var arr2 = Bu.isString(arr) ? arr.split('') : arr;
         for (var i = l - 1; i >= 0; --i)
         {
            if (i in arr2)
            {
               fn.call(/** @type {?} */ (context), arr2[i], i, arr);
            }
         }
      },

      /**
       *
       * @param list {Array}
       * @param fn {fn<param>} alias
       * @param alias
       * @param ctx
       */
      forEachAs(list, alias, fn, ctx)
      {
         for( alias of list)
         {
            fn.call(ctx, alias, list);
         }
      },

      /**
       * Calls a function for each element in an array and inserts the result into a
       * new array.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-map}
       * @param arr {Array|String} arr Array or array like object(eg. string)
       * @param fn {Function}
       * @param ctx {Function}
       * @returns {*|Array|{shadow}}
       */
      map     : function (arr, fn, ctx)
      {
         if (Array.prototype.map)
         {
            return arr.map(fn);
         }
         else
         {
            var l = arr.length;  // must be fixed during loop... see docs
            var res = new Array(l);
            var arr2 = Bu.isString(arr) ? arr.split('') : arr;
            for (var i = 0; i < l; i++)
            {
               if (i in arr2)
               {
                  res[i] = f.call(/** @type {?} */ (ctx), arr2[i], i, arr);
               }
            }
            return res;
         }
      },

      /**
       * Calls f for each element of an array. If any call returns true, some()
       * returns true (without checking the remaining elements). If all calls
       * return false, some() returns false.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-some}
       *
       * @param arr {Array | String}arr Array or array like object over which to iterate.
       * @param fn {Function} The function to call for for every element
       * @param ctx {Function} The object to be used as the value of 'this' within fn.
       * @returns {boolean} true if any element passes the test
       * @template T,S
       */
      someOf      : function (arr, fn, ctx)
      {
         if (Bu.defined(arr[0]))
         {
            var arr2 = Bu.isString(arr) ? arr.split('') : arr;

            if (!Array.prototype.some)
            {
               var l = arr.length;  // must be fixed during loop... see docs

               for (var i = 0; i < l; i++)
               {
                  if (i in arr2 && f.call(/** @type {?} */ (ctx), arr2[i], i, arr))
                  {
                     return true;
                  }
               }
               return false;
            }
            else
            {
               return arr2.some(fn);
            }
         }
         else
         {
            return false;
         }
      },

      /**
       * Calls f for each element of an array. If any call returns true, some()
       * returns true (without checking the remaining elements). If all calls
       * return false, some() returns false.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-some}
       *
       * @param arr {Array | String}arr Array or array like object over which to iterate.
       * @param fn {Function} The function to call for for every element
       * @param ctx {Function} The object to be used as the value of 'this' within fn.
       * @returns {boolean} true if any element passes the test
       * @template T,S
       */
      allOf      : function (arr, fn, ctx)
      {
         if (Bu.defined(arr[0]))
         {
            var arr2 = Bu.isString(arr) ? arr.split('') : arr;

            if (!Array.prototype.every)
            {

               var l = arr.length;  // must be fixed during loop... see docs

               for (var i = 0; i < l; i++)
               {
                  if (i in arr2 && f.call(/** @type {?} */ (ctx), arr2[i], i, arr))
                  {
                     return false;
                  }
               }
               return true;
            }
            else
            {
               return arr2.every(fn);
            }
         }
         else
         {
            return false;
         }
      },


      /**
       *
       * @param arr
       * @returns {*}Array}
       */
      shuffle     : function (arr)
      {
         var i = arr.length, j, temp;
         while (--i > 0)
         {
            j = Math.floor(Math.random() * (i + 1));
            temp = arr[j];
            arr[j] = arr[i];
            arr[i] = temp;
         }
         return arr;
      },

      /**
       * Returns the last element in an array without removing it.
       * @param {|string} array The array.
       * @returns {Array} Last item in array.
       */
      peek        : function (array)
      {
         return array[array.length - 1];
      },

      /**
       * @use Returns a new array of elements from arr, based on the indexes of elements
       * provided by index_arr. For example, the result of index copying
       * ['a', 'b', 'c'] with index_arr [1,0,0,2] is ['b', 'a', 'a', 'c'].
       *
       * @param {Array} arr The array to get a indexed copy from.
       * @param {Array <number>} index_arr An array of indexes to get from arr.
       * @returns {Array} A new array of elements from arr in index_arr order.
       */
      copyByIndex : function (arr, index_arr)
      {
         var result = [];
         this.forEach(index_arr, function (index)
         {
            result.push(arr[index]);
         });
         return result;
      },

      /**
       * Creates a new array for which the element at position i is an array of the
       * ith element of the provided arrays.  The returned array will only be as long
       * as the shortest array provided; additional values are ignored.  For example,
       * the result of zipping [1, 2] and [3, 4, 5] is [[1,3], [2, 4]].
       *
       * This is similar to the zip() function in Python.
       * See {@link http://docs.python.org/library/functions.html#zip}
       *
       * @param {!Array<?>} var_args Arrays to be combined.
       * @return {!Array<!Array<?>>} A new array of arrays created from provided arrays.
       */
      zip         : function (var_args)
      {
         var i = 0;
         if (!arguments.length)
         {
            return [];
         }

         var result = [],
             minLen = arguments[0].length;

         for (i = 1; i < arguments.length; i++)
         {
            if (arguments[i].length < minLen)
            {
               minLen = arguments[i].length;
            }
         }
         for (i = 0; i < minLen; i++)
         {
            var value = [];
            for (var j = 0; j < arguments.length; j++)
            {
               value.push(arguments[j][i]);
            }
            result.push(value);
         }
         return result;
      },

      /**
       * Returns an array consisting of every argument with all arrays
       * expanded in-place recursively.
       *
       * @param {...*} var_args The values to flatten.
       * @return {!Array<?>} An array containing the flattened values.
       */
      flatten     : function (var_args)
      {
         var CHUNK_SIZE = 8192;
         var result = [];

         for (var i = 0; i < arguments.length; i++)
         {
            var element = arguments[i];
            if (Bu.isArray(element))
            {
               for (var c = 0; c < element.length; c += CHUNK_SIZE)
               {
                  var chunk = Barge.Array.slice(element, c, c + CHUNK_SIZE);
                  var recurseResult = Barge.Array.flatten.apply(null, chunk);
                  for (var r = 0; r < recurseResult.length; r++)
                  {
                     result.push(recurseResult[r]);
                  }
               }
            }
            else
            {
               result.push(element);
            }
         }
         return result;
      },

      /**
       * Returns an array consisting of the given value repeated N times.
       *
       * @param {VALUE} value The value to repeat.
       * @param {number} n The repeat count.
       * @return {!Array<VALUE>} An array with the repeated value.
       * @template VALUE
       */
      repeat      : function (value, n)
      {
         var array = [];
         for (var i = 0; i < n; i++)
         {
            array[i] = value;
         }
         return array;
      },

      /**
       * Creates a range of numbers in an arithmetic progression.
       *
       * Range takes 1, 2, or 3 arguments:
       * <pre>
       * range(5) is the same as range(0, 5, 1) and produces [0, 1, 2, 3, 4]
       * range(2, 5) is the same as range(2, 5, 1) and produces [2, 3, 4]
       * range(-2, -5, -1) produces [-2, -3, -4]
       * range(-2, -5, 1) produces [], since stepping by 1 wouldn't ever reach -5.
       * </pre>
       *
       * @param {number} startOrEnd The starting value of the range if an end argument
       *     is provided. Otherwise, the start value is 0, and this is the end value.
       *
       * @param {number=} [end] The optional end value of the range.
       * @param {number=} [step] The step size between range values. Defaults to 1
       *     if opt_step is undefined or 0.
       *
       * @return {!Array<number>} An array of numbers for the requested range. May be
       *     an empty array if adding the step would not converge toward the end
       *     value.
       */
      range       : function (startOrEnd, end, step)
      {
         var array = [],
             start = 0,
             endie   = startOrEnd,
             stepie  = step || 1,
             i     = 0;

         if (end !== undefined)
         {
            start = startOrEnd;
            endie = end;
         }

         if (stepie * (endie - start) < 0)
         {
            // Sign mismatch: start + step will never reach the end value.
            return [];
         }

         if (stepie > 0)
         {
            for (i = start; i < endie; i += stepie)
            {
               array.push(i);
            }
         }
         else
         {
            for (i = start; i > endie; i += stepie)
            {
               array.push(i);
            }
         }
         return array;
      },

      /**
       * Creates a new object built from the provided array and the key-generation
       * function.
       * @param {Array<T>} arr Array or array like object over
       *     which to iterate whose elements will be the values in the new object.
       * @param {?function(this:S, T, number, ?) : string} keyFunc The function to
       *     call for every element. This function takes 3 arguments (the element, the
       *     index and the array) and should return a string that will be used as the
       *     key for the element in the new object. If the function returns the same
       *     key for more than one element, the value for that key is
       *     implementation-defined.
       * @param {S=} opt_obj The object to be used as the value of 'this'
       *     within keyFunc.
       * @return {!Object<T>} The new object.
       * @template T,S
       */
      toObject    : function (arr, keyFunc, opt_obj)
      {
         var ret = {};
         this.forEach(arr, function (element, index)
         {
            ret[keyFunc.call(/** @type {?} */ (opt_obj), element, index, arr)] =
               element;
         });
         return ret;
      },

      /**
       *
       * @param arr {Array}
       * @param sortingFn {fn}
       * @param asc {Boolean}
       * @returns {*}
       */
      sort :function (arr, sortingFn, asc = true)
      {
         let len = arr.length;

         for (let i = 0; i < len; i++)
         {
            for (let j = 0; j < len; j++)
            {
               if (asc)
               {
                  if (arr[j] > arr[j + 1])
                  {
                     sortingFn(arr, j, j + 1);
                  }
               }
               else
               {
                  if (arr[j] < arr[j + 1])
                  {
                     sortingFn(arr, j, j + 1);
                  }
               }
            }
         }

         return arr;
      },

      /**
       * Tells if the array is sorted.
       * @param {!Array<T>} arr The array.
       * @param {?function(T,T):number=} opt_compareFn Function to compare the
       *     array elements.
       *     Should take 2 arguments to compare, and return a negative number, zero,
       *     or a positive number depending on whether the first argument is less
       *     than, equal to, or greater than the second.
       * @param {boolean=} opt_strict If true no equal elements are allowed.
       * @return {boolean} Whether the array is sorted.
       * @template T
       */
      isSorted    : function (arr, opt_compareFn, opt_strict)
      {
         var compare = opt_compareFn || this.defaultCompare;
         for (var i = 1; i < arr.length; i++)
         {
            var compareResult = compare(arr[i - 1], arr[i]);
            if (compareResult > 0 || compareResult === 0 && opt_strict)
            {
               return false;
            }
         }
         return true;
      },

      /**
       * Compares two arrays for equality. Two arrays are considered equal if they
       * have the same length and their corresponding elements are equal according to
       * the comparison function.
       *
       * @param {Array<?>} arr1 The first array to compare.
       * @param {Array<?>} arr2 The second array to compare.
       * @param {Function=} opt_equalsFn Optional comparison function.
       *     Should take 2 arguments to compare, and return true if the arguments
       *     are equal. Defaults to {link this .defaultCompareEquality} which
       *     compares the elements using the built-in '===' operator.
       * @return {boolean} Whether the two arrays are equal.
       */
      equals      : function (arr1, arr2, opt_equalsFn)
      {
         if (!Bu.isArrayLike(arr1) || !Bu.isArrayLike(arr2) ||
            arr1.length !== arr2.length)
         {
            return false;
         }
         var l = arr1.length;
         var equalsFn = opt_equalsFn || this.defaultCompareEquality;
         for (var i = 0; i < l; i++)
         {
            if (!equalsFn(arr1[i], arr2[i]))
            {
               return false;
            }
         }
         return true;
      },

      /**
       * 3-way array compare function.
       * @param {!Array<VALUE>} arr1 The first array to
       *     compare.
       * @param {!Array<VALUE>} arr2 The second array to
       *     compare.
       * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
       *     function by which the array is to be ordered. Should take 2 arguments to
       *     compare, and return a negative number, zero, or a positive number
       *     depending on whether the first argument is less than, equal to, or
       *     greater than the second.
       * @return {number} Negative number, zero, or a positive number depending on
       *     whether the first argument is less than, equal to, or greater than the
       *     second.
       * @template VALUE
       */
      compare3 : function (arr1, arr2, opt_compareFn)
      {
         var compare = opt_compareFn || this.defaultCompare;
         var l = Math.min(arr1.length, arr2.length);
         for (var i = 0; i < l; i++)
         {
            var result = compare(arr1[i], arr2[i]);
            if (result != 0)
            {
               return result;
            }
         }
         return this.defaultCompare(arr1.length, arr2.length);
      },

      /**
       * Compares its two arguments for order, using the built in < and >
       * operators.
       * @param {VALUE} a The first object to be compared.
       * @param {VALUE} b The second object to be compared.
       * @return {number} A negative number, zero, or a positive number as the first
       *     argument is less than, equal to, or greater than the second,
       *     respectively.
       * @template VALUE
       */
      defaultCompare : function (a, b)
      {
         return a > b ? 1 : a < b ? -1 : 0;
      },

      /**
       * Compares its two arguments for inverse order, using the built in < and >
       * operators.
       * @param {VALUE} a The first object to be compared.
       * @param {VALUE} b The second object to be compared.
       * @return {number} A negative number, zero, or a positive number as the first
       *     argument is greater than, equal to, or less than the second,
       *     respectively.
       * @template VALUE
       */
      inverseDefaultCompare : function (a, b)
      {
         return -this.defaultCompare(a, b);
      },

      /**
       * Compares its two arguments for equality, using the built in === operator.
       * @param {Object} a The first object to compare.
       * @param {Object} b The second object to compare.
       * @return {boolean} True if the two arguments are equal, false otherwise.
       */
      defaultCompareEquality : function (a, b)
      {
         return a === b;
      },

      /**
       * Inserts a value into a sorted array. The array is not modified if the
       * value is already present.
       * @param {Array<VALUE>} array The array to modify.
       * @param {VALUE} value The object to insert.
       * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
       *     function by which the array is ordered. Should take 2 arguments to
       *     compare, and return a negative number, zero, or a positive number
       *     depending on whether the first argument is less than, equal to, or
       *     greater than the second.
       * @return {boolean} True if an element was inserted.
       * @template VALUE
       */
      binaryInsert : function (array, value, opt_compareFn)
      {
         var index = this.binarySearch(array, value, opt_compareFn);
         if (index < 0)
         {
            this.insertAt(array, value, -(index + 1));
            return true;
         }
         return false;
      },

      /**
       * Removes a value from a sorted array.
       * @param {!Array<VALUE>} array The array to modify.
       * @param {VALUE} value The object to remove.
       * @param {function(VALUE, VALUE): number=} opt_compareFn Optional comparison
       *     function by which the array is ordered. Should take 2 arguments to
       *     compare, and return a negative number, zero, or a positive number
       *     depending on whether the first argument is less than, equal to, or
       *     greater than the second.
       * @return {boolean} True if an element was removed.
       * @template VALUE
       */
      binaryRemove : function (array, value, opt_compareFn)
      {
         var index = this.binarySearch(array, value, opt_compareFn);
         return (index >= 0) ? this.removeAt(array, index) : false;
      },

      /**
       * Splits an array into disjoint buckets according to a splitting function.
       * @param {Array<T>} array The array.
       * @param {function(this:S, T,number,Array<T>):?} sorter Function to call for
       *     every element.  This takes 3 arguments (the element, the index and the
       *     array) and must return a valid object key (a string, number, etc), or
       *     undefined, if that object should not be placed in a bucket.
       * @param {S=} opt_obj The object to be used as the value of 'this' within
       *     sorter.
       * @return {!Object} An object, with keys being all of the unique return values
       *     of sorter, and values being arrays containing the items for
       *     which the splitter returned that key.
       * @template T,S
       */
      bucket : function (array, sorter, opt_obj)
      {
         var buckets = {};

         for (var i = 0; i < array.length; i++)
         {
            var value = array[i];
            var key = sorter.call(/** @type {?} */ (opt_obj), value, i, array);
            if (Bu.defined(key))
            {
               // Push the value to the right bucket, creating it if necessary.
               var bucket = buckets[key] || (buckets[key] = []);
               bucket.push(value);
            }
         }

         return buckets;
      },

      // NOTE(arv): Since most of the array functions are generic it allows you to
// pass an array-like object. Strings have a length and are considered array-
// like. However, the 'in' operator does not work on strings so we cannot just
// use the array path even if the browser supports indexing into strings. We
// therefore end up splitting the string.

      /**
       * Returns the index of the first element of an array with a specified value, or
       * -1 if the element is not present in the array.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-indexof}
       *
       * @param {Array<T>|string} arr The array to be searched.
       * @param {T} obj The object for which we are searching.
       * @param {number=} opt_fromIndex The index at which to start the search. If
       *     omitted the search starts at index 0.
       * @return {number} The index of the first matching array element.
       * @template T
       */
      indexOf : function (arr, obj, opt_fromIndex)
      {
         if (!Array.prototype.indexOf)
         {
            var fromIndex = opt_fromIndex == null ? 0 :
                            (opt_fromIndex < 0 ? Math.max(0, arr.length + opt_fromIndex) : opt_fromIndex);

            if (Bu.isString(arr))
            {
               // Array.prototype.indexOf uses === so only strings should be found.
               if (!Bu.isString(obj) || obj.length !== 1)
               {
                  return -1;
               }
               return arr.indexOf(obj, fromIndex);
            }

            for (var i = fromIndex; i < arr.length; i++)
            {
               if (i in arr && arr[i] === obj) return i;
            }
            return -1;
         }
         else
         {
            // arr.length != null;
            return Array.prototype.indexOf.call(arr, obj, opt_fromIndex);
         }
      },

      /**
       * Returns the index of the last element of an array with a specified value, or
       * -1 if the element is not present in the array.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-lastindexof}
       *
       * @param {!Array<T>|string} arr The array to be searched.
       * @param {T} obj The object for which we are searching.
       * @param {?number=} opt_fromIndex The index at which to start the search. If
       *     omitted the search starts at the end of the array.
       * @return {number} The index of the last matching array element.
       * @template T
       */
      lastIndexOf : function (arr, obj, opt_fromIndex)
      {
         var fromIndex;
         if (!Array.prototype.lastIndexOf)
         {
            fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;

            if (fromIndex < 0)
            {
               fromIndex = Math.max(0, arr.length + fromIndex);
            }

            if (Bu.isString(arr))
            {
               // Array.prototype.lastIndexOf uses === so only strings should be found.
               if (!Bu.isString(obj) || obj.length != 1)
               {
                  return -1;
               }
               return arr.lastIndexOf(obj, fromIndex);
            }

            for (var i = fromIndex; i >= 0; i--)
            {
               if (i in arr && arr[i] === obj) return i;
            }
            return -1;
         }
         else
         {
            // goog.asserts.assert(arr.length != null);

            // Firefox treats undefined and null as 0 in the fromIndex argument which
            // leads it to always return -1
            fromIndex = opt_fromIndex == null ? arr.length - 1 : opt_fromIndex;
            return Array.prototype.lastIndexOf.call(arr, obj, fromIndex);
         }
      },

      /**
       * Calls a function for each element in an array, and if the function returns
       * true adds the element to a new array.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-filter}
       *
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?):boolean} fn The function to call for
       *     every element. This function
       *     takes 3 arguments (the element, the index and the array) and must
       *     return a Boolean. If the return value is true the element is added to the
       *     result array. If it is false the element is not included.
       * @param {S=} opt_obj The object to be used as the value of 'this'
       *     within fn.
       * @return {!Array<T>} a new array in which only elements that passed the test
       *     are present.
       * @template T,S
       */
      filter : function (arr, fn, opt_obj)
      {
         if (!Array.prototype.filter)
         {
            var l = arr.length;  // must be fixed during loop... see docs
            var res = [];
            var resLength = 0;
            var arr2 = Bu.isString(arr) ? arr.split('') : arr;
            for (var i = 0; i < l; i++)
            {
               if (i in arr2)
               {
                  var val = arr2[i];  // in case fn mutates arr2
                  if (fn.call(/** @type {?} */ (opt_obj), val, i, arr))
                  {
                     res[resLength++] = val;
                  }
               }
            }
            return res;
         }
         else
         {

            // goog.asserts.assert(arr.length != null);

            return Array.prototype.filter.call(arr, fn, opt_obj);

         }
      },

      /**
       * Passes every element of an array into a function and accumulates the result.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-reduce}
       *
       * For example:
       * var a = [1, 2, 3, 4];
       * reduce(a, function(r, v, i, arr) {return r + v;}, 0);
       * returns 10
       *
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {function(this:S, R, T, number, ?) : R} fn The function to call for
       *     every element. This function
       *     takes 4 arguments (the function's previous result or the initial value,
       *     the value of the current array element, the current array index, and the
       *     array itself)
       *     function(previousValue, currentValue, index, array).
       * @param {?} val The initial value to pass into the function on the first call.
       * @param {S=} opt_obj  The object to be used as the value of 'this'
       *     within fn.
       * @return {R} Result of evaluating fn repeatedly across the values of the array.
       * @template T,S,R
       */
      reduce : function (arr, fn, val, opt_obj)
      {
         if (!Array.prototype.reduce)
         {
            var rval = val;
            this.forEach(arr, function (val, index)
            {
               rval = fn.call(/** @type {?} */ (opt_obj), rval, val, index, arr);
            });
            return rval;
         }
         else
         {
            // goog.asserts.assert(arr.length != null);
            if (opt_obj)
            {
               fn =Bu.bind(fn, opt_obj);
            }
            return Array.prototype.reduce.call(arr, fn, val);
         }
      },

      /**
       * Passes every element of an array into a function and accumulates the result,
       * starting from the last element and working towards the first.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-reduceright}
       *
       * For example:
       * var a = ['a', 'b', 'c'];
       * reduceRight(a, function(r, v, i, arr) {return r + v;}, '');
       * returns 'cba'
       *
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, R, T, number, ?) : R} f The function to call for
       *     every element. This function
       *     takes 4 arguments (the function's previous result or the initial value,
       *     the value of the current array element, the current array index, and the
       *     array itself)
       *     function(previousValue, currentValue, index, array).
       * @param {?} val The initial value to pass into the function on the first call.
       * @param {S=} opt_obj The object to be used as the value of 'this'
       *     within f.
       * @return {R} Object returned as a result of evaluating f repeatedly across the
       *     values of the array.
       * @template T,S,R
       */
      reduceRight : function (arr, f, val, opt_obj)
      {
         if (!Array.prototype.reduceRight)
         {
            var rval = val;
            this.forEachRight(arr, function (val, index)
            {
               rval = f.call(/** @type {?} */ (opt_obj), rval, val, index, arr);
            });
            return rval;
         }
         else
         {
            // goog.asserts.assert(arr.length != null);
            // goog.asserts.assert(f != null);
            if (opt_obj)
            {
               f = Bu.bind(f, opt_obj);
            }
            return Array.prototype.reduceRight.call(arr, f, val);

         }
      },

      /**
       * Call f for each element of an array. If all calls return true, every()
       * returns true. If any call returns false, every() returns false and
       * does not continue to check the remaining elements.
       *
       * See {@link http://tinyurl.com/developer-mozilla-org-array-every}
       *
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
       *     for every element. This function takes 3 arguments (the element, the
       *     index and the array) and should return a boolean.
       * @param {S=} opt_obj The object to be used as the value of 'this'
       *     within f.
       * @return {boolean} false if any element fails the test.
       * @template T,S
       */
      every : function (arr, f, opt_obj)
      {
         if (!Array.prototype.every)
         {
            var l = arr.length;  // must be fixed during loop... see docs
            var arr2 = Bu.isString(arr) ? arr.split('') : arr;
            for (var i = 0; i < l; i++)
            {
               if (i in arr2 && !f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr))
               {

                  return false;
               }
            }
            return true;
         }
         else
         {
            // goog.asserts.assert(arr.length != null);
            return Array.prototype.every.call(arr, f, opt_obj);
         }
      },

      /**
       * Counts the array elements that fulfill the predicate, i.e. for which the
       * callback function returns true. Skips holes in the array.
       *
       * @param {!Array<T>|string} arr Array or array like object
       *     over which to iterate.
       * @param {function(this: S, T, number, ?): boolean} f The function to call for
       *     every element. Takes 3 arguments (the element, the index and the array).
       * @param {S=} opt_obj The object to be used as the value of 'this' within f.
       * @return {number} The number of the matching elements.
       * @template T,S
       */
      count : function (arr, f, opt_obj)
      {
         var count = 0;
         this.forEach(arr, function (element, index, arr)
         {
            if (f.call(/** @type {?} */ (opt_obj), element, index, arr))
            {
               ++count;
            }
         }, opt_obj);
         return count;
      },

      /**
       * Search an array for the first element that satisfies a given condition and
       * return that element.
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?) : boolean} f The function to call
       *     for every element. This function takes 3 arguments (the element, the
       *     index and the array) and should return a boolean.
       * @param {S=} opt_obj An optional "this" context for the function.
       * @return {T|null} The first array element that passes the test, or null if no
       *     element is found.
       * @template T,S
       */
      find : function (arr, f, opt_obj)
      {
         var i = this.findIndex(arr, f, opt_obj);
         return i < 0 ? null : Bu.isString(arr) ? arr.charAt(i) : arr[i];
      },

      /**
       * Search an array for the first element that satisfies a given condition and
       * return its index.
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?) : boolean} f The function to call for
       *     every element. This function
       *     takes 3 arguments (the element, the index and the array) and should
       *     return a boolean.
       * @param {S=} opt_obj An optional "this" context for the function.
       * @return {number} The index of the first array element that passes the test,
       *     or -1 if no element is found.
       * @template T,S
       */
      findIndex : function (arr, f, opt_obj)
      {
         var l = arr.length;  // must be fixed during loop... see docs
         var arr2 = Bu.isString(arr) ? arr.split('') : arr;
         for (var i = 0; i < l; i++)
         {
            if (i in arr2 && f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr))
            {
               return i;
            }
         }
         return -1;
      },

      /**
       * Search an array (in reverse order) for the last element that satisfies a
       * given condition and return that element.
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?) : boolean} f The function to call
       *     for every element. This function
       *     takes 3 arguments (the element, the index and the array) and should
       *     return a boolean.
       * @param {S=} opt_obj An optional "this" context for the function.
       * @return {T|null} The last array element that passes the test, or null if no
       *     element is found.
       * @template T,S
       */
      findRight : function (arr, f, opt_obj)
      {
         var i = this.findIndexRight(arr, f, opt_obj);
         return i < 0 ? null : Bu.isString(arr) ? arr.charAt(i) : arr[i];
      },

      /**
       * Search an array (in reverse order) for the last element that satisfies a
       * given condition and return its index.
       * @param {Array<T>|string} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?) : boolean} f The function to call
       *     for every element. This function
       *     takes 3 arguments (the element, the index and the array) and should
       *     return a boolean.
       * @param {S=} opt_obj An optional "this" context for the function.
       * @return {number} The index of the last array element that passes the test,
       *     or -1 if no element is found.
       * @template T,S
       */
      findIndexRight : function (arr, f, opt_obj)
      {
         var l = arr.length;  // must be fixed during loop... see docs
         var arr2 = Bu.isString(arr) ? arr.split('') : arr;
         for (var i = l - 1; i >= 0; i--)
         {
            if (i in arr2 && f.call(/** @type {?} */ (opt_obj), arr2[i], i, arr))
            {
               return i;
            }
         }
         return -1;
      },

      /**
       * Whether the array contains the given object.
       * @param {Array<?>|string} arr The array to test for the presence of the
       *     element.
       * @param {*} obj The object for which to test.
       * @return {boolean} true if obj is present.
       */
      contains : function (arr, obj)
      {
         return this.indexOf(arr, obj) >= 0;
      },

      /**
       * Whether the array is empty.
       * @param {Array<?>|string} arr The array to test.
       * @return {boolean} true if empty.
       */
      isEmpty : function (arr)
      {
         return arr.length === 0;
      },

      /**
       * Clears the array.
       * @param {Array<?>} arr Array or array like object to clear.
       */
      clear : function (arr)
      {
         // For non real arrays we don't have the magic length so we delete the
         // indices.
         if (!Bu.isArray(arr))
         {
            arr = [];
            //for (var i = arr.length - 1; i >= 0; i--)
            //{
               //msg this sets the values as each element of the array to (empty|undefined|null)
               //rather set the value of the array to an empty array
               //delete arr[i];
            //}
         }
         arr.length = 0;
      },

      removeAll : this.clear,

      /**
       * Pushes an item into an array, if it's not already in the array.
       * @param {Array<T>} arr Array into which to insert the item.
       * @param {T} obj Value to add.
       * @template T
       */
      insert : function (arr, obj)
      {
         if (!this.contains(arr, obj))
         {
            arr.push(obj);
         }
      },

      /**
       * Inserts an object at the given index of the array.
       * @param {Array<?>} arr The array to modify.
       * @param {*} obj The object to insert.
       * @param {number=} opt_i The index at which to insert the object. If omitted,
       *      treated as 0. A negative index is counted from the end of the array.
       */
      insertAt : function (arr, obj, opt_i)
      {
         this.splice(arr, opt_i, 0, obj);
      },

      /**
       * Inserts at the given index of the array, all elements of another array.
       * @param {Array<?>} arr The array to modify.
       * @param {Array<?>} elementsToAdd The array of elements to add.
       * @param {number=} opt_i The index at which to insert the object. If omitted,
       *      treated as 0. A negative index is counted from the end of the array.
       */
      insertArrayAt : function (arr, elementsToAdd, opt_i)
      {
         Bu.partial(this.splice, arr, opt_i, 0).apply(null, elementsToAdd);
      },

      /**
       * Inserts an object into an array before a specified object.
       * @param {Array<T>} arr The array to modify.
       * @param {T} obj The object to insert.
       * @param {T=} opt_obj2 The object before which obj should be inserted. If obj2
       *     is omitted or not found, obj is inserted at the end of the array.
       * @template T
       */
      insertBefore : function (arr, obj, opt_obj2)
      {
         var i;

         if (arguments.length == 2 || (i = this.indexOf(arr, opt_obj2)) < 0)
         {
            arr.push(obj);
         }
         else
         {
            this.insertAt(arr, obj, i);
         }
      },

      /**
       * Removes the last element from an array if no index param is supplied
       * but removes the element at a specified index in the array
       * and returns the deleted element
       * Designed to behave like pop in python
       * @param arr {Array<T>} arr Array from which to remove
       * @param index {Number}
       * @returns {*}
       */
      pop : function (arr, index = null)
      {
        if(!index)
        {
           return arr.pop();
        }
        else if(arr && Bu.isNumber(index))
        {
           return this.removeAt(arr, index);
        }
      },

      /**
       * Removes the first occurrence of a particular value from an array.
       * @param {Array<T>} arr Array from which to remove
       *     value.
       * @param {T} obj Object to remove.
       * @return {boolean} True if an element was removed.
       * @template T
       */
      remove : function (arr, obj)
      {
         var i = this.indexOf(arr, obj);
         var rv;

         if ((rv = i >= 0))
         {
            this.removeAt(arr, i);
         }

         return rv;
      },

      /**
       * Removes the last occurrence of a particular value from an array.
       * @param {!Array<T>} arr Array from which to remove value.
       * @param {T} obj Object to remove.
       * @return {boolean} True if an element was removed.
       * @template T
       */
      removeLast : function (arr, obj)
      {
         var i = this.lastIndexOf(arr, obj);

         if (i >= 0)
         {
            this.removeAt(arr, i);
            return true;
         }

         return false;
      },

      /**
       * Removes from an array the element at index index
       * @param {Array<?>} arr Array or array like object from which to
       *     remove value.
       * @param {number} index The index to remove.
       * @return {boolean} True if an element was removed.
       */
      removeAt : function (arr, index)
      {
         // goog.asserts.assert(arr.length != null);

         // use generic form of splice
         // splice returns the removed items and if successful the length of that
         // will be 1
         return Array.prototype.splice.call(arr, index, 1).length === 1;
      },

      /**
       * Removes the first value that satisfies the given condition.
       * @param {Array<T>} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?) : boolean} f The function to call
       *     for every element. This function
       *     takes 3 arguments (the element, the index and the array) and should
       *     return a boolean.
       * @param {S=} opt_obj An optional "this" context for the function.
       * @return {boolean} True if an element was removed.
       * @template T,S
       */
      removeIf : function (arr, f, opt_obj)
      {
         var i = this.findIndex(arr, f, opt_obj);
         if (i >= 0)
         {
            this.removeAt(arr, i);
            return true;
         }
         return false;
      },

      /**
       * Removes all values that satisfy the given condition.
       * @param {Array<T>} arr Array or array
       *     like object over which to iterate.
       * @param {?function(this:S, T, number, ?) : boolean} f The function to call
       *     for every element. This function
       *     takes 3 arguments (the element, the index and the array) and should
       *     return a boolean.
       * @param {S=} opt_obj An optional "this" context for the function.
       * @return {number} The number of items removed
       * @template T,S
       */
      removeAllIf : function (arr, f, opt_obj)
      {
         var removedCount = 0;

         this.forEachRight(arr, function (val, index)
         {
            if (f.call(/** @type {?} */ (opt_obj), val, index, arr))
            {
               if (this.removeAt(arr, index))
               {
                  removedCount++;
               }
            }
         });

         return removedCount;
      },

      /**
       * Returns a new array that is the result of joining the arguments.  If arrays
       * are passed then their items are added, however, if non-arrays are passed they
       * will be added to the return array as is.
       *
       * Note that ArrayLike objects will be added as is, rather than having their
       * items added.
       *
       * concat([1, 2], [3, 4]) -> [1, 2, 3, 4]
       * concat(0, [1, 2]) -> [0, 1, 2]
       * concat([1, 2], null) -> [1, 2, null]
       *
       * There is bug in all current versions of IE (6, 7 and 8) where arrays created
       * in an iframe become corrupted soon (not immediately) after the iframe is
       * destroyed. This is common if loading data via goog.net.IframeIo, for example.
       * This corruption only affects the concat method which will start throwing
       * Catastrophic Errors (#-2147418113).
       *
       * See http://endoflow.com/scratch/corrupted-arrays.html for a test case.
       *
       * Internally this should use this, so that all methods will continue to
       * work on these broken array objects.
       *
       * @param {...*} var_args Items to concatenate.  Arrays will have each item
       *     added, while primitives and objects will be added as is.
       * @return {!Array<?>} The new resultant array.
       */
      concat : function (var_args)
      {
         return Array.prototype.concat.apply(Array.prototype, arguments);
      },

      /**
       * Returns a new array that contains the contents of all the arrays passed.
       * @param {...!Array<T>} var_args
       * @return {!Array<T>}
       * @template T
       */
      join : function (var_args)
      {
         return Array.prototype.concat.apply(Array.prototype, arguments);
      },

      /**
       *
       * @param arr {Array}
       * @param start {Number}
       * @param opt_end {Number}
       * @returns {T[]}
       */
      slice        : function (arr, start, opt_end)
      {
         // passing 1 arg to slice is not the same as passing 2 where the second is
         // null or undefined (in that case the second argument is treated as 0).
         // we could use slice on the arguments object and then use apply instead of
         // testing the length
         if (arguments.length <= 2)
         {
            return Array.prototype.slice.call(arr, start);
         }
         else
         {
            return Array.prototype.slice.call(arr, start, opt_end);
         }

      },

      /**
       *
       * @param arr {Array}
       * @param index {Number}
       * @param howMany {Number}
       * @param var_args
       * @returns {T[]}
       */
      splice       : function (arr, index, howMany, var_args)
      {
         return Array.prototype.splice.apply(arr, this.slice(arguments, 1));
      },

      /**
       * Searches the specified array for the specified target using the binary
       * search algorithm.  If no opt_compareFn is specified, elements are compared
       * using {@code Barge.Array.defaultCompare}, which compares the elements
       * using the built in < and > operators.  This will produce the expected
       * behavior for homogeneous arrays of String(s) and Number(s). The array
       * specified <b>must</b> be sorted in ascending order (as defined by the
       * comparison function).  If the array is not sorted, results are undefined.
       * If the array contains multiple instances of the specified target value, any
       * of these instances may be found.
       *
       * Runtime: O(log n)
       *
       * @param {IArrayLike<VALUE>} arr The array to be searched.
       * @param {TARGET} target The sought value.
       * @param {function(TARGET, VALUE): number=} opt_compareFn Optional comparison
       *     function by which the array is ordered. Should take 2 arguments to
       *     compare, and return a negative number, zero, or a positive number
       *     depending on whether the first argument is less than, equal to, or
       *     greater than the second.
       * @return {number} Lowest index of the target value if found, otherwise
       *     (-(insertion point) - 1). The insertion point is where the value should
       *     be inserted into arr to preserve the sorted property.  Return value >= 0
       *     iff target is found.
       * @template TARGET, VALUE
       */
      binarySearch : function (arr, target, opt_compareFn)
      {
         return this.binarySearch_(
            arr, opt_compareFn || this.defaultCompare, false /* isEvaluator */,
            target);
      },

      /**
       * casts a list or Array-Like object to an Array
       * @param list {Collection | String}
       * @returns {Array}
       */
      toArray          : function (list)
      {
         if (Bu.defined(list))
         {
            var newArray = [];
            if(Bu.isString(list))
            {
               list = list.split('')
            }

            if(list.length < 1 || !Bu.defined(list.length))
            {
               return this.asArray(list);
            }
            for (var i = 0, len = list.length; i < len; i++)
            {
               newArray.push(list[i]);
            }
            return newArray
         }
         else
         {
            throw new Error("Barge.Array.toArray method expects a list")
         }
      },

      /**
       * @use Wraps a variable as an array, if it isn't one yet.
       * @use Note that an input array is returned by reference!
       * @param a {Array}
       * @returns {*|Array}
       */
      asArray     : function (a)
      {
         return Array.isArray(a) ? a : [a];
      },

      /**
       *
       * @param {any} obj
       * @param {Array<T>} arr
       * @returns {boolean}
       */
      inArray : function (obj, arr)
      {
         return arr.indexOf(obj) > -1;
      }
   };
})(Barge.utils);


(function (Bu)
{
   //cr8n the Barge.Object object
   /**
    * @static
    * @type {{}}
    */
   Barge.Object = Barge.Object || {};
   /**
    * Whether two values are not observably distinguishable. This
    * correctly detects that 0 is not the same as -0 and two NaNs are
    * practically equivalent.
    *
    * The implementation is as suggested by harmony:egal proposal.
    *
    * @param {*} v The first value to compare.
    * @param {*} v2 The second value to compare.
    * @return {boolean} Whether two values are not observably distinguishable.
    * @see http://wiki.ecmascript.org/doku.php?id=harmony:egal
    */
   Barge.Object.is = function (v, v2)
   {
      if (v === v2)
      {
         // 0 === -0, but they are not identical.
         // We need the cast because the compiler requires that v2 is a
         // number (although 1/v2 works with non-number). We cast to ? to
         // stop the compiler from type-checking this statement.
         return v !== 0 || 1 / v === 1 / /** @type {?} */ (v2);
      }

      // NaN is non-reflexive: NaN !== NaN, although they are identical.
      return v !== v && v2 !== v2;
   };

   /**
    * Calls a function for each element in an object/map/hash.
    *
    * @param {Object<K,V>} obj The object over which to iterate.
    * @param {function(this:T,V,?,Object<K,V>):?} f The function to call
    *     for every element. This function takes 3 arguments (the value, the
    *     key and the object) and the return value is ignored.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @template T,K,V
    */
   Barge.Object.forEach = function (obj, f, opt_obj)
   {
      for (var key in obj)
      {
         f.call(/** @type {?} */ (opt_obj), obj[key], key, obj);
      }
   };

   /**
    * Calls a function for each element in an object/map/hash. If that call returns
    * true, adds the element to a new object.
    *
    * @param {Object<K,V>} obj The object over which to iterate.
    * @param {function(this:T,V,?,Object<K,V>):boolean} f The function to call
    *     for every element. This
    *     function takes 3 arguments (the value, the key and the object)
    *     and should return a boolean. If the return value is true the
    *     element is added to the result object. If it is false the
    *     element is not included.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {!Object<K,V>} a new object in which only elements that passed the
    *     test are present.
    * @template T,K,V
    */
   Barge.Object.filter = function (obj, f, opt_obj)
   {
      var res = {};
      for (var key in obj)
      {
         if (f.call(/** @type {?} */ (opt_obj), obj[key], key, obj))
         {
            res[key] = obj[key];
         }
      }
      return res;
   };

   /**
    * For every element in an object/map/hash calls a function and inserts the
    * result into a new object.
    *
    * @param {Object<K,V>} obj The object over which to iterate.
    * @param {function(this:T,V,?,Object<K,V>):R} f The function to call
    *     for every element. This function
    *     takes 3 arguments (the value, the key and the object)
    *     and should return something. The result will be inserted
    *     into a new object.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {!Object<K,R>} a new object with the results from f.
    * @template T,K,V,R
    */
   Barge.Object.map = function (obj, f, opt_obj)
   {
      var res = {};
      for (var key in obj)
      {
         res[key] = f.call(/** @type {?} */ (opt_obj), obj[key], key, obj);
      }
      return res;
   };

   /**
    * Calls a function for each element in an object/map/hash. If any
    * call returns true, returns true (without checking the rest). If
    * all calls return false, returns false.
    *
    * @param {Object<K,V>} obj The object to check.
    * @param {function(this:T,V,?,Object<K,V>):boolean} f The function to
    *     call for every element. This function
    *     takes 3 arguments (the value, the key and the object) and should
    *     return a boolean.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {boolean} true if any element passes the test.
    * @template T,K,V
    */
   Barge.Object.some = function (obj, f, opt_obj)
   {
      for (var key in obj)
      {
         if (f.call(/** @type {?} */ (opt_obj), obj[key], key, obj))
         {
            return true;
         }
      }
      return false;
   };

   /**
    * Calls a function for each element in an object/map/hash. If
    * all calls return true, returns true. If any call returns false, returns
    * false at this point and does not continue to check the remaining elements.
    *
    * @param {Object<K,V>} obj The object to check.
    * @param {?function(this:T,V,?,Object<K,V>):boolean} f The function to
    *     call for every element. This function
    *     takes 3 arguments (the value, the key and the object) and should
    *     return a boolean.
    * @param {T=} opt_obj This is used as the 'this' object within f.
    * @return {boolean} false if any element fails the test.
    * @template T,K,V
    */
   Barge.Object.every = function (obj, f, opt_obj)
   {
      for (var key in obj)
      {
         if (!f.call(/** @type {?} */ (opt_obj), obj[key], key, obj))
         {
            return false;
         }
      }
      return true;
   };

   /**
    * returns an the value for an item in an Object
    * if it exists and null if otherwise
    * @param {Object<K,V>} obj The object to check.
    * @param {String} key The function to
    *
    * @return {boolean} null if the key does not exist.
    */
   Barge.Object.get = function (obj, key)
   {
      if (key in  obj)
      {
         return obj[key]
      }
      return null
   };

   /**
    * Returns the number of key-value pairs in the object map.
    *
    * @param {Object} obj The object for which to get the number of key-value
    *     pairs.
    * @return {number} The number of key-value pairs in the object map.
    */
   Barge.Object.getCount = function (obj)
   {
      var rv = 0;
      for (var key in obj)
      {
         rv++;
      }
      return rv;
   };

   /**
    * Returns one key from the object map, if any exists.
    * For map literals the returned key will be the first one in most of the
    * browsers (a know exception is Konqueror).
    *
    * @param {Object} obj The object to pick a key from.
    * @return {string|undefined} The key or undefined if the object is empty.
    */
   Barge.Object.getAnyKey = function (obj)
   {
      for (var key in obj)
      {
         return key;
      }
   };

   /**
    * Returns one value from the object map, if any exists.
    * For map literals the returned value will be the first one in most of the
    * browsers (a know exception is Konqueror).
    *
    * @param {Object<K,V>} obj The object to pick a value from.
    * @return {V|undefined} The value or undefined if the object is empty.
    * @template K,V
    */
   Barge.Object.getAnyValue = function (obj)
   {
      for (var key in obj)
      {
         return obj[key];
      }
   };

   /**
    * Whether the object/hash/map contains the given object as a value.
    * An alias for Barge.Object.containsValue(obj, val).
    *
    * @param {Object<K,V>} obj The object in which to look for val.
    * @param {V} val The object for which to check.
    * @return {boolean} true if val is present.
    * @template K,V
    */
   Barge.Object.contains = function (obj, val)
   {
      return Barge.Object.containsValue(obj, val);
   };

   /**
    * Returns the values of the object/map/hash.
    *
    * @param {Object<K,V>} obj The object from which to get the values.
    * @return {!Array<V>} The values in the object/map/hash.
    * @template K,V
    */
   Barge.Object.getValues = function (obj)
   {
      var res = [];
      var i = 0;
      for (var key in obj)
      {
         res[i++] = obj[key];
      }
      return res;
   };

   /**
    * Returns the keys of the object/map/hash.
    *
    * @param {Object} obj The object from which to get the keys.
    * @return {!Array<string>} Array of property keys.
    */
   Barge.Object.getKeys = function (obj)
   {
      var res = [];
      var i = 0;
      for (var key in obj)
      {
         res[i++] = key;
      }
      return res;
   };

   /**
    * Get a value from an object multiple levels deep.  This is useful for
    * pulling values from deeply nested objects, such as JSON responses.
    * Example usage: getValueByKeys(jsonObj, 'foo', 'entries', 3)
    *
    * @param {!Object} obj An object to get the value from.  Can be array-like.
    * @param {...(string|number|!IArrayLike<number|string>)}var_args
    *     A number of keys (as strings, or numbers, for array-like objects).  Can also be
    *     specified as a single array of keys.
    * @return {*} The resulting value.  If, at any point, the value for a key
    *     is undefined, returns undefined.
    */
   Barge.Object.getValueByKeys = function (obj, var_args)
   {
      var isArrayLike = Barge.isArrayLike(var_args);
      var keys = isArrayLike ? var_args : arguments;

      // Start with the 2nd parameter for the variable parameters syntax.
      for (var i = isArrayLike ? 0 : 1; i < keys.length; i++)
      {
         obj = obj[keys[i]];
         if (!Barge.isDef(obj))
         {
            break;
         }
      }

      return obj;
   };

   /**
    * Whether the object/map/hash contains the given key.
    *
    * @param {Object} obj The object in which to look for key.
    * @param {?} key The key for which to check.
    * @return {boolean} true If the map contains the key.
    */
   Barge.Object.containsKey = function (obj, key)
   {
      return obj !== null && key in obj;
   };

   /**
    * Whether the object/map/hash contains the given value. This is O(n).
    *
    * @param {Object<K,V>} obj The object in which to look for val.
    * @param {V} val The value for which to check.
    * @return {boolean} true If the map contains the value.
    * @template K,V
    */
   Barge.Object.containsValue = function (obj, val)
   {
      for (var key in obj)
      {
         if (obj[key] == val)
         {
            return true;
         }
      }
      return false;
   };

   /**
    * Searches an object for an element that satisfies the given condition and
    * returns its key.
    * @param {Object<K,V>} obj The object to search in.
    * @param {function(this:T,V,string,Object<K,V>):boolean} f The
    *      function to call for every element. Takes 3 arguments (the value,
    *     the key and the object) and should return a boolean.
    * @param {T=} opt_this An optional "this" context for the function.
    * @return {string|undefined} The key of an element for which the function
    *     returns true or undefined if no such element is found.
    * @template T,K,V
    */
   Barge.Object.findKey = function (obj, f, opt_this)
   {
      for (var key in obj)
      {
         if (f.call(/** @type {?} */ (opt_this), obj[key], key, obj))
         {
            return key;
         }
      }
      return undefined;
   };

   /**
    * Searches an object for an element that satisfies the given condition and
    * returns its value.
    * @param {Object<K,V>} obj The object to search in.
    * @param {function(this:T,V,string,Object<K,V>):boolean} f The function
    *     to call for every element. Takes 3 arguments (the value, the key
    *     and the object) and should return a boolean.
    * @param {T=} opt_this An optional "this" context for the function.
    * @return {V} The value of an element for which the function returns true or
    *     undefined if no such element is found.
    * @template T,K,V
    */
   Barge.Object.findValue = function (obj, f, opt_this)
   {
      var key = Barge.Object.findKey(obj, f, opt_this);
      return key && obj[key];
   };

   /**
    * Whether the object/map/hash is empty.
    *
    * @param {Object} obj The object to test.
    * @return {boolean} true if obj is empty.
    */
   Barge.Object.isEmpty = function (obj)
   {
      for (var key in obj)
      {
         return false;
      }
      return true;
   };

   /**
    * Removes all key value pairs from the object/map/hash.
    *
    * @param {Object} obj The object to clear.
    */
   Barge.Object.clear = function (obj)
   {
      for (var i in obj)
      {
         delete obj[i];
      }
   };

   /**
    * Removes all key value pairs from the object/map/hash.
    *
    * @param {Object} obj The object to clear.
    */
   Barge.Object.destroy = function (obj)
   {
      for (var i in obj)
      {
         delete obj[i];
      }
   };



   /**
    * Removes a key-value pair based on the key.
    *
    * @param {Object} obj The object from which to remove the key.
    * @param {?} key The key to remove.
    * @return {boolean} Whether an element was removed.
    */
   Barge.Object.remove = function (obj, key)
   {
      var rv;
      if (rv = key in /** @type {!Object} */ (obj))
      {
         delete obj[key];
      }
      return rv;
   };

   /**
    * Adds a key-value pair to the object. Throws an exception if the key is
    * already in use. Use set if you want to change an existing pair.
    *
    * @param {Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {V} val The value to add.
    * @template K,V
    */
   Barge.Object.add = function (obj, key, val)
   {
      if (obj !== null && key in obj)
      {
         throw Error('The object already contains the key "' + key + '"');
      }
      Barge.Object.set(obj, key, val);
   };

   /**
    * Returns the value for the given key.
    *
    * @param {Object<K,V>} obj The object from which to get the value.
    * @param {string} key The key for which to get the value.
    * @param {R=} opt_val The value to return if no item is found for the given
    *     key (default is undefined).
    * @return {V|R|undefined} The value for the given key.
    * @template K,V,R
    */
   Barge.Object.get = function (obj, key, opt_val)
   {
      if (obj !== null && key in obj)
      {
         return obj[key];
      }
      return opt_val;
   };

   /**
    * Adds a key-value pair to the object/map/hash.
    *
    * @param {Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {V} value The value to add.
    * @template K,V
    */
   Barge.Object.set = function (obj, key, value)
   {
      obj[key] = value;
   };

   /**
    * Adds a key-value pair to the object/map/hash if it doesn't exist yet.
    *
    * @param {Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {V} value The value to add if the key wasn't present.
    * @return {V} The value of the entry at the end of the function.
    * @template K,V
    */
   Barge.Object.setIfUndefined = function (obj, key, value)
   {
      return key in /** @type {!Object} */ (obj) ? obj[key] : (obj[key] = value);
   };

   /**
    * Sets a key and value to an object if the key is not set. The value will be
    * the return value of the given function. If the key already exists, the
    * object will not be changed and the function will not be called (the function
    * will be lazily evaluated -- only called if necessary).
    *
    * This function is particularly useful for use with a map used a as a cache.
    *
    * @param {!Object<K,V>} obj The object to which to add the key-value pair.
    * @param {string} key The key to add.
    * @param {function():V} f The value to add if the key wasn't present.
    * @return {V} The value of the entry at the end of the function.
    * @template K,V
    */
   Barge.Object.setWithReturnValueIfNotSet = function (obj, key, f)
   {
      if (key in obj)
      {
         return obj[key];
      }

      var val = f();
      obj[key] = val;
      return val;
   };

   /**
    * Compares two objects for equality using === on the values.
    *
    * @param {!Object<K,V>} a
    * @param {!Object<K,V>} b
    * @return {boolean}
    * @template K,V
    */
   Barge.Object.equals = function (a, b)
   {
      for (var k in a)
      {
         if (!(k in b) || a[k] !== b[k])
         {
            return false;
         }
      }
      for (var k in b)
      {
         if (!(k in a))
         {
            return false;
         }
      }
      return true;
   };

   /**
    * Returns a shallow clone of the object.
    *
    * @param {Object<K,V>} obj Object to clone.
    * @return {!Object<K,V>} Clone of the input object.
    * @template K,V
    */
   Barge.Object.clone = function (obj)
   {
      // We cannot use the prototype trick because a lot of methods depend on where
      // the actual key is set.

      if (obj === null)
      {
         return null;
      }

      var res = {};
      for (var key in obj)
      {
         res[key] = obj[key];
      }
      return res;
      // We could also use Barge.mixin but I wanted this to be independent from that.
   };

   /**
    * Clones a value. The input may be an Object, Array, or basic type. Objects and
    * arrays will be cloned recursively.
    *
    * WARNINGS:
    * <code>Barge.Object.unsafeClone</code> does not detect reference loops. Objects
    * that refer to themselves will cause infinite recursion.
    *
    * <code>Barge.Object.unsafeClone</code> is unaware of unique identifiers, and
    * copies UIDs created by <code>getUid</code> into cloned results.
    *
    * @param {*} obj The value to clone.
    * @return {*} A clone of the input value.
    */
   Barge.Object.unsafeClone = function (obj)
   {
      var type = Barge.typeOf(obj);
      if (type == 'object' || type == 'array')
      {
         if (Barge.isFunction(obj.clone))
         {
            return obj.clone();
         }
         var clone = type == 'array' ? [] : {};
         for (var key in obj)
         {
            clone[key] = Barge.Object.unsafeClone(obj[key]);
         }
         return clone;
      }

      return obj;
   };

   /**
    * Returns a new object in which all the keys and values are interchanged
    * (keys become values and values become keys). If multiple keys map to the
    * same value, the chosen transposed value is implementation-dependent.
    *
    * @param {Object} obj The object to transpose.
    * @return {!Object} The transposed object.
    */
   Barge.Object.transpose = function (obj)
   {
      var transposed = {};
      for (var key in obj)
      {
         transposed[obj[key]] = key;
      }
      return transposed;
   };

   /**
    * The names of the fields that are defined on Object.prototype.
    * @type {Array<string>}
    * @private
    */
   Barge.Object.PROTOTYPE_FIELDS_ = [
      'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
      'toLocaleString', 'toString', 'valueOf'
   ];

   /**
    * Extends an object with another object.
    * This operates 'in-place'; it does not create a new Object.
    *
    * Example:
    * var o = {};
    * Barge.Object.extend(o, {a: 0, b: 1});
    * o; // {a: 0, b: 1}
    * Barge.Object.extend(o, {b: 2, c: 3});
    * o; // {a: 0, b: 2, c: 3}
    *
    * @param {Object} target The object to modify. Existing properties will be
    *     overwritten if they are also present in one of the objects in
    *     {@code var_args}.
    * @param {...Object} var_args The objects from which values will be copied.
    * @deprecated use{@link Barge.Object.extend | @link Barge.utils.extend } instead
    */
   Barge.Object.extendss = function (target, var_args)
   {
      var key, source;
      for (var i = 1; i < arguments.length; i++)
      {
         source = arguments[i];
         for (key in source)
         {
            target[key] = source[key];
         }

         // For IE the for-in-loop does not contain any properties that are not
         // enumerable on the prototype object (for example isPrototypeOf from
         // Object.prototype) and it will also not include 'replace' on objects that
         // extend String and change 'replace' (not that it is common for anyone to
         // extend anything except Object).

         for (var j = 0; j < Barge.Object.PROTOTYPE_FIELDS_.length; j++)
         {
            key = Barge.Object.PROTOTYPE_FIELDS_[j];
            if (Object.prototype.hasOwnProperty.call(source, key))
            {
               target[key] = source[key];
            }
         }
      }
   };

   Barge.Object.extend = Bu.extend;

   /*Barge.Object.extendClone = function (a, b)FIXME
   {
      Bu.extend(a, b)
   };*/

   /**
    * Creates a new object built from the key-value pairs provided as arguments.
    * @param {...*} var_args If only one argument is provided and it is an array
    *     then this is used as the arguments,  otherwise even arguments are used as
    *     the property names and odd arguments are used as the property values.
    * @return {!Object} The new object.
    * @throws {Error} If there are uneven number of arguments or there is only one
    *     non array argument.
    */
   Barge.Object.create = function (var_args)
   {
      var argLength = arguments.length;
      if (argLength === 1 && Barge.isArray(arguments[0]))
      {
         return Barge.Object.create.apply(null, arguments[0]);
      }

      if (argLength % 2)
      {
         throw Error('Uneven number of arguments');
      }

      var rv = {};
      for (var i = 0; i < argLength; i += 2)
      {
         rv[arguments[i]] = arguments[i + 1];
      }
      return rv;
   };

   /**
    * Ctor === Creator
    * @use mimics {@link Object.create}
    * @param prototype
    * @returns {Creator}
    */
   Barge.Object.createObject = function (prototype)
   {
      /**
       *
       * @constructor
       */
      function Creator() {}
      Creator.prototype = prototype;
      return new Creator();
   };

   /**
    * Creates a new object where the property names come from the arguments but
    * the value is always set to true
    * @param {...*} var_args If only one argument is provided and it is an array
    *     then this is used as the arguments,  otherwise the arguments are used
    *     as the property names.
    * @return {!Object} The new object.
    */
   Barge.Object.createSet = function (var_args)
   {
      var argLength = arguments.length;
      if (argLength === 1 && Barge.isArray(arguments[0]))
      {
         return Barge.Object.createSet.apply(null, arguments[0]);
      }

      var rv = {};
      for (var i = 0; i < argLength; i++)
      {
         rv[arguments[i]] = true;
      }
      return rv;
   };

   /**
    * Creates an immutable view of the underlying object, if the browser
    * supports immutable objects.
    *
    * In default mode, writes to this view will fail silently. In strict mode,
    * they will throw an error.
    *
    * @param {!Object<K,V>} obj An object.
    * @return {!Object<K,V>} An immutable view of that object, or the
    *     original object if this browser does not support immutables.
    * @template K,V
    */
   Barge.Object.createImmutableView = function (obj)
   {
      var result = obj;
      if (Object.isFrozen && !Object.isFrozen(obj))
      {
         result = Object.create(obj);
         Object.freeze(result);
      }
      return result;
   };

   /**
    * @param {!Object} obj An object.
    * @return {boolean} Whether this is an immutable view of the object.
    */
   Barge.Object.isImmutableView = function (obj)
   {
      return Object.isFrozen && Object.isFrozen(obj);
   };

})(Barge.utils);

(function (Bu)
{
   Barge.String =
   {
      RSPACE : /\s+/g,

      /**
       * @use for genrating random strings of a certain length
       * @param length
       * @returns {string}
       */
      rand : function (length = 5)
      {
         if(!Bu.isNumber(length) || length < 1)
         { throw new Error("rand expects an integer greater than 0") }

         let text = "";
         let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
         let len = possible.length;

         for (var i = 0; i < length; i++)
         {
            text += possible.charAt(Math.floor(Math.random() * len));
         }

         len = possible = null;
         return text;
      },

      /**
       *@use for converting a string to sentence case
       * @param str {string}
       * @returns {string}
       */
      toSentenceCase : function (str)
      {
         str = str.toString();
         str = str.toLowerCase();
         return str = str[0].toUpperCase() + str.substring(1, str.length);
      },

      /**
       *@use for capitalising a string
       * @param str {string}
       * @returns {string}
       */
      capitalise     : function (str)
      {
         str = str.toString();
         str = str.toLowerCase();
         var strArr = str.split(" ");
         str = "";
         for (var i = 0; i < strArr.length; i++)
         {
            var tsc = this.toSentenceCase(strArr[i].toString());
            str += tsc + " ";
         }
         return str;
      },
      /**
       *@use for converting a string to camel case
       * @param str {string}
       * @param strict {Boolean}
       * @returns {string}
       */
      toCamelCase    : function (str, strict)
      {
         str = str.toString();
         str = str.toLowerCase();
         var strArr = str.split(" ");
         var space = !strict ? " " : "";
         str = "";
         str += strArr[0].toString();
         for (var i = 1; i < strArr.length; i++)
         {
            var tsc = this.toSentenceCase(strArr[i].toString());
            str += tsc + space;
         }
         return str;
      },
      /**
       *@use for converting a string to pascal case
       * @param str {string}
       * @param strict {Boolean}
       * @returns {string}
       */
      toPascalCase   : function (str, strict)
      {
         str = str.toString();
         str = str.toLowerCase();

         var strArr = str.split(" ");
         var space = !strict ? " " : "";
         str = "";

         for (var i = 0; i < strArr.length; i++)
         {
            var tsc = this.toSentenceCase(strArr[i].toString());
            str += tsc + space;
         }
         space = strArr = null;
         return str;
      },
      /**
       *@use for randomising the case of the words in a string
       * @param str {string}
       * @returns {string}
       */
      toggleCase     : function (str) // randomised capitalisation of strings
      {
         str = str.toString();
         var strArr = str.split(" ");
         str = "";
         for (var i = 0; i < strArr.length; i += (Math.floor(Math.random() * 4)))
         {
            strArr[i] = this.toSentenceCase(strArr[i]);
         }
         str = strArr.concat().toString();
         return str.replace(/,/g, " ")
      },
      /**
       *@use breaks sentence into individual words(can only breaks camelcase words) and make sentence case
       * @param str
       * @returns {string|*}
       */
      humanize       : function (str) //
      {
         if (str === null || str === undefined)
         {
            return "";
         }
         var s = this.underScore(str).replace(/_id$/, '').replace(/_/g, ' ').trim();
         return Barge.String.toSentenceCase(s);
      },
      /**
       * @use replaces spaces with dashes
       * @param str
       * @returns {*|string}
       */
      dasherise      : function (str)
      {
         var s = this.trim(str);
         s.replace(/[_\s]+/g, '-').replace(/([A-Z])/g, '-$1').replace(/-+/g, '-').toLowerCase();
         return s;
      },
      /**
       * @use for ellipsifying text if longer than the maxLen  ellipses
       * @param str
       * @param maxLen
       * @returns {*}
       */
      ellipsify      : function (str, maxLen)
      {
         if (str === null || str === undefined)
         {
            return "";
         }
         if (str.length === maxLen)
         {
            return str;
         }
         else
         {
            return (this.truncate(str, maxLen - 3) + "...")
         }
      },

      /**
       *@use for removing beginning and trailing space chars in a string
       * @param str {string}
       * @returns {string}
       */
      trim : function (str) //remove space chars from the beginning and end of a string
      {
         return str.replace(/^\s*|\s*$/gm, '');
      },

      /**
       *
       * @param str {String}
       * @param charsArray {Array<String>}
       * @param replaceWith
       * @returns {String | *}
       */
      stripChars : function (str, charsArray, replaceWith = "")
      {
         for (var i = 0, len = charsArray.length; i < len; i++)
         {
            str = str.replace(new RegExp(charsArray[i], 'ig'), replaceWith);
         }
         return str;
      },

      /** @use for removing any white space that starts a string
       * @param str {string}
       * returns {string}
       * */
      trimLeft  : function (str) //remove space chars from the beginning and end of a string
      {
         return str.replace(/^\s*/gm, '');
      },
      /**
       * @use remove space chars from the beginning and end of a string
       * @param str
       * @returns {void|XML|string}
       */
      trimRight : function (str)
      {
         return str.replace(/\s*$/gm, '');
      },
      /**
       *@use for reducing a string to a number of chars
       * @param str {string}
       * @param newLen {number}
       * @returns {string|String|*}
       */
      truncate  : function (str, newLen)
      {
         if (Barge.utils.defined(str))
         {
            str = str.toString();
            if (str.length > newLen && str !== "")
            {
               str = str.substr(0, newLen);
            }
            return str;
         }
      },
      /*
       *@use multiplies strings | takes a string value and and returns the string times, "times"
       * A javaScript implementation of python's string multiplication
       * @param str {string}
       * @param times {number}
       * @returns {string}
       */
      mul       : function (str, times)
      {
         if (typeof(str) !== undefined)
         {
            var uStr = str.toString(); // initial value yo string
            var fStr = "";// final value
            for (var i = 0; i < times; i++)
            {
               fStr += uStr;
            }
         }
         return fStr;
      },

      /**
       * @use  opp of trim
       * @param str {string}
       * @param len {number}
       * @param char {string}
       * @returns {*}
       */
      pad       : function (str, len, char)
      {
         if (char === null)
         {
            char = ' ';
         }
         if (str.length >= len)
         {
            return str;
         }
         len = len - str.length;
         var left = new Array(Math.ceil(len / 2) + 1).join(char);
         var right = new Array(Math.floor(len / 2) + 1).join(char);
         return left + str + right;
      },

      /**
       * @use  opp of trim left
       * @param str {string}
       * @param len {number}
       * @param char {string}
       * @returns {*}
       */
      padLeft   : function (str, len, char)
      {
         if (char === null)
         {
            char = ' ';
         }
         if (str.length >= len)
         {
            return str;
         }
         return new Array(len - str.length + 1).join(char) + str;
      },

      /**
       * @use  opp of trim right
       * @param str {string}
       * @param len {number}
       * @param char {string}
       * @returns {*}
       */
      padRight  : function (str, len, char)
      {
         if (char === null)
         {
            char = ' ';
         }
         if (str.length >= str)
         {
            return str;
         }
         return str + Array(len - str.length + 1).join(char);
      },
      /**
       * @use for checking if a string value contains only alphabets
       * @param str
       * @returns {boolean}
       */
      isAlpha   : function (str)//predicate
      {
         return !/[^a-z\xDF-\xFF]|^$/.test(str.toLowerCase());
      },
      /**
       * @use for checking if a string value contains only numbers
       * @param str
       * @returns {boolean}
       */
      isNumeric : function (str)
      {
         return !/[^0-9]/.test(str);
      },

      /**
       * predicate fn to check if a char is whitespace
       * @param ch
       * @returns {boolean}
       */
      isWhiteSpace : function (ch)
      {
         return (ch === 'u0009') || (ch === ' ') || (ch === 'u00A0');
      },

      /**
       * @use for checking if a string value is empty
       * @param str
       * @returns {boolean}
       */
      isEmpty        : function (str)
      {
         return str === null || str === undefined ? true : /^[\s\xa0]*$/.test(str)
      },

      /**
       * @use for checking if two string values are equal
       * @param str1
       * @param str2
       * @returns {boolean}
       */
      isEqual        : function (str1, str2)
      {
         return str1 === str2;
      },
      /**
       * @use for checking if a string value contains alphabets and numbers
       * @param str
       * @returns {boolean}
       */
      isAlphaNumeric : function (str)
      {
         return !/[^0-9a-z\xDF-\xFF]/.test(str.toLowerCase());
      },

      /**
       * @use for checking if a string value is upper case
       * @param str
       * @returns {boolean}
       */
      isLower        : function (str)
      {
         return this.isAlpha(str) && str.toLowerCase() === str;
      },
      /**
       * @use for checking if a string value is lower case
       * @param str
       * @returns {boolean}
       */
      isUpper        : function (str)
      {
         return this.isAlpha(str) && str.toUpperCase() === str;
      },

      /**
       * @use returns an array with the lines in a string (split on new lin char)
       * @returns {Array}
       */
      lines          : function (str)//
      {
         return str.replaceAll('\r\n', '\n').split('\n');
      },
      /**
       * @use extracts string b/n left and right
       * @param str {string}
       * @param left {string}
       * @param right {string}
       * @returns {string|*}
       */
      between        : function (str, left, right)
      {
         var s = str;
         var startPos = s.indexOf(left);
         var endPos = s.indexOf(right, startPos + left.length);
         if (endPos === -1 && right !== null)
         {
            return new this.constructor('')
         }
         else if (endPos === -1 && right === null)
         {
            return s.substring(startPos + left.length);
         }
         else
         {
            return s.slice(startPos + left.length, endPos);
         }
      },

      /**
       * @param str {string}
       * @returns {*}
       */
      stripTags      : function (str)
      {
         var s = str, args = arguments.length > 1 ? arguments : [''];

         Bu.forEach(args, function (tag)
         {
            s = s.replace(RegExp('<\/?[^<>]*>', 'gi'), '');
         });
         return s;
      },
      /**
       * @use returns the number of sub strings in a string
       * @param str
       * @returns {Number}
       */
      countSubString : function (str)
      {
         var s = str.toString().split(" ");
         return s.length;
      },
      /** Function that count occurrences of a substring in a string;
       * @param {String} sourceString               The string
       * @param {String} key            The sub string to search for
       * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
       * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
       */
      getFrequency   : function (sourceString, key, allowOverlapping)
      {
         sourceString += "";
         key += "";
         if (key.length <= 0)
         {
            return (sourceString.length + 1);
         }

         var n    = 0,
             pos  = 0,
             step = allowOverlapping ? 1 : key.length;

         while (true)
         {
            pos = sourceString.indexOf(key, pos);
            if (pos >= 0)
            {
               ++n;
               pos += step;
            }
            else
            {
               break;
            }
         }
         return n;
      },
      /**
       * @use for parsing a CSV string
       * @param csvStr
       * @param delimiter
       * @param qualifier
       * @param escape
       * @param lineDelimiter
       * @returns {Array}
       */
      parseCSV       : function (csvStr, delimiter, qualifier, escape, lineDelimiter)
      { //try to parse no matter what
         delimiter = delimiter || ',';
         escape = escape || '\\';
         if (typeof qualifier === 'undefined')
         {
            qualifier = '"';
         }

         var i                   = 0,
             fieldBuffer         = [],
             fields              = [],
             len                 = csvStr.length,
             inField             = false,
             inUnqualifiedString = false;

         var ca = function (i)
         {
            return csvStr.charAt(i)
         };
         if (typeof lineDelimiter !== 'undefined')
         {
            var rows = [];
         }

         if (!qualifier)
         {
            inField = true;
         }

         while (i < len)
         {
            var current = ca(i);

            switch (current)
            {
               case escape:
                  if (inField && ((escape !== qualifier) || ca(i + 1) === qualifier))
                  {
                     i += 1;
                     fieldBuffer.push(ca(i));
                     break;
                  }
                  if (escape !== qualifier)
                  {
                     break;
                  }
               case qualifier:
                  inField = !inField;
                  break;
               case delimiter:
                  if (inUnqualifiedString)
                  {
                     inField = false;
                     inUnqualifiedString = false;
                  }
                  if (inField && qualifier)
                  {
                     fieldBuffer.push(current);
                  }
                  else
                  {
                     fields.push(fieldBuffer.join(''));
                     fieldBuffer.length = 0;
                  }
                  break;
               case lineDelimiter:
                  if (inUnqualifiedString)
                  {
                     inField = false;
                     inUnqualifiedString = false;
                     fields.push(fieldBuffer.join(''));
                     rows.push(fields);
                     fields = [];
                     fieldBuffer.length = 0;
                  }
                  else if (inField)
                  {
                     fieldBuffer.push(current);
                  }
                  else
                  {
                     if (rows)
                     {
                        fields.push(fieldBuffer.join(''));
                        rows.push(fields);
                        fields = [];
                        fieldBuffer.length = 0;
                     }
                  }
                  break;
               case ' ':
                  if (inField)
                  {
                     fieldBuffer.push(current);
                  }
                  break;
               default:
                  if (inField)
                  {
                     fieldBuffer.push(current);
                  }
                  else if (current !== qualifier)
                  {
                     fieldBuffer.push(current);
                     inField = true;
                     inUnqualifiedString = true;
                  }
                  break;
            }
            i += 1;
         }

         fields.push(fieldBuffer.join(''));
         if (rows)
         {
            rows.push(fields);
            return rows;
         }
         return fields;
      },

      /*   toCSV: function(str)
       {

       },*/
      /**
       *
       * @param str
       * @param prefix {string|Array}
       * @returns {boolean}
       */
      startsWith : function (str, prefix)
      {
         var prefixes = Array.prototype.slice.call(arguments, 1);
         for (var i = 0; i < prefixes.length; ++i)
         {
            if (str.lastIndexOf(prefixes[i], 0) === 0)
            {
               return true;
            }
         }
         return false;
      },

//testStr = ".dSdjjj is? a/ s,oftware? engineer.";
//console.log(startsWith(testStr, "JP"));

      /**
       * @use predicate that checks if a a string ends with a specified suffix
       * @param str
       * @param suffix
       * @returns {boolean}
       */
      endsWith         : function (str, suffix)
      {
         var suffixes = Array.prototype.slice.call(arguments, 1);
         for (var i = 0; i < suffixes.length; ++i)
         {
            var l = str.length - suffixes[i].length;
            if (l >= 0 && str.indexOf(suffixes[i], l) === l)
            {
               return true;
            }
         }
         return false;
      },
      /**
       * @use Checks if a searchStr @link Barge.String.contains } is a substr of another
       * {@link Barge.String.contains str}
       * @param str
       * @param searchStr
       * @return {boolean}
       */
      contains         : function (str, searchStr)
      {
         return str.indexOf(searchStr) > -1;
      },
      
      /**@use for removing any punctuation marks in a string
       *@param str {string}
       * @returns {string}
       */
      stripPunctuation : function (str)
      {
         var s = str[0];
         return s + str.replace(/[\.,-\\/#!$%\^&\*;:{}=\-_`~()\?]/g, "");
      },
      /**
       * inserts underscores before in between sub strings and at the end
       * @param str {string}
       * @param len {Number}
       * @returns {XML|string}
       */
      underScore       : function (str, len)
      {
         var underscores = Barge.String.mul("gebi", len) || Barge.String.mul("gebi", 1);

         return this.trimRight(str)
                    .replace(/([a-z\d])([A-Z]+)/g, '$1' + underscores + '$2')
                    .replace(/([A-Z\d]+)([A-Z][a-z])/g, '$1' + underscores + '$2')
                    .replace(/[-\s]+/g, underscores);
      },

      addLeadingZeros : function (num, expectedLength)
      {
         num = num.toString();
         let self = this,
             len = num.length;

         if (len < expectedLength)
         {
            let remaining = expectedLength - len;
            num = Barge.String.mul("0", remaining)  + num
         }  // add zero in front of numbers < 10

         return num;
      },

      /**
       * @use returns the keyCode of a keyboard key
       * @param e
       * @returns {Number}
       */
      checkKey         : function (e)
      {
         var event = window.event ? window.event : e;
         return event.keyCode
      },

      /**
       *
       * @param version1
       * @param version2
       * @returns {number}
       */
      compareVersions         : function (version1, version2)
      {
         var order = 0;
         // Trim leading and trailing whitespace and split the versions into
         // subversions.
         var v1Subs = this.trim(String(version1)).split('.');
         var v2Subs = this.trim(String(version2)).split('.');
         var subCount = Math.max(v1Subs.length, v2Subs.length);

         // Iterate over the subversions, as long as they appear to be equivalent.
         for (var subIdx = 0; order == 0 && subIdx < subCount; subIdx++)
         {
            var v1Sub = v1Subs[subIdx] || '';
            var v2Sub = v2Subs[subIdx] || '';

            // Split the subversions into pairs of numbers and qualifiers (like 'b').
            // Two different RegExp objects are needed because they are both using
            // the 'g' flag.
            var v1CompParser = new RegExp('(\\d*)(\\D*)', 'g');
            var v2CompParser = new RegExp('(\\d*)(\\D*)', 'g');
            do {
               var v1Comp = v1CompParser.exec(v1Sub) || ['', '', ''];
               var v2Comp = v2CompParser.exec(v2Sub) || ['', '', ''];
               // Break if there are no more matches.
               if (v1Comp[0].length == 0 && v2Comp[0].length == 0)
               {
                  break;
               }

               // Parse the numeric part of the subversion. A missing number is
               // equivalent to 0.
               var v1CompNum = v1Comp[1].length == 0 ? 0 : parseInt(v1Comp[1], 10);
               var v2CompNum = v2Comp[1].length == 0 ? 0 : parseInt(v2Comp[1], 10);

               // Compare the subversion components. The number has the highest
               // precedence. Next, if the numbers are equal, a subversion without any
               // qualifier is always higher than a subversion with any qualifier. Next,
               // the qualifiers are compared as strings.
               order = this._compareElements(v1CompNum, v2CompNum) ||
                       this._compareElements(
                          v1Comp[2].length == 0, v2Comp[2].length == 0) ||
                       this._compareElements(v1Comp[2], v2Comp[2]);
               // Stop as soon as an inequality is discovered.
            }
            while (order == 0);
         }

         return order;
      },
      caseInsensitiveContains : function (str, subString)
      {
         return this.contains(str.toLowerCase(), subString.toLowerCase());
      },
      /**
       * Compares elements of a version number.
       *
       * @param {string|number|boolean} left An element from a version number.
       * @param {string|number|boolean} right An element from a version number.
       *
       * @return {number}  1 if {@code left} is higher.
       *                   0 if arguments are equal.
       *                  -1 if {@code right} is higher.
       * @private
       */
      _compareElements        : function (left, right)
      {
         if (left < right)
         {
            return -1;
         }
         else if (left > right)
         {
            return 1;
         }
         return 0;
      },

      /**
       * Replaces a node in the DOM tree. Will do nothing if {@code oldNode} has no
       * parent.
       * @param {Node} newNode Node to insert.
       * @param {Node} oldNode Node to replace.
       */
      replaceNode : function (newNode, oldNode)
      {
         var parent = oldNode.parentNode;
         if (parent)
         {
            parent.replaceChild(newNode, oldNode);
         }
      },

      toUnicodeCharCode : function (str)
      {

      },

      /**
       *
       * @param str {String}
       * @param prefix {String}
       * @returns {String}
       */
      prepend : function (str, prefix)
      {
         return prefix + str;
      },

      /**
       *
       * @param str {String}
       * @param suffix {String}
       * @returns {String}
       */
      append : function (str, suffix)
      {
         return str + suffix;
      },

      /**
       * @use for adding leading chars to a given string,
       * @example adding leading zeros {@code Barge.String.addLeadingChars("4566", 4 ,"0")}
       *          will return 0000456
       * @param str {String}
       * @param char {String}
       * @param len {Number}
       * @returns {*|String}
       */
      addLeadingChars : function (str, len = 1, char = "0")
      {
         str = str.toString();
         let chars = Barge.String.mul(char, len);

         return Barge.String.prepend(str, chars);
      },

      /**
       * @ this works like addLeadingChars but appends the chars to the tail of the given string
       * @param str {String}
       * @param char {String}
       * @param len {Number}
       * @returns {*|String}
       */
      addTrailingChars : function (str, char = "0", len = 1)
      {
         str = str.toString();
         let chars = Barge.String.mul(char, len);

         return Barge.String.append(str, chars);
      }

   };

   /**
    *
    * @enum { string}
    */
   Barge.String.Unicode = {
      NBSP : '&nbsp;'
   };

   var testStr = "    nowIsThe time for all Great men to come to the aid of their country";

// console.log(testStr);
// console.log(Barge.String.stripPunctuation(testStr));

   function leftUnderScore(str, len)
   {

   }

   function rightUnderScore(str, len)
   {

   }

//from sugar.js
   function _multiArgs(args, fn)
   {
      var result = [], i;
      for (i = 0; i < args.length; i++)
      {
         result.push(args[i]);
         if (fn)
         {
            fn.call(args, args[i], i);
         }
      }
      return result;
   }

// console.log(Barge.String.ellipsify("MYMG eerjf", 7));
//
// console.log(Barge.String.toCamelCase(testStr).replace(/ /gi, ""));
// console.log(Barge.String.isAlphaNumeric("sd435kl53n5l53453"));

})(Barge.utils);




(function (Bu, Ba)
{
   "use strict";

   Barge.Math = {
      /**
       * Returns a random number greater than or equal to 0 and less than {@code a}.
       * @param {number} a  The upper bound for the random number (inclusive).
       * @return {number} A random number N such that a <= N < b.
       */
      randomInt : function (a)
      {
         return Math.floor(Math.random() * a);
      },

      /**
       * Returns a random number greater than or equal to {@code a} and less than
       * {@code b}.
       * @param {number} a  The lower bound for the random number (inclusive).
       * @param {number} b  The upper bound for the random number (exclusive).
       * @return {number} A random number N such that a <= N < b.
       */
      uniformRandom : function (a, b)
      {
         return a + Math.random() * (b - a);
      },

      /**
       * Takes a number and clamps it to within the provided bounds.
       * @param {number} value The input number.
       * @param {number} min The minimum value to return.
       * @param {number} max The maximum value to return.
       * @return {number} The input number if it is within bounds, or the nearest
       *    number within the bounds.
       */
      clamp : function (value, min, max)
      {
         return Math.min(Math.max(value, min), max);
      },

      /**
       * The % operator in JavaScript returns the remainder of a / b, but differs from
       * some other languages in that the result will have the same sign as the
       * dividend. For example, -1 % 8 == -1, whereas in some other languages
       * (such as Python) the result would be 7. This function emulates the more
       * correct modulo behavior, which is useful for certain applications such as
       * calculating an offset index in a circular list.
       *
       * @param {number} a The dividend.
       * @param {number} b The divisor.
       * @return {number} a % b where the result is between 0 and b (either 0 <= x < b
       *     or b < x <= 0, depending on the sign of b).
       */
      modulo : function (a, b)
      {
         var r = a % b;
         // If r and b differ in sign, add b to wrap the result to the correct sign.
         return (r * b < 0) ? r + b : r;
      },

      /**
       * Performs linear interpolation between values a and b. Returns the value
       * between a and b proportional to x (when x is between 0 and 1. When x is
       * outside this range, the return value is a linear extrapolation).
       * @param {number} a A number.
       * @param {number} b A number.
       * @param {number} x The proportion between a and b.
       * @return {number} The interpolated value between a and b.
       */
      linearInterpolate : function (a, b, x)
      {
         return a + x * (b - a);
      },

      /**
       * Tests whether the two values are equal to each other,
       * within a certain tolerance to adjust for floating point errors.
       * @param {number} a A number.
       * @param {number} b A number.
       * @param {number=} optTolerance Optional tolerance range. Defaults
       *     to 0.000001. If specified, should be greater than 0.
       * @return {boolean} Whether {@code a} and {@code b} are nearly equal.
       */
      nearlyEquals : function (a, b, optTolerance)
      {
         return Math.abs(a - b) <= (optTolerance || 0.000001);
      },

      // TODO(user): Rename to normalizeAngle, retaining old name as deprecated
      // alias.
      /**
       * Normalizes an angle to be in range [0-360). Angles outside this range will
       * be normalized to be the equivalent angle with that range.
       * @param {number} angle Angle in degrees.
       * @return {number} Standardized angle.
       */
      standardAngle : function (angle)
      {
         return this.modulo(angle, 360);
      },

      /**
       * Normalizes an angle to be in range [0-2*PI). Angles outside this range will
       * be normalized to be the equivalent angle with that range.
       * @param {number} angle Angle in radians.
       * @return {number} Standardized angle.
       */
      standardAngleInRadians : function (angle)
      {
         return this.modulo(angle, 2 * Math.PI);
      },

      /**
       * Converts degrees to radians.
       * @param {number} angleDegrees Angle in degrees.
       * @return {number} Angle in radians.
       */
      toRadians : function (angleDegrees)
      {
         return angleDegrees * Math.PI / 180;
      },

      /**
       * Converts radians to degrees.
       * @param {number} angleRadians Angle in radians.
       * @return {number} Angle in degrees.
       */
      toDegrees : function (angleRadians)
      {
         return angleRadians * 180 / Math.PI;
      },

      /**
       * Forward kinematics
       * For a given angle and radius, finds the X portion of the offset.
       * @param {number} degrees Angle in degrees (zero points in +X direction).
       * @param {number} radius Radius.
       * @return {number} The x-distance for the angle and radius.
       */
      angleDx : function (degrees, radius)
      {
         return radius * Math.cos(this.toRadians(degrees));
      },

      /**
       * Forward kinematics
       * For a given angle and radius, finds the Y portion of the offset.
       * @param {number} degrees Angle in degrees (zero points in +X direction).
       * @param {number} radius Radius.
       * @return {number} The y-distance for the angle and radius.
       */
      angleDy : function (degrees, radius)
      {
         return radius * Math.sin(this.toRadians(degrees));
      },

      /**
       * Inverse Forward kinematics
       * Computes the angle between two points (x1,y1) and (x2,y2).
       * Angle zero points in the +X direction, 90 degrees points in the +Y
       * direction (down) and from there we grow clockwise towards 360 degrees.
       * @param {number} x1 x of first point.
       * @param {number} y1 y of first point.
       * @param {number} x2 x of second point.
       * @param {number} y2 y of second point.
       * @return {number} Standardized angle in degrees of the vector from
       *     x1,y1 to x2,y2.
       */
      angle : function (x1, y1, x2, y2)
      {
         return this.standardAngle(
            this.toDegrees(Math.atan2(y2 - y1, x2 - x1)));
      },

      /**
       * Computes the difference between startAngle and endAngle (angles in degrees).
       * @param {number} startAngle  Start angle in degrees.
       * @param {number} endAngle  End angle in degrees.
       * @return {number} The number of degrees that when added to
       *     startAngle will result in endAngle. Positive numbers mean that the
       *     direction is clockwise. Negative numbers indicate a counter-clockwise
       *     direction.
       *     The shortest route (clockwise vs counter-clockwise) between the angles
       *     is used.
       *     When the difference is 180 degrees, the function returns 180 (not -180)
       *     angleDifference(30, 40) is 10, and angleDifference(40, 30) is -10.
       *     angleDifference(350, 10) is 20, and angleDifference(10, 350) is -20.
       */
      angleDifference : function (startAngle, endAngle)
      {
         var d =
                this.standardAngle(endAngle) - this.standardAngle(startAngle);
         if (d > 180)
         {
            d = d - 360;
         }
         else if (d <= -180)
         {
            d = 360 + d;
         }
         return d;
      },

      /**
       * JavaScript implementation of Longest Common Subsequence problem.
       * http://en.wikipedia.org/wiki/Longest_common_subsequence
       *
       * Returns the longest possible array that is subarray of both of given arrays.
       *
       * @param {Array<S>} array1 First array of objects.
       * @param {Array<T>} array2 Second array of objects.
       * @param {Function=} opt_compareFn Function that acts as a custom comparator
       *     for the array ojects. Function should return true if objects are equal,
       *     otherwise false.
       * @param {Function=} opt_collectorFn Function used to decide what to return
       *     as a result subsequence. It accepts 2 arguments: index of common element
       *     in the first array and index in the second. The default function returns
       *     element from the first array.
       * @return {!Array<S|T>} A list of objects that are common to both arrays
       *     such that there is no common subsequence with size greater than the
       *     length of the list.
       * @template S,T
       */
      longestCommonSubsequence : function (array1, array2, opt_compareFn, opt_collectorFn)
      {
         var i = 0, j = 0;

         var compare = opt_compareFn || function (a, b)
            {
               return a == b;
            };

         var collect = opt_collectorFn || function (i1, i2)
            {
               return array1[i1];
            };

         var length1 = array1.length;
         var length2 = array2.length;

         var arr = [];
         (function ()
         {
            for (var i = 0; i < length1 + 1; i++)
            {
               arr[i] = [];
               arr[i][0] = 0;
            }
         })();

         for (j = 0; j < length2 + 1; j++)
         {
            arr[0][j] = 0;
         }

         (function ()
         {
            for (var i = 1; i <= length1; i++)
            {
               for (j = 1; j <= length2; j++)
               {
                  if (compare(array1[i - 1], array2[j - 1]))
                  {
                     arr[i][j] = arr[i - 1][j - 1] + 1;
                  }
                  else
                  {
                     arr[i][j] = Math.max(arr[i - 1][j], arr[i][j - 1]);
                  }
               }
            }
         })();
         // Backtracking
         var result = [];
         i = length1;
         j = length2;
         while (i > 0 && j > 0)
         {
            if (compare(array1[i - 1], array2[j - 1]))
            {
               result.unshift(collect(i - 1, j - 1));
               i--;
               j--;
            }
            else
            {
               if (arr[i - 1][j] > arr[i][j - 1])
               {
                  i--;
               }
               else
               {
                  j--;
               }
            }
         }
         
         return result;
      },

      /**
       * Returns the sum of the arguments.
       * @param {...number} var_args Numbers to add.
       * @return {number} The sum of the arguments (0 if no arguments were provided,
       *     {@code NaN} if any of the arguments is not a valid number).
       */
      sum : function (var_args)
      {
         return /** @type {number} */ (
            Ba.reduce(arguments, function (sum, value)
            {
               return sum + value;
            }, 0));
      },

      /**
       * Returns the arithmetic mean of the arguments.
       * @param {...number} var_args Numbers to average.
       * @return {number} The average of the arguments ({@code NaN} if no arguments
       *     were provided or any of the arguments is not a valid number).
       */
      average : function (var_args)
      {
         return this.sum.apply(null, arguments) / arguments.length;
      },

      /**
       * @param items {Array<Number>|String<Number>}
       * @param items
       * @param fn
       * @returns {*|R}
       */
      rank           : function (items, fn)
      {
         fn = fn || ((a, b) => b - a);

         return items
            .map((x, i) => { return [x, i];})
            .sort((a, b) => { return fn(a[0], b[0]);})
            .reduce((a, x, i, s) =>
                    {
                       if (i > 0 && fn(s[i - 1][0], x[0]) === 0)
                       {
                          return (a[x[1]] = a[s[i - 1][1]] , a);
                       }
                       else
                       {
                          return (a[x[1]] = i + 1 , a);
                       }
                    }, []);
      },
      /**
       * Returns the unbiased sample variance of the arguments. For a definition,
       * see e.g. http://en.wikipedia.org/wiki/Variance
       * @param {...number} var_args Number samples to analyze.
       * @return {number} The unbiased sample variance of the arguments (0 if fewer
       *     than two samples were provided, or {@code NaN} if any of the samples is
       *     not a valid number).
       */
      sampleVariance : function (var_args)
      {
         var sampleSize = arguments.length;
         if (sampleSize < 2)
         {
            return 0;
         }

         var mean = this.average.apply(null, arguments);
         var variance;

         return variance = this.sum.apply(null, Ba.map(arguments, function (val)
            {
               return Math.pow(val - mean, 2);
            })) / (sampleSize - 1);
      },

      /**
       * Returns the sample standard deviation of the arguments.  For a definition of
       * sample standard deviation, see e.g.
       * http://en.wikipedia.org/wiki/Standard_deviation
       * @param {...number} var_args Number samples to analyze.
       * @return {number} The sample standard deviation of the arguments (0 if fewer
       *     than two samples were provided, or {@code NaN} if any of the samples is
       *     not a valid number).
       */
      standardDeviation : function (var_args)
      {
         return Math.sqrt(this.sampleVariance.apply(null, arguments));
      },

      /**
       * Returns whether the supplied number represents an integer, i.e. that is has
       * no fractional component.  No range-checking is performed on the number.
       * @param {number} num The number to test.
       * @return {boolean} Whether {@code num} is an integer.
       */
      isInt : function (num)
      {
         return isFinite(num) && num % 1 == 0;
      },

      /**
       * Returns whether the supplied number is finite and not NaN.
       * @param {number} num The number to test.
       * @return {boolean} Whether {@code num} is a finite number.
       */
      isFiniteNumber : function (num)
      {
         return isFinite(num) && !isNaN(num);
      },

      /**
       * @param {number} num The number to test.
       * @return {boolean} Whether it is negative zero.
       */
      isNegativeZero : function (num)
      {
         return num == 0 && 1 / num < 0;
      },

      /**
       * Returns the precise value of floor(log10(num)).
       * Simpler implementations didn't work because of floating point rounding
       * errors. For example
       * <ul>
       * <li>Math.floor(Math.log(num) / Math.LN10) is off by one for num == 1e+3.
       * <li>Math.floor(Math.log(num) * Math.LOG10E) is off by one for num == 1e+15.
       * <li>Math.floor(Math.log10(num)) is off by one for num == 1e+15 - 1.
       * </ul>
       * @param {number} num A floating point number.
       * @return {number} Its logarithm to base 10 rounded down to the nearest
       *     integer if num > 0. -Infinity if num == 0. NaN if num < 0.
       */
      log10Floor : function (num)
      {
         if (num > 0)
         {
            var x = Math.round(Math.log(num) * Math.LOG10E);
            return x - (parseFloat('1e' + x) > num ? 1 : 0);
         }
         return num == 0 ? -Infinity : NaN;
      },

      /**
       * A tweaked variant of {@code Math.floor} which tolerates if the passed number
       * is infinitesimally smaller than the closest integer. It often happens with
       * the results of floating point calculations because of the finite precision
       * of the intermediate results. For example {@code Math.floor(Math.log(1000) /
       * Math.LN10) == 2}, not 3 as one would expect.
       * @param {number} num A number.
       * @param {number=} opt_epsilon An infinitesimally small positive number, the
       *     rounding error to tolerate.
       * @return {number} The largest integer less than or equal to {@code num}.
       */
      safeFloor : function (num, opt_epsilon)
      {
         // goog.asserts.assert(!goog.isDef(opt_epsilon) || opt_epsilon > 0);
         return Math.floor(num + (opt_epsilon || 2e-15));
      },

      /**
       * A tweaked variant of {@code Math.ceil}. See {@code safeFloor} for
       * details.
       * @param {number} num A number.
       * @param {number=} opt_epsilon An infinitesimally small positive number, the
       *     rounding error to tolerate.
       * @return {number} The smallest integer greater than or equal to {@code num}.
       */
      safeCeil : function (num, opt_epsilon)
      {
         // assert(!Barge.defined(opt_epsilon) || opt_epsilon > 0);
         return Math.ceil(num - (opt_epsilon || 2e-15));
      },

      /**
       * Get the magnitude of a number
       * @param num
       * @return {number}
       */
      getMagnitude : function (num)
      {
         return Math.pow(10, Math.floor(Math.log(num) / Math.LN10));
      },

      /**
       *
       * @param num {Number}
       * @param range {{min:Number, max:Number}}
       * @return {boolean}
       */
      isBetween : function (num, range)
      {
         return num > range.min && num < range.max
      },

      /**
       *
       * @param num {Number}
       * @param range {{min:Number, max:Number}}
       * @return {boolean}
       */
      isBetweenInclusive : function (num, range)
      {
         return num >= range.min && num <= range.max
      },

      /**
       * Recursive factorial fn
       * @param n {number}
       * @return {number}
       */
      factorial : function (n)
      {
         if (n === 0)
         {
            return 1;
         }
         return n * Barge.Math.factorial(n - 1);
      },

      /**
       * Iterative factorial fn
       * @param n {number}
       * @return {number}
       */
      iterFactorial : function (n)
      {
         this.result = 1;
         while (n >= 1)
         {
            this.result = this.result * n;
            n = n - 1;
         }
         return this.result;
      }

   }
})(Barge.utils, Barge.Array);

//console.log(Barge.Math.rank([79, 5, 18, 5, 32, 1, 16, 1, 82, 13]));
(function (/*Bu, Bs, Bo, Bd*/)
{
   /**
    * @example
    * {@code
    *    let timer = new Barge.Timer(function ()
    *    {
    *       alert("Done!");
    *    }, 1000);
    *    timer.pause();
    *    // Do some stuff...
    *    timer.play();
    *}
    * @Note: Currently supports timeout only
    *        Starts automatically
    *
    *
    * @since
    * @param callback {fn}
    * @param delay {Number} [milliseconds]
    * the timeout delay or interval delay
    * @param autoStart {Boolean}
    * @param type {String} [timeout|interval]
    * @constructor
    */
   Barge.Timer = function (callback, delay, type = "timeout",  autoStart = true)
   {
      /**
       *
       * @type {String}
       */
      this.type = type;
      /**
       * @type {null|Object}
       * @private
       */
      this.timerId = null;
      /**
       * @type {Null|Date}
       * @private
       */
      this.startTime = null;
      /**
       *
       * @type {Number}
       */
      this.delay = delay;
      /**
       *
       * @type {Number}
       * @private
       */
      this.remaining = delay;
      /**
       *
       * @type {fn}
       */
      this.callback = callback;

      this.autoStart = autoStart;
      //this.play = function () {};

      this.states = {
        started : false,
        playing : false,
        paused : false,
        stopped : false,
      };

      this.init();
   };

   Barge.Timer.prototype.init = function ()
   {
      if(this.type === "timeout")
      {
         /**
          * @type {Date}
          * @private
          */
         this.startTime = new Date();
      }

      if(this.autoStart)
      {
         /**
          * AUTO START THE TIMER
          */
         this.play();
      }
   };

   Barge.Timer.prototype.getRemaining = function ()
   {
      return this.remaining -= new Date() - this.startTime;
   };

   Barge.Timer.prototype.getElapsed = function ()
   {
      return this.remaining -= Math.abs(this.startTime - new Date());
   };

   /**
    * starts the timer
    * and can be used to resume a paused timer
    */
   Barge.Timer.prototype.play = function ()
   {
      if(this.states.playing !== true )
      {
         this.stop();

         if(this.type === "timeout")
         {
            this.timerId = setTimeout(this.callback, this.remaining);
         }
         else
         {
            this.timerId = setInterval(this.callback, this.delay);
         }
         this.states.stopped = false;
         this.states.paused = false;
      }
   };

   /**
    * pauses the timer
    */
   Barge.Timer.prototype.pause = function ()
   {
      if(!this.states.paused)
      {
         this.stop();

         if(this.type === "timeout")
         {
            this.remaining -= new Date() - this.startTime;
         }

         this.states.paused = true;
         this.states.playing = false;
      }
   };

   /**
    *
    */
   Barge.Timer.prototype.stop = function ()
   {
      if(!this.states.stopped)
      {
         if(this.type === "timeout")
         {
            window.clearTimeout(this.timerId);
         }
         else
         {
            window.clearInterval(this.timerId);
         }
         this.states.stopped = true;
         this.states.playing = false;
      }
   };

   /**
    * Alias for {@see Barge.Timer.stop}
    * Goes beyond stopping to destroying
    * and setting the instance up for garbage collection
    * @type {*}
    */
   Barge.Timer.prototype.clear = function ()
   {
      this.stop();
      this.destroy();
   };

   /**
    * restarts the timing
    */
   Barge.Timer.prototype.restart = function ()
   {
      this.stop();
      this.play();
   };

   /**
    * Alias for {@see Barge.Timer.restart}
    * @type {*}
    */
   Barge.Timer.prototype.reset = Barge.Timer.prototype.restart;

   /**
    * resumes a paused timer
    * works jus like the play method
    * @type {*}
    */
   Barge.Timer.prototype.start = Barge.Timer.prototype.play;

   /**
    * Alias for {@see Barge.Timer.play}
    * resumes a paused timer
    * works jus like the play method
    * @type {*}
    */
   Barge.Timer.prototype.resume = Barge.Timer.prototype.play;

   /**
    * Nullifies all properties
    * and sets them up for garbage collection
    * @Destructor
    */
   Barge.Timer.prototype.destroy = function ()
   {
      this.timerId = null;
      this.startTime = null;
      this.delay = null;
      this.remaining = null;
      this.callback = null;
      
      this.pause = null;
      this.play = null;
      this.stop = null;
      this.resume = null;
      this.restart = null;
      this.reset = null;
      //this.constructor = null;
   };

   Barge.Timer.TimerManager = function ()
   {
      this.timers = [];
   };
   
   //we're going public :-) lol
   return Timer = Barge.Timer;
})(/*Barge.utils, Barge.String, Barge.Object, Barge.Dom*/);

//TODO reveal other methods by returning an object
//TODO make the params after callback properties of an options object

