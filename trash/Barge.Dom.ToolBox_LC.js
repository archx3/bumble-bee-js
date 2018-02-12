/**
 * @Author Created by Arch on 22/01/17.
 * @Copyright (C) 2017
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
 *    @fileOverview contains instruction[code] for creating a flyout toolbox
 *    A highly customised version of the menubar widget
 */

var Bee = Bee || {};
(function (Bu, Bs, Bo, Bd)
{

   //region protected globals
   Bee.Widget = Bee.Widget || {};

   /**
    *
    * @type {Barge.Utils.getStyleValue}
    * @protected
    */
   const gsv = Bu.getStyleValue;

   /**
    *
    * @type {number}
    * @protected
    */
   let flyOutRight = 0;

   /**
    * the root element
    * @const
    * @type {CSSStyleDeclaration}
    * @protected
    */
   const rootStyle = document.documentElement.style;
   //endregion

   /**
    *
    * @param options {{toolBoxID: string, toolBoxListNodeID: string, toolBoxItemsClassName: string,
      flyOutDirection: string, recurse: boolean, switchOnHover: boolean, keepState: boolean,
      keepPosition: boolean, trackMouseMove: boolean, useNativeShortcut: boolean,
      unDockable: boolean, floatingWidth: null, floatingHeight: null,elOnRight : String,
         elOnLeft : null, elOnTop : null, elOnBottom : null,}}
    *
    * @param dragOptions {{prevDef: boolean, moveParent: boolean, tolerance: number, floatingHeight: null, ShowOnLeft : Boolean}}
    * @constructor
    */
   Bee.Widget.Toolbox = function (options, dragOptions)
   {
      //ensure window exists else don't create
      Bu.assert(Bu.defined(window) && Bu.defined(document),
         'Barge.Widget.Toolbox a window object as host');

      //ensure that at least options.toolBoxID or options.toolBoxListNodeID or options.toolBoxItemsClassName
      // exists else don't create
      Bu.assert(Bu.defined(options.toolBoxID) || Bu.defined(options.toolBoxListNodeID) ||
                Bu.defined(options.toolBoxItemsClassName),
         'Barge.Widget.Toolbox expects non-null params: toolBoxNodeID,' +
         ' toolBoxListNodeID, toolBoxItemsClassName');

      //defaults
      this.options = {
         //the id of the toolbox Node, usually a div
         toolBoxID : 'toolBox',

         // the id of the toolbox List, ul or ol
         toolBoxListNodeID : 'toolBoxList',//imhere

         //className
         toolBoxItemsClassName : 'toolBoxItem',

         //relatives
         elOnRight  : null, //mk these objs to avoid hard-coding
         elOnLeft   : null,
         elOnTop    : null,
         elOnBottom : null,

         //ignoredItemsClassName : 'ignoredToolBoxItem', //fixme
         ShowOnLeft         : true,
         varyFlyOutPosition : false,

         expandable : true,

         recurse          : false,
         switchOnHover    : true,
         keepState        : true,

         /**
          * disabling icon swapping to stabilise behaviour b4 shipping
          * issue #66
          * icon swapping must be implemented to avoid event listener removal
          */
         swapToolBoxIcons : false,

         //currently giving problems
         keepPosition   : true,
         trackMouseMove : false,

         /*uses the title attr as shortcut handle*/
         useNativeShortcut : false,
         unDockable        : true,
         floatingWidth     : null,
         floatingHeight    : null
      };

      this.dragOptions = {
         prevDef        : false,
         moveParent     : true,
         tolerance      : 30,
         floatingHeight : null
      };

      if (options)
      {
         this.options = Bu.extend(this.options, options);
      }

      if (dragOptions)
      {
         this.dragOptions = Bu.extend(this.dragOptions, dragOptions);
      }

      this.toolBox = Bd.getEl("#" + this.options.toolBoxID);

      this.list = Bd.getEl("#" + this.options.toolBoxListNodeID);

      /**
       * an array of main tool box Items (fields)
       * @type {Object|Array}
       * @private
       */
      this.toolBoxItems = null;

      /**
       * @private
       * @type {null}
       */
      this.thumbGrip = null;

      this.expandBtn = null;

      /**
       * @private
       * @type {null}
       */
      this.toolTip = null;

      /**
       *
       * @type {{left: null, leftOffset: number, topOffset: number}}
       */
      this.toolTipProps = {
         leftOffset : 0,
         topOffset  : 0
      };

      /**
       * caching the tool box I's fields len to avoid re-querying for loops
       * @type {Number} NIU
       */
      //this.len = this.toolBoxItems.length;
      /**
       *
       * @type {number}
       */
      this.i = 0;

      this.len = 0;

      /**
       * flag for whether a Sub Menu Is Open
       * @type {boolean}
       * @private
       */
      this.aFlyOutIsOpen = false;

      //going public
      window.toolBoxFlyOutIsOpen = this.aFlyOutIsOpen;

      /**
       * workAround for issue #58 in (menu bar)
       * @type {boolean}
       */
      this.toolBoxActivated = false;

      this.toolTipIsShowing = false;

      /**
       * global reference for the currently open FlyOut aka activeRow
       * @type {null | Element}
       */
      this.openFlyOut = null;

      this.docked = true;

      this.toBeMovedWidth = null;
      this.toBeMovedHeight = null;

      //this.gFlyOutMenuItems = [];
      /**
       *
       * @type {Barge.Event.EventManager}
       */
      this.Be = new Bee.Event.EventManager();

      /**
       * checks if a flyOut is open
       * @type {boolean}
       */
      this.aFlyOutIsOpen = false;

      this.dynamicStyleSheet = null;
      this.expansionStyleSheet = null;
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.addDynamicStyleSheet = function ()
   {
      this.dynamicStyleSheet = Bu.createEl('style', { id : 'toolboxDStyle' });
      this.expansionStyleSheet = Bu.createEl('style', { id : 'toolboxDxStyle' });

      //document.head.appendChild(this.dynamicStyleSheet);
      //document.head.appendChild(this.expansionStyleSheet);
      Bd.appendToHead([this.dynamicStyleSheet, this.expansionStyleSheet]);
   };

   /**
    *
    * @param li
    * @param flyOutMenuItems
    * @param toolBoxItem
    */
   Bee.Widget.Toolbox.prototype.swapIcons = function (li, flyOutMenuItems, toolBoxItem)
   {
      let iconItem = li.children[0].children[0];
      let iconDugOut = li.parentElement.previousElementSibling.children[0];
      let shortCutItem = li.children[0].getElementsByClassName('shortCut')[0];

      //console.log(li, "li");
      //console.log(toolBoxItem, "toolBoxItem");
      //console.log(flyOutMenuItems, "lyOutMenuItems");
      //
      //console.log("----------------------");
      //
      //console.log(iconItem, "iconItem");
      //console.log(iconDugOut, "iconDugOut");
      //console.log(shortCutItem, "shortCutItem");
      //console.log("********************************************************");

      //console.log('shortCutItem', shortCutItem, shortCutItem.innerHTML);

      let shortCut = '';

      if (this.options.useNativeShortcut === false)
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

      if (this.options.keepState)
      {

         let myIndex = this.toolBoxItems.indexOf(li.parentElement.parentElement);
         let myFlyOutItemIndex = flyOutMenuItems.indexOf(li);

         //console.log(li.parentElement.parentElement);
         //console.log('toolBoxItem' + myIndex, myFlyOutItemIndex);

         localStorage.setItem('toolBoxItem' + myIndex, myFlyOutItemIndex);

      }

      let iconHasKids = Bd.hasChildren(li.children[0].children[0]);

      Bd.removeEl(iconDugOut);
      iconDugOut = li.parentElement.previousElementSibling;

      let duplicateEl = Bu.createEl("span");

      Bu.extend(duplicateEl, { className : iconItem.className });

      if (!iconHasKids)
      {
         Bu.extend(duplicateEl, { innerHTML : iconItem.innerHTML });
      }

      Bd.css(duplicateEl, iconItem.style);

      if (iconHasKids)
      {

         let duplicateKidEl = Bu.createEl(iconItem.children[0].tagName.toLocaleLowerCase());

         Bu.extend(duplicateKidEl, { className : iconItem.children[0].className });

         Bd.css(duplicateKidEl, iconItem.children[0].style);
         Bd.css(duplicateKidEl, { textAlign : 'center', width : '25px', height : '25px' });

         duplicateEl.appendChild(duplicateKidEl);
      }

      if (this.options.useNativeShortcut === false)
      {
         toolBoxItem.setAttribute("data-tbTip", shortCut);
         duplicateEl.title = '';
      }
      else
      {
         Bu.extend(toolBoxItem, { title : !Bs.isEmpty(shortCut) ? shortCut : '' });

      }

      //insert the icon into dugout
      iconDugOut.appendChild(duplicateEl);

      //copy link if any
      if (Bu.defined(li.children[0].href) && !Bs.isEmpty(li.children[0].href))
      {
         Bu.extend(toolBoxItem, { href : li.children[0].href }); //imhere
      }

      /**
       *
       * copy popup attr if any
       * issue #66
       * TODO {@link Barge.Bursty.window} will have to be reinstantiated
       * FIND a workaround
       */
      if (Bu.defined(li.getAttribute("data-window")) && !Bs.isEmpty(li.getAttribute("data-window")))
      {
         toolBoxItem.setAttribute("data-window", li.getAttribute("data-window"));
      }
   };

   /**
    *
    * @param toolBoxItems
    * @private
    */
   Bee.Widget.Toolbox.prototype._closeAllFlyOuts = function (toolBoxItems)
   {
      if (this.toolBoxItems)
      {
         for (this.i = 0, this.len = toolBoxItems.length; this.i < this.len; this.i++)
         {
            let flyOut    = toolBoxItems[this.i].children[1],
                hasFlyOut = toolBoxItems[this.i].children[1] && flyOut.tagName === "UL";

            if (hasFlyOut)
            {
               Bu.closeWin(flyOut);
            }
         }
      }
   };

   /**
    *
    * @param toolBoxItem
    * @returns {boolean}
    * @private
    */
   Bee.Widget.Toolbox.prototype._haveFlyOutOpen = function (toolBoxItem)
   {
      let flyOut    = toolBoxItem.children[1],
          HasFlyOut = flyOut && flyOut.tagName === "UL";
      return HasFlyOut && flyOut.style.display === "block";
   };

   /**
    *
    * @param toolBox
    * @param options
    * @private
    */
   Bee.Widget.Toolbox.prototype._resetToolBoxSize = function (toolBox, options)
   {
      if (Bu.defined(options.floatingWidth))
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
   };

   /**
    * returns the display state of an el; 1 if visible else 0
    * @param el
    * @return {number}
    * @private
    */
   Bee.Widget.Toolbox.prototype._getDisplayState = function (el)
   {
      if (el.style.display === "none" || el.style.display === "")
      {
         return 0;
      }
      return 1
   };

   /**
    *
    * @param windowEl
    * @private
    */
   Bee.Widget.Toolbox.prototype._openWin = function (windowEl)
   {
      if (Bu.getDisplayState(windowEl) === 0)
      {
         Bu.setDisplayState(windowEl, "block");
      }
   };

   /**
    *
    * @param removeEvs
    * @private
    */
   Bee.Widget.Toolbox.prototype._insertCustomToolTip = function (removeEvs)
   {
      const _this = this;
      //console.log(_this.toolBoxItems);

      Bu.forEach(_this.toolBoxItems, function (node)
      {
         //console.log(node.children[0]);
         if (node.children[0])
         {
            node.children[0].title = '';
         }
      });

      if (!removeEvs)
      {
         _this.toolTip = Bd.createEl('div',
                                     { id : 'toolTip' },

                                     {
                                        top     : 0,
                                        left    : 0,
                                        display : 'none'
                                     });
         //document.body.appendChild(toolTip);
         Bd.appendToWindow(_this.toolTip);

         /**
          * @type {Timer}
          */
         let timer;

         let haveToolBoxTip = Bu.getElementsByAttribute("data-tbTip");

         /**
          *
          * @type {number}
          * caching for performance
          */

         //console.log(_this.toolTipProps.topOffset);

         this.Be.bindOnAll(haveToolBoxTip, 'mouseover', function (e)
         {
            if (_this.aFlyOutIsOpen === false)
            {
               let self = this.parentElement,
                   left = (Bd.getRight(self) / 2) - 6;
               //top = _this.options.elOnTop ? Bd.getEl("#" + _this.options.elOnTop).offsetHeight : 0;
               //top = _this.options.elOnTop ? Bd.getEl("#" + _this.options.elOnTop).offsetHeight : 0;
               //toolTipProps.left = Bu.pInt(self.offsetLeft) + Bu.pInt(toolTipProps.leftOffset);
               //console.log(left);

               let addendumOffset = (!Bd.getEl('#propertyBar') || (Bd.getEl('#propertyBar') && !_this.docked)
                     ? 6 : 46) +
                                    //work around for inability to acquire property bar height form root

                                    //adding tooltip offset from toolbox movement
                                    (Bu.pInt(_this.toolTipProps.topOffset) !== 0 && !_this.docked ?
                                     Bu.pInt(_this.toolTipProps.topOffset) : 30 );

               Bd.alignLeft(self, _this.toolTip, _this.toolTipProps.leftOffset);

               Bd.anchorBottom(self, _this.toolTip, addendumOffset);

               Bd.setPseudoStyle(_this.toolTip, 'before', 'left', left + 'px');

               let tbTipText  = this.getAttribute("data-tbTip").split(","),
                   tipCanShow = !Bs.isEmpty(tbTipText[0]);

               _this.toolTip.innerHTML = tbTipText[0];

               timer = setTimeout(function ()
                                  {
                                     clearTimeout(timer);

                                     if (tipCanShow)
                                     {
                                        //console.log('_this.aFlyOutIsOpen',);
                                        Bu.openWin(_this.toolTip);
                                        _this.toolTipIsShowing = true;
                                     }
                                  }, 300)
            }

         }, false);

         this.Be.bindOnAll(haveToolBoxTip, 'mouseout', function (e)
         {
            if (_this._getDisplayState(_this.toolTip) === 0)
            {
               clearTimeout(timer);
            }
            else
            {
               timer = setTimeout(function ()
                                  {
                                     clearTimeout(timer);
                                     Bu.closeWin(_this.toolTip);
                                     _this.toolTipIsShowing = false;

                                  }, 100);
            }

         });
      }
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.addClickEvent = function ()
   {
      const self = this;
      let timer = null;

      this.Be.bindOnAll(self.toolBoxItems, 'mousedown', function (e)
      {
         //e.preventDefault();
         /*function hasCHild1()
          {

          }*/
         const me = this;
         let flyOut          = me.children[1] ? me.children[1] : null,
             flyOutMenuItems = Bu.nodeListToArray(me.children[1].children),
             toolBoxItem     = me.children[0],
             hasFlyOut       = me.children[1] && flyOut.tagName === "UL",
             target          = e.target;

         if (hasFlyOut)
         {
            //gFlyOutMenuItems.push(flyOutMenuItems);
            //
            //Be.bindOnAll(flyOutMenuItems, "click", function (ev)
            // {
            //
            // });
            if (self.options.swapToolBoxIcons === true)
            {
               /**issue #01 FIXED
                using native event binding because managing the event w/ {@link Barge.Event.EventManager}
                sort of uses the elements elsewhere and so  DOm els delete
                when performing appendChild*/
               for (let i = 0, len = flyOutMenuItems.length; i < len; i++)
               {
                  /**issue #02
                   * mouse up event is only swaps the iconItem after the second click
                   * */
                  function makeSwap(e)
                  {
                     /**
                      * issue #65 FIXED
                      * icons no longer swapping
                      * seems method isn't being called
                      */
                     //console.log("making call");
                     //console.log(e.target.parentElement);

                     self.swapIcons(e.target.parentElement, flyOutMenuItems, toolBoxItem);

                     Bu.forEach(flyOutMenuItems, function (flyOutMenuItem, i)
                     {
                        /**
                         * issue #65
                         * listener not removing on all only the curr clicked item
                         * */
                        flyOutMenuItems[i].removeEventListener("mousedown", makeSwap, false);
                     });
                  }

                  /**
                   * issue #65
                   * icons no longer swapping
                   * seems method isn't being called
                   * FIXED : using mousedown as a workaround
                   * since click and mouseup do not call the method
                   * P.S don't know why
                   */
                  flyOutMenuItems[i].addEventListener("mousedown", makeSwap, false);

               }
            }


            if (self._getDisplayState(flyOut) === 1)
            {
               clearTimeout(timer);
               Bd.closeWin(flyOut);

               Bd.css(toolBoxItem, { backgroundColor : "" });

               //issue #64 FIXED
               self.openFlyOut = null;
               self.aFlyOutIsOpen = false;
               toolBoxFlyOutIsOpen = false;

            }
            else
            {
               timer = setTimeout(function ()
                                  {
                                     //console.log("it's time");
                                     clearTimeout(timer);

                                     //this is counter-intuitive
                                     // console.log('aFlyOutIsOpen', aFlyOutIsOpen);
                                     /**issue #58 workaround*/
                                     if (!self.toolBoxActivated)
                                     {
                                        self._closeAllFlyOuts(self.toolBoxItems, true);
                                        self.toolBoxActivated = true;

                                     }
                                     /**issue #03
                                      * Menu gets activate but does not display
                                      * P.S Don't know why*/
                                     if (self.aFlyOutIsOpen)
                                     {
                                        //_closeAllFlyOuts(toolBoxItems, true);
                                        Bu.closeWin(self.openFlyOut);
                                        //console.log('menuA here', openFlyOut);
                                        // console.log('closeA here');
                                     }

                                     if (self.toolTipIsShowing)
                                     {
                                        //console.log("yes");
                                        if (Bu.defined(Bd.getEl("#toolTip")))
                                        {
                                           Bd.closeWin(Bd.getEl("#toolTip"));
                                        }
                                     }

                                     Bu.css(toolBoxItem, { backgroundColor : "var(--menuItemHoverColor)" });

                                     self._openWin(flyOut);

                                     //hide custom tooltip if open
                                     if (self.toolTip && self._getDisplayState(self.toolTip) === 1)
                                     {
                                        Bu.closeWin(me.toolTip);
                                        me.toolTipIsShowing = false;
                                     }

                                     self.openFlyOut = flyOut;
                                     self.dynamicStyleSheet.innerHTML = "#toolBox ul ul{left : calc(100% + 2px)}";

                                     flyOutRight = Bu.pInt(Bd.getRight(self.openFlyOut)) +
                                                   Bu.pInt(self.toolTipProps.leftOffset);

                                     self.options.showOnLeft = flyOutRight <= (window.innerWidth - 3);

                                     if (self.options.showOnLeft === false)
                                     {
                                        self.dynamicStyleSheet.innerHTML = "#toolBox ul ul{right : calc(100% + 2px)}";
                                     }

                                     self.aFlyOutIsOpen = true;
                                     toolBoxFlyOutIsOpen = true;

                                  }, 600);
            }
         }
         else
         {
            Bu.css(toolBoxItem, { backgroundColor : "var(--menuItemHoverColor)" });
            self.aFlyOutIsOpen = true;
            toolBoxFlyOutIsOpen = true;
         }

         if (target.nextElementSibling !== flyOut || target.parentNode !== me)
         {
            Bu.closeWin(flyOut);
            Bu.css(toolBoxItem, { backgroundColor : "" });
            self.aFlyOutIsOpen = false;
            toolBoxFlyOutIsOpen = false;
         }
      });

      this.Be.bindOnAll(self.toolBoxItems, 'mouseup', function (e)
      {
         e.stopPropagation();
         e.preventDefault();
         clearTimeout(timer);

         const me = this;
         let flyOut          = Bu.defined(me.children[1]) ? me.children[1] : null,
             hasFlyOut       = Bu.defined(me.children[1]) && flyOut.tagName === "UL",

             flyOutMenuItems = hasFlyOut ? Bu.nodeListToArray(flyOut.children) : null,
             toolBoxItem     = me.children[0],
             target          = e.target;

         /**
          * issue #65
          * default action is fired when closing
          */
         if(hasFlyOut)
         {
            if (self.aFlyOutIsOpen !== true)
            {
               //TODO
               //get the
               // go to the link in the item
               console.log(this.children[0]);
               Bu.redirectTo(this.children[0].href)
               //this.children[0].click();
            }
         }
         else
         {
            Bu.redirectTo(this.children[0].href)
         }

      });

      this.Be.bindOnAll(self.toolBoxItems, 'click', function (e)
      {
         e.stopPropagation();
         e.preventDefault();
      });

      if (this.options.expandable === true)
      {
         this.Be.bind(this.expandBtn, 'click', function (e)
         {
            if (self.docked)
            {
               if (!Bu.defined(this.getAttribute('data-expanded')) || this.getAttribute('data-expanded') === 'false')
               {
                  this.setAttribute('data-expanded', 'true');
                  self.expansionStyleSheet.innerHTML =
                     ":root{ --toolBoxWith : 76px; }" +
                     "#toolBox ul li:nth-child(n) { float: left; }" +
                     "#toolBox ul ul li:nth-child(n) { float: none; margin-left: 6%; }" +
                     "#toolBox ul li {width: 35px; }#toolBox{ width : 76px;}" +
                     "#toolBox li.hDivider{width:100%}";

                  this.classList.remove('fa-angle-double-right');
                  this.classList.add('fa-angle-double-left');

                  Bu.css(self.thumbGrip, { 'backgroundSize' : '40%' });
               }
               else
               {
                  this.setAttribute('data-expanded', 'false');
                  this.classList.add('fa-angle-double-right');
                  this.classList.remove('fa-angle-double-left');

                  self.expansionStyleSheet.innerHTML = "";

                  Bu.css(self.thumbGrip, { 'backgroundSize' : '70%' });
               }
            }

         });
      }
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.addMouseOutEvent = function ()
   {
      let _this = this;
      this.Be.bindOnAll(this.toolBoxItems, "mouseout", function ()
      {

         if (_this.openFlyOut) /*&& _this.openFlyOut.parentElement === this*///FIXME
         {
            // this.children[0].style.backgroundColor = "";
            Bd.css(this.children[0], { backgroundColor : "" })
         }

      })
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.addMouseOverEvent = function ()
   {
      let _this = this;
      this.Be.bindOnAll(this.toolBoxItems, 'mouseover', function (e)
      {
         //check if a submenu is open
         if (_this.aFlyOutIsOpen)
         {
            /**
             *
             * @type {Element}
             */
            let flyOut                = this.children[1],  //submenu
                /**
                 *
                 * @type {Element}
                 */
                toolBoxItem           = this.children[0],  //submenu row
                /**
                 *
                 * @type {Boolean}
                 */
                toolBoxItemHasSubMenu = this.children[1] && flyOut.tagName === "UL";

                console.log(toolBoxItemHasSubMenu);
            if (toolBoxItemHasSubMenu)
            {
               //region b4 innerLoop
               //_closeAllFlyOuts(this.toolBoxItems, true);
               //console.log(openFlyOut);
               //Bu.css(_this.openFlyOut, {left : '' });

               Bu.closeWin(_this.openFlyOut);

               //open the sub menu
               _this._openWin(flyOut);

               _this.aFlyOutIsOpen = true;

               /**
                * set the activeRow and openSubMenu to flyOut
                * @type {Element}
                */
               _this.openFlyOut = flyOut;

               _this.dynamicStyleSheet.innerHTML = "#toolBox ul ul{left : calc(100% + 2px)}";

               if (_this.options.varyFlyOutPosition === true)
               {
                  flyOutRight = Bu.pInt(Bd.getRight(flyOut)) +
                                Bu.pInt(_this.toolTipProps.leftOffset);

                  console.log(flyOutRight);
                  _this.options.showOnLeft = flyOutRight <= (window.innerWidth - 3);
               }

               //Bu.css(self.openFlyOut, {left : 'calc(100% + 2px)'});
               //console.log(_this.options.showOnLeft);
               if (_this.options.showOnLeft === false)
               {
                  _this.dynamicStyleSheet.innerHTML = "#toolBox ul ul{right : calc(100% + 2px)}";

                  //Bu.css(self.openFlyOut, {right : 'calc(100% + 2px)'});
                  //self.options.showOnLeft = false;
               }

               /**
                * set the global sub Menu Items to flyOutItems;
                * @type {HTMLElement[]}
                */
               //gflyOutItems = flyOut.children;

               //endregion

               /**
                *Implementing Bruce Tognazzini's algorithm NIU (NOT IN USE atm)
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
               //console.log("here");
               //_closeAllFlyOuts(this.toolBoxItems, true);
               Bd.closeWin(_this.openFlyOut);
            }

            if(Bu.defined(toolBoxItem))
            {
               Bd.css(toolBoxItem, { backgroundColor : "var(--menuItemHoverColor)" });
            }
         }
      });
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.addCloseOutEventOnBodyClick = function ()
   {
      const self = this;

      this.Be.bind(window, "mouseup", function (e)
      {
         /**
          *
          * @type {boolean}
          */
         let isWin = e.target.tagName ?
                     e.target.tagName.toLowerCase() === 'body' ||
                     e.target.tagName.toLowerCase() === 'html' : null;

         /**
          *
          * @private
          */
         function _closeEveryOpenItem()
         {
            Bu.closeWin(self.openFlyOut);
            self.aFlyOutIsOpen = false;
         }

         if (self.aFlyOutIsOpen)
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
               _closeEveryOpenItem()
            }
         }
      });
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.createThumb = function ()
   {
      this.thumbGrip = Bu.createEl('div', { className : "hDockThumb" });

      if (this.options.expandable === true)
      {
         this.expandBtn = Bu.createEl('div', { className : "expandBtn fa fa-angle-double-right" },
                                      {
                                         position   : 'relative',
                                         float      : 'right',
                                         height     : '100%',
                                         width      : '10px',
                                         fontSize   : '8px',
                                         textAlign  : 'right',
                                         lineHeight : '6px',
                                         fontWeight : '600'
                                      });

         this.dynamicStyleSheet.innerHTML += '.expandBtn:hover{ color:#fff;}';
         this.thumbGrip.appendChild(this.expandBtn);
      }

      Bd.insertChildAt(this.toolBox, this.thumbGrip, 0);
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.addClassNameToList = function ()
   {
      this.toolBoxItems = Bu.nodeListToArray(this.list.children);
      let self   = this;
          /*myList = []*/

      Bu.forEach(this.toolBoxItems, function (node)
      {
         //let flyOut    = node.children[1],
         //    hasFlyOut = node.children[1] && flyOut.tagName === "UL";
         //if (hasFlyOut)
         //{
         //   Bu.closeWin(flyOut);
            //Bu.addClass(node, self.options.toolBoxItemsClassName);
            //myList.push(node);
         //}
            Bd.addClass(node, self.options.toolBoxItemsClassName);
      });

      //this.toolBoxItems = myList;
      //myList = null;
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.dock = function ()
   {
      Bu.css(this.toolBox, { top : 0, left : 0 });
      this.docked = true;

      if (this.options.keepState === true && this.options.keepPosition === true)
      {
         localStorage.setItem('toolBoxDockState', 'true');
      }
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.makeUnDockable = function ()
   {
      const _this = this;

      /**
       * @augments Barge.Widget.Toolbox
       * @param el {Element}
       * @param dragOptions {{prevDef : Boolean, moveParent : Boolean,
            tolerance : Number, dragStart : fn, dragDrop : fn,
          * floatingWidth : Number, floatingHeight : Number }}
       * @constructor
       */
      const Dockable = function (el, dragOptions = {})
      {
         let self = this;
         let propertyBarExists = Bu.defined(Bd.getEl("#propertyBar")),
             propertyBar = propertyBarExists ? Bd.getEl("#propertyBar") : null;


         Bu.extend(dragOptions, dragOptions);
         self.moveParent = dragOptions.moveParent || null;
         //tolerance  = dragOptions.tolerance || null;
         //let dBe = new Bee.Event.EventManager();

         self.toBeMoved = null;

         this.dragOptions = dragOptions;
         self.toBeMoved = self.moveParent ? el.parentElement : el;

         _this.toBeMovedWidth = self.toBeMoved.offsetWidth;
         _this.toBeMovedHeight = self.toBeMoved.offsetHeight;

         Bd.addClass(self.toBeMoved, "draggable");

         Bd.css(self.toBeMoved, {
            position   : 'relative',
            left       : self.toBeMoved.offsetLeft,
            top        : self.toBeMoved.offsetTop,
            zIndex     : self.toBeMoved.style.zIndex + 20,
            transition : 'all .07s'
         });
         //Bd.css(self.toBeMoved, {});

         var defaultPos = {
            left : self.toBeMoved.offsetLeft,
            top  : self.toBeMoved.offsetTop
         };

         var myShadow = Bd.createEl('div');
         //Bu.extend(myShadow.style, self.toBeMoved.style);
         Bd.css(myShadow, self.toBeMoved.style);

         Bu.extend(myShadow, { id : '', innerHTML : '' });

         Bd.css(myShadow, {
            display         : 'none',
            position        : 'absolute',
            borderLeft      : '2px solid #0078ff', //transition      : 'all .3s',
            borderTop       : 'none',
            borderRight     : 'none',
            borderBottom    : 'none',
            zIndex          : self.toBeMoved.style.zIndex - 1,
            backgroundColor : 'rgba(8, 124, 255, 0.3)',
            top             : Bd.getTop(self.toBeMoved) + 'px'
         });

         //insert shadow
         document.body.appendChild(myShadow);

         let myShadowIsOpen = false;

         var move = function (event)
         {
            Bd.css(myShadow, {
               width  : (_this.toBeMovedWidth ) + 'px',
               height : _this.toBeMovedHeight + 'px',
            });

            // don't bubble this event - mousedown
            event.stopPropagation();

            var originalLeft = parseInt(window.getComputedStyle(self.toBeMoved).left);
            var originalTop = parseInt(window.getComputedStyle(self.toBeMoved).top);

            if (event.target == el)
            {
               var mouseDownX = event.clientX;
               var mouseDownY = event.clientY;

               //no need to manage events, we can't unbind
               document.addEventListener("mouseup", dropMe, false);
               document.addEventListener("mousemove", dragMe, false);

               function dragMe(event)
               {

                  if (dragOptions.tolerance)
                  {

                     Bd.css(el, { cursor : 'move' });

                     var currLeftPos = Bu.getStyleValue('left', self.toBeMoved);
                     //currTopPos  = Bu.getStyleValue('top', self.toBeMoved);
                     //console.log(currLeftPos);

                     if (currLeftPos >= 10 && currLeftPos <= _this.toBeMovedWidth && !_this.docked)
                     {
                        Bd.openWin(myShadow);

                        //myShadowIsOpen = true;
                     }
                     else
                     {
                        Bd.closeWin(myShadow);
                     }

                     if (_this.docked)
                     {
                        var dX = event.clientX - mouseDownX,
                            dY = event.clientY - mouseDownY;

                        if (dX > dragOptions.tolerance)
                        {
                           Bd.css(toolBox, { left : originalLeft + event.clientX - mouseDownX + "px" });
                           _this.docked = false;
                        }

                        if (dY > 10)
                        {
                           Bd.css(toolBox, { top : originalTop + event.clientY - mouseDownY + "px" });
                           _this.docked = false;
                        }
                     }
                     else if (currLeftPos <= dragOptions.tolerance + 5)
                     {
                        Bu.css(self.toBeMoved, { left : defaultPos.left + "px" });

                        Bd.closeWin(myShadow);

                        /*if (myShadowIsOpen)
                         {
                         myShadowIsOpen = false;
                         }*/

                        _this.docked = true;

                     }
                     else
                     {
                        self.toBeMoved.style.left = originalLeft + event.clientX - mouseDownX + "px";
                        /*if (myShadowIsOpen)
                         {
                         myShadowIsOpen = false;
                         }*/
                     }
                  }
                  else
                  {
                     self.toBeMoved.style.left = originalLeft + event.clientX - mouseDownX + "px";
                  }

                  if (event.clientY < 31)
                  {
                     self.toBeMoved.style.top = 31 + "px";
                  }
                  else if (event.clientY >= 31 && !_this.docked)
                  {
                     self.toBeMoved.style.top = originalTop + event.clientY - mouseDownY + "px";
                  }
               }

               function dropMe(event)
               {
                  Bd.css(el, { cursor : 'default' });

                  _this.toolTipProps.leftOffset = Bu.pInt(gsv('left', self.toBeMoved));
                  _this.toolTipProps.topOffset = Bu.pInt(gsv('top', self.toBeMoved));

                  //var leftPos = gsv('left', self.toBeMoved);
                  myShadowIsOpen = Bd.getDisplayState(myShadow) === 1;

                  if (_this.toolTipProps.leftOffset <= 0 || myShadowIsOpen)
                  {
                     _this.dock();
                     //Bu.css(self.toBeMoved, { left : 0 + 'px' });
                     //_this.docked = true;
                     //if(_this.options.keepState === true && _this.options.keepPosition === true)
                     //{
                     //   localStorage.setItem('toolBoxDockState', 'true');
                     //}
                  }

                  //console.log(myShadowIsOpen);
                  //if ( myShadowIsOpen)
                  //{
                  //   _this.dock();
                  //Bu.css(self.toBeMoved, { left : 0 + 'px' });
                  //myShadowIsOpen = false;
                  //_this.docked = true;
                  //if(_this.options.keepState === true && _this.options.keepPosition === true)
                  //{
                  //   localStorage.setItem('toolBoxDockState', 'true');
                  //}
                  //}
                  //console.log(self.dragOptions.floatingHeight);
                  if (!_this.docked) //fixme imhere
                  {
                     Bu.css(self.toBeMoved, {
                        position  : 'absolute',
                        border    : '1px solid var(--dividerColor)',
                        boxShadow : '0px 0px 3px rgba(0, 0, 0, 0.6)'
                     });

                     //console.log(!_this.docked);
                     if (self.dragOptions.floatingWidth)
                     {
                        Bu.css(self.toBeMoved, { width : self.dragOptions.floatingWidth + 10 + 'px' });
                     }

                     if (self.dragOptions.floatingHeight)
                     {

                        Bu.css(self.toBeMoved, { height : self.dragOptions.floatingHeight + 7 + 'px' });
                     }

                     if (_this.options.keepState === true && _this.options.keepPosition === true)
                     {
                        localStorage.setItem('toolBoxDockState', 'false');
                     }

                     if (gsv('top', self.toBeMoved) < 31)
                     {
                        self.toBeMoved.style.top = '31px';
                     }

                     if (Bu.defined(_this.options.elOnRight))
                     {
                        //_this.options.elOnRight = Bd.getEl('#'+_this.options.elOnRight);
                        Bee.Widget.CSSSTYLE.setProperty('--toolBoxWith', '0px');

                     }
                  }
                  else
                  {
                     //Bu.css(self.toBeMoved, { position : 'absolute' });

                     Bu.css(self.toBeMoved, {
                        width     : _this.toBeMovedWidth + 'px',
                        height    : _this.toBeMovedHeight + (propertyBarExists ? 40 : 0) + 'px',
                        top       : defaultPos.top - (propertyBarExists && propertyBar.style.display === "none" ? 40 : 0) + "px",
                        borderTop : 'none',
                        boxShadow : 'none'
                     });

                     //_this.toolTipProps.topOffset = 0;
                     //_this.toolTipProps.leftOffset = 0;
                     //Bu.css(self.toBeMoved, { height : _this.toBeMovedHeight + 'px' });
                     //Bd.css(self.toBeMoved, { top : defaultPos.top + "px" });
                     //console.log(_this.toolBox);
                     //console.log(gsv(_this.toolBox, 'width'));
                     rootStyle.setProperty('--toolBoxWith', _this.toolBox.style.width);
                  }

                  if (_this.options.keepState === true && _this.options.keepPosition === true &&
                      _this.options.unDockable === true)
                  {
                     var x = Bd.getLeft(self.toBeMoved).toString();
                     var y = Bd.getTop(self.toBeMoved).toString();
                     localStorage.setItem('toolBoxXY', x + ',' + y)
                  }

                  document.removeEventListener("mousemove", dragMe, false);
                  document.removeEventListener("mouseup", dropMe, false);
               }
            }
         };

         el.addEventListener("mousedown", move, false);
      };

      Bd.css(_this.toolBox, {
         width     : _this.toolBox.offsetWidth,
         height    : _this.toolBox.offsetHeight,
         border    : '1px solid var(--dividerColor)',
         borderTop : 'none'
      });

      var drg = new Dockable(_this.thumbGrip, {
         prevDef        : false,
         moveParent     : true,
         tolerance      : 30,
         floatingHeight : _this.list.offsetHeight + _this.thumbGrip.offsetHeight
      });
   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.makeStateful = function ()
   {
      const _this = this;
      //console.log(options.unDockable === true);
      if (this.options.unDockable === true && this.options.keepPosition === true)
      {
         let lastXY = localStorage.getItem('toolBoxXY').split(',');
         let lastDockState = localStorage.getItem('toolBoxDockState');

         //console.log('lastDockState', Bu.defined(lastDockState) && lastDockState === 'true');

         if (Bu.defined(lastDockState) && lastDockState === 'false')
         {
            _this._resetToolBoxSize(_this.toolBox, {
               floatingHeight : _this.toolBox.children[0].offsetHeight +
                                _this.toolBox.children[1].offsetHeight
            });

         }

         if (Bu.defined(lastXY))
         {
            Bu.css(_this.toolBox, { left : lastXY[0] + 'px', top : lastXY[1] + 'px' });

            _this.toolTipProps.leftOffset = lastXY[0]; //fixme
            _this.toolTipProps.topOffset = lastXY[1]; //fixme

            //console.log('gsv(_this.toolBox)', gsv('left', _this.toolBox));
            //console.log(_this.toolTipProps.leftOffset);
            //_this.docked = false; fixme imhere
            //localStorage.setItem('_this.toolBoxDockState', 'false');
         }
      }

      if (_this.options.swapToolBoxIcons)
      {
         Bu.forEach(_this.toolBoxItems, function (node, i)
         {
            let lastActive      = localStorage.getItem('toolBoxItem' + i),
                toolBoxItem     = _this.toolBoxItems[i].children[0],
                flyOutMenuItems = _this.toolBoxItems[i].children[1] !== undefined &&
                                  _this.toolBoxItems[i].children[1].children !== undefined ?
                                  Bu.nodeListToArray(_this.toolBoxItems[i].children[1].children) : null;
            //console.log(i,"i");
            //console.log(node,"node");
            //console.log(flyOutMenuItems,"toolBoxItems[" + i + "].children");
            //console.log(lastActive,"lastActive");
            //console.log(flyOutMenuItems[lastActive],"flyOutMenuItems[lastActive]");

            if (Bu.defined(flyOutMenuItems) && Bu.defined(lastActive) && Bu.defined(flyOutMenuItems[lastActive]))
            {
               let myClicker = flyOutMenuItems[lastActive];

               //issue #04
               //myClicker.click() does not work because the
               //click event is wired to the flyOutItem after the first click
               //Idk why
               //myClicker.click();
               //myClicker.click();
               //
               //we are using this work around instead
               _this.swapIcons(myClicker, flyOutMenuItems, toolBoxItem);
            }
         });
      }

   };

   /**
    *
    */
   Bee.Widget.Toolbox.prototype.create = function ()
   {
      //var _this = this;

      this.addClassNameToList();

      this.addDynamicStyleSheet();

      if (Bu.defined(this.options.elOnRight))
      {
         this.options.elOnRight = Bd.getEl('#' + this.options.elOnRight)
      }

      if (Bu.defined(this.options.elOnTop))
      {
         //console.log(this.toolTipProps.topOffset);
         //console.log(Bu.pInt(Bd.getEl("#" + this.options.elOnTop).offsetHeight));
         //this.toolTipProps.topOffset += Bu.pInt(Bd.getEl("#" + this.options.elOnTop).offsetHeight);
         //this.toolTipProps.topOffset += Bu.pInt(Bd.getEl("#" + this.options.elOnTop).offsetHeight);
         //console.log(this.toolTipProps.topOffset);
      }

      //this.toolBoxItems = Bu.nodeListToArray(document.getElementsByClassName(this.options.toolBoxItemsClassName));

      if (this.options.unDockable)
      {
         this.createThumb();
      }
      else
      {
         Bu.css(this.toolBox, { paddingTop : '5px' });
      }

      this.aFlyOutIsOpen = this.toolBoxItems.some(this._haveFlyOutOpen);

      this.addClickEvent();

      if (this.options.switchOnHover === true)
      {
         this.addMouseOverEvent();

         this.addMouseOutEvent();
      }

      this.addCloseOutEventOnBodyClick();

      /*if (this.options.trackMouseMove === true) NIU
       {
       this.Be.bind(window, 'mousemove', function (e)
       {

       if (openFlyOut)
       {
       var currLoc = 0;
       var interval = setInterval(function ()
       {
       if (currLoc === self.MOUSE_LOCS_TRACKED)
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
       self.mouseLocs.shift();
       }

       _getGradient();

       currLoc++;

       }, 300)
       }

       });

       /!**
       * @use for calculating the slope b/n the curr mouse x|y and the conners of an obj
       * @param a {Object}
       * @param b {Object}
       * @return {number}
       * @private
       *!/
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
       }*/

      if (this.options.useNativeShortcut === false)
      {
         this._insertCustomToolTip();
      }

      if (this.options.unDockable === true)
      {
         this.makeUnDockable();
      }

      if (this.options.keepState === true)
      {
         this.makeStateful();
      }
   };

   Bee.Widget.Toolbox.prototype.hide = function ()
   {
      let _this = this;
      Bd.css(_this.toolBox, {display : "none"});

      if(this.docked === true)
      {
         Bee.Widget.CSSSTYLE.setProperty('--toolBoxWith', '0px');
      }
   };

   Bee.Widget.Toolbox.prototype.show = function ()
   {
      let _this = this;

      if(this.docked === true)
      {
         Bee.Widget.CSSSTYLE.setProperty('--toolBoxWith', '40px');
      }
      Bd.css(_this.toolBox, {display : "block"});
   };

   Bee.Widget.Toolbox.prototype.getToolBoxFlyOutIsOpen = function ()
   {
      return this.aFlyOutIsOpen;
   };

   return {
      ToolBox                : Bee.Widget.Toolbox,
      getToolBoxFlyOutIsOpen : Bee.Widget.Toolbox.prototype.getToolBoxFlyOutIsOpen

   };

})(Bee.Utils, Bee.String, Bee.Object, Bee.Widget);

/*
 * TODO ADD support for adjusting surrounding els
 * provide vars to get surrounding els
 * and Objects to store the state of the surrounding els when toolBox is floating
 * and when it's docked
 *
 * TODO if the tool Box is contained in a container other than the body
 * TODO then  position the left and top of the toolBox shadow el  anchored topLeft to the container DONE
 * ! FIXME issue #65 and #66 FIXED
 * */

/**@CHANGE_LOG
 * 15/04/17 : ADDED support for both click and long click on the toolbox items (NOT submenu items)
 *          now flyOut opens on long click
 * 13/05/17 : Fixed issues w/ long click, and a bunch of other errors and misbehaviour
 *          added a global variable {@link window.toolBoxFlyOutIsOpen}
 *          to tell the outside world the state of {@link Barge.Widget.Toolbox.aFlyOutIsOpen}
 *
 */