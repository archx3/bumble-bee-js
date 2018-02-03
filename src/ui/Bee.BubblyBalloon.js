/**
 * Created by ARCH on 02/07/2016.
 * Copyright (C) 2016 Barge Studios <bargestd@gmail.com>
 */

var Bee = Bee || {};

(function (Bu, Bd)
{
   var balloonCount = 0;
   var tWBalloonCount = 0;

   var options = {
          dragToClose : true,
          balSpace    : 40 //balloonSpacingInterval
       },

       gsv     = Bu.getStyleValue;

   Bee.BubblyBalloon =
   {
      //region configurable
      /**
       * @private
       */
      _maxBalloonCount   : 4, // default val | configurable
      /**
       * @private
       */
      _maxTWBalloonCount : 6, // default val | configurable

      /**
       * @private
       */
      _balloons : [],

      /**
       * @private
       */
      _firstBalloon : null,

      /**
       * @private
       */
      _lastBalloon : null,
      //endregion
      addBalloon   : function (bal)
      {
         this._balloons.push(bal);
      },

      removeLastBalloon : function ()
      {
         return this._balloons.pop();
      },

      getMaxBalloonCount : function ()
      {
         return this._maxBalloonCount;
      },

      getMaxTWBalloonCount : function ()
      {
         return this._maxTWBalloonCount;
      },

      setMaxBalloonCount : function (newMaxCount)
      {
         this._maxBalloonCount = newMaxCount;
      },

      setMaxTWBalloonCount : function (newMaxCount)
      {
         this._maxTWBalloonCount = newMaxCount;
      },

      /**
       *
       * @return {Array<i>} {@link Barge.BubblyBalloon._balloons}
       */
      getFirstBalloon : function ()
      {
         return this._firstBalloon;
      },

      /**
       *
       * @param bal
       * @public
       */
      setFirstBalloon : function (bal)
      {
         this._firstBalloon = bal;
      },

      getLastBalloon : function ()
      {
         return this._lastBalloon;
      },

      /**
       *
       * @param bal
       * @public
       */
      setLastBalloon : function (bal)
      {
         this._lastBalloon = bal;
      },

      /**
       *
       * @return {Array}
       * @public
       */
      getBalloons : function ()
      {
         return this._balloons;
      },

      /**
       *
       * @param balls {Array | HTMLCollection}
       * @public
       */
      setBalloons : function (balls)
      {
         this._balloons = balls;
      },

      /**
       *
       * @param message
       * @param sticky
       * @private
       */
      _makeTWBalloon : function (message, sticky)
      {
         if (tWBalloonCount >= this._maxTWBalloonCount)
         {
            var balloons = document.querySelectorAll(".toolWindowBalloon");
            for (var b = 0; b < balloons.length; b++)
            {
               var originalTop = Bu.getStyleValue(balloons[b].style.top);
               balloons[b].style.top = originalTop - 30 + "px";

               var newCount = parseInt(balloons[b].getAttribute("data-count")) - 1;
               balloons[b].setAttribute("data-count", newCount.toString());
            }
            Bu.closeWin(Bu.qs(".toolWindowBalloon"), true, true);
            --tWBalloonCount;
         }
         /*if(!Bu.gebi("balloonStyle"))
          {
          var balloonCss = document.createElement("style");
          balloonCss.innerHTML = bubblyBallCss;
          balloonCss.id = "balloonStyle";
          document.head.appendChild(balloonCss);
          }*/
         document.body.appendChild(_renderToolWindowBalloon(message, sticky))
      },

      /**
       *
       * @param message
       * @param sticky
       * @param heading
       * @param icon
       * @param delay
       * @private
       */
      _makeBalloon : function (message, sticky, heading, icon, delay)
      {

         var windowEl = Bu.qs(".balloon");

         if (balloonCount >= this._maxBalloonCount)
         {
            _closeOutBalloon(windowEl);
         }

         var lastBal = _renderBalloon(message, sticky, heading, icon, delay);
         // this.addBalloon(lastBal);
         this.setLastBalloon(lastBal);

         //console.log(this.getLastBalloon());

         document.body.appendChild(lastBal);

         //this._balloons.push(lastBal);
         if (options.dragToClose == true)
         {
            this._makeCloseableByDrag(lastBal);
         }
      },

      toolWindowBalloon       : function (message)
      {
         this._makeTWBalloon(message, true);
      },
      stickyToolWindowBalloon : function (message)
      {
         this._makeTWBalloon(message, false);
      },

      stickyBalloon : function (message, heading, icon)
      {
         /*if(!Bu.gebi("balloonStyle"))
          {
          var balloonCss = document.createElement("style");
          balloonCss.innerHTML = bubblyBallCss;
          balloonCss.id = "balloonStyle";
          document.head.appendChild(balloonCss);
          }*/
         this._makeBalloon(message, false, heading, icon)
      },

      balloon : function (message, heading, icon, delay)
      {
         this._makeBalloon(message, true, heading, icon, delay)
      },

      _makeCloseableByDrag : function (bal)
      {
         /**
          * @augments Barge.BubblyBalloon
          * @param el {Element}
          * @param dragOptions {{prevDef : Boolean, tolerance : Number }}
          * @constructor
          */
         var DraggableToast = function (el, dragOptions = {})
         {
            var self = this;
            this.dragOptions = {};

            Bu.extend(this.dragOptions, dragOptions); //self.toBeMoved = null;

            self.toBeMoved = el;
            Bd.addClass(self.toBeMoved, "draggable"); //Bd.css(self.toBeMoved, {});

            var defaultPos = {
               left : self.toBeMoved.offsetLeft,
               //top  : self.toBeMoved.offsetTop
            };

            var move = function (event)
            {  // don't bubble this event - mousedown
               event.stopPropagation();

               var originalLeft = parseInt(Bd.getCss(self.toBeMoved, 'left'));

               if (event.target == el)
               {
                  var mouseDownX = event.clientX;

                  document.addEventListener("mouseup", dropMe, false);
                  document.addEventListener("mousemove", dragMe, false);

                  function dragMe(event)
                  {
                     event.preventDefault();

                     if (event.clientX > defaultPos.left)
                     {
                        self.toBeMoved.style.left = originalLeft + event.clientX - mouseDownX + "px";
                     }
                  }

                  function dropMe(event)
                  {
                     if (Bu.defined(dragOptions.tolerance))
                     {
                        var dXPos = event.clientX - defaultPos.left;

                        if (dXPos < (dragOptions.tolerance))
                        {
                           self.toBeMoved.style.left = defaultPos.left + "px";
                        }
                        else
                        {
                           var closeBtn = self.toBeMoved.getElementsByClassName('closeBtn')[0];
                           self.toBeMoved.style.left = (window.innerWidth + 50) + "px";
                           closeBtn.click();
                        }
                     }

                     document.removeEventListener("mousemove", dragMe, false);
                     document.removeEventListener("mouseup", dropMe, false);
                  }
               }
            };
            el.addEventListener("mousedown", move, false);
         };

         var drg = new DraggableToast(bal, { prevDef : false, tolerance : 200 });
      },

      closeAllBalloons()
      {
         var balls = Bu.qsa(".balloon");

         if (Bu.defined(balls))
         {
            Bu.forEach(balls, function (node)
            {
               var closeBtn = node.getElementsByClassName('closeBtn')[0];
               closeBtn.click();
            });
         }
      }

   };

   var Bb = Bee.BubblyBalloon;

   function _renderCloseBtn()
   {
      //var balloonCloseBtn = document.createElement("button");
      //balloonCloseBtn.className = "closeBtn";
      //balloonCloseBtn.innerHTML = "&times;";

      return Bu.createEl('button', { className : "closeBtn", innerHTML : "&times;" });
   }

   /**
    *
    * @param message {string}
    * @param autoClose {boolean}
    * @returns {Element}
    * @private
    */
   function _renderToolWindowBalloon(message, autoClose)
   {
      //console.log(tWBalloonCount);
      var windowBalloonDiv = null;

      windowBalloonDiv = Bu.createEl('div',
                                     { className : "toolWindowBalloon" },
                                     { top : tWBalloonCount++ * 30 + "px" });
      /*
       windowBalloonDiv.className = "toolWindowBalloon";
       windowBalloonDiv.style.top = tWBalloonCount++ * 35  +  "px";*/
      windowBalloonDiv.setAttribute("data-count", tWBalloonCount.toString());

      //var msgP = document.createElement("p");
      //msgP.innerHTML = message;

      var msgP = Bd.createEl('p', { innerHTML : message });

      var balloonCloseBtn = _renderCloseBtn();
      balloonCloseBtn.onclick = function ()
      {
         --tWBalloonCount;
         var balloons = document.querySelectorAll(".toolWindowBalloon");
         for (var i = 0; i < balloons.length; i++)
         {
            if (parseInt(balloons[i].getAttribute("data-count")) > parseInt(this.parentElement.getAttribute("data-count")))
            {
               var originalTop = Bu.getStyleValue(balloons[i].style.top);
               balloons[i].style.top = originalTop - 30 + "px";
               var newCount = parseInt(balloons[i].getAttribute("data-count")) - 1;
               balloons[i].setAttribute("data-count", newCount.toString());
            }
         }
         Bu.closeWin(this.parentElement, true, true);
         if (balloons.length == 1)
         {
            Bu.closeWin(Bu.gebi("balloonStyle"), true, true)
         }
         //todo for style element removal
      };

      if (autoClose)
      {
         var timingFn = setTimeout(function ()
                                   {
                                      --tWBalloonCount;
                                      var balloons = document.querySelectorAll(".toolWindowBalloon");
                                      for (var i = 0; i < balloons.length; i++)
                                      {
                                         if (parseInt(balloons[i].getAttribute("data-count")) > parseInt(windowBalloonDiv.getAttribute("data-count")))
                                         {
                                            var originalBottom = Bu.getStyleValue(balloons[i].style.bottom);
                                            balloons[i].style.bottom = originalBottom - 19 + "%";
                                            console.log(balloons[i].getAttribute("data-count"));
                                            // if (parseInt(balloons[i].getAttribute("data-count")) > 1)
                                            // {
                                            var newCount = parseInt(balloons[i].getAttribute("data-count")) - 1;
                                            balloons[i].setAttribute("data-count", newCount.toString());
                                            //}
                                         }
                                      }
                                      Bu.closeWin(windowBalloonDiv, true, true);
                                      if (balloons.length == 1)
                                      {
                                         Bu.closeWin(Bu.gebi("balloonStyle"), true, true)
                                      }
                                      clearTimeout(timingFn);
                                   }, 5000);//clearTimeout(timingFn);
      }

      windowBalloonDiv.appendChild(msgP);
      windowBalloonDiv.appendChild(balloonCloseBtn);

      windowBalloonDiv.classList.add("tada");
      return windowBalloonDiv;
   }

//todo refactor code to make use of this function again [DONE]

   function _renderBalloonHead(heading, icon)
   {
      if (heading)
      {
         var lod = "light";
         var msgHead = document.createElement("h5");
         if (icon == "warning" || icon == "alert")
         {
            if (lod != undefined && lod == "dark")
            {
               msgHead.innerHTML = "<span class='msgIcon' style='color: #fff;'>&#xE814;</span>" + heading.toString();
            }
            else
            {

               msgHead.innerHTML = "<i class='fa  fa-warning fw' style='color: #f00;'></i>  " + heading.toString();
            }
         }
         else if (icon == "info")
         {
            msgHead.innerHTML = "<i class='fa fa-info-circle fw' style='color: #00a5ff;'></i>  " + heading.toString();
         }
         else if (icon == "question")
         {
            msgHead.innerHTML = "<span class='msgIcon msgIconQues' style='color: #ffc600; background-color: rgba(255, 253, 209, 1);border-color: #ffc600'>&#xE11B;</span>" + heading.toString();
         }
         else if (icon == "ok" || icon == "success")
         {
            msgHead.innerHTML = "<i class='fa fa-check-circle fw' style='color: #04e704; background-color: #e8ffe7'></i>  " + heading.toString();
         }
         else if (icon == "failure")
         {
            msgHead.innerHTML = "<i class='fa fa-times-circle fw' style='color: #f00;'></i>  " + heading.toString();
         }
         else if (icon == "delete")
         {
            msgHead.innerHTML = "<i class='fa fa-trash fw' style='color: #f00;'></i>  " + heading.toString();
         }
         else
         {
            msgHead.innerHTML = heading.toString();
         }
      }
      return msgHead;
   }

   function _closeOutBalloon(balloonDiv)
   {
      --balloonCount;
      var balloons = document.querySelectorAll(".balloon");
      for (var i = 0; i < balloons.length; i++)
      {
         if (parseInt(balloons[i].getAttribute("data-count")) > parseInt(balloonDiv.getAttribute("data-count")))
         {
            var originalBottom = Bu.getStyleValue(balloons[i].style.bottom);

            //msg msgic reduction formula (options.balSpace - (options.balSpace/4)) cr8s an offset
            var nextPosition = balloons[i].offsetHeight + (options.balSpace );

            //console.log(balloons[i].offsetHeight + 30);
            //console.log("originalBottom", originalBottom);

            balloons[i].style.bottom = originalBottom - nextPosition + "px";

            //balloons[i].style.bottom = originalBottom - 19 + "%";
            var newCount = Bu.pInt(balloons[i].getAttribute("data-count")) - 1;
            balloons[i].setAttribute("data-count", newCount.toString());

         }
      }
      Bu.closeWin(balloonDiv, true, true);
      /*if (balloons.length == 1)
       {
       Bu.closeWin(Bu.gebi("balloonStyle"), true, true)
       }*/

      Bb.removeLastBalloon();
      var balls = Bb.getBalloons();
      Bb.setLastBalloon(balls[balls.length - 1]);
      //Bb._balloons.pop();

      //console.log(Bb.getLastBalloon());

   }

   function _renderBalloon(message, autoClose, heading, icon, delay)
   {
      var balloonDiv        = Bu.createEl('div', { className : "balloon" }),
          lastBalloonHeight = Bu.defined(Bb.getLastBalloon()) ?
                              Bb.getLastBalloon().offsetHeight : null;

      var baseHeight = lastBalloonHeight !== null ? (lastBalloonHeight > 100 ? 140 : 100) : 100,
          i          = balloonCount >= 0 ? ++balloonCount : balloonCount = 1,
          nextPosition = (baseHeight * (i - 1)) + (options.balSpace * i); //msg magic formula

      Bu.css(balloonDiv, { bottom : nextPosition + "px" }); //++balloonCount * 19 + "%"; IMHERE old method

      balloonDiv.setAttribute("data-count", (balloonCount).toString());

      var balloonCloseBtn = Bu.createEl('button', { className : "closeBtn", innerHTML : "&times;" }),
          timingFn;

      balloonCloseBtn.addEventListener("click", function ()
      {
         clearTimeout(timingFn);
         _closeOutBalloon(balloonDiv);
      });

      if (autoClose)
      {
         delay = delay || 5000;
         if (delay < 20 && delay > 0)
         {
            delay *= 1000;
         }
         timingFn = setTimeout(function ()
                               {
                                  clearTimeout(timingFn);
                                  _closeOutBalloon(balloonDiv);
                               }, delay);//clearTimeout(timingFn);
      }

      var msgP = Bu.createEl('p', { innerHTML : message });

      balloonDiv.appendChild(balloonCloseBtn);
      balloonDiv.appendChild(_renderBalloonHead(heading, icon));
      balloonDiv.appendChild(msgP);

      balloonDiv.classList.add("tada");
      return balloonDiv;
   }

   function _renderBalloonN(message, options = { autoClose : true, heading : '', icon : '', delay : 5000 })
   {
      var balloonDiv        = Bu.createEl('div', { className : "balloon" }),

          lastBalloonHeight = Bu.defined(Bee.BubblyBalloon.getLastBalloon()) ?
                              Bee.BubblyBalloon.getLastBalloon().offsetHeight : null;

      var baseHeight   = lastBalloonHeight !== null ? (lastBalloonHeight > 100 ? 140 : 100) : 100,

          i            = ++balloonCount,

          nextPosition = (baseHeight * (i - 1)) + (40 * i); //msg *** magic formula ***

      Bu.css(balloonDiv, { bottom : nextPosition + "px" }); //++balloonCount * 19 + "%"; IMHERE old method

      balloonDiv.setAttribute("data-count", (balloonCount).toString());

      var balloonCloseBtn = _renderCloseBtn();

      balloonCloseBtn.addEventListener("click", function ()
      {
         _closeOutBalloon(balloonDiv);
         clearTimeout(timingFn);
      });

      if (options.autoClose)
      {
         options.delay = options.delay || 5000;
         if (options.delay < 20 && options.delay > 0)
         {
            options.delay *= 1000;
         }

         var timingFn = setTimeout(function ()
                                   {
                                      _closeOutBalloon(balloonDiv);
                                      clearTimeout(timingFn);
                                   }, options.delay);//clearTimeout(timingFn);
      }

      var msgP = Bu.createEl('p', { innerHTML : message });

      balloonDiv.appendChild(balloonCloseBtn);
      balloonDiv.appendChild(_renderBalloonHead(options.heading, options.icon));
      balloonDiv.appendChild(msgP);

      balloonDiv.classList.add("tada");
      return balloonDiv;
   }

   window.TWB = Bee.BubblyBalloon.toolWindowBalloon;
   //window.BB = Bee.BubblyBalloon.ligtoolWindowBalloon;
})(Bee.utils, Bee.Dom);

