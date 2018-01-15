/**
 * @Author Created by ARCH on 14/05/2016.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Barge Studios EULA
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * http://www.bargestudios.com/bumblebee/licence
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *        \__/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 *
 * @fileOverview This is the base static class for bumble bee library
 *
 *
 * @user msg: Some lines in this file use constructs from es6 or later
 * to make it es5 compatible check for es6+ or #es6+ in comments
 */

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

//TODO remove some of the functions from herer into their right place