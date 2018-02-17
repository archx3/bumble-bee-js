/**
 * @Author Created by ARCH on 25/08/2016.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Barge Studios Eula
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
 * @fileOverview This object contains objects, enums, static + constructor methods for manipulating DOM elements
 *
 * @requires Barge.Utils
 * @requires Barge.String
 * @requires Barge.Array
 * @requires Barge.Object
 *
 * @user MSG: Some lines in this file use constructs from es6 or later
 * to make it es5 compatible check for es6+ or #es6+ in comments
 */

var Bee = Bee || {};

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

(function (Bu, Bs, Ba, Bo)
{
   /**
    *@object
    *
    */
   Bee.Dom = {
      root     : Element.prototype,
      i        : 0,
      len      : 0,
      innerLen : 0,

      posX              : 0,
      posY              : 0,
      /**
       * Cached default DOM helper.
       * @type {!Bee.Widget.DomHelper |undefined}
       * @private
       */
      _defaultDomHelper : null,

      gsv : Bee.Utils.getStyleValue,

      /**
       *
       * @param query {String}
       * @param single {Boolean}
       * @returns {*}
       */
      $     : function (query, single)
      {
         if (query)
         {
            if (query.match(/^#(\S*)/))
            {
               return document.getElementById(query);
            }
            else if (query.match(/^\.(\S*)/) && single)
            {
               return document.querySelector(query);
            }
            else
            {
               return document.querySelectorAll(query);
            }
         }
         else if (!Bu.defined(query))
         {
            throw new Error("method Bee.Dome.$() expects a query");
         }
      },
      /**@use: the following function returns the id of the object passed
       *@param {Element} el HTML Element
       *@returns  [string] HTML element id
       * */
      getID : function (el)
      {
         return el.id;
      },

      /**
       *
       * @param event {Event}
       */
      getMouseCoordinates : function (event)
      {
         let self = this;
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
         };
      },
      /**
       * @use Jquery-lyk el(s) selector
       * @param query {string}
       * @param multiple {boolean}
       * @returns {*}
       */
      getEl               : function (query, multiple = false)
      {
         // query = query.toLowerCase;
         if (query)
         {
            //console.log(Bs.stripChars(query.substr(1), ['-', '_']));
            //console.log(Bs.isAlphaNumeric(Bs.stripChars(query.substr(1), ['-', '_'])));

            if (Bs.isAlphaNumeric(Bs.stripChars(query.substr(1), ['-', '_'])))
            {
               if (query.substr(0, 1) === "#")
               {
                  return document.getElementById(query.substr(1));
               }
               else if (query.substr(0, 1) === ".")
               {
                  //console.log(query.substr(0, 1) === ".", 'here');
                  if (multiple === true)
                  {
                     return document.getElementsByClassName(query.substr(1));
                  }
                  else
                  {
                     return document.querySelector(query);
                  }
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
       * @use returns an array of all elements with the specified attribute Name or
       * an array of all elements with the specified attribute Name with a specified value or
       * a single element with the specified attribute Name and val
       *
       * geElementById returns  the first instance if multiple els have the same id,
       * this can be used the get all els with a single id
       *
       * @param attribute {String}
       * @param value {String}
       * @param single {Boolean}
       * @param ignoreList {Array<String>}
       * @returns {Array | Element}
       */
      getElementsByAttribute : function (attribute, value, single, ignoreList)
      {
         let matchingElements = [];
         let allElements = document.getElementsByTagName('*');

         let i = 0, n = allElements.length;
         for (; i < n; i++)
         {
            if (Bu.defined(allElements[i].getAttribute(attribute)))
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
               matchingElements.push(allElements[i]);
            }
         }
         return matchingElements;
      },

      /**
       * @use returns an array of all elements with the specified attribute Name
       * @param name
       * @returns {Array}
       */
      getElementsByName : function (name)
      {
         const matchingElements = [];
         const allElements = document.getElementsByTagName('*');
         let i = 0;
         const n = allElements.length;
         for (; i < n; i++)
         {
            if (allElements[i].tagName.toLowerCase() === name)
            {  // Element exists with attribute. Add to array.
               matchingElements.push(allElements[i]);
            }
         }
         return matchingElements;
      },
      /**
       *
       * @param el
       * @return {Element|DocumentView}
       */
      getActiveEl       : function (el)
      {
         return document.activeElement ?
                document.activeElement : el.ownerDocument.activeElement;
      },

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

                  const tag = query.shift().toUpperCase(),
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

      isEditable : function (el)
      {
         return Bee.Dom.matches(el, 'input,[contenteditable]') ||
                Bee.Dom.matches(el, 'textarea,[contenteditable]');
      },

      appendTo : function (child, parent)
      {
         parent.appendChild(child);
         return child;
      },

      /**
       *
       * @param el
       * @param rem
       * @param fade
       * @param delay
       * @param fn
       */
      closeOutOnBodyClick : function (el, fn = false, rem = false, fade = false, delay = false)
      {
         var self = this;

         window.addEventListener("click", function (e)
         {
            /**
             *
             * @type {boolean}
             */
            var isWin = e.target.tagName ?
                        e.target.tagName.toLowerCase() === 'body' ||
                        e.target.tagName.toLowerCase() === 'html' : null;

            if (isWin)
            {
               if (el && self.getDisplayState(el) === 1)
               {
                  self.closeWin(el, rem, fade, delay);

               }

               if (fn && Bu.isFunction(fn))
               {
                  fn();
               }
            }
         });
      },

      isDescendantOf : function (descendantEl, parentEl)
      {
         //msg we're using the custom one for now cos
         //msg node.contains is poorly supported; even tho we're checking for it's existence
         //msg it shd only be used if only modern desktop browsers are supported
         //msg u may activate the native one by negating the test below
         // lyk if (!document.body.contains)
         if (document.body.contains)
         {
            //equivalent to but this is cryptic
            // function childOf(c,p){while((c=c.parentNode)&&c!==p);return !!c}

            //we loop through the child's pEls till we hit the specified pEl from form the child el
            //thanks to Stack overflow community [Asaph and GitaarLab]
            var node = descendantEl.parentElement;
            while (node !== null)
            {
               if (node === parentEl)
               {
                  return true;
               }
               node = node.parentElement;
            }
            return false;

         }
         else
         {
            return parentEl.contains(descendantEl);
         }

      },

      isDescendantNodeOf : function (child, parent)
      {
         var node = child.parentNode;
         while (node !== null)
         {
            if (node === parent)
            {
               return true;
            }
            node = node.parentNode;
         }
         return false;
      },

      /**
       * @static
       * @param node
       * @returns {*|Boolean}
       */
      isInPage : function (node)
      {
         return (node === document.body) ? false : document.body.contains(node);
      },

      /**
       *
       * @param el
       * @returns {*|boolean}
       */
      hasChildren : function (el)
      {
         return Bu.defined(el.children[0]);
      },

      /**
       * Insert a child at a given index. If index is larger than the number of child
       * nodes that the parent currently has, the node is inserted as the last child
       * node.
       * @param {Element} parent The element into which to insert the child.
       * @param {Node} child The element to insert.
       * @param {number} index The index at which to insert the new child node. Must
       *     not be negative.
       */
      insertChildAt : function (parent, child, index)
      {
         // Note that if the second argument is null, insertBefore
         // will append the child at the end of the list of children.
         parent.insertBefore(child, parent.childNodes[index] || null);
      },

      insertFromFragment : function (XML, el)
      {
         if (XML && el)
         {
            let frag = document.createDocumentFragment();
            frag.body.innerHTML = XML;
         }
      },

      /**
       * @deprecated
       * @param el {Element}
       * @param speed {Number}
       * @param rem {boolean}
       */
      fadeOut : function (el, speed, rem)
      {
         var self = this,
             op   = 1;// initial opacity

         //set interval is an infinite timer loop
         var fadeOutTimer = setInterval(function ()
                                        {
                                           if (op <= 0.1)
                                           {
                                              clearInterval(fadeOutTimer);
                                              self.setDisplayState(el, "none");
                                              if (rem)
                                              {
                                                 self.removeEl(el);
                                              }
                                           }
                                           el.style.opacity = op;
                                           el.style.filter = 'alpha(opacity=' + (op * 100) + ")";
                                           op -= op * 0.1;
                                        }, speed);
      },

      /**
       *@use for removing an element from the HTML document
       * @param winEl {Element}
       * may need to be moved to Widget to allow for testing if winEL is a descendant of pEl
       */
      removeEl : function (winEl)
      {
         if (Bu.defined(winEl.remove))
         {
            winEl.remove();
         }
         else if (Bu.defined(winEl.parentNode) && winEl.parentNode.hasChildNodes())
         {
            winEl.parentNode.removeChild(winEl);
         }
         else
         {
            throw new Error(winEl + " cannot be removed");
         }
      },

      /**
       * @use for removing all the children of a parent HTML element
       * @param parentEl {Element}
       */
      removeChildren : function (parentEl)
      {
         while (parentEl.hasChildNodes())
         {
            parentEl.removeChild(parentEl.firstChild);
         }
      },

      /**
       * @use for acquiring the display state of an HTML element
       * @param el {Element}
       * @returns {number}
       */
      getDisplayState : function (el)
      {
         let _tempState = el.style.display;

         if (Bs.isEmpty(_tempState))
         {
            _tempState = "block";
         }

         if (_tempState === "none")
         {
            return 0;
         }
         return 1;
      },
      /**
       * @use used to set the display of an HTML element
       * @param el {Element}
       * @param newDisplayState {string}
       */
      setDisplayState : function (el, newDisplayState)
      {
         el.style.display = newDisplayState;
      },

      /**
       *@param windowEl {Element} HTML element
       *@param remove "remove|true" {string|boolean}
       *@param fade {boolean}
       *@param delay {Number}
       * */
      closeWin       : function (windowEl, remove, fade, delay)
      {
         var self = this;
         if (windowEl && this.getDisplayState(windowEl) === 1)
         {//console.log(fade);
            var delayVal = delay ? delay : 12;
            if (remove && (remove === "remove" || remove === true))
            {
               if (fade === true)
               {
                  self.fadeOut(windowEl, delayVal, true);
               }
               else
               {
                  self.removeEl(windowEl);
               }
            }
            else
            {
               if (fade)
               {
                  self.fadeOut(windowEl, delayVal);
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
                                                   Bee.Utils.setDisplayState(windowEl, "none");
                                                   clearTimeout(clockOut2);
                                                }, delayVal);
                  }
               }
            }
         }
      },
      /** The following function displays an html element that may be hidden
       *@param windowEl {Element} HTML element {identifier}
       *@param delay {Number}
       *@param notBlock {Boolean}
       **/
      openWin        : function (windowEl, delay, notBlock)
      {
         if (Bs.isEmpty(windowEl.style.display) || this.getDisplayState(windowEl) === 0)
         {
            if (delay)
            {
               var delayVal = delay ? delay : 50;
               var clockOut = setTimeout(function ()
                                         {
                                            clearTimeout(clockOut);
                                            Bee.Utils.setDisplayState(windowEl, "block");
                                         }, delayVal);
            }
            else
            {
               this.setDisplayState(windowEl, "block");
            }
         }
      },
      /**
       *@use Toggles the display of the El
       * @param windowEl {Element}
       * @param delay {Number}
       */
      toggleDisplay  : function (windowEl, delay)
      {
         var self     = this,
             delayVal = delay ? delay : 50;

         if (Bs.isEmpty(windowEl.style.display) || self.getDisplayState(windowEl) === 0)
         {
            if (!delay)
            {
               this.setDisplayState(windowEl, "block");
            }
            else
            {
               var clockOut = setTimeout(function ()
                                         {
                                            self.setDisplayState(windowEl, "block");
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
                                             self.setDisplayState(windowEl, "none");
                                             clearTimeout(clockOut2);
                                          }, delayVal);
            }
         }
      },
      /**@use swaps the display of one of the els for the other depending on the state
       *@param el {Element}
       *@param el2 {Element}
       *@param currentAnim {string}
       *@param newAnim {string}*/
      swapElsDisplay : function (el, el2, currentAnim, newAnim)
      {
         if (this.getDisplayState(el) === 0)
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

      /**@use: the following function activates(distinguishes) a new object that is a part of a list of nodes
       *@param newActiveEL {Element}
       *@param classDeactivate {string}
       *@param activeClassName {string}
       * */
      setActive : function (newActiveEL, classDeactivate, activeClassName)
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
       * @param newClassName {string|Array<string>}
       */
      addClass    : function (el, newClassName)
      {
         if (Bee.Utils.isString(el))
         {
            el = this.getEl(el);
         }

         if (!Bu.isArray(newClassName))
         {
            if (!el.classList.contains(newClassName) || el.className === "")
            {
               el.classList.add(newClassName);
            }
         }
         else
         {
            Ba.forEach(newClassName, function (className)
            {
               if (!el.classList.contains(className) || el.className === "")
               {
                  el.classList.add(className);
               }
            });
         }
         return el;
      },
      /**
       * @param el {Element}
       * @param oldClassName {string|Array<string>}
       */
      removeClass : function (el, oldClassName)
      {
         if (Bee.Utils.isString(el))
         {
            el = this.getEl(el);
         }

         if (!Bu.isArrayLike(oldClassName))
         {
            if (el.classList.contains(oldClassName))
            {
               el.classList.remove(oldClassName);
            }
         }
         else
         {
            Ba.forEach(oldClassName, function (className)
            {
               if (el.classList.contains(className))
               {
                  el.classList.remove(className);
               }
            });
         }

         return el;
      },
      /**
       * @use juggles an element between two  class names
       * @param el {Element}
       * @param className1 {string}
       * @param className2 {string}
       * @returns {boolean}
       */
      toggleClass : function (el, className1, className2)
      {
         if (Bu.defined(el) && className1 && className2)
         {
            if (Bee.Utils.isString(el))
            {
               el = this.getEl(el);
            }

            if (el.classList.contains(className1))
            {
               el.classList.remove(className1);
               el.classList.add(className2);
               return false;
            }
            else if (el.classList.contains(className2))
            {
               el.classList.remove(className2);
               el.classList.add(className1);
            }

         }
         return el;
      },
      /**
       *
       * @param el
       * @param className {String}
       * @returns {boolean}
       */
      inClass     : this.hasClass,

      /**
       *
       * @param el
       * @param className {String}
       * @returns {boolean}
       */
      hasClass : function (el, className)
      {
         if (Bu.defined(el.classList.contains))
         {
            return el.classList.contains(className);
         }
         else
         {
            return el.className.search(/\bsortable\b/) !== -1;
         }
      },

      /**
       *
       * @param el
       * @param className {String}
       * @returns {boolean}
       */
      classListContains : function (el, className)
      {
         if (Bu.defined(el.classList.contains))
         {
            return el.classList.contains(className);
         }
         else
         {
            return el.className.search(/\bsortable\b/) !== -1;
         }
      },

      /**
       *
       * @return {{}}
       * @private
       */
      _makeGETVars : function ()
      {
         if (window.location)
         {
            var q           = window.location.search.substring(1),//get the substr starting from the after "?"
                qStrVarsArr = q.split("&"), //split into arr on err &
                qStrVar,
                varsObject  = {};

            for (var i = 0, len = qStrVarsArr.length; i < len; i++)
            {
               qStrVar = qStrVarsArr[i].split("=");
               varsObject[qStrVar[0]] = qStrVar[1];
            }
            return varsObject;
         }
         else
         {
            throw new Error("$_GET method is unable to determine URL ");
         }
      },

      /**
       * @use works like the php $_GET "function" but is readOnly
       * @param variableName {String}
       * @returns {*}
       * @global
       */
      $_GET : function (variableName)
      {
         try
         {
            var getVars = this._makeGETVars();

            if (variableName in getVars && Bu.defined(getVars[variableName]))
            {
               var val = getVars[variableName];

               Bo.clear(getVars);

               return val.replace("+", " ")
                         .replace("%20", " ")
                         .trim();
            }

         }
         catch (e)
         {
            console.log(e);
         }
      },

      /**
       * @use works like the php $_GET "function" but only sets vals
       * @param variableName {String}
       * @param newValue {String}
       * @returns {*}
       * @global
       */
      $_SET : function (variableName, newValue)
      {
         try
         {
            var getVars = this._makeGETVars();

            if (variableName in getVars && Bu.defined(getVars[variableName]))
            {
               var val = getVars[variableName];

               Bo.clear(getVars);

               return val.replace(getVars[variableName], newValue)
                         .trim();
            }

         }
         catch (e)
         {
            console.log(e);
         }
      },

      /**
       * Set CSS style on a given element
       * @param {Object} el
       * @param {Object | String} styles Style object with camel case property names
       * @param {String | Boolean} [multiSetType]
       * @static
       */
      css : function (el, styles, multiSetType)
      {
         if (el && typeof el === "object")
         {
            if (styles && typeof styles === "object")
            {
               if (styles.opacity !== undefined)
               {
                  styles.filter = 'alpha(opacity=' + (styles.opacity * 100) + ')';
               }

               if (multiSetType)
               {
                  for (var key in styles)
                  {
                     var val = styles[key];
                     if (typeof val === 'number')
                     {
                        val = val.toString() + 'px';
                     }
                     el.style[key] = val;
                  }

                  return el;
               }
               return Bu.extend(el.style, styles);
            }
            else
            {
               throw new Error('method css expects a styles object or a string to return the value of')
            }
         }
         else
         {
            throw new Error('method css expects an HTML Object');
         }
      },

      /**
       *
       * @param el {Element}
       * @param posX {Number | String}
       * @param posY {Number | String}
       */
      setBackGroundPosition : function (el, posX = "", posY = "")
      {
         if (el.style.backgroundPositionX)
         {//other browsers apart from FFx

            if (Bu.defined(posX))
            {
               Bee.Widget.css(el, {
                  backgroundPositionX : Bu.isNumber(Number(posX)) ? posX + "px" : posX,
                  backgroundPositionY : Bu.isNumber(Number(posY)) ? posY + "px" : posY
               });
            }
         }
         else
         {//is FFx
            if (Bu.defined(posX))
            {
               Bee.Widget.css(el, {
                  backgroundPosition : (Bu.isNumber(Number(posX)) ? posX + "px" : posX) + " " +
                                       (Bu.isNumber(Number(posY)) ? posY + "px" : posY)
               });
            }
         }
      },

      /**
       *
       * @param element {Element}
       * @param styleName {String}
       * @return {*}
       */
      getCss : function (element, styleName)
      {
         return window.getComputedStyle(element)[styleName];
      },

      /**
       *
       * @param elRule {Element.style}
       * @returns {Number}
       */
      getStyleValue : Bu.getStyleValue,

      /**
       *
       * @param el {Element}
       * @param styleName
       * @param styleValue
       * @param unit
       * @return {*}
       */
      setCss : function (el, styleName, styleValue, unit = 'px')
      {
         if (el)
         {
            if (Bu.isNumber(styleValue)) /*typeof styleValue === 'number'*/
            {
               styleValue = styleValue.toString() + unit /*|| 'px'*/;
               //fixme uncomment the comment above and remove the
               //fixme default param val for backward compatibility
            }
            el['style'][styleName] = styleValue;
            return el;
         }
      },

      /**
       * Pls do not use this it's experimental
       * @deprecated
       * @param form
       * @returns {Array}
       */
      serializeFormToArray   : function (form)
      {
         var field, l, s = [];
         if (typeof form === 'object' && form.nodeName === "FORM")
         {
            let len = form.elements.length;
            for (let i = 0; i < len; i++)
            {
               field = form.elements[i];
               if (field.name && !field.disabled && field.type !== 'file' &&
                   field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button')
               {
                  if (field.type === 'select-multiple')
                  {
                     l = form.elements[i].options.length;
                     for (j = 0; j < l; j++)
                     {
                        if (field.options[j].selected)
                        {
                           s[s.length] = { name : field.name, value : field.options[j].value };
                        }
                     }
                  }
                  else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked)
                  {
                     s[s.length] = { name : field.name, value : field.value };
                  }
               }
            }
         }
         return s;
      },
      /**
       * Pls do not use this it's experimental
       * @param form
       * @returns {string}
       * @deprecated
       */
      serializeFormToQString : function (form)
      {
         var field, l, s = [];
         if (typeof form === 'object' && form.nodeName === "FORM")
         {
            var len = form.elements.length;

            for (var i = 0; i < len; i++)
            {
               field = form.elements[i];
               if (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' &&
                   field.type !== 'button')
               {
                  if (field.type === 'select-multiple')
                  {
                     l = form.elements[i].options.length;
                     for (var j = 0; j < l; j++)
                     {
                        if (field.options[j].selected)
                        {
                           s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[j].value);
                        }
                     }
                  }
                  else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked)
                  {
                     s[s.length] = encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value);
                  }
               }
            }
         }
         return s.join('&').replace(/%20/g, '+');
      },

      prepend : function (el, newChild)
      {
         el.insertBefore(newChild, el.childNodes[0]);
      },

      unwrap : function (el)
      {
         // select element to unwrap
         el = document.querySelector('div');

         // get the element's parent node
         let parent = el.parentNode;

         // move all children out of the element
         while (el.firstChild)
         {
            parent.insertBefore(el.firstChild, el);
         }

         // remove the empty element
         parent.removeChild(el);
      },

      /**
       * creates a dom element w/ or w/o properties and/or styles
       * @param {String} tag  tagName
       * @param {{classList : Array<String> | Object<String>|String, className : String}} [properties] or attributes
       * @param {Object} [styles] cssStyles
       * @returns {Element}
       * @static
       */
      createEl           : function (tag, properties, styles = null)
      {
         var self = this;

         if (tag && typeof tag === "string")
         {
            tag = Bs.stripChars(tag, ['<', '>', '/']);
            let el = document.createElement(tag);
            if (properties && typeof properties === "object")
            {
               if ('classList' in properties)
               {
                  if (Bu.isObject(properties.classList))
                  {
                     for (let className in properties.classList)
                     {
                        self.addClass(el, properties.classList[className]);
                     }
                  }
                  else if (Bu.isArray(properties.classList))
                  {
                     Bu.forEach(properties.classList, function (className)
                     {
                        self.addClass(el, className);
                     });
                  }
                  delete properties['classList'];
               }

               Bee.Utils.extend(el, properties);
            }
            if (styles && typeof styles === "object")
            {
               if ('backgroundPosition' in styles)
               {
                  self.setBackGroundPosition(el, styles['backgroundPosition']);
                  delete styles['backgroundPosition'];
               }

               self.css(el, styles);
            }
            return el;
         }
         else
         {
            throw new Error('createEl method expects at least a tag');
         }
      },
      /**
       *
       * @param markUpString {String<HTML>}
       * @param type {String}
       * @returns {Document}
       */
      createElFromString : function (markUpString, type = "text/xml")
      {
         let parser = new DOMParser();
         return parser.parseFromString(markUpString, type);
      },

      createItems : function (items, isSub)
      {
         let self           = this,
             hasChildObject = false;

         var html = (isSub) ? '<div>' : ''; // Wrap with div if true
         html += '<ul>';

         Bo.forEach(items, function (item)
         {
            html += '<li>';
            if (typeof(item.sub) === 'object')
            { // An array will return 'object'
               if (isSub)
               {
                  html += '<a href="' + item.link + '">' + item.name + '</a>';
               }
               else
               {
                  html += item.id; // Submenu found, but top level list item.
               }
               // Submenu found. Calling recursively same method (and wrapping it in a div)
               html += Bee.Widget.createItems(item.sub, true);
            }
            else
            {
               html += item.id; // No submenu
            }
            html += '</li>';
         });

         html += '</ul>';
         html += (isSub) ? '</div>' : '';
         return html;
      },

      /**
       * hack for parsing strings into html
       * @param html {String<HTML>}
       * @returns {Node|Element}
       */
      strToElement : function (html)
      {
         //var frame = document.createElement('iframe');
         var frame = document.createElement('div');
         frame.style.display = 'none';
         document.body.appendChild(frame);

         //frame.contentDocument.open();
         //frame.contentDocument.write(html);
         //frame.contentDocument.close();
         //frame.write(html);
         frame.innerHTML = html;
         //var el = frame.contentDocument.body.firstChild;
         var el = frame.children[0];
         document.body.removeChild(frame);
         return el;
      },
      /**
       * Returns the index of an element within its parent for a selected set of
       * elements
       * @param  {HTMLElement} el
       * @param  {selector} selector
       * @return {number}
       */
      index        : function (el, selector)
      {
         var index = 0;

         if (!el || !el.parentNode)
         {
            return -1;
         }

         while (el && (el = el.previousElementSibling))
         {
            if ((el.nodeName.toUpperCase() !== 'TEMPLATE') && (selector === '>*' || Bee.Dom.matches(el, selector)))
            {
               index++;
            }
         }

         return index;
      },

      /**
       * @static
       * @param refEl {NodeList}
       * @param el {Element}
       * @returns {number}
       */
      indexOf : function (refEl, el)
      {
         var arr = Ba.toArray(this.getChildren(refEl));

         return arr.indexOf(el);
      },

      /**
       *
       * @param el {Element}
       * @returns {*|Node}
       */
      cloneNode : function (el)
      {
         return el.cloneNode(true);
      },

      /**
       *
       * @param el
       * @returns {*}
       */
      getParentOrHost : function (el)
      {
         var parent = el.host;

         return (parent && parent.nodeType) ? parent : el.parentNode;
      },

      /**
       * disables a enabled el
       * @param el {Element}
       * @param strict {Boolean}
       */
      disable : function (el, strict = false)
      {
         let self = this;
         if (!this.disabled(el))
         {
            self.addClass(el, 'disabled');

            if (strict)
            {
               el.setAttribute("disabled", 'true');
            }
         }
      },

      /**
       * returns true if an el is disabled
       * @param el
       * @returns {boolean}
       */
      disabled : function (el)
      {
         return (el.classList.contains("disabled") ||
                 el.disabled || (el.getAttribute("disabled") === 'true'));
         //|| el.readOnly || (el.getAttribute("readonly") === 'true'));
      },

      /**
       * returns true if an el is read only
       * @param el
       * @returns {boolean}
       * @static
       */
      readOnly : function (el)
      {
         return (el.readOnly || (el.getAttribute("readonly") === 'true'));
      },

      /**
       * enables a disabled el
       * @param el {Element}
       * @param strict {Boolean}
       * @static
       */
      enable : function (el, strict = false)
      {
         let self = this;
         if (this.disabled(el))
         {
            if (el.classList.contains("disabled"))
            {
               self.removeClass(el, 'disabled');
            }

            if (strict)
            {
               el.setAttribute("disabled", 'false');
            }
         }
      },

      getInnerText : function (node)
      {
         // gets the text we want from an el.
         // strips leading and trailing whitespace.
         // this is *not* a generic getInnerText function; it's special to sortable.
         // for example, you can override the cell text with a customkey attribute.
         // it also gets .value for <srcInputEl> fields.

         if (!node)
         {
            return "";
         }

         var hasInputs = (typeof node.getElementsByTagName === 'function') &&
                         node.getElementsByTagName('srcInputEl').length;

         if (node.getAttribute("sortable_customkey") !== null)
         {
            return node.getAttribute("sortable_customkey");
         }
         else if (typeof node.textContent !== undefined && !hasInputs)
         {
            return node.textContent.replace(/^\s+|\s+$/g, '');
         }
         else if (typeof node.innerText !== undefined && !hasInputs)
         {
            return node.innerText.replace(/^\s+|\s+$/g, '');
         }
         else if (typeof node.text !== undefined && !hasInputs)
         {
            return node.text.replace(/^\s+|\s+$/g, '');
         }
         else
         {
            switch (node.nodeType)
            {
               case 3:
                  if (node.nodeName.toLowerCase() === 'input')
                  {
                     return node.value.replace(/^\s+|\s+$/g, '');
                  }
                  break;
               case 4:
                  return node.nodeValue.replace(/^\s+|\s+$/g, '');
               //case 1:
               case 11:
                  var innerText = '';
                  for (var i = 0; i < node.childNodes.length; i++)
                  {
                     innerText += sortable.getInnerText(node.childNodes[i]);
                  }
                  return innerText.replace(/^\s+|\s+$/g, '');
                  //break;
               default:
                  return '';
            }
         }
      },

      /**
       *
       * @param inputEl
       * @param ul
       * @param collapsed
       */
      filterList : function (inputEl, ul, collapsed)
      {
         // Declare variables
         if (collapsed)
         {
            Bee.CollapsibleLists.toggleCollapseAll();
         }

         if (inputEl && ul)
         {
            var filter, // search query string
                a = "", //the string content of the LI
                i; // generic use counter
            if (!Bu.isObject(inputEl) && (typeof inputEl === "string"))
            {
               inputEl = document.getElementById(inputEl);
            }

            filter = inputEl.value.toUpperCase();

            var lis = null;
            if (Bu.isArray(ul))
            {
               lis = ul;
            }
            else
            {
               lis = ul.getElementsByTagName('li');
            }

            // Loop through all list items, and hide those who don't match the search query
            if (!Bs.isEmpty(filter))
            {
               for (i = 0, len = lis.length; i < len; i++)
               {
                  /*if(lis[i].hasChildNodes())
                   {
                   var temp = "";
                   for(var j = 0, innerLen = lis[i].children.length; j < innerLen; j++ )
                   {
                   temp += this.getInnerText(lis[i].children[j]);

                   }
                   a = temp
                   }
                   else {*/
                  a = this.getInnerText(lis[i]);
                  a = a.replace(/\s+/, " ");
                  a = a.split(" ")[0];
                  //}



                  if (a.toUpperCase().indexOf(filter) > -1)
                  {
                     if (!collapsed)
                     {
                        Bu.setDisplayState(lis[i], '');

                     }
                     else
                     {
                        Bu.setDisplayState(lis[i], 'block');

                        var parentLi      = lis[i].parentElement,
                            grandParentLi = lis[i].parentElement.parentElement,

                            ptagName      = parentLi.tagName.toUpperCase(),
                            gPtagName     = parentLi.tagName.toUpperCase();

                        // console.log('p', parentLi);
                        // console.log('psd', parentLi.style.display);
                        // console.log('gp', grandParentLi);
                        // console.log('gpsd', grandParentLi.style.display);
                        // console.log("---------------------------------------------------------------");

                        if (Bu.defined(parentLi))
                        {
                           if ((ptagName === 'LI' || ptagName === "UL") && (parentLi.style.display === "none"))
                           {
                              Bu.setDisplayState(parentLi, '');
                           }
                           if (parentLi.classList.contains('collapsibleListClosed'))
                           {
                              // Bu.removeClass(parentLi, 'collapsibleListClosed');
                              // Bu.addClass(parentLi, 'collapsibleListOpen');
                              Bu.toggleClass(parentLi, 'collapsibleListClosed', 'collapsibleListOpen')

                           }
                        }

                        if (Bu.defined(grandParentLi))
                        {
                           if ((gPtagName === 'LI' || gPtagName === "UL") && (grandParentLi.style.display === "none"))
                           {
                              Bu.setDisplayState(grandParentLi, '');
                           }

                           if (grandParentLi.classList.contains('collapsibleListClosed'))
                           {
                              // Bu.removeClass(grandParentLi, 'collapsibleListClosed');
                              // Bu.addClass(grandParentLi, 'collapsibleListOpen');

                              Bu.toggleClass(grandParentLi, 'collapsibleListClosed', 'collapsibleListOpen')
                           }
                        }
                     }
                  }
                  else
                  {
                     Bu.setDisplayState(lis[i], 'none');
                     // Bu.toggleClass(grandParentLi,'collapsibleListClosed', 'collapsibleListOpen')

                  }
               }

            }

         }
      },

      /**
       * Print an el
       * @param el
       */
      print : function (el)
      {
         var origDisplay = [],
             origParent  = el.parentNode,
             body        = doc.body,
             childNodes  = body.childNodes,
             container   = el;

         // hide all body content
         Bu.forEach(childNodes, function (node, i)
         {
            if (node.nodeType === 1)
            {
               origDisplay[i] = node.style.display;
               node.style.display = 'none';
            }
         });

         // pull out the container
         body.appendChild(container);

         // print
         win.focus(); // #1510
         win.print();

         // allow the browser to prepare before reverting
         setTimeout(function ()
                    {
                       // put the chart back in
                       origParent.appendChild(container);

                       // restore all body content
                       Bu.forEach(childNodes, function (node, i)
                       {
                          if (node.nodeType === 1)
                          {
                             node.style.display = origDisplay[i];
                          }
                       });
                    }, 1000);
      },

      /**
       * @use for browser detection
       * @returns {*}
       */
      browserDetect : function ()
      {
         const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf("OPR/") > 0;
         const isFfox = typeof InstallTrigger !== "undefined";
         const isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0;
         const isIE = /*@cc_onl@*/false || !!document.documentMode;
         const isEdge = !isIE && !!window.StyleMedia;
         const isChrome = !!window.chrome && !!window.chrome.webstore;
         const isBlink = (isChrome || isOpera) && !!window.css;
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
       * @param delay {number}
       */
      redirectTo : function (loc, delay)
      {
         if (delay && !(Number.isNaN(delay)))
         {
            setTimeout(function ()
                       {
                          window.location.assign(loc);
                       }, delay);
         }
         else
         {
            window.location.assign(loc);
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

      /**
       *
       * @param el
       * @returns {number|Number}
       */
      getTop : function (el)
      {
         return Bu.pInt(Bu.defined(el.style.top) && !Bs.isEmpty(el.style.top) ? this.gsv('top', el) : el.offsetTop);
      },

      /**
       *
       * @param el
       * @param val
       */
      setTop : function (el, val)
      {
         Bee.Widget.css(el, { top : val });
      },

      /**
       *
       * @returns {number}
       */
      getHeight : function (el)
      {
         return el.offsetHeight;
      },

      /**
       *
       * @param el
       * @returns {*}
       */
      getBottom : function (el)
      {
         return this.getTop(el) + el.offsetHeight;
      },

      /**
       *
       * @param el
       * @returns {Number|number}
       */
      getLeft : function (el)
      {
         return Bu.pInt(el.style.left ? this.gsv('left', el) : el.offsetLeft);
      },

      /**
       *
       * @param el
       * @param val
       */
      setLeft : function (el, val)
      {
         Bee.Widget.css(el, { left : val });
      },

      /**
       *
       * @returns {*|number}
       */
      getWidth : function (el)
      {
         return el.offsetWidth;
      },

      /**
       *
       * @param el
       * @returns {*}
       */
      getRight : function (el)
      {
         return Bu.pInt(this.getLeft(el)) + el.offsetWidth;
      },

      /**
       *
       * @param el
       * @returns {{top: (*|number|Number), right: *}}
       */
      getTopRight : function (el)
      {
         return {
            top   : Bee.Widget.getTop(el),
            right : Bee.Widget.getRight(el)
         }
      },

      /**
       *
       * @param el
       * @returns {{bottom: *, right: *}}
       */
      getBottomRight : function (el)
      {
         return {
            bottom : Bee.Widget.getBottom(el),
            right  : Bee.Widget.getRight(el)
         }
      },

      /**
       *
       * @param el
       * @returns {{top: (*|number|Number), left: (*|Number|number)}}
       */
      getTopLeft : function (el)
      {
         return {
            top  : Bee.Widget.getTop(el),
            left : Bee.Widget.getLeft(el)
         }
      },

      /**
       *
       * @param el
       * @returns {{bottom: *, left: (*|Number|number)}}
       */
      getBottomLeft : function (el)
      {
         return {
            bottom : Bee.Widget.getBottom(el),
            left   : Bee.Widget.getLeft(el)
         }
      },

      /**
       * returns true if el is in horizontal view
       * @param el
       * @returns {boolean}
       */
      isInHorizontalView : function (el)
      {
         return this.getTop(el) > 0 && this.getBottom(el) < window.innerHeight;
      },

      /**
       * returns true if el is in vertical view
       * @param el
       * @returns {boolean}
       */
      isInVerticalView : function (el)
      {
         return this.getLeft(el) > 0 && this.getRight(el) < window.innerWidth;
      },

      /**
       * returns true if el is in both horizontal and vertical view
       * @param el
       * @returns {*|boolean}
       */
      isInView : function (el)
      {
         return this.isInHorizontalView(el) && this.isInVerticalView(el);
      },

      /**
       * @use for dynamically repositioning Elements based on the space taken by the element
       * @param el {Element}
       * @param offset {{x : Number, y : Number}}
       */
      pushIntoView : function (el, offset)
      {
         offset = offset || { x : 0, y : 0 };

         var spaceLeftX = window.innerWidth - (this.getRight(el));
         var spaceLeftY = window.innerHeight - (this.getBottom(el));

         if (spaceLeftY < 3)
         {
            Bu.css(el, { top : ((el.offsetTop - el.offsetHeight) + offset.x) + "px" })
         }

         if (spaceLeftX < 3)
         {
            Bu.css(el, { left : ((el.offsetLeft - el.offsetWidth) + offset.y) + "px" });
         }

         if (this.gsv('top', el) < 0)
         {
            el.style.top = 0;
         }

         if (this.gsv('left', el) < 0)
         {
            el.style.left = 0;
         }
      },

      /**
       * aligns an {el2} element or and array of els to the vertical center of el1
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       */
      alignCentersHorizontally : function (el1, el2)
      {
         // this.alignLeft(el1, el2);
         // var leftAnchorPoint  = ((el1.offsetLeft + el1.offsetWidth)- (el1.offsetWidth/2));

         var elsWidthDifference = null;

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               elsWidthDifference = node.offsetWidth - el1.offsetWidth;
               Bd.css(node, { left : (el1.offsetLeft - (elsWidthDifference / 2)) + 'px' });
            })
         }
         else
         {
            elsWidthDifference = el2.offsetWidth - el1.offsetWidth;

            Bd.css(el2, { left : (el1.offsetLeft - (elsWidthDifference / 2)) + 'px' });
         }

      },
      /**
       * aligns an {el2} element or and array of els to the horizontal center of el1
       * @param el1 {Element}
       * @param el2 {Element | Array<Element> | HTMLCollection}
       */
      alignCentersVertically   : function (el1, el2)
      {
         var elsHeightDifference = null;

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               elsHeightDifference = node.offsetHeight - el1.offsetHeight;
               Bu.css(node, { top : (el1.offsetTop - (elsHeightDifference / 2)) + 'px' });
            })
         }
         else
         {
            elsHeightDifference = el2.offsetHeight - el1.offsetHeight;

            Bu.css(el2, { top : (el1.offsetTop - (elsHeightDifference / 2)) + 'px' });
         }
      },
      /**
       * aligns an {el2} element or and array of els to the left of el1
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @param offset {Number}
       * @type void
       */
      alignLeft                : function (el1, el2, offset = 0) //this and anchorLeft are the same
      {
         //.offsetLeft
         //var leftAnchorPoint = window.getComputedStyle(el1).left;
         var leftAnchorPoint = el1.offsetLeft;
         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               Bu.css(node, { left : (leftAnchorPoint + Bu.pInt(offset)) + 'px' });
            })
         }
         else
         {
            Bu.css(el2, { left : (leftAnchorPoint + Bu.pInt(offset)) + 'px' });
            return el2;
         }
      },
      /**
       * anchors an {el2} element or and array of els to the left of el1
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @param offset {Number}
       * @type void
       */
      anchorLeft               : function (el1, el2, offset = 0) //this and anchorLeft are the same
      {
         var leftAnchorPoint = (el1.offsetLeft - el2.offsetWidth) + Bu.pInt(offset);
         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               leftAnchorPoint = el1.offsetLeft - node.offsetWidth;
               Bu.css(node, { left : leftAnchorPoint + 'px' });
            })
         }
         else
         {
            Bu.css(el2, { left : leftAnchorPoint + 'px' });
         }
      },
      /**
       * aligns an {el2} element or and array of els to the right of el1
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @returns {void}
       */
      alignRight               : function (el1, el2)

      {
         // var rightAnchorPoint  = ((el1.offsetLeft + el1.offsetWidth)),
         var rightAnchorPoint = null;

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               rightAnchorPoint = (el1.offsetLeft - (node.offsetWidth - el1.offsetWidth));
               Bu.css(node, { left : rightAnchorPoint + 'px' });
               //console.log(node);
            })
         }
         else
         {
            rightAnchorPoint = (el1.offsetLeft - (el2.offsetWidth - el1.offsetWidth));

            Bu.css(el2, { left : rightAnchorPoint + 'px' });
         }
      },
      /**
       * anchors an {el2} element or and array of els to the right of el1
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @returns {void}
       */
      anchorRight              : function (el1, el2)
      {
         // var rightAnchorPoint  = ((el1.offsetLeft + el1.offsetWidth)),
         var rightAnchorPoint = null;

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               rightAnchorPoint = (el1.offsetLeft + el1.offsetWidth);
               Bu.css(node, { left : rightAnchorPoint + 'px' });
               // console.log(node);
            })
         }
         else
         {
            rightAnchorPoint = (el1.offsetLeft + el1.offsetWidth);

            Bu.css(el2, { left : rightAnchorPoint + 'px' });
         }
      },
      /**
       * aligns an {el2} element or and array of els to the top of el1
       * @param el1 {Element}
       * @param el2 {Element | Array<Element> | HTMLCollection}
       */
      alignTop                 : function (el1, el2)//this and anchorTop are the same
      {
         var rightAnchorPoint = (el1.offsetTop);

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               Bu.css(node, { top : rightAnchorPoint + 'px' });
            })
         }
         else
         {
            Bu.css(el2, { top : rightAnchorPoint + 'px' });
         }
      },
      /**
       * @use anchors an {el2} element or and array of els to the top of {el1}
       * @param el1 {Element}
       * @param el2 {Element | Array<Element> | HTMLCollection}
       * @returns {void}
       */
      anchorTop                : function (el1, el2)//this and anchorTop are the same
      {
         var rightAnchorPoint = (el1.offsetTop - el2.offsetHeight);

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               rightAnchorPoint = (el1.offsetTop - node.offsetHeight);
               Bu.css(node, { top : rightAnchorPoint + 'px' });
            })
         }
         else
         {
            Bu.css(el2, { top : rightAnchorPoint + 'px' });
         }
      },
      /**
       * aligns an {el2} element or and array of els to the bottom of el1
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @param offset
       * @returns {void}
       */
      alignBottom              : function (el1, el2, offset = 0)
      {
         var rightAnchorPoint = null;

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               rightAnchorPoint = (el1.offsetTop - (node.offsetHeight - el1.offsetHeight)) + offset;
               Bu.css(node, { top : rightAnchorPoint + 'px' });
               console.log(node);
            })
         }
         else
         {
            rightAnchorPoint = (el1.offsetTop - (el2.offsetHeight - el1.offsetHeight)) + offset;

            Bu.css(el2, { top : rightAnchorPoint + 'px' });
         }
      },
      /**
       * anchors an {el2} element or and array of els to the bottom of el1
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @param offset {Number}
       * @returns {void}
       */
      anchorBottom             : function (el1, el2, offset = 0)
      {
         var rightAnchorPoint = null;

         if (Bu.isArray(el2) || Bu.isArrayLike(el2))
         {
            Ba.forEach(el2, function (node)
            {
               rightAnchorPoint = (el1.offsetTop + el1.offsetHeight + Bu.pInt(offset));
               Bu.css(node, { top : rightAnchorPoint + 'px' });
               console.log(node);
            })
         }
         else
         {
            rightAnchorPoint = (el1.offsetTop + el1.offsetHeight + Bu.pInt(offset));

            Bu.css(el2, { top : rightAnchorPoint + 'px' });
            return el2;
         }
      },
      /**
       * aligns an {el} element's center to the horizontally center of the page
       * @param el {Element | Array <Element >| HTMLCollection}
       * @param offset {Number}
       * @param useWidth {Boolean}
       * @returns {void|Element}
       */
      centerToPageHorizontally : function (el, offset = 0, useWidth)
      {
         var horMid = null, self = this;

         if (Bu.isArray(el))
         {
            Ba.forEach(el, function (node)
            {
               horMid = ((window.innerWidth / 2) - (node.offsetHeight) / 2);
               Bu.css(node, { left : horMid + 'px' });
               console.log(node);
            })
         }
         else
         {
            if (useWidth)
            {
               horMid = (window.innerWidth / 2) - (Bu.pInt(Bee.Utils.getStyleValue('width', el)) / 2) - offset;
            }
            else
            {
               horMid = ((window.innerWidth / 2) - (el.getBoundingClientRect().width) / 2) - offset;
            }

            self.css(el, { left : horMid + 'px' });
         }
         return el;
      },
      /**
       * aligns an {el} element's center to the vertical center of the page
       * @param el {Element | Array <Element >| HTMLCollection}
       * @param offset {Number}
       * @param useHeight {Boolean}
       * @returns {void}
       */
      centerToPageVertically   : function (el, offset = 0, useHeight)
      {
         var self = this, verMid = window.innerHeight / 2;

         if (Bu.isArray(el))
         {
            Ba.forEach(el, function (node)
            {
               verMid = window.innerHeight / 2 - (node.offsetHeight) / 2;
               //Bu.css(node, { top : verMid + 'px' });

               self.setCss(node, 'top', verMid + 'px');
            })
         }
         else
         {

            if (useHeight)
            {
               console.log(offset);
               verMid -= ((Bu.pInt(Bee.Utils.getStyleValue('height', el))) / 2) + offset;
            }
            else
            {
               verMid -= ((Bu.pInt(el.getBoundingClientRect().height)) / 2) + offset;
            }
            //Bu.css(el, { top : verMid + 'px' });
            self.setCss(el, 'top', verMid + 'px');
         }
      },
      /**
       * aligns an {el} element's center to the vertical center of the page
       * @param el {Element | Array <Element >| HTMLCollection}
       * @returns {void}
       */
      centerToPage             : function (el)
      {
         this.centerToPageHorizontally(el);
         this.centerToPageVertically(el);
      },

      /* TODO
       TODO determine the amount of space to distribute by summing the space b/n them
       TODO this may be derived from their offset Tops and lefts

       distributeSpacesVertically : function (els)
       {

       },

       distributeSpacesHorizontally : function (els)
       {

       },*/

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       */
      alignTopLeft : function (el1, el2)
      {
         this.anchorTop(el1, el2);
         this.anchorLeft(el1, el2);
      },

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       */
      anchorTopLeft : function (el1, el2)
      {
         this.anchorTop(el1, el2);
         this.anchorLeft(el1, el2);
      },

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       */
      alignTopRight : function (el1, el2)
      {
         this.alignTop(el1, el2);
         this.alignRight(el1, el2);
      },

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       */
      anchorTopRight : function (el1, el2)
      {
         this.anchorTop(el1, el2);
         this.anchorRight(el1, el2);
      },

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @param leftOffset
       * @param topOffset
       */
      alignBottomLeft : function (el1, el2, topOffset = 0, leftOffset = 0)
      {
         this.alignBottom(el1, el2, topOffset);
         this.alignLeft(el1, el2, leftOffset);
      },

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       * @param leftOffset
       * @param topOffset
       */
      anchorBottomLeft : function (el1, el2, topOffset = 0, leftOffset = 0)
      {
         this.anchorBottom(el1, el2, topOffset);
         this.anchorLeft(el1, el2, leftOffset);
      },

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       */
      alignBottomRight : function (el1, el2)
      {
         this.alignBottom(el1, el2);
         this.alignRight(el1, el2);
      },

      /**
       *
       * @param el1 {Element}
       * @param el2 {Element | Array <Element >| HTMLCollection}
       */
      anchorBottomRight : function (el1, el2)
      {
         this.anchorBottom(el1, el2);
         this.anchorRight(el1, el2);
      },

      rotateTowardsMouse : function (el, rollBack, originAnchor)
      {
         var self = this;
         //finding the center of the el
         var elCenter = [self.getLeft(el) + self.getWidth(el) / 2,
                         self.getTop(el) + self.getHeight(el) / 2];

         if (originAnchor)
         {
            elCenter = [self.getLeft(originAnchor) + self.getWidth(originAnchor) / 2,
                        self.getTop(originAnchor) + self.getHeight(originAnchor) / 2];
         }

         console.log(originAnchor);

         (originAnchor ? originAnchor : el).addEventListener('mousemove', function (e)
         {
            var angle = Math.atan2(e.pageX - elCenter[0], -(e.pageY - elCenter[1])) * (180 / Math.PI);

            self.css(el, { "-webkit-transform" : 'rotate(' + angle + 'deg)' });
            self.css(el, { '-moz-transform' : 'rotate(' + angle + 'deg)' });
         });

         if (rollBack)
         {
            (originAnchor ? originAnchor : el).addEventListener('mouseout', function (e)
            {
               self.css(el, { "-webkit-transform" : 'rotate(' + 0 + 'deg)' });
               self.css(el, { '-moz-transform' : 'rotate(' + 0 + 'deg)' });
            })
         }

      },

      /**
       * Returns the owner document for a node.
       * @param {Node|Window} node The node to get the document for.
       * @return {!Document} The document owning the node.
       */
      getOwnerDocument : function (node)
      {
         // TODO(: Update param signature to be non-nullable.
         Bu.assert(node, 'Node cannot be null or undefined.');

         /** @type {!Document} */
         return (node.nodeType == Bee.Widget.NodeType.DOCUMENT ?
                 node : node.ownerDocument || node.document);
      },

      /**
       *
       * @param el {Element}
       * @param styles {Object, Array}
       * @param options {Object}
       */
      animate : function (el, styles, options)
      {
         if (Bu.defined(Velocity))
         {
            var animations = {};
            if (Bu.isArray(styles))
            {
               //#es6+
               for (let i = 0, len = styles.length; i < len; i++)
               {
                  Bu.extend(animations, styles[i])
               }
               styles = null;
            }
            else
            {
               animations = styles;
               styles = null;
            }

            Velocity(el,
                     animations,
                     Bu.defined(options) ? {
                        loop     : options.loop ? options.loop : null,
                        easing   : options.easing ? options.easing : null,
                        delay    : options.delay ? this.resolveToMilliSeconds(options.delay) : null,
                        duration : options.duration ? this.resolveToMilliSeconds(options.duration) : null
                     } : null);

            if (options.reverse !== undefined)
            {
               //es6+
               let dur = options.reverse.duration ? this.resolveToMilliSeconds(options.reverse.duration) :
                         options.duration ? this.resolveToMilliSeconds(options.duration) : 1000;

               Velocity(el, 'reverse', { duration : dur });
            }
         }
      },

      /**
       * register effect
       * @param fxName {String}
       */
      registerFx : function (fxName)
      {
         fx = Bee.Animations[fxName];
         Velocity.RegisterEffect(fx.animName, fx.animStyles);
      },

      /**
       *
       * @param seconds
       * @returns {*}
       */
      resolveToMilliSeconds : function (seconds)
      {
         if (Bu.isString(seconds))
         {
            seconds = Bu.pFt(seconds.replace("m", "").replace("s", ""));
         }

         if (Bu.isBetween(seconds, 10, 100))
         {
            seconds *= 100;
         }
         else if (seconds <= 10)
         {
            seconds *= 1000;
         }

         return seconds;
      },

      /**
       *
       * @param seconds
       * @returns {number}
       */
      toMilliSeconds : function (seconds)
      {
         return seconds / 1000;
      },

      /**
       *
       * @param element
       * @param pseudoClass
       * @param prop
       * @param value
       */
      setPseudoStyle : function (element, pseudoClass, prop, value)
      {
         var sheetId = "pseudoStyles";

         var head = document.head || document.getElementsByTagName('head')[0];
         var sheet = document.getElementById(sheetId) || document.createElement('style');

         sheet.id = sheetId;
         var className = "pseudoStyle"/* + Bee.Widget.UID.getNew()*/;
         //_this.className += " " + className;

         this.addClass(element, className);

         sheet.innerHTML += " ." + className + "::" + // inserting the shadow property
                            pseudoClass + "{" + prop +
                            ":" + value + "}";
         head.appendChild(sheet);
         //return element;
      },

      /**
       *
       * @param obj
       * @returns {*|boolean}
       */
      isElement : function (obj)
      {
         return Bu.isObject(obj) && obj.nodeType === Bee.Widget.NodeType.ELEMENT;
      },

      /**
       * Returns an array containing just the element children of the given element.
       * @param {Element} element The element whose element children we want.
       * @return {!(Array<!Element>|NodeList<!Element>)} An array or array-like list
       *     of just the element children of the given element.
       */
      getChildren : function (element)
      {
         // We check if the children attribute is supported for child elements
         // since IE8 misuses the attribute by also including comments.
         if (element.children !== "undefined")
         {
            return element.children;
         }
         // Fall back to manually filtering the element's child nodes.
         return Bee.Array.filter(element.childNodes, function (node)
         {
            return node.nodeType === Bee.Widget.NodeType.ELEMENT;
         });
      },

      /**
       *
       * @param el {Element | Array<Element>}
       */
      appendToWindow : function (el)
      {
         if (el)
         {
            if (Bu.isArray(el))
            {
               Bu.forEach(el, function (node)
               {
                  document.body.appendChild(node);
               })
            }
            else
            {
               document.body.appendChild(el);
            }
         }
      },

      /**
       *
       * @param el {Element | Array<Element>}
       */
      appendToHead : function (el)
      {
         if (el)
         {
            if (Bu.isArray(el))
            {
               Bu.forEach(el, function (node)
               {
                  document.head.appendChild(node);
               })
            }
            else
            {
               document.head.appendChild(el);
            }
         }
      },

      /**
       *
       * @param properties
       * @param styles
       * @returns {*|Element}
       */
      appendOverlay : function (properties, styles)
      {
         var self    = this,
             overlay = Bee.Widget.createEl('section', { className : 'overlay' });
         Bee.Widget.css(overlay, {
            zIndex          : 200,
            position        : 'absolute',
            top             : 0,
            left            : 0,
            backgroundColor : '#000',
            opacity         : .8,
            overflow        : 'hidden',
            display         : 'block',
            width           : '100%',
            height          : '100%'
         });

         if (properties)
         {
            Bu.extend(overlay, properties);
         }

         if (styles)
         {
            self.css(overlay, styles);
         }

         Bee.Widget.appendToWindow(overlay);

         return overlay;
      },

      /**
       * Appends a child to a node.
       * @param {Node} parent Parent.
       * @param {Node} child Child.
       */
      appendChild : function (parent, child)
      {
         if (parent && child)
         {
            parent.appendChild(child);
         }
      },

      /**
       * Appends a child to a node.
       * @param {Node} parent Parent.
       * @param {Array<Node>} children Child.
       */
      appendChildren : function (parent, children)
      {
         if (parent && children)
         {
            if (!Bu.isArray(children))
            {
               children = Ba.toArray(children);
            }

            Ba.forEach(children, function (child)
            {
               parent.appendChild(child);
            })
         }
      },

      /**
       * Create a table.
       * @param {!Document} doc Document object to use to create the table.
       * @param {number} rows The number of rows in the table.  Must be >= 1.
       * @param {number} columns The number of columns in the table.  Must be >= 1.
       * @param {boolean} fillWithNBSP If true, fills table entries with
       *     {@link Barge.String.Unicode.NBSP} characters.
       *
       * @param content {Array<Array<*>>} A 2d array of
       * the same row and col size as the rows and columns
       *
       * @return {!HTMLTableElement} The created table.
       *
       */
      createTable : function (doc, rows, columns, content, fillWithNBSP)
      {
         /** @type {!HTMLTableElement} */
         var table = (Bu.createEl('table'));
         var tbody = table.appendChild(Bu.createEl('tbody'));
         var useContent;

         if (content && content.length === rows && content[0].length === columns)
         {
            useContent = true;
         }

         for (var i = 0; i < rows; i++)
         {
            var tr = Bu.createEl('tr');
            for (var j = 0; j < columns; j++)
            {
               var td = Bu.createEl('td', { innerHTML : useContent ? content[i][j] : "" });

               // IE <= 9 will create a text node if we set text content to the empty
               // string, so we avoid doing it unless necessary. This ensures that the
               // same DOM tree is returned on all browsers.
               if (fillWithNBSP)
               {
                  Bee.Widget.setTextContent(td, Bee.String.Unicode.NBSP);
               }

               if (useContent)
               {
               }

               tr.appendChild(td);
            }
            tbody.appendChild(tr);
         }
         return table;
      },

      /**
       * Sets the text content of a node, with cross-browser support.
       * @param {Node} node The node to change the text content of.
       * @param {string|number} text The value that should replace the node's content.
       */
      setTextContent : function (node, text)
      {
         Bu.assert(node !== null, 'Barge.Widget.setTextContent expects a non-null value for node');

         if ('textContent' in node)
         {
            node.textContent = text;
         }
         else if (node.nodeType === Bee.Widget.NodeType.TEXT)
         {
            node.data = text;
         }
         else if (node.firstChild && node.firstChild.nodeType === Bee.Widget.NodeType.TEXT)
         {
            // If the first child is a text node we just change its data and remove the
            // rest of the children.
            while (node.lastChild !== node.firstChild)
            {
               node.removeChild(node.lastChild);
            }
            node.firstChild.data = text;
         }
         else
         {
            Bee.Widget.removeChildren(node);

            var doc = Bee.Widget.getOwnerDocument(node);

            node.appendChild(doc.createTextNode(String(text)));
         }
      },

      /**
       *@use returns the index of the caret position in an editable HTML element
       * @param el {Element} {object}
       * @returns {Number}
       */
      getCaretPosition         : function n(el)
      {
         const val = el.value;
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
            const range = el.createTextRange();
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
            const sel = document.selection.createRange();
            sel.text = val;
         }
         else if (el.selectionStart || el.selectionStart === '0')    //MOZILLA and others
         {
            el.focus();
            const startPos = el.selectionStart;
            const endPos = el.selectionEnd;
            if (el.tagName.toLowerCase() === "textarea")
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
            if (el.tagName.toLowerCase() === "textarea")
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
         const it = el.value;
         const gcp = this.getCaretPosition(el);
         if (gcp < it.length)
         {
            if (numOfChars !== undefined)
            {
               const it1 = it.substring(0, gcp - numOfChars);
               const it2 = it.substring(gcp, it.length);
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
               const it11 = it.substring(0, gcp - 1);
               const it22 = it.substring(gcp, it.length);
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
         const str = input.value;
         const iSubStr = str.substring(0, input.selectionStart);
         const uSubStr = str.substring(input.selectionEnd, str.length);
         input.value = iSubStr + uSubStr;
      }
,

      /**
       * domready (c) Dustin Diaz 2014 - License MIT
       * @param fns {Function | Array<Function>}
       * @returns {Function}
       */
      ready : function (fns)
      {
         const self = this;
         let listener;
         const hack = document.documentElement.doScroll;
         let loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(document.readyState);

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
      }
   };

   /**
    * :root element style + vars
    * @type {CSSStyleDeclaration}
    * @const
    * @enum
    */
   Bee.Dom.CSSSTYLE = document.documentElement.style;

   /**
    *
    * @param PropertyName {string}
    * @param value {string}
    */
   Bee.Dom.setRootStyle = function (PropertyName, value)
   {
      return Bee.Widget.CSSSTYLE.setProperty(PropertyName, value);
   };

   /**
    *
    * @param PropertyName
    * @returns {string}
    */
   Bee.Dom.getRootStyle = function (PropertyName)
   {
      return Bee.Widget.CSSSTYLE.getPropertyValue(PropertyName);
   };

   /**
    * Gets the document object being used by the dom library.
    * @return {!Document} Document object.
    */
   Bee.Dom.getDocument = function ()
   {
      return document;
   };

   //these globals will be used for constructor and object type fns
   var i = 0, len = 0;
   Bee.Dom.surrogateButton = function ()
   {
      var sBtns = Bee.Widget.getElementsByAttribute("data-sbtn");
      // console.log(sBtns);
      if (sBtns)
      {
         Ba.forEach(sBtns, function (sBtn, i)
         {
            if (Bu.defined(sBtn.getAttribute("data-sbtn")) && !Bs.isEmpty(sBtn.getAttribute("data-sbtn")))
            {
               sBtn.addEventListener("click", function (e)
               {
                  let actualBtn = Bee.Widget.getEl('#' + e.target.getAttribute("data-sbtn"));

                  if (Bu.defined(actualBtn))
                  {
                     if ((!Bee.Widget.disabled(actualBtn)))
                     {
                        actualBtn.click();
                        if (actualBtn.classList.contains('reload'))
                        {
                           window.opener.location.reload();
                        }
                        if (actualBtn.classList.contains('close'))
                        {
                           window.close();
                        }
                     }
                  }
               });
            }
         });

         /*for (i = 0, len = sBtns.length; i < len; i++)
         {
            sBtns[i].addEventListener('click', function ()
            {
               //console.log(window.opener)
               if (this.getAttribute("data-sbtn") && !Bs.isEmpty(this.getAttribute("data-sbtn")))
               {
                  var actualBtn = Bee.Widget.getEl('#' + this.getAttribute("data-sbtn"));
                  // console.log(actualBtn);

                  if (actualBtn)
                  {
                     console.log(actualBtn);

                     console.log(actualBtn.classList.contains("disabled"));
                     if ((!Bee.Widget.disabled(actualBtn)))
                     {
                        actualBtn.click();
                        if (actualBtn.classList.contains('reload'))
                        {
                           window.opener.location.reload();
                        }
                        if (actualBtn.classList.contains('close'))
                        {
                           window.close();
                        }
                     }
                  }
               }
            })
         }*/
      }
   };

   /**
    * Prefer the standardized (http://www.w3.org/TR/selectors-api/), native and
    * fast W3C Selectors API.
    * @param {!(Element|Document)} parent The parent document object.
    * @return {boolean} whether or not we can use parent.querySelector* APIs.
    * @private
    */
   Bee.Dom._canUseQuerySelector = function (parent)
   {
      return !!(parent.querySelectorAll && parent.querySelector);
   };

   /**
    * Constants for the nodeType attribute in the Node interface.
    *
    * These constants match those specified in the Node interface. These are
    * usually present on the Node object in recent browsers, but not in older
    * browsers (specifically, early IEs) and thus are given here.
    *
    * In some browsers (early IEs), these are not defined on the Node object,
    * so they are provided here.
    *
    * See http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1950641247
    * @enum {number}
    */
   Bee.Dom.NodeType = {
      ELEMENT                : 1,
      ATTRIBUTE              : 2,
      TEXT                   : 3,
      CDATA_SECTION          : 4,
      ENTITY_REFERENCE       : 5,
      ENTITY                 : 6,
      PROCESSING_INSTRUCTION : 7,
      COMMENT                : 8,
      DOCUMENT               : 9,
      DOCUMENT_TYPE          : 10,
      DOCUMENT_FRAGMENT      : 11,
      NOTATION               : 12
   };

   if (Bu.defined(Bee.userAgent))
   {
      /**
       * Enum of browser capabilities.
       * @enum {boolean}
       */
      Bee.Widget.BrowserFeature = {
         /**
          * Whether attributes 'name' and 'type' can be added to an element after it's
          * created. False in Internet Explorer prior to version 9.
          */
         CAN_ADD_NAME_OR_TYPE_ATTRIBUTES : !Bee.userAgent.IE || Bee.userAgent.isDocumentModeOrHigher(9),

         /**
          * Whether we can use element.children to access an element's Element
          * children. Available since Gecko 1.9.1, IE 9. (IE<9 also includes comment
          * nodes in the collection.)
          */
         CAN_USE_CHILDREN_ATTRIBUTE : !Bee.userAgent.GECKO && !Bee.userAgent.IE ||
                                      Bee.userAgent.IE && Bee.userAgent.isDocumentModeOrHigher(9) ||
                                      Bee.userAgent.GECKO && Bee.userAgent.isVersionOrHigher('1.9.1'),

         /**
          * Opera, Safari 3, and Internet Explorer 9 all support innerText but they
          * include text nodes in script and style tags. Not document-mode-dependent.
          */
         CAN_USE_INNER_TEXT : (Bee.userAgent.IE && !Bee.userAgent.isVersionOrHigher('9')),

         /**
          * MSIE, Opera, and Safari>=4 support element.parentElement to access an
          * element's parent if it is an Element.
          */
         CAN_USE_PARENT_ELEMENT_PROPERTY : Bee.userAgent.IE || Bee.userAgent.OPERA || Bee.userAgent.WEBKIT,

         /**
          * Whether NoScope elements need a scoped element written before them in
          * innerHTML.
          * MSDN: http://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx#1
          */
         INNER_HTML_NEEDS_SCOPED_ELEMENT : Bee.userAgent.IE,

         /**
          * Whether we use legacy IE range API.
          */
         LEGACY_IE_RANGES : Bee.userAgent.IE && !Bee.userAgent.isDocumentModeOrHigher(9)
      };
   }

   //endregion
})(Bee.Utils, Bee.String, Bee.Array, Bee.Object);

/*issue #01 the display state of grandParent lis and uls don't change for filter list
 * */