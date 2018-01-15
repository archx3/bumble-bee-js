/**
 * Created by arch on 7/2/16.
 */
"use strict";


var Barge = Barge || {};
Barge.Drag = Barge.Drag || {};
/**
 *
 * @param el {Element}
 * @param minElWidth {number}
 * @param minElHeight {number}
 * @param resizeRight {boolean}
 * @param resizeBottom {boolean}
 * @param resizeLeft {boolean}
 * @param resizeTop {boolean}
 * @param maxWidth {number}
 * @param maxHeight {number}
 * @constructor
 */
Barge.Drag.Resizeable = function (el, minElWidth, minElHeight, resizeRight, resizeBottom, resizeLeft, resizeTop, maxWidth, maxHeight)
{
   this.el = el;
   this.minElWidth = minElWidth;
   this.minElHeight = minElHeight;
   this.resizeRight = resizeRight;
   this.resizeBottom = resizeBottom;
   this.resizeLeft = resizeLeft;
   this.resizeTop = resizeTop;
   var self = this;
   this.maxWidth = maxWidth;
   this.maxHeight = maxHeight;


   var resize = null;
   var onRightEdge, onBottomEdge, onLeftEdge, onTopEdge;

   var elBounds, x, y;

   function calc(e, el)
   {
      var MARGINS = 4;

      elBounds = el.getBoundingClientRect();
      x = e.clientX - elBounds.left;
      y = e.clientY - elBounds.top;

      onTopEdge = y < MARGINS; //these statements are equivalent to boolean returning if statements
      onLeftEdge = x < MARGINS;
      onRightEdge = x >= elBounds.width - MARGINS;
      onBottomEdge = y >= elBounds.height - MARGINS;
   }

   function onMouseDown(e)
   {
      onDown(e, self.el);
      e.preventDefault();
   }
   function onMouseMove(e)
   {
      onMove(e, self.el);
      e.preventDefault();
   }

   function onDown(e , el)
   {
      calc(e, self.el);

      var isResizing = onRightEdge || onBottomEdge || onTopEdge || onLeftEdge;

      resize =
      {
         x: x,
         y: y,
         cx: e.clientX,
         cy: e.clientY,
         w: elBounds.width,
         h: elBounds.height,
         isResizing: isResizing,
         isMoving: !isResizing,
         onTopEdge: onTopEdge,
         onLeftEdge: onLeftEdge,
         onRightEdge: onRightEdge,
         onBottomEdge: onBottomEdge
      };
   }

   function onUp(e)
   {
      resize = null;
      document.removeEventListener("mouseup", onUp, true);
      document.removeEventListener("mousemove", onMove, true);
   }

   var e;
   function onMove(ee, el)
   {
      calc(ee, el);

      e = ee;
   }

   function makeResiseable(el, minWidth, minHeight ,maxWidth, maxHeight)
   {
      function animate()
      {
         //requestAnimationFrame(animate);

         if (resize && resize.isResizing)
         {
            if (resize.onRightEdge)
            {
               if(self.resizeRight)
               {
                  self.el.style.width = Math.max(x, minWidth) + 'px';
               }
            }

            if (resize.onBottomEdge)
            {
               if(self.resizeBottom)
               {
                  self.el.style.height = Math.max(y, minHeight) + 'px';
               }
            }

            if (resize.onLeftEdge)
            {
               if(self.resizeLeft)
               {
                  var currentWidth = Math.max(resize.cx - e.clientX  + resize.w, minWidth);
                  if (currentWidth > minWidth)
                  {
                     self.el.style.width = currentWidth + 'px';
                     self.el.style.left = e.clientX + 'px';
                  }
               }
            }

            if (resize.onTopEdge)
            {
               if(self.resizeTop)
               {
                  var currentHeight = Math.max(resize.cy - e.clientY  + resize.h, minHeight);
                  if (currentHeight > minHeight)
                  {
                     self.el.style.height = currentHeight + 'px';
                     self.el.style.top = e.clientY + 'px';
                  }
               }
            }
            return;
         }

         /*This code executes when mouse moves without clicking
          this is where the resize cursors are set
          style cursor*/
         if (onRightEdge && onBottomEdge || onLeftEdge && onTopEdge)
         {
            self.el.style.cursor = 'nwse-resize';
         }
         else if (onRightEdge && onTopEdge || onBottomEdge && onLeftEdge)
         {
            self.el.style.cursor = 'nesw-resize';
         }
         else if (onRightEdge)
         {
            if(self.resizeRight)
            {
               self.el.style.cursor = 'ew-resize';
            }
         }
         else if(onLeftEdge)
         {
            if(self.resizeLeft)
            {
               self.el.style.cursor = 'ew-resize';
            }
         }
         else if (onBottomEdge)
         {
            if(self.resizeBottom)
            {
               self.el.style.cursor = 'ns-resize';
            }
         }
         else if(onTopEdge)
         {
            if(self.resizeTop)
            {
               self.el.style.cursor = 'ns-resize';
            }
         }
         else
         {
            self.el.style.cursor = 'default';
         }
      }
      animate();
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onUp);
   }
   makeResiseable(this.el, this.minElWidth, this.minElHeight);
   this.el.addEventListener('mousedown', onMouseDown);
};

var pane = document.getElementById('pane');
var rsbl = new Barge.Drag.Resizeable(pane, 250, 60, true);