/**
 * @Author Created by Arch on 1/22/17.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
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
 *
 *        \__/
 *    \  (-_-)  /
 *    \-( ___)-/
 *     ( ____)
 *   <-(____)->
 *    \      /
 */

var Barge = Bee || {};
(function (Bu, Bs, Bd)
{
   //region prtected globals
   /**
    *
    * @type {{toolBox: null, toolBoxItemsClassName: string, flyOutDirection: string, recurse: boolean, switchOnHover: boolean,
    *    keepState: boolean, trackMouseMove: boolean, useNativeShortcut: boolean, unDockable: boolean}}
    */
   var options          = {
      toolBoxItemsClassName : "toolBoxItem",
      flyOutDirection       : 'right',
      recurse               : false,
      switchOnHover         : true,
      keepState             : true,

      //currently giving issues
      keepPosition          : false,
      trackMouseMove        : false,

      /*uses the title attr as shortcut handle*/
      useNativeShortcut : false,
      unDockable        : true,
      floatingWidth     : null,
      floatingHeight    : null
   },
       toolBox          = null,

       /**
        * an array of main tool box Items (fields)
        * @type {Object|Array}
        * @protected
        */
       toolBoxItems     = Bu.nodeListToArray(document.getElementsByClassName(options.toolBoxItemsClassName)),



       toolTip          = null,

       /**
        *
        * @type {{left: null, leftOffset: number, topOffset: number}}
        */
       toolTipProps     = {
          leftOffset : 0,
          topOffset  : 0
       },

       /**
        * caching the tool box I's fields len to avoid re-querying for loops
        * @type {Number}
        */
       len              = toolBoxItems.length,
       /**
        *
        * @type {number}
        */
       i                = 0,
       /**
        * flag for whether a Sub Menu Is Open
        * @type {boolean}
        * @protected
        */
       aFlyOutIsOpen    = false,

       /**
        * workAround for issue #58 in menu bar
        * @type {boolean}
        */
       toolBoxActivated = false,

       toolTipIsShowing = false,

       /**
        * global reference for the currently open FlyOut aka activeRow
        * @type {null | Element}
        */
       openFlyOut       = null,

       docked = true,

       toBeMovedWidth  = null,
       toBeMovedHeight = null,

       gFlyOutMenuItems = [],

       bottomXY         = { x : null, y : null },

       topXY            = { x : null, y : null },

       /**
        *
        * @type {Barge.Event.EventManager}
        */
       Be               = new Bee.Event.EventManager(),
       /**
        *
        * @type {Array}
        */
       mouseLocs        = [],

       /**
        *
        * @type {*}
        */
       loc              = mouseLocs[mouseLocs.length - 1],
       /**
        *
        * @type {*}
        */
       prevLoc          = mouseLocs[0];
//endregion

   /**
    * tracking the mouse locations
    * @type {number}
    * @const
    */
   const MOUSE_LOCS_TRACKED = 3;  // number of past mouse locations to track

   /**
    * returns the display state of an el 1 if  visible else 0
    * @param el
    * @return {number}
    * @private
    */
   function _getDisplayState(el)
   {
      if (el.style.display === "none" || el.style.display === "")
      {
         return 0;
      }
      return 1
   }

   /**
    *
    * @param windowEl
    * @private
    */
   function _openWin(windowEl)
   {
      if (Bu.getDisplayState(windowEl) == 0)
      {
         Bu.setDisplayState(windowEl, "block");
      }
   }

   /**
    *
    * @param toolBoxItem
    * @return {*|HTMLElement|boolean}
    * @private
    */
   function _haveFlyOutOpen(toolBoxItem)
   {
      var flyOut    = toolBoxItem.children[1],
          HasFlyOut = flyOut && flyOut.tagName === "UL";
      return HasFlyOut && flyOut.style.display == "block";
   }

   function resetToolBoxSize(toolBox, options)
   {
      if (Bu.defined(options.floatingWidth ))
      {
         Bu.css(toolBox, { width : options.floatingWidth + 10 + 'px' });
      }
      /*else
       {
       Bu.css(toBeMoved, { width : toBeMovedWidth + 'px' });
       }*/

      if (Bu.defined(options.floatingHeight))
      {
         Bu.css(toolBox, { height : options.floatingHeight + 7 + 'px' });
         //Bu.css(toBeMoved, { height : dragOptions.floatingHeight || toBeMovedHeight + 'px' });
      }
      /*else
       {
       Bu.css(toBeMoved, { height : toBeMovedHeight + 'px' });

       }*/
   }
   /**
    * checks if a flyOut is open
    * @type {boolean}
    */
   aFlyOutIsOpen = toolBoxItems.some(_haveFlyOutOpen);

   /**
    * @use close any FlyOuts of a toolBox item passed to it
    * @param toolBoxItems {HTMLCollection | Array}
    * @param rootChild {Boolean}
    * @param innerRoot{Boolean}
    * @private
    */
   function _closeAllFlyOuts(toolBoxItems, rootChild, innerRoot)
   {
      if (toolBoxItems)
      {
         for (i = 0, len = toolBoxItems.length; i < len; i++)
         {
            var flyOut    = toolBoxItems[i].children[1],
                hasFlyOut = toolBoxItems[i].children[1] && flyOut.tagName === "UL";

            if (hasFlyOut)
            {
               Bu.closeWin(flyOut);
            }
            if (rootChild)
            {
               // .style.backgroundColor = "";
               Bu.css(toolBoxItems[i].children[0], { backgroundColor : "" });
            }
            if (innerRoot)
            {
               // .style.backgroundColor = "";
               Bu.css(toolBoxItems[i], { backgroundColor : "" })

            }
         }
      }
   }

   /**
    * extracted method used as a workaround for issue #04
    * @param li {Element} the clicked li
    * @param flyOutMenuItems {NodeList}
    * @param toolBoxItem {Element}
    */
   function swapIcons(li, flyOutMenuItems, toolBoxItem)
   {
      let iconItem = li.children[0].children[0];
      let iconDugOut = li.parentElement.previousElementSibling.children[0];
      let shortCutItem = li.children[0].getElementsByClassName('shortCut')[0];
      //console.log('shortCutItem', shortCutItem, shortCutItem.innerHTML);

      var shortCut = '';

      if (options.useNativeShortcut === false)
      {
         if (Bu.defined(iconItem.getAttribute("data-tbTip")))
         {
            shortCut += iconItem.getAttribute("data-tbTip");
         }
         else if (iconItem.title && !Bs.isEmpty(iconItem.title))
         {
            shortCut += iconItem.title;
         }
         shortCut += shortCutItem ? '  (' + shortCutItem.innerHTML + ')' : ''

      }
      else
      {
         shortCut = iconItem.title + ( shortCutItem ? '  (' + shortCutItem.innerHTML + ')' : '');
      }

      //console.log(iconItem.title);

      if (options.keepState)
      {
         var myIndex = toolBoxItems.indexOf(li.parentElement.parentElement);
         var myFlyOutItemIndex = flyOutMenuItems.indexOf(li);

         //console.log(li.parentElement.parentElement);
         console.log('toolBoxItem' + myIndex, myFlyOutItemIndex);

         localStorage.setItem('toolBoxItem' + myIndex, myFlyOutItemIndex);

      }

      var iconHasKids = Bd.hasChildren(li.children[0].children[0]);

      Bd.removeEl(iconDugOut);
      iconDugOut = li.parentElement.previousElementSibling;

      var duplicateEl = Bu.createEl("span");

      Bu.extend(duplicateEl, { className : iconItem.className });

      if (!iconHasKids)
      {
         Bu.extend(duplicateEl, { innerHTML : iconItem.innerHTML });
      }
      Bd.css(duplicateEl, iconItem.style);

      if (iconHasKids)
      {
         var duplicateKidEl = Bu.createEl(iconItem.children[0].tagName.toLocaleLowerCase());

         Bu.extend(duplicateKidEl, { className : iconItem.children[0].className });

         Bd.css(duplicateKidEl, iconItem.children[0].style);
         Bd.css(duplicateKidEl, { textAlign : 'center', width : '25px', height : '25px' });

         duplicateEl.appendChild(duplicateKidEl);
      }

      if (options.useNativeShortcut === false)
      {
         toolBoxItem.setAttribute("data-tbTip", shortCut)
      }
      else
      {
         Bu.extend(toolBoxItem, { title : !Bs.isEmpty(shortCut) ? shortCut : '' });

      }

      iconDugOut.appendChild(duplicateEl);
   }

   if (options.useNativeShortcut === false)
   {
      Bu.forEach(toolBoxItems, function (node)
      {
         var toolBoxItem = node.children[0];
         toolBoxItem.title = "";

      });
   }

   Be.bindOnAll(toolBoxItems, 'mouseup', function (e)
   {
      var flyOut          = this.children[1],
          flyOutMenuItems = Bu.nodeListToArray(this.children[1].children),
          toolBoxItem     = this.children[0],
          hasFlyOut       = this.children[1] && flyOut.tagName === "UL",
          target          = e.target;

      if (hasFlyOut)
      {
         if (_getDisplayState(flyOut) === 1)
         {
            Bu.closeWin(flyOut);

            Bu.css(toolBoxItem, { backgroundColor : "" });

            openFlyOut = null;
            aFlyOutIsOpen = false;

            //gFlyOutMenuItems.push(flyOutMenuItems);
            //
            /*Be.bindOnAll(flyOutMenuItems, "click", function (ev)
             {

             });*/
            //issue #01
            //using native event binding because managing the event
            // sort of uses the elements elsewhere and so  DOm els delete
            // when performing appendChild
            for (let i = 0, len = flyOutMenuItems.length; i < len; i++)
            {
               /*issue #01
                * mouse up event is only swaps the iconItem after the second click
                * */
               flyOutMenuItems[i].addEventListener("click", function ()
               {
                  swapIcons(this, flyOutMenuItems, toolBoxItem);
               }, false);

            }
         }
         else
         {
            //this is counter-intuitive
            // console.log('aFlyOutIsOpen', aFlyOutIsOpen);
            /*issue #58 workaround*/
            if (!toolBoxActivated)
            {
               _closeAllFlyOuts(toolBoxItems, true);
               toolBoxActivated = true;

            }
            /*issue #03
             * Menu gets activate but does not display
             * P.S Don't know why*/
            if (aFlyOutIsOpen)
            {
               //_closeAllFlyOuts(toolBoxItems, true);
               Bu.closeWin(openFlyOut);
               console.log('menuA here', openFlyOut);

               // console.log('closeA here');
            }

            //activate the menu bar once
            //if (toolBoxActivated === false)
            //{
            // console.log('menuATrue here');
            //}

            if (toolTipIsShowing)
            {
               console.log(toolTipIsShowing);
               if (Bu.defined(Bd.getEl("toolTip")))
               {
                  Bd.closeWin(Bd.getEl("toolTip"));
               }
            }

            Bu.css(toolBoxItem, { backgroundColor : "var(--menuItemHoverColor)" });

            _openWin(flyOut);

            console.log('imhere');

            openFlyOut = flyOut;


            // console.log('here');
            // Bu.setObjectPositionAt(flyOut,this,'bottomLeft', false, false);
            // console.log(Bu.containedInWindow(flyOut));
            // console.log(flyOut);
            // Bu.fitIntoWindow(flyOut);
            aFlyOutIsOpen = true;
         }


      }
      else
      {
         /* if (!_noHover(this))
          {*/
         Bu.css(toolBoxItem, { backgroundColor : "var(--menuItemHoverColor)" });
         //}
         aFlyOutIsOpen = true;
      }

      if (target.nextElementSibling != flyOut || target.parentNode != this)
      {
         Bu.closeWin(flyOut);
         Bu.css(toolBoxItem, { backgroundColor : "" });
         aFlyOutIsOpen = false;
      }
   });

   if (options.switchOnHover === true)
   {
      Be.bindOnAll(toolBoxItems, 'mouseover', function (e)
      {
         //check if a submenu is open and the item does not contain a drop down
         if (aFlyOutIsOpen && !this.classList.contains("dropDown"))
         {
            /**
             *
             * @type {Element}
             */
            var flyOut                = this.children[1], //submenu
                /**
                 *
                 * @type {Element}
                 */
                toolBoxItem           = this.children[0], //submenu row
                /**
                 *
                 * @type {Boolean}
                 */
                toolBoxItemHasSubMenu = this.children[1] && flyOut.tagName === "UL";

            if (toolBoxItemHasSubMenu)
            {
               //region b4 innerLoop
               //_closeAllFlyOuts(toolBoxItems, true);
               //console.log(openFlyOut);
               Bu.closeWin(openFlyOut);

               //open the sub menu
               _openWin(flyOut);

               aFlyOutIsOpen = true;

               /**
                * set the activeRow and openSubMenu to flyOut
                * @type {Element}
                */
               openFlyOut = flyOut;

               /**
                * set the global sub Menu Items to flyOutItems;
                * @type {HTMLElement[]}
                */
               //gflyOutItems = flyOut.children;

               //endregion

               /**
                *Implementing Bruce Tognazzini's algorithm (NOT IN USE atm)
                flyOut.addEventListener("mousemove", function (e)
                {
                   mouseMoveSubMenu(e);

                   loc = mouseLocs[mouseLocs.length - 1];
                   prevLoc = mouseLocs[0];

                   var decreasingCorner = upperRight,
                       increasingCorner = lowerRight;

                   var decreasingSlope     = _getSlope(loc, decreasingCorner),
                       increasingSlope     = _getSlope(loc, increasingCorner),
                       prevDecreasingSlope = _getSlope(prevLoc, decreasingCorner),
                       prevIncreasingSlope = _getSlope(prevLoc, increasingCorner);

                   console.log(loc);
                   console.log('dc', decreasingCorner);
                   console.log('ic', increasingCorner);
                   console.log('ds', decreasingSlope);
                   console.log('is', increasingSlope);

                });*/

               //region start of inner Loop
               /*for (var j = 0, innerLen = flyOutItems.length; j < innerLen; j++)
                {

                flyOutItems[j].addEventListener("mouseover", function ()
                {
                /!**
                *
                * @type {Element}
                *!/
                var flyOutItemSubMenu    = this.children[1],
                /!**
                *
                * @type {Element}
                *!/
                flyOutItem           = this.children[0],
                /!**
                *
                * @type {Boolean}
                *!/
                flyOutItemHasSubMenu = this.children[1] && flyOut.tagName === "UL";

                /!**
                * NIU atm
                upperLeft = Bd.getTopLeft(this);
                upperRight = Bd.getTopRight(this);
                lowerLeft = Bd.getBottomLeft(this);
                lowerRight = Bd.getBottomRight(this);*!/

                //default menu direction

                // Our expectations for decreasing or increasing slope values
                // depends on which direction the submenu opens relative to the
                // main menu. By default, if the menu opens on the right, we
                // expect the slope between the cursor and the upper right
                // corner to decrease over time, as explained above. If the
                // submenu opens in a different direction, we change our slope
                // expectations.

                /!**
                * NOT IN USE atm
                if (options.submenuDirection === "left")
                {
                decreasingCorner = lowerLeft;
                increasingCorner = upperLeft;
                }
                else if (options.submenuDirection === "below")
                {
                decreasingCorner = lowerRight;
                increasingCorner = lowerLeft;
                }
                else if (options.submenuDirection === "above")
                {
                decreasingCorner = upperLeft;
                increasingCorner = upperRight;
                }

                if (decreasingSlope < prevDecreasingSlope &&
                increasingSlope > prevIncreasingSlope)
                {
                // Mouse is moving from previous location towards the
                // currently activated submenu. Delay before activating a
                // new menu row, because user may be moving into submenu.
                lastDelayLoc = loc;
                return DELAY;
                }

                lastDelayLoc = null;
                return 0;*!/

                if (flyOutItemHasSubMenu)
                {
                _closeAllSubMenus(flyOutItems, false, true);
                openSubSubMenu = flyOutItemSubMenu;

                if (!_disabled(flyOutItemSubMenu.parentElement))
                {  // flyOutItemSubMenu.style.display = "block";
                Bu.css(flyOutItemSubMenu, { display : "block" });
                Bu.css(this, { backgroundColor : "var(--toolBoxItemHoverColor)" });

                aSubMenuChildMenuIsOpen = true;

                }

                /!*region 2n inner deep loop msg u may disable dis and use css for speed sake*!/
                /!**
                *
                * @type {HTMLElement[]}
                *!/
                var subSubMenuItems = flyOutItemSubMenu.children;

                /!**
                * set the global sub sub Menu Items to flyOutItems;
                * @type {HTMLElement[]}
                *!/
                gSubSubMenuItems = subSubMenuItems;

                for (var k = 0, innerMostLen = subSubMenuItems.length; k < innerMostLen; k++)
                {
                subSubMenuItems[k].addEventListener("mouseover", function ()
                {
                var subSubMenu               = this.children[1],
                subSubtoolBoxItem           = this.children[0],
                subSubtoolBoxItemHasSubMenu = this.children[1] && flyOut.tagName === "UL";

                if (subSubtoolBoxItemHasSubMenu)
                {
                _closeAllSubMenus(subSubMenuItems, false);//imhere i'm lost
                if (!_disabled(subSubMenu.parentElement))
                {
                subSubMenu.style.display = "block";
                aSubMenuGrandChildMenuIsOpen = true; // subSubtoolBoxItem.style.backgroundColor = "";
                }
                }
                else
                {
                _closeAllSubMenus(subSubMenuItems, false);
                aSubMenuGrandChildMenuIsOpen = false;
                }
                });
                }
                /!*endregion*!/
                }
                else
                {
                _closeAllSubMenus(flyOutItems, false, true);
                Bu.css(this, { backgroundColor : "var(--toolBoxItemHoverColor)" });

                aSubMenuChildMenuIsOpen = false;
                }

                });

                flyOutItems[j].addEventListener("mouseout", function ()
                {
                if (aSubMenuChildMenuIsOpen)
                {
                if (openSubSubMenu && openSubSubMenu.parentElement != this)
                {
                Bu.css(this, { backgroundColor : "" });
                }
                }
                else
                {
                Bu.css(this, { backgroundColor : "" });
                }

                });
                }*/

               //endregion
               /*var deepSubMenu = flyOut.children[1],
                SubMenuItem = flyOut.children[0],
                deepSubMenuHasSubMenu = flyOut.children[1] && flyOut.tagName === "UL";
                if(deepSubMenuHasSubMenu)
                {
                /!*console.log("deepMenu");
                *!/
                }*/
            }
            else
            {
               //_closeAllFlyOuts(toolBoxItems, true);
               Bu.closeWin(openFlyOut);
            }

            /*if (!_noHover(this))
             {*/
            // toolBoxItem.style.backgroundColor = "var(--toolBoxItemHoverColor)";
            Bu.css(toolBoxItem, { backgroundColor : "var(--menuItemHoverColor)" });
            //}
         }
         //_closeAllSubMenus(gflyOutItems, false, true);
         //_closeAllSubMenus(gSubSubMenuItems, false);
      });

      Be.bindOnAll(toolBoxItems, "mouseout", function ()
      {
         //console.log(openFlyOut && openFlyOut.parentElement != this);
         //console.log(openFlyOut.parentElement);
         //console.log(this);
         if (aFlyOutIsOpen)
         {
            if (openFlyOut && openFlyOut.parentElement === this)
            {
               // this.children[0].style.backgroundColor = "";
               Bu.css(this.children[0], { backgroundColor : "" })

            }
         }
      })
   }

   Be.bind(window, "click", function (e)
   {
      /**
       *
       * @type {boolean}
       */
      var isWin = e.target.tagName ?
                  e.target.tagName.toLowerCase() === 'body' ||
                  e.target.tagName.toLowerCase() === 'html' : null;

      /**
       *
       * @private
       */
      function _closeEveryOpenItem()
      {
         //_closeAllFlyOuts(toolBoxItems, true);
         //_closeAllFlyOuts(gflyOutItems, false);
         Bu.closeWin(openFlyOut);
         aFlyOutIsOpen = false;
      }

      if (aFlyOutIsOpen)
      {
         /**
          * issue #59
          * If the target tag Name is html || body an err occurs
          */
         if ((e.target.parentNode.classList && !e.target.parentNode.classList.contains("toolBoxItem")))
         {
            _closeEveryOpenItem();
         }
         else if (isWin)//issue #59 workaround
         {
            // console.log(e.target.tagName.toLocaleLowerCase());
            _closeEveryOpenItem();
         }
      }
   });

   if (options.trackMouseMove === true)
   {
      Be.bind(window, 'mousemove', function (e)
      {

         if (openFlyOut)
         {
            var currLoc = 0;
            var interval = setInterval(function ()
                                       {
                                          if (currLoc === MOUSE_LOCS_TRACKED)
                                          {
                                             clearInterval(interval);
                                          }
                                          //mouseLocs[mouseLocs.length ] = Bu.getMouseCoordinates(e);
                                          mouseLocs.push(Bu.getMouseCoordinates(e));
                                          //console.log('1', mouseLocs[0]);
                                          //console.log('2', mouseLocs[1]);
                                          //console.log('3', mouseLocs[2]);

                                          if (mouseLocs.length > MOUSE_LOCS_TRACKED)
                                          {
                                             mouseLocs.shift();
                                          }

                                          _getGradient();

                                          currLoc++;

                                       }, 300)
         }

      });

      /**
       * @use for calculating the slope b/n the curr mouse x|y and the conners of an obj
       * @param a {Object}
       * @param b {Object}
       * @return {number}
       * @private
       */
      function _getSlope(a, b)
      {
         //b.y = b.y || 0;
         //a.y = a.y || 0;
         //
         //b.x = b.x || 0;
         //a.x = a.x || 0;
         //console.log(b.y);
         //console.log(a.y);
         //
         //console.log(b.x);
         //console.log(a.x);

         var dY = (b.y || 0 ) - (a.y || 0),
             dX = (b.x || 0) - (a.x || 0);

         return dY / dX;
      }

      function _getGradient()
      {
         if (openFlyOut)
         {
            var openFlyOutParent = openFlyOut.parentElement;

            bottomXY.x = Bd.getBottomRight(openFlyOutParent).right;
            bottomXY.y = Bd.getBottomRight(openFlyOutParent).bottom;

            topXY.x = Bd.getTopRight(openFlyOutParent).right;
            topXY.y = Bd.getTopRight(openFlyOutParent).top;

            if (Bu.defined(mouseLocs[mouseLocs.length - 1]))
            {
               var decreasingSlope = _getSlope(mouseLocs[mouseLocs.length - 1], bottomXY),
                   increasingSlope = _getSlope(mouseLocs[mouseLocs.length - 1], topXY);

               //prevDecreasingSlope = _getSlope(prevLoc, bottomXY),
               //prevIncreasingSlope = _getSlope(prevLoc, topXY);

               console.log('ds', decreasingSlope);
               console.log('is', increasingSlope);
            }

            //console.log(loc);
            //console.log('dc', decreasingSlope);
            //console.log('ic', increasingSlope);
            //console.log(Bd.getBottomRight(openFlyOutParent));
            //console.log(Bd.getTopRight(openFlyOutParent));
         }
      }
   }

   function insertCustomToolTip(removeEvs)
   {
      if (!removeEvs)
      {
         toolTip = Bd.createEl('div', { id : 'toolTip' }, { top : 0, left : 0, display : 'none' });
         document.body.appendChild(toolTip);

         var timer;

         var haveModernTip = Bu.getElementsByAttribute("data-tbTip");

         Be.bindOnAll(haveModernTip, 'mouseenter', function (e)
         {
            let self = this.parentElement,
                left = (Bd.getRight(self) / 2) - 6;
            //toolTipProps.left = Bu.pInt(self.offsetLeft) + Bu.pInt(toolTipProps.leftOffset);
            //console.log(left);

            Bd.alignLeft(self, toolTip, toolTipProps.leftOffset);

            //Bd.css(toolTip, {left : toolTipProps.left + 'px'});
            //console.log('ol', toolTipProps.left);

            Bd.anchorBottom(self, toolTip, 6 + Bu.pInt(toolTipProps.topOffset));

            Bd.setPseudoStyle(toolTip, 'before', 'left', left + 'px');

            var mtA     = this.getAttribute("data-tbTip").split(","),
                canShow = !Bs.isEmpty(mtA[0]);

            toolTip.innerHTML = mtA[0];

            timer = setTimeout(function ()
                               {
                                  clearTimeout(timer);
                                  if (canShow)
                                  {
                                     Bu.openWin(toolTip);
                                     toolTipIsShowing = true;
                                  }
                               }, 300)

         });

         Be.bindOnAll(haveModernTip, 'mouseout', function (e)
         {
            timer = setTimeout(function ()
                               {
                                  clearTimeout(timer);
                                  Bu.closeWin(toolTip);
                                  toolTipIsShowing = false;
                               }, 100);
         });
      }
   }

   if (options.useNativeShortcut === false)
   {
      insertCustomToolTip();
   }

   if (options.unDockable === true)
   {
      /**
       *
       * @param el {Element}
       * @param dragOptions {{prevDef : Boolean, moveParent : Boolean,
         tolerance : Number, dragStart : fn, dragDrop : fn,
       * floatingWidth : Number, floatingHeight : Number }}
       * @constructor
       */
      var Dockable = function (el, dragOptions = {})
      {
         var moveParent = dragOptions.moveParent || null,
             tolerance  = dragOptions.tolerance || null;

         //let dBe = new Bee.Event.EventManager();

         var self = this;
         var gsv = Bu.getStyleValue;

         var toBeMoved = null;

         toBeMoved = moveParent ? el.parentElement : el;

         toBeMovedWidth  = toBeMoved.offsetWidth;
         toBeMovedHeight = toBeMoved.offsetHeight;

         Bd.addClass(toBeMoved, "draggable");

         Bu.css(toBeMoved, {
            position   : 'absolute',
            left       : toBeMoved.offsetLeft,
            top        : toBeMoved.offsetTop,
            zIndex     : toBeMoved.style.zIndex + 1,
            transition : 'all .07s'
         });
         //Bd.css(toBeMoved, {});

         var defaultPos = {
            left : toBeMoved.offsetLeft,
            top  : toBeMoved.offsetTop
         };

         var myShadow = Bd.createEl('div');
         Bu.extend(myShadow, toBeMoved);
         Bu.css(myShadow, toBeMoved.style);

         Bu.extend(myShadow, { id : '', innerHTML : '' });

         Bu.css(myShadow, {
            display         : 'none',
            position        : 'absolute',
            borderLeft      : '2px solid #0078ff', //transition      : 'all .3s',
            borderTop       : 'none',
            borderRight     : 'none',
            borderBottom    : 'none',
            zIndex          : toBeMoved.style.zIndex - 1,
            backgroundColor : 'rgba(8, 124, 255, 0.3)'
         });

         document.body.appendChild(myShadow);

         var myShadowIsOpen  = false;

             //caching heights for later use


         var move = function (event)
         {
            Bu.css(myShadow, {
               width  : (toBeMovedWidth ) + 'px',
               height : toBeMovedHeight + 'px',
            });

            // don't bubble this event - mousedown
            event.stopPropagation();

            var originalLeft = parseInt(window.getComputedStyle(toBeMoved).left);
            var originalTop = parseInt(window.getComputedStyle(toBeMoved).top);

            if (event.target == el)
            {
               var mouseDownX = event.clientX;
               var mouseDownY = event.clientY;

               //no need to manage events, we can't unbind
               //dBe.bind(document,"mouseup", dropMe);
               //dBe.bind(document,"mousemove", dragMe);
               document.addEventListener("mouseup", dropMe, false);
               document.addEventListener("mousemove", dragMe, false);

               function dragMe(event)
               {

                  if (tolerance)
                  {

                     Bd.css(el, { cursor : 'move' });

                     var currLeftPos = Bu.getStyleValue('left', toBeMoved);
                     //currTopPos  = Bu.getStyleValue('top', toBeMoved);

                     //console.log(currLeftPos);

                     if (currLeftPos >= 10 && currLeftPos <= toBeMovedWidth)
                     {
                        Bd.openWin(myShadow);

                        myShadowIsOpen = !myShadowIsOpen;
                     }
                     else
                     {
                        Bd.closeWin(myShadow);
                     }

                     if (docked)
                     {
                        var dX = event.clientX - mouseDownX,
                            dY = event.clientY - mouseDownY;

                        if (dX > tolerance)
                        {
                           Bd.css(toolBox, { left : originalLeft + event.clientX - mouseDownX + "px" });
                           docked = false;
                        }

                        if (dY > 10)
                        {
                           Bd.css(toolBox, { top : originalTop + event.clientY - mouseDownY + "px" });
                           docked = false;


                        }
                     }
                     else if (currLeftPos <= tolerance + 5)
                     {

                        //Bu.css(myShadow, {
                        //   width  : 0 + 'px',
                        //   height : 0 + 'px'
                        //});
                        //console.log('defaultPos.top', defaultPos.top);

                        //toBeMoved.style.left = defaultPos.left + "px";
                        Bu.css(toBeMoved, {left : defaultPos.left + "px"});

                        //console.log('toBeMoved.style.top', toBeMoved.style.top);
                        //toBeMoved.style.top = ;

                        Bd.closeWin(myShadow);

                        if (myShadowIsOpen)
                        {
                           myShadowIsOpen = false;
                        }

                        docked = true;

                     }
                     else
                     {
                        toBeMoved.style.left = originalLeft + event.clientX - mouseDownX + "px";
                        if (myShadowIsOpen)
                        {
                           //Bd.closeWin(myShadow);
                           myShadowIsOpen = false;
                        }
                     }
                  }
                  else
                  {
                     toBeMoved.style.left = originalLeft + event.clientX - mouseDownX + "px";
                  }

                  if (event.clientY < 3)
                  {
                     toBeMoved.style.top = 0 + "px";
                  }
                  else if (event.clientY >= 3 && !docked)
                  {
                     toBeMoved.style.top = originalTop + event.clientY - mouseDownY + "px";
                  }
                  //event.stopPropagation();
               }

               function dropMe(event)
               {
                  //Bu.css(myShadow, {
                  //   //width           : 0 + 'px',
                  //   //height          : 0 + 'px'
                  //});
                  Bd.css(el, { cursor : 'default' });

                  toolTipProps.leftOffset = gsv('left', toBeMoved);
                  toolTipProps.topOffset = gsv('top', toBeMoved);

                  var leftPos = Bu.getStyleValue('left', toBeMoved);

                  if (leftPos <= 0)
                  {
                     //toBeMoved.style.left = ;
                     Bu.css(toBeMoved, { left : 0 + 'px' });
                     docked = true;

                     if(options.keepState === true && options.keepPosition === true)
                     {
                        localStorage.setItem('toolBoxDockState', 'true');
                     }
                  }
                  else if (((leftPos < tolerance + 5) && !docked) || myShadowIsOpen)
                  {
                     Bu.css(toBeMoved, { left : 0 + 'px' });
                     myShadowIsOpen = false;

                     docked = true;

                     if(options.keepState === true && options.keepPosition === true)
                     {
                        localStorage.setItem('toolBoxDockState', 'true');
                     }
                  }

                  //console.log(dragOptions.floatingHeight);
                  if (!docked) //fixme imhere
                  {
                     if (dragOptions.floatingWidth)
                     {
                        Bu.css(toBeMoved, { width : dragOptions.floatingWidth + 10 + 'px' });
                     }
                     /*else
                      {
                      Bu.css(toBeMoved, { width : toBeMovedWidth + 'px' });
                      }*/

                     if (dragOptions.floatingHeight)
                     {
                        Bu.css(toBeMoved, { height : dragOptions.floatingHeight + 7 + 'px' });
                        //Bu.css(toBeMoved, { height : dragOptions.floatingHeight || toBeMovedHeight + 'px' });
                     }
                     /*else
                      {
                      Bu.css(toBeMoved, { height : toBeMovedHeight + 'px' });

                      }*/

                     //docked = true;

                     if(options.keepState === true && options.keepPosition === true)
                     {
                        localStorage.setItem('toolBoxDockState', 'false');
                     }
                  }
                  else
                  {
                     Bu.css(toBeMoved, { width : toBeMovedWidth + 'px' });
                     Bu.css(toBeMoved, { height : toBeMovedHeight + 'px' });
                     Bd.css(toBeMoved, { top : defaultPos.top + "px" });
                  }

                  if(options.keepState === true && options.keepPosition === true && options.unDockable === true)
                  {
                     var x = Bd.getLeft(toBeMoved).toString();
                     var y = Bd.getTop(toBeMoved).toString();
                     localStorage.setItem('toolBoxXY', x + ',' + y )
                  }

                  //dBe.unbind(document, "mousemove", dragMe);
                  document.removeEventListener("mousemove", dragMe, false);
                  document.removeEventListener("mouseup", dropMe, false);

               }
            }
         };

         //dBe.bind(el, "mousedown", move);
         el.addEventListener("mousedown", move, false);
      };

      toolBox = Bd.getEl('#toolBox');
      var grip = toolBox.children[0];

      Bd.css(toolBox, {
         width  : toolBox.offsetWidth,
         height : toolBox.offsetHeight,
         border : '1px solid var(--dividerColor)'
      });

      //console.log(toolBox.children[1].offsetHeight);

      var drg = new Dockable(grip, {
         prevDef        : false,
         moveParent     : true,
         tolerance      : 30,
         floatingHeight : toolBox.children[0].offsetHeight + toolBox.children[1].offsetHeight
      });
   }

   if (options.keepState === true)
   {
      //console.log(options.unDockable === true);
      if(options.unDockable === true && options.keepPosition === true)
      {

         var lastXY = localStorage.getItem('toolBoxXY').split(',');
         var lastDockState = localStorage.getItem('toolBoxDockState');

         //console.log('lastDockState', Bu.defined(lastDockState) && lastDockState === 'true');

         if(Bu.defined(lastDockState) && lastDockState === 'false')
         {
            resetToolBoxSize(toolBox, {floatingHeight : toolBox.children[0].offsetHeight + toolBox.children[1].offsetHeight});
         }

         if(Bu.defined(lastXY))
         {
            Bu.css(toolBox, {left : lastXY[0] + 'px', top : lastXY[1] + 'px'});

            //docked = false; fixme imhere

            //localStorage.setItem('toolBoxDockState', 'false');
         }


      }

      Bu.forEach(toolBoxItems, function (node, i)
      {
         var lastActive      = localStorage.getItem('toolBoxItem' + i),
             toolBoxItem     = toolBoxItems[i].children[0],
             flyOutMenuItems = toolBoxItems[i].children[1] !== undefined &&
                               toolBoxItems[i].children[1].children !== undefined ?
                               Bu.nodeListToArray(toolBoxItems[i].children[1].children) : null;

         //console.log(i,"i");
         //console.log(node,"node");
         //console.log(flyOutMenuItems,"toolBoxItems[" + i + "].children");
         //console.log(lastActive,"lastActive");
         //console.log(flyOutMenuItems[lastActive],"flyOutMenuItems[lastActive]");

         if (Bu.defined(flyOutMenuItems) && Bu.defined(lastActive) && Bu.defined(flyOutMenuItems[lastActive]))
         {
            var myClicker = flyOutMenuItems[lastActive];

            //issue #04
            //myClicker.click() does not work because the
            //click event is wired to the flyOutItem after the first click
            //Idk why
            //myClicker.click();
            //myClicker.click();
            //
            //we are using this work around instead
            swapIcons(myClicker, flyOutMenuItems, toolBoxItem);
         }

      });
   }
})(Bee.Utils, Bee.String, Bee.Widget);

/*
 * TODO ADD support for adjusting surrounding els
 * provide vars to get surrounding els
 * and Objects to store the state of the surrounding els when toolBox is floating
 * and when it's docked
 * */