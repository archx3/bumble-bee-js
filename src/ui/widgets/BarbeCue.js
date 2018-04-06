/**
 * Created by ARCH on 17/07/2016.
 * Copyright (C) 2016 Barge Studios Inc<bargestd@gmail.com>
 */
var Bee = Bee || {};

var dXOffSet = 0,
    dYOffSet = 0;
(function (Bu, Ba, Bd)
   {
      /**
       *
       * @type {Barge.Event.EventManager}
       */
      let Be = new Bee.Event.EventManager();

      //region CSS
      /*function _insertDynamicCss()
       {*/
      var tipCss = '#tTip, #hTip {z-index:47; width:auto; height:auto; position: absolute; background-color: #f5f5f5; border: 1px' +
                   ' solid #b5b1b1;box-shadow: 2px 2px 0.01em 0.01em rgba(0, 0, 0, .2); padding: 0 5px 5px 5px; text-overflow:ellipsis;' +
                   'overflow-wrap:normal; white-space:nowrap; display: none} #tTip{background-color: #fff9ca;border: 1px solid #666;}' +

                   '#tTip::before, #tTip::after { content: ""; position: absolute; width: 0; height: 0; border-style: solid;' +
                   'border-color: transparent; border-top: 0; }' +
                   '#hTip { white-space: pre-wrap; max-width: 350px;}';

      var toolTipCss = '#toolTip { width:auto; height:auto; position: absolute; background-color: ' +
                       '#f5f5f5; border: 1px solid #b5b1b1;box-shadow: 2px 2px 0.01em 0.01em rgba(0, 0, 0, .2); padding: 5px 5px 5px 5px;transition: display .5s;transition-delay: 5s; ' +
                       'text-overflow:ellipsis;overflow-wrap:normal; white-space:nowrap; display: none}' +
                       '#toolTip{background-color: #000; color:#fff; box-shadow:none; border:0;font-weight: 600;font-size: 15px; border:1px solid rgba(204, 204, 204, .6); z-index:190;}' +
                       '#toolTip::before, #toolTip::after { content: ""; position: absolute; width: 0; height: 0; border-style: solid;' +
                       'border-color: transparent; border-top: 0; }' +
                       '#toolTip::before{top:-25%; border-bottom-color:#000; border-width: 10px; }';

      /* if(!document.getElementById("toolTipCss"))
       {
       var toolTipCss = document.createElement("style");
       toolTipCss.id="toolTipCss";
       toolTipCss.innerHTML = tipCss;
       document.head.appendChild(toolTipCss);
       }
       }*/
//endregion
      function _cuePositioner(tTip, e, cue, isHint, rOl)
      {
         Bu.openWin(tTip);
         Bu.getMouseCoordinates(e);
         tTip.innerHTML = this.getAttribute(cue);
         //getting the distance between the object's width and height and the window
         var py = window.innerHeight - (Bu.getStyleValue(tTip.clientHeight) + Bu.getStyleValue(tTip.style.top));

         var px = window.innerWidth - (Bu.getStyleValue(tTip.style.left) + Bu.getStyleValue(tTip.clientWidth) + 200);
         //todo fix the bug with hint positioning (commented out below)
         //setting the top positioning
         /*if(isHint)
          {
          tTip.style.left = posX + "px";
          tTip.style.top = posY + "px";
          }
          else
          {*/
         tTip.style.left = (Math.floor(70 / 100 * (posX))) + "px";
         tTip.style.top = posY + 13 + "px";
         //}

         if (Bu.getStyleValue(tTip.clientHeight) > py)
         {
            tTip.style.top = posY - tTip.offsetHeight + "px";
         }
         else if (Bu.getStyleValue(tTip.clientHeight) < 3)
         {
            tTip.style.top = posY + tTip.offsetHeight + "px";
         }
         //setting the left positioning
         if (Bu.getStyleValue(tTip.clientWidth) > px)
         {
            tTip.style.left = posX - tTip.offsetWidth + "px";
         }
         else if (Bu.getStyleValue(tTip.style.left) < 3)
         {
            tTip.style.left = posX + tTip.offsetWidth + "px";
         }
         //console.log(py);
         // console.log(px);
         //console.log(window.innerWidth);
         //console.log(Bu.getStyleValue(tTip.style.left));
      }

      Bee.Barbecue = Bee.Barbecue || {};
      Bee.Barbecue.hint = function ()
      {
         var hint = document.createElement("div");
         hint.id = "hTip";
         hint.style.display = "none";
         Bu.insertDynamicCss(tipCss, "toolTipCss");
         document.body.appendChild(hint);

         var containsHint = Bu.getElementsByAttribute("data-hint");

         for (var ch = 0; ch < containsHint.length; ch++)
         {
            containsHint[ch].addEventListener('mouseover', function (e)
            {
               if (this.getAttribute("data-hint").toString().length > 1)
               {
                  _cuePositioner.call(this, hint, e, "data-hint", true);
               }
            });
            containsHint[ch].addEventListener('mouseout', function ()
            {
               Bu.closeWin(hint, false, false);
            });
         }
      };
      /**
       *
       * @param anchor {boolean}
       */
      Bee.Barbecue.tip = function (anchor)
      {
         var tTip = document.createElement("div");
         tTip.id = "tTip";
         tTip.style.display = "none";
         tTip.style.top = 0;
         tTip.style.left = 0;
         Bu.insertDynamicCss(tipCss, "toolTipCss");

         document.body.appendChild(tTip);

         var containsToolTip = Bu.getElementsByAttribute("data-tooltip");

         for (var i = 0; i < containsToolTip.length; i++)
         {  //displaying the tooltip
            containsToolTip[i].addEventListener('mouseover', function (e)
            {
               if (this.getAttribute("data-tooltip").toString().length > 1)
               {
                  Bu.openWin(tTip);
                  if (anchor)
                  {
                     Bu.setObjectPositionAt(tTip, this, "bottomLeft");

                     if (this.classList.contains("normalTip"))
                     {
                        Bu.setObjectPositionAt(tTip, this, "bottomLeft", false, true);
                     }
                  }
                  else
                  {
                     Bu.getMouseCoordinates(e);
                     tTip.style.top = posY + 20 + document.body.scrollTop + "px";
                     tTip.style.left = posX + document.body.scrollLeft + "px";

                     //console.log(posX);
                  }
                  tTip.innerHTML = this.getAttribute("data-tooltip");
                  Bu.dynamicSpaceElPositioner(tTip, true);
               }
            });
            //removing the tooltip
            containsToolTip[i].addEventListener('mouseout', function ()
            {
               Bu.closeWin(tTip, false, false);
            });
         }
      };

      /**
       * the code below creates a modern toolTip
       * but is messy in re-usability cos the sidebar and the top bar with and height respectively affect it
       *todo for reuse a new constructor has to be created with the offsetWidth and Height reduced by 250 and 40px respectively
       *
       * @param xOffset
       * @param yOffset
       */
      Bee.Barbecue.modernTip = function ()
      {
         //document.body.appendChild(mTip);

         let haveModernTip = Bd.getElementsByAttribute("data-modernToolTip");
         let haveMTip = Bd.getElementsByAttribute("data-tip");

         if (Bu.defined(haveMTip[0]))
         {
            haveModernTip = haveModernTip.concat(haveMTip);
         }

         Bu.forEach(haveModernTip, function (node, i)
         {
            let tooltip = Bd.createEl("div", { className : "mTip" },
                                      { display : "none", position : "absolute" });

            if (!Bu.defined(node.parentElement.getElementsByClassName("mTip")[0]))
            {
               node.parentElement.appendChild(tooltip);
            }

         });

         Be.bindOnAll(haveModernTip, "mouseover", function (e)
         {
            let target = e.target;
            //don't insert the el more than once
            let tooltip = target.parentElement.getElementsByClassName("mTip")[0];

            let data       = Bu.defined(target.getAttribute("data-modernToolTip")) ?
                             target.getAttribute("data-modernToolTip").split(",") :
                             target.getAttribute("data-tip").split(","),
                isRelative = Bu.defined(data[3]),
                xOffset    = Bu.defined(data[1]) && Bu.isNumber(data[1]) ? Bu.pInt(data[1]) : 0,
                yOffset    = Bu.defined(data[2]) && Bu.isNumber(data[2]) ? Bu.pInt(data[2]) : 0;

            tooltip.innerHTML = data[0];

            Bd.css(tooltip,
                   {
                      display : "block",
                      left    : `${(target.offsetLeft - target.offsetWidth) + 17 + xOffset}px`,
                      top     : `${(target.offsetTop + target.offsetHeight) + 7 + yOffset}px`,
                   });

            let spaceLeftX = window.innerWidth - (tooltip.getBoundingClientRect().left + tooltip.offsetWidth);
            let spaceLeftY = window.innerHeight - (tooltip.getBoundingClientRect().top + tooltip.offsetHeight);

            if (spaceLeftY < 3)
            {
               tooltip.style.top = "-37px";
               Bd.addClass(tooltip, "up")
            }

            if (spaceLeftX < 3)
            {
               tooltip.style.left = (tooltip.offsetLeft - tooltip.offsetWidth) + "px";
            }
         });

         Be.bindOnAll(haveModernTip, "mouseout", function (e)
         {
            let tooltip = e.target.parentElement.getElementsByClassName("mTip")[0];

            if (tooltip.style.display !== "none")
            {
               Bd.css(tooltip, { display : "none" });
               Bd.removeClass(tooltip, "up");
            }

         });

      };

      /*return{
       'Bee.Barbecue.modernTip' : Bee.Barbecue.modernTip()
       }*/

   })(Bee.Utils, Bee.Array, Bee.Widget);
