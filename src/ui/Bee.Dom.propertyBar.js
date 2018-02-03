/**
 * @Author       Created by arch on 06/07/17 using PhpStorm.
 * @Time         : 12:58
 * @Copyright (C) 2017
 * Barge Studios Inc, The $ Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence      Licensed under the Barge Studios Eula
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
 * @fileOverview contains instruction[code] for creating a $
 *
 * @requires
 */
(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['PropertyBar'] = factory(global));
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
      global['PropertyBar'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let Bu = Bee.utils,
       Bs = Bee.String,
       Bo = Bee.Object,
       Bd = Bee.Dom;
   //endregion
   /**
    *
    * @constructor
    */
   function PropertyBar(options)
   {
      this.expandBtn = null;
      this.thumbGrip = null;

      this.options = {
         expandable : false,
         unDockable : true,
      }
   }

   /**
    *
    */
   PropertyBar.prototype.createThumb = function ()
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


   PropertyBar.prototype.makeUnDockable = function ()
   {
      const _this = this;

      /**
       * @augments Barge.Dom.Toolbox
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
                  Bee.Dom.CSSSTYLE.setProperty('--toolBoxWith', '0px');

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

   PropertyBar.prototype.create = function ()
   {
      //var _this = this;



      //this.toolBoxItems = Bu.nodeListToArray(document.getElementsByClassName(this.options.toolBoxItemsClassName));

      if (this.options.unDockable)
      {
         this.createThumb();
      }
      else
      {
         Bu.css(this.toolBox, { paddingTop : '5px' });
      }



      this.addCloseOutEventOnBodyClick();



      if (this.options.unDockable === true)
      {
         this.makeUnDockable();
      }

      //if (this.options.keepState === true)
      //{
      //   this.makeStateful();
      //}
   };

   //going public whoop! whoop! lol
   return Bee.Dom.Propertybar = PropertyBar;
});