/*TODO : Add Icon support for more informativeness
 * TODO : Add Link or action button and handler control support*/
//TODO : fix sliding after auto close
//TODO : add the time the message was sent [mk it an option in the param list]
//TODO : externalise css to make appearance more customisable by others

/*REGION MAX CLOSE CODE
 * var balloons = document.querySelectorAll(".balloon");
 for (var b = 0; b < balloons.length; b++)
 {
 var originalBottom = Bu.getStyleValue(balloons[b].style.bottom);
 balloons[b].style.bottom = originalBottom - 19 +"%";

 var newCount = parseInt(balloons[b].getAttribute("data-count")) - 1;
 balloons[b].setAttribute("data-count", newCount.toString());
 }
 Bu.closeWin(windowEl,true, true);
 --balloonCount;
 ENDREGION */
/**@CHANGE_LOG
 * 06/11/16 : ADDED ICON support
 */

/*DEPRECATED
 * //region bubblyBallCss
 var bubblyBallCss = ".toolWindowBalloon{z-index:49;width: 100%;height: 30px;position: absolute;background-color: #feffc1; top: 0;transition: all .3s ease; box-shadow: 0 2px 6px rgba(46, 50, 61, 0.36);}"+
 ".toolWindowBalloon p{margin: 0;text-align:left;display:inline-block;font-size:18px;font-weight: normal;margin-left: 20px;line-height: 1.5;}"+
 ".closeBtn{height: 24px;width: 24px;border: 0;float:right;background: transparent;font-size: 20px;cursor: pointer;opacity: .5;}"+
 ".closeBtn:hover{opacity:1; box-shadow:none;}"+
 ".balloon{z-index:48;font-weight: 400;min-width: 200px;max-width: 350px;max-height: 150px;min-height: 100px;position: absolute;background-color: #fff;bottom: 40%;right: 12px;padding: 15px;height: auto;width:auto;border-radius: 2px;border: 2px solid #0078df;opacity: 1;transition: all .3s ease;box-shadow: 0 2px 6px rgba(46, 50, 61, 0.36);}"+
 '.balloon::before, .balloon::after{content: "";position: absolute;width: 0;height: 0;border-style: solid;border-color:transparent;}'+
 ".balloon::before{bottom: 75px;left: -33px;border-top-color: #0078df;border-right-color: #0078df;border-bottom-width: 20px;"+ "border-right-width:30px; border-top-width: 3px;}"+
 ".balloon::after{bottom: 76px;left: -27px;border-top-color: #fff; border-right-color: #fff; border-bottom-width: 17px;border-right-width: 25px;}"+
 ".balloon .closeBtn{min-height: 24px;max-height: 24px;min-width: 24px;max-width: 24px;padding:0;margin-right: 0;float:right;font-size: 20px;cursor: pointer;top: -14px;position: absolute;right: -11px;border: 2px solid #0078df;border-radius: 50%;line-height: 1px;background: #fff;opacity: 1;vertical-align: middle;text-align: center;color: rgba(0, 0, 0, .5);}"+
 ".balloon:hover:not(.closeBtn){opacity: .6;}" +
 ".balloon .closeBtn:hover{opacity: 1;color: rgba(0, 0, 0, 1);}" +
 ".balloon .msgIcon { font-family: 'segoe mdl2 Assets', sans-serif; vertical-align: middle; font-size: 20px; margin-right: 12px; width: auto; height: auto; border-radius: 50%;";
 //endregion
 * */