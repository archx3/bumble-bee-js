/**
 * Created by ARCH on 21/06/2016.
 */
/*the following function is the constructor for the drag and drop APi
PRE: takes the element to be made draggable
     whether the default effect of the event should be appiled or not
**/
var Bee = Bee || {};
(function (Bu)
{
   Bee.Drag = Bee.Drag || {};
   /**
    * @param el {Element}
    * @param prevDef {boolean}
    * @param dragStart {String}
    * @param dragDrop {String}
    * @constructor
    */
   Bee.Drag.Movable = function (el, prevDef, dragStart, dragDrop)
   {
      this.el = el;
      this.dragStart = dragStart;
      this.dragDrop = dragDrop;
      this.prevDef = prevDef;
      this.el.classList.add("draggable");
      var self = this;
      var gsv = Bu.getStyleValue;

      /*the following method implements the movement of an element to a new position
       * it doesn't have to be called explicitly
       * */
      var move = function(event)
      {//console.log(event.currentTarget)*/
         /*if(self.dragStart !== undefined)
          {
          self.dragStart();
          }*/
         event.stopPropagation();// don't bubble this event - mousedown

         if(self.prevDef)
         {
            event.preventDefault(); //prevent any default action
         }

         var originalLeft = parseInt(window.getComputedStyle(this).left);
         var originalTop = parseInt(window.getComputedStyle(this).top);

         if(event.target == self.el)
         {
            var mouseDownX = event.clientX;
            var mouseDownY = event.clientY;

            document.addEventListener("mouseup", dropMe, false);
            document.addEventListener("mousemove", dragMe, false);

            function dragMe(event)
            {
               var horizontalConstraint = 0 && window.innerWidth;
               var verticalConstraint = 0 && window.innerHeight;

               /*if(event.clientX < 0 || (gsv(self.el.style.left) < 0) && event.clientX  )
               {
                  // self.el.style.left = 0+'px';
                  // self.el.style.left = originalLeft + event.clientX - mouseDownX + "px";
               }
               else
               {*///FIXME let's implement the constraint later
                  self.el.style.left = originalLeft + event.clientX - mouseDownX + "px";

               //}

               if (event.clientY < 3)
               {
                  self.el.style.top = 0 + "px";
               }
               else
               {
                  self.el.style.top = originalTop + event.clientY - mouseDownY + "px";
               }
               //event.stopPropagation();
            }

            function dropMe(event)
            {
               //console.log('self.el.style.left', self.el.style.left);
               if(gsv(self.el.style.left) < 0 )
               {
                  self.el.style.left = 0+'px';
               }

               document.removeEventListener("mousemove", dragMe, false);
               document.removeEventListener("mouseup", dropMe, false);
               /*if(self.dragDrop !== undefined)
                {
                self.dragDrop();
                }
                //event.stopPropagation();*/
            }
         }
      };
      this.el.addEventListener("mousedown", move, false);
   };

//region counter-intuitive code
   var dragStart = function (handler1)
   {
      if(handler1 !== undefined)
      {
         window[handler1]();
      }
      /*this.el.style.width = parseInt(window.getComputedStyle(this.el).width )* 1.3 + "px";
       this.el.style.height = parseInt(window.getComputedStyle(this.el).height) * 1.3 + "px";*/
   };

   var dragDrop = function (handler2)
   {
      if(handler2 !== undefined)
      {
         window[handler2]();
      }
      /*this.el.style.width = parseInt(window.getComputedStyle(this.el).width) * 100/130 + "px";
       this.el.style.height = parseInt(window.getComputedStyle(this.el).height) * 100/130 + "px";*/
   };
//endregion

   /**
    * @PRE:
    * @POST:
    * @example var div1 = document.getElementsByTagName("div")[0];
    * var dragObject1 = new BargeDraggable(div1,dragStart,dragDrop);
    * */

   Bee.Drag.Move = function(WinElID)
   {
      var cnLeft = "0", cnTop = "0", xpos = 0, ypos = 0, domStyle = null;

      function _holdIt(evt)
      {
         var objectID, dom, de, b;
         // accesses the element that generates the event and retrieves its ID
         if (document.addEventListener)
         { // w3c
            objectID = evt.target.id;
            if (objectID== WinElID)
            {
               dom = document.getElementById(objectID);
               cnLeft = evt.pageX;
               cnTop = evt.pageY;

               if (dom.offsetLeft)
               {
                  cnLeft = (cnLeft - dom.offsetLeft);
                  cnTop = (cnTop - dom.offsetTop);
               }
            }

            // get mouse position on click
            xpos = (evt.pageX);
            ypos = (evt.pageY);
         }

         else
         { // IE
            objectID = event.srcElement.id;
            cnLeft = event.offsetX;
            cnTop = (event.offsetY);

            // get mouse position on click
            de = document.documentElement;
            b = document.body;

            xpos = event.clientX + (de.scrollLeft || b.scrollLeft) - (de.clientLeft || 0);
            ypos = event.clientY + (de.scrollTop || b.scrollTop) - (de.clientTop || 0);
         }

         // verify if this is a valid element to pick
         if (objectID == WinElID)
         {
            domStyle = document.getElementById(objectID).style;
         }

         if (domStyle)
         {
            domStyle.zIndex = 100;
            return false;
         }

         else
         {
            domStyle = null;
         }
      }

      function _dragIt(event)
      {
         if (domStyle)
         {
            if (document.addEventListener)
            { //for IE
               domStyle.left = (event.clientX - cnLeft + document.body.scrollLeft) + 'px';
               domStyle.top = (event.clientY - cnTop + document.body.scrollTop) + 'px';
            }
            else
            {  //Firefox
               domStyle.left = (evt.clientX - cnLeft + document.body.scrollLeft) + 'px';
               domStyle.top = (evt.clientY - cnTop + document.body.scrollTop) + 'px';
            }
         }
      }

      function _dropIt()
      {
         if (domStyle)
         {
            domStyle = null;
         }
      }

      document.onmousedown = _holdIt;
      document.onmousemove = _dragIt;
      document.onmouseup = _dropIt;
   };
})(Bee.Utils);

