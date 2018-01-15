/**
 * @Author Created by Arch on 11/12/16.
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
 *
 *    @fileOverview This file helps to manage a navigation bar as a menu bar aka file menu
 *    @requires {@link Barge.utils, @link Barge.Array, @link Barge.Dom (DOM_CORE)}
 *
 *    @version 3.15
 */
/**
 *
 */
(function (Bu, Ba, Bd)
{
   Barge.Dom = Barge.Dom || {};

   Barge.Dom.MenuBar = function (options)
   {
      /**
       *
       * @type {Object}
       */
      this.options = {
         menuItemsClassName : "menuItem",
         submenuDirection   : 'right',
         recurse            : false,
         menuItems : null
      };

      if (options)
      {
         this.options = Bu.extend(this.options, options);
      }

      /**
       *
       * @type {Barge.Event.EventManager}
       */
      this.Be = new Barge.Event.EventManager();

      //this.list = document.getElementsByClassName(this.options.menuItemsClassName);
      /**
       * an array of main menu bar Items (fields)
       * @type {Object|Array}
       */
      this.menuItems = Bu.nodeListToArray(document.getElementsByClassName(this.options.menuItemsClassName));

      this.allItems = [];
      this.itemsWithSubMenu = [];

      /**
       * caching the menu bar I's fields len to avoid re-querying for loops
       * @type {Number}
       */
      this.len = this.menuItems.length;

      this.i = 0;
      /**
       * global reference for subMenuItems
       * @type {null | Element}
       * @protected
       */
      this.gsubMenuItems = null;

      /**
       * public reference for subMenuItems
       * @type {null | Element}
       * @protected
       */
      this.gSubSubMenuItems = null;
      /**
       * flag for whether a Sub Menu Is Open
       * @type {boolean}
       * @protected
       */
      this.aSubMenuIsOpen = false;

      /**
       * global reference for the currently open SubMenu aka activeRow
       * @type {null | Element}
       */
      this.openSubMenu = null;

      /**
       * global reference for the currently open SubMenu of a submenu item aka activeSubRow
       * @type {null | Element}
       * @protected
       */
      this.openSubSubMenu = null;

      this.openSubMenus = [];
      // openSubSubSubMenu = null,

      /**
       * flag for whether a Sub Menu Is Open
       * @type {boolean}
       */
      this.aSubMenuChildMenuIsOpen = false;
      this.aSubMenuGrandChildMenuIsOpen = false;

      /**
       * @type {null | Object <<{x:}><Number> <{y:}><Number>>}
       */
      this.upperLeft = null;
      /**
       * @type {null | Object <<{x:}><Number> <{y:}><Number>>}
       */
      this.upperRight = null;
      /**
       * @type {null | Object <<{x:}><Number><{y:}><Number>>}
       */
      this.lowerLeft = null;
      /**
       * @type {null | Object <<{x:}><Number><{y:}><Number>>}
       */
      this.lowerRight = null;

      /**
       * global reference for the currently open SubMenu aka activeRow
       * @type {null | Element}
       */
      this.activeRow = Bu.defined(this.openSubMenu) ? this.openSubMenu : null;
      /**
       *
       * @type {Array}
       */
      this.mouseLocs = [];
      this.loc = this.mouseLocs[this.mouseLocs.length - 1];
      this.prevLoc = this.mouseLocs[0];
      /**
       * tracking the mouse locations
       * @type {number}
       */
      this.MOUSE_LOCS_TRACKED = 3;  // number of past mouse locations to track

      /**
       * workAround for issue #58
       * @type {boolean}
       */
      this.menuBarActivated = false;

      /**
       * checks if a submenu is open
       * @type {boolean}
       */
      this.aSubMenuIsOpen = this.menuItems.some(this._hasSubMenuOpen);
   };

   Barge.Dom.MenuBar.prototype._openWin = function (windowEl)
   {
      if (this._getDisplayState(windowEl) === 0)
      {
         Bu.setDisplayState(windowEl, "block");
      }
   };

   /**
    * @use Keep track of the last few locations of the mouse.
    * @param e {Event}
    */
   var mouseMoveSubMenu = function (e)
   {
      mouseLocs.push({ x : e.pageX, y : e.pageY });

      if (mouseLocs.length > MOUSE_LOCS_TRACKED)
      {
         mouseLocs.shift();
      }
   };

   /**
    * @use for calculating the slope b/n the curr mouse x|y and the conners of an obj
    * @param a {Object}
    * @param b {Object}
    * @return {number}
    * @private
    */
   Barge.Dom.MenuBar.prototype._getSlope = function (a, b)
   {

      var dY = (b.y ? b.y : b.top ? b.top : 0) - (a.y ? a.y : a.top ? a.top : 0),
          dX = (b.x ? b.x : b.right ? b.right : 0) - (a.x ? a.x : a.right ? a.right : 0);

      return dY / dX;
   };

   /**
    *
    * @param item
    * @return {boolean}
    * @private
    */
   Barge.Dom.MenuBar.prototype._disabled = function (item)
   {
      return item.classList.contains('disabled');
   };

   /**
    *
    * @param item
    * @return {boolean}
    * @private
    */
   Barge.Dom.MenuBar.prototype._noHover = function (item)
   {
      return item.classList.contains('noHov');
   };

   /**
    * returns the display state of an el 1 if  visible else 0
    * @param el
    * @return {number}
    * @private
    */
   Barge.Dom.MenuBar.prototype._getDisplayState = function (el)
   {
      if (el.style.display === "none" || el.style.display === "")
      {
         return 0;
      }
      return 1
   };

   /**
    *
    * @param menuItem
    * @return {*|HTMLElement|boolean}
    * @private
    */
   Barge.Dom.MenuBar.prototype._hasSubMenuOpen = function (menuItem)
   {
      var subMenu    = menuItem.children[1],
          HasSubMenu = subMenu && subMenu.tagName === "UL";

      return HasSubMenu && subMenu.style.display === "block";
   };

   /**
    * @use close any sub menus of a menu item passed to it
    * @param menuItems {HTMLCollection | Array}
    * @param rootChild {Boolean}
    * @param innerRoot{Boolean}
    * @private
    */
   Barge.Dom.MenuBar.prototype._closeAllSubMenus = function (menuItems, rootChild, innerRoot)
   {
      var self = this;
      if (menuItems)
      {
         for (var i = 0, len = menuItems.length; i < len; i++)
         {
            var subMenu    = menuItems[i].children[1],
                hasSubMenu = menuItems[i].children[1] && subMenu.tagName === "UL";

            if (subMenu && self._getDisplayState(subMenu) === 1)
            {
               if (hasSubMenu)
               {
                  Bu.closeWin(subMenu);
               }

               if (rootChild)
               {
                  // .style.backgroundColor = "";
                  Bu.css(menuItems[i].children[0], { backgroundColor : "" })

               }
            }

            if (innerRoot)
            {
               Bu.css(menuItems[i], { backgroundColor : "" })
            }
         }
      }
   };

   Barge.Dom.MenuBar.prototype._closeOpenSubMenus = function (menuItem)
   {
      var self = this;
      if (Bu.defined(self.openSubMenu))
      {
         Bu.css(self.openSubMenu, { 'display' : 'none' });
         Bu.css(menuItem.children[0], { backgroundColor : "" });
      }

      if (Bu.defined(self.openSubSubMenu))
      {
         Bu.css(self.openSubSubMenu, { 'display' : 'none' });
      }
   };

   // Detect if the user is moving towards the currently activated
   // submenu.
   //
   // If the mouse is heading relatively clearly towards
   // the submenu's content, we should wait and give the user more
   // time before activating a new row. If the mouse is heading
   // elsewhere, we can immediately activate a new row.
   //
   // We detect this by calculating the slope formed between the
   // current mouse location and the upper/lower right points of
   // the menu. We do the same for the previous mouse location.
   // If the current mouse location's slopes are
   // increasing/decreasing appropriately compared to the
   // previous's, we know the user is moving toward the submenu.
   //
   // Note that since the y-axis increases as the cursor moves
   // down the screen, we are looking for the slope between the
   // cursor and the upper right corner to decrease over time, not
   // increase (somewhat counter-intuitively).
   Barge.Dom.MenuBar.prototype.addClickEvent = function ()
   {
      var self = this;

      this.Be.bindOnAll(self.menuItems, "click", function (e)
      {

         var subMenu    = this.children[1],
             menuItem   = this.children[0],
             hasSubMenu = this.children[1] && subMenu.tagName === "UL",
             target     = e.target;

         if (hasSubMenu)
         {
            if (self._getDisplayState(subMenu) === 1)
            {
               Bu.closeWin(subMenu);

               Bu.css(menuItem, { backgroundColor : "" });

               self.aSubMenuIsOpen = false;
               self._closeAllSubMenus(self.allItems, false, true);
               self.aSubMenuChildMenuIsOpen = false;
            }
            else
            {
               //console.log(hasSubMenu);
               //console.log(subMenu);
               //this is counter-intuitive
               // console.log('aSubMenuIsOpen', aSubMenuIsOpen);
               /*issue #58 workaround*/
               if (self.menuBarActivated === false)
               {
                  self._closeAllSubMenus(self.menuItems, true);
                  // console.log('menuA here');
               }
               /*issue #58
                * Menu gets activate but does not display
                * P.S Don't know why*/
               if (self.aSubMenuIsOpen === true)
               {
                  self._closeAllSubMenus(self.menuItems, true);

                  // console.log('closeA here');
               }

               //activate the menu bar once

               if (self.menuBarActivated === false)
               {
                  //console.log(self.menuBarActivated);
                  self.menuBarActivated = true;
                  // console.log('menuATrue here');
                  //console.log(self.menuBarActivated);

               }

               if (self._noHover(this) === false)
               {
                  Bu.css(menuItem, { backgroundColor : "var(--menuItemHoverColor)" });
               }

               self._openWin(subMenu);
               Bu.css(subMenu, { 'display' : 'block' });
               self.openSubMenu = subMenu;

               //console.log('here');
               // Bu.setObjectPositionAt(subMenu,this,'bottomLeft', false, false);
               // console.log(Bu.containedInWindow(subMenu));
               // console.log(subMenu);
               // Bu.fitIntoWindow(subMenu);
               self.aSubMenuIsOpen = true;
            }
         }
         else
         {
            if (!self._noHover(this))
            {
               Bu.css(menuItem, { backgroundColor : "var(--menuItemHoverColor)" });
            }
            self.aSubMenuIsOpen = true;
         }

         if (target.nextElementSibling !== subMenu || target.parentNode !== this)
         {
            Bu.closeWin(subMenu);
            Bu.css(menuItem, { backgroundColor : "" });
            self.aSubMenuIsOpen = false;
         }

      });
   };

   /**
    * Recursively gather all menu items into an array
    * @param items
    * @private
    */
   Barge.Dom.MenuBar.prototype._collectAllMenuItems = function (items)
   {
      const self = this;
      Ba.forEach(items, function (node, i)
      {
         /**
          *
          * @type {Element}
          */
         var subMenu    = node.children[1];

         if (subMenu && subMenu.tagName === "UL")
         {
            if (self.menuItems.indexOf(node) < 0 && !node.classList.contains("hDivider"))
            {
               self.allItems.push(node);
            }
            self._collectAllMenuItems(subMenu.children);
         }
         else if (!node.classList.contains("hDivider") && self.menuItems.indexOf(node) < 0)
         {
            self.allItems.push(node);
         }
      });
   };

   Barge.Dom.MenuBar.prototype.getAllMenuItems = function ()
   {
      return this.allItems;
   };

   Barge.Dom.MenuBar.prototype.addMouseOverEvent = function ()
   {
      var self = this;


      var subMenu  = null, //submenu
          menuItem = null; //submenu row

      /*this.Be.bindOnAll(self.menuItems,"mouseover", function (e)
       {
       //check if a submenu is open and the item does not contain a drop down
       if (self.aSubMenuIsOpen === true && !this.classList.contains("dropDown"))
       {
       /!**
       *
       * @type {Element}
       *!/
       var subMenu            = this.children[1], //submenu
       /!**
       *
       * @type {Element}
       *!/
       menuItem           = this.children[0], //submenu row
       /!**
       *
       * @type {Boolean}
       *!/
       menuItemHasSubMenu = this.children[1] && subMenu.tagName === "UL";

       if (menuItemHasSubMenu)
       {
       //region b4 innerLoop
       self._closeAllSubMenus(self.menuItems, true);
       //Bu.css(self.openSubMenu, {'display' : 'none'});//fixme

       //open the sub menu
       self._openWin(subMenu);

       self.aSubMenuIsOpen = true;

       /!**
       * set the activeRow and openSubMenu to subMenu
       * @type {Element}
       *!/
       self.openSubMenu = subMenu;

       /!**
       *
       * @type {HTMLElement[]}
       *!/
       var subMenuItems = subMenu.children;

       /!**
       * set the global sub Menu Items to subMenuItems;
       * @type {HTMLElement[]}
       *!/
       self.gsubMenuItems = subMenuItems;

       //endregion

       /!**
       *Implementing Bruce Tognazzini's algorithm (NOT IN USE atm)
       subMenu.addEventListener("mousemove", function (e)
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

       });*!/

       //issue #73 poor event mapping technique
       //event listener is addded to sub menu I's anytime there is a mouse over
       //region start of inner Loop
       for (var j = 0, innerLen = subMenuItems.length; j < innerLen; j++)
       {
       subMenuItems[j].addEventListener("mouseover", function ()
       {
       /!**
       *
       * @type {Element}
       *!/
       var subMenuItemSubMenu    = this.children[1],
       /!**
       *
       * @type {Element}
       *!/
       subMenuItem           = this.children[0],
       /!**
       *
       * @type {Boolean}
       *!/
       subMenuItemHasSubMenu = this.children[1] && subMenu.tagName === "UL";

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

       if (subMenuItemHasSubMenu)
       {
       self._closeAllSubMenus(subMenuItems, false, true);
       self.openSubSubMenu = subMenuItemSubMenu;

       if (!self._disabled(subMenuItemSubMenu.parentElement))
       {  // subMenuItemSubMenu.style.display = "block";
       Bu.css(subMenuItemSubMenu, { display : "block" });
       Bu.css(this, { backgroundColor : "var(--menuItemHoverColor)" });

       self.aSubMenuChildMenuIsOpen = true;

       }

       /!*region 2n inner deep loop msg u may disable dis and use css for speed sake*!/
       /!**
       *
       * @type {HTMLElement[]}
       *!/
       var subSubMenuItems = subMenuItemSubMenu.children;

       /!**
       * set the global sub sub Menu Items to subMenuItems;
       * @type {HTMLElement[]}
       *!/
       self.gSubSubMenuItems = subSubMenuItems;

       for (var k = 0, innerMostLen = subSubMenuItems.length; k < innerMostLen; k++)
       {
       subSubMenuItems[k].addEventListener("mouseover", function ()
       {
       var subSubMenu               = this.children[1],
       subSubmenuItem           = this.children[0],
       subSubmenuItemHasSubMenu = this.children[1] && subMenu.tagName === "UL";

       if (subSubmenuItemHasSubMenu)
       {
       self._closeAllSubMenus(subSubMenuItems, false);//imhere i'm lost
       if (!self._disabled(subSubMenu.parentElement))
       {
       subSubMenu.style.display = "block";
       self.aSubMenuGrandChildMenuIsOpen = true; // subSubmenuItem.style.backgroundColor = "";
       }
       }
       else
       {
       self._closeAllSubMenus(subSubMenuItems, false);
       self.aSubMenuGrandChildMenuIsOpen = false;
       }
       });
       }
       /!*endregion*!/
       }
       else
       {
       self._closeAllSubMenus(subMenuItems, false, true);
       Bu.css(this, { backgroundColor : "var(--menuItemHoverColor)" });

       self.aSubMenuChildMenuIsOpen = false;
       }
       });

       subMenuItems[j].addEventListener("mouseout", function ()
       {
       if (self.aSubMenuChildMenuIsOpen)
       {
       if (self.openSubSubMenu && self.openSubSubMenu.parentElement != this)
       {
       Bu.css(this, { backgroundColor : "" });
       }
       }
       else
       {
       Bu.css(this, { backgroundColor : "" });
       }
       });
       }
       //endregion
       /!*var deepSubMenu = subMenu.children[1],
       SubMenuItem = subMenu.children[0],
       deepSubMenuHasSubMenu = subMenu.children[1] && subMenu.tagName === "UL";
       if(deepSubMenuHasSubMenu)
       {
       /!*console.log("deepMenu");
       *!/
       }*!/
       }
       else
       {
       self._closeAllSubMenus(self.menuItems, true);
       }

       if (!self._noHover(this))
       {
       // menuItem.style.backgroundColor = "var(--menuItemHoverColor)";
       Bu.css(menuItem, { backgroundColor : "var(--menuItemHoverColor)" })
       }
       }
       self._closeAllSubMenus(self.gsubMenuItems, false, true);
       self._closeAllSubMenus(self.gSubSubMenuItems, false);
       }, true);*/

      /**
       * workaround
       * issue #74 the event handler (fn) mapped onto the root els for
       * turning off all open submenus from the root menu items affects the sub els as well, DKW
       */
      Ba.forEach(this.menuItems, function (node, i)
      {
         node.addEventListener("mouseover", function (e)
         {
            if (self.aSubMenuIsOpen === true && !this.classList.contains("dropDown"))
            {
               if (this === e.target.parentElement)
               {
                  let i = 0, len = self.allItems.length;
                  for (; i < len; i++)
                  {
                     let subMenu = self.allItems[i].children[1];

                     if (subMenu && self._getDisplayState(subMenu) === 1)
                     {
                        if (subMenu && subMenu.tagName === "UL")
                        { Bu.closeWin(subMenu); }
                     }
                     Bu.css(self.allItems[i], { backgroundColor : "" })
                  }
               }
            }
         });
      });

      this.Be.bindOnAll(this.menuItems, "mouseover", function (e)
      {
         //e.preventDefault();
         //e.stopPropagation();
         //console.log(e.preventDefault);

         //console.log(this);
         if (self.aSubMenuIsOpen === true && !this.classList.contains("dropDown"))
         {
            subMenu = this.children[1]; //submenu

            menuItem = this.children[0]; //submenu row

            if (subMenu && subMenu.tagName === "UL")//check if item has a subMenu
            {
               Bd.css(self.openSubMenu.parentElement.children[0], { backgroundColor : "" });
               Bd.closeWin(self.openSubMenu);
               self.aSubMenuIsOpen = false;

               //console.log(e.target, 'tg');
               if (!e.target === this)
               {
                  //console.log(this);

               }

               //open the sub menu
               self._openWin(subMenu);

               self.aSubMenuIsOpen = true;

               /**
                * set the activeRow and openSubMenu to subMenu
                * @type {Element}
                */
               self.openSubMenu = subMenu;

               /**
                *
                * @type {HTMLElement[]}
                */
               subMenuItems = subMenu.children;

               /**
                * set the global sub Menu Items to subMenuItems;
                * @type {HTMLElement[]}
                */
               self.gsubMenuItems = subMenuItems;
            }
            else
            {
               Bd.css(self.openSubMenu.parentElement.children[0], { backgroundColor : "" });
               Bd.closeWin(self.openSubMenu);
            }

            if (!self._noHover(this))
            {
               Bu.css(menuItem, { backgroundColor : "var(--menuItemHoverColor)" })
            }
         }
      }, true);

      this.Be.bindOnAll(this.allItems, "mouseover", function (e)
      {
         let subMenu = this.children[1]; //submenu

         if (this.children[1] && subMenu.tagName === "UL")
         {
            if (Bu.defined(self.openSubSubMenu))
            {
               Bd.css(self.openSubSubMenu.parentElement, { backgroundColor : "" });
               Bd.closeWin(self.openSubSubMenu);
            }

            //open the sub menu
            self._openWin(subMenu);

            self.aSubMenuChildMenuIsOpen = true;

            /**
             * set the activeRow and openSubMenu to subMenu
             * @type {Element}
             */
            self.openSubSubMenu = subMenu;

            /**
             *
             * @type {HTMLElement[]}
             */
            //subMenuItems = subMenu.children;
            /**
             * set the global sub Menu Items to subMenuItems;
             * @type {HTMLElement[]}
             */
            //self.gSubSubMenuItems = subMenuItems;
         }
         else
         {

            if (self.aSubMenuChildMenuIsOpen === true)
            {
               Bd.css(self.openSubSubMenu.parentElement, { backgroundColor : "" });
               Bd.closeWin(self.openSubSubMenu);
               self.aSubMenuChildMenuIsOpen = false;
            }
         }

         Bu.css(this, { backgroundColor : "var(--menuItemHoverColor)" });
      });
   };

   Barge.Dom.MenuBar.prototype.addMouseOutEvent = function ()
   {
      var self = this;
      this.Be.bindOnAll(self.menuItems, "mouseout", function ()
      {
         if (self.aSubMenuIsOpen === true)
         {
            //console.log('self.aSubMenuIsOpen', self.aSubMenuIsOpen);
            //console.log('self.openSubMenu.parentElement', self.openSubMenu.parentElement);
            //console.log('this', this);
            //console.log('self.openSubMenu.parentElement', self.openSubMenu.parentElement);
            //console.log('Bu.defined(self.openSubMenu)', Bu.defined(self.openSubMenu));
            //console.log('Bu.defined(self.openSubMenu) && self.openSubMenu.parentElement != this',
            //            Bu.defined(self.openSubMenu) && self.openSubMenu.parentElement !== this);
            //console.log(this.children[0]);
            //console.log(self.openSubMenu.parentElement);
            if (Bu.defined(self.openSubMenu) && self.openSubMenu.parentElement !== this)
            {
               // this.children[0].style.backgroundColor = "";
               Bu.css(this.children[0], { backgroundColor : "" });
            }
         }
      });

      this.Be.bindOnAll(this.allItems, "mouseout", function (e)
      {
         const self = this;

         if (this.children[1] && this.children[1].tagName === "UL")
         {
            if (self.aSubMenuChildMenuIsOpen === true)
            {
               if (Bu.defined(self.openSubSubMenu) && self.openSubSubMenu.parentElement !== this)
               {
                  Bu.css(e.target, { backgroundColor : "" });
               }
            }
         }
         else
         {
            Bd.css(this, { backgroundColor : "" });
         }

      }, false);
   };

   Barge.Dom.MenuBar.prototype.addCloseOutEvent = function ()
   {
      var self = this;

      window.addEventListener("click", function (e)
      {
         /**
          *
          * @type {boolean}
          */
         var isWin = e.target.tagName.toLocaleLowerCase() === 'body' ||
                     e.target.tagName.toLocaleLowerCase() === 'html';

         /**
          * this is where we close err open item
          * @private
          */
         function _closeEveryOpenItem()
         {
            self._closeAllSubMenus(self.menuItems, true);
            self._closeAllSubMenus(self.allItems, false, true);
            self.aSubMenuIsOpen = false;
         }

         if (self.aSubMenuIsOpen)
         {
            /**
             * issue #59
             * If the target tag Name is html || body, an err occurs
             */
            if ((e.target.parentNode.classList && !e.target.parentNode.classList.contains("menuItem")))
            {
               _closeEveryOpenItem();
            }
            else if (isWin)//issue #59 workaround
            {
               _closeEveryOpenItem();  // console.log(e.target.tagName.toLocaleLowerCase());
            }
         }
      });
   };

   Barge.Dom.MenuBar.prototype.create = function ()
   {
      let self = this;
      this._collectAllMenuItems(self.menuItems);

      this.addClickEvent();

      this.addMouseOverEvent();

      this.addMouseOutEvent();

      this.addCloseOutEvent();
   };

   return MenuBar = Barge.Dom.MenuBar;

})(Barge.utils, Barge.Array, Barge.Dom);

var menubar = new Barge.Dom.MenuBar();
menubar.create();

/*

 TODO : Make the {@link Barge.Dom.MenuBar} Constructor accept a config object that specifies a list menu items and sub-menu items
 TODO : Use MVC so the menubar DOM will be a visual rep'tn of the menubar data
 TODO : Add support for removing and adding menu item
 TODO :


 TODO : issue #0053 Make active menu list item maintain hover bg color when you mouseout on all menus DONE
 TODO : issue #0054 Make sub menu of menu stick around after activation and DONE -> up to two depp menu levels
 TODO : issue #0055 Make sure submenu has space on right to show else anchor right to left [DONE ->but not dynamic]
 TODO : issue #0056 Add support for check menu Item DONE
 TODO : issue #0057 Add support for dotted, activation type menu items DONE
 TODO : issue #0060 fix fo issue #54 only allows sub menu to stick around if we move mouse almost perfectly horizontally
 to the submenu
 TODO : Make it possible to move in a virtual triangular region wherein the submenu will not leave
 TODO : Add support for multiple horizontally-arrayed button menu (max three btns)

 TODO make it possible for only one className or ID
 to be used determine what shd be managed as a neu bar
 then recursively loop over the descendant li's and assign
 them the class menuItem or a custom className for items iDfication like treeview.js
 */


