/**
 * @Author Created by arch on 10/05/17.
 * Time: 14:03
 * @Copyright (C) 2017
 * Barge Studios Inc, The $ Authors
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
 *    @fileOverview contains instruction[code] for creating ToolWindow Balloon and a toasts or message balloons $
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.BubblyBalloon'] = factory(global));
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
      global['Barge.BubblyBalloon'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let Bu = Bee.Utils,
       Ba = Bee.Array,
       Bo = Bee.Object,
       Bs = Bee.String,
       Bd = Bee.Widget;

   let Be = new Bee.Event.EventManager();
   //endregion

   /**
    *
    * @constructor
    */
   function BubblyBalloon(options)
   {  //balloonPosition tr|br |bl|tl

      // default vals | configurable
      this.options = {

         dragToClose : true,

         balloonSpace    : 40, //balloonSpacingInterval
         _maxBalloonCount   : 4,
         _maxTWBalloonCount : 6,

         balloonPosition : "br",

         //closeableOnSlide : true
      };

      if(Bu.defined(options))
      {
         this.options = Bu.extend(this.options, options);
      }

      this.balloons = [];
      this.balloonCount = 0;

      this.twBalloons = [];
      this.twBalloonCount = 0;


      this.balloonTimers = {};
      this.twBalloonTimers = {};

      this.timerUID = 0;
   }

   /**
    *
    * @param options {{message : String, autoClose : Boolean, icon : String}}
    */
   BubblyBalloon.prototype.balloon = function (options)
   {
      options['type'] = "balloon";

      if(this.getBalloonCount("balloon") >= this.options._maxBalloonCount)
      {
         this.pauseAllTimers(options);

         options["balloonEl"] = this.getFirstBalloon("balloon");
         this.dismiss(options);
         this.render(options);

         this.resumeAllTimers(options);

      }
      else
      {
         this.render(options);
      }
   };

   BubblyBalloon.prototype.toolWindowBalloon = function (options)
   {
      this.render(options);
   };

   BubblyBalloon.prototype.addCloseButton = function (options, balloonDiv)
   {
      let self = this,
          closeBtn = Bd.createEl("button", { className : "closeBtn", innerHTML : "&times;" });

      Be.bind(closeBtn, "click", function ()
      {
         self.pauseAllTimers(options);
         if(balloonDiv.hasAttribute("data-tid"))
         {
            Bo.remove(self.balloonTimers, balloonDiv.getAttribute("data-tid"));
         }

         self.dismiss(options);

         self.resumeAllTimers(options);
      });
      balloonDiv.appendChild(closeBtn);
   };

   /**
    * Pass the balloon cr8tn process through this pip
    * @param options {{type : String, message : String, autoClose : Boolean,  delay : Number, icon : String, onDismiss : fn}}
    */
   BubblyBalloon.prototype.render = function (options)
   {
      let self = this;
      if(options.type === "balloon")
      {

         let balloonDiv = Bd.createEl("div", {className : "balloon"}),
             lastBalloonHeight = Bu.defined(this.getLastBalloon("balloon")) ? this.getLastBalloon("balloon").offsetHeight : null,
             balloonCount = this.getBalloonCount("balloon")  ;

         let baseHeight = lastBalloonHeight !== null ? (lastBalloonHeight > 100 ? 140 : 100) : 100,
             i          = this.balloonCount >= 0 ? ++this.balloonCount : this.balloonCount = 1,
             nextPosition = (baseHeight * (i - 1)) + (this.options.balloonSpace * i); //MSG magic formula

         Bd.css(balloonDiv, { bottom : nextPosition + "px" });
         balloonDiv.setAttribute("data-id", (this.balloonCount).toString());
         options["balloonEl"] = balloonDiv;

         let balMsg = Bd.createEl("div", {className : "balMsg"});

         this.addCloseButton(options, balloonDiv);

         let balP = Bd.createEl("p", {innerHTML : options.message});


         balMsg.appendChild(balP);
         balloonDiv.appendChild(balMsg);

         this.balloons.push(balloonDiv);

         if(options.autoClose === true)
         {
            options["balloonEl"] = balloonDiv;
            this.makeAutoClosable(options);
         }

         if(self.options.dragToClose === true)
         {
            this.makeClosableOnSlide(options);
         }

         Bd.appendToWindow(balloonDiv);
      }
   };

   BubblyBalloon.prototype.getBalloonCount = function (type)
   {
      if(type === "balloon")
      {
         return this.balloons.length;
      }
   };

   BubblyBalloon.prototype.getMaxBalloonCount = function (type)
   {
      if(type === "balloon")
      {
         return this._maxBalloonCount;
      }
   };

   BubblyBalloon.prototype.getLastBalloon = function (type)
   {
      if(type === "balloon")
      {
         return this.balloons[this.balloons.length- 1];
      }
   };

   BubblyBalloon.prototype.getFirstBalloon = function (type)
   {
      if(type === "balloon")
      {
         return this.balloons[0];
      }
   };

   /**
    *
    * @param options {{type : String, balloonEl : Element, message : String, autoClose : Boolean,  delay : Number, icon : String,
    *    onDismiss : fn}}
    */
   BubblyBalloon.prototype.makeAutoClosable = function (options)
   {
      let self = this,
      tid = "tid" + this.timerUID++,
      delay = options.delay || 5000;

      options.balloonEl.setAttribute("data-tid", tid);

      //console.log(timer);
      this.balloonTimers[tid] = new Bee.Timer(function ()
                                                {
                                                   Bo.remove(self.balloonTimers, tid);
                                                   self.dismiss(options);
                                                }, delay);

      //let timerId = this.timerUID++
   };

   /**
    *
    * @param options {{type : String, message : String, balloonDiv : Element, autoClose : Boolean,  delay : Number, icon : String, onDismiss : fn}}
    */
   BubblyBalloon.prototype.makeClosableOnSlide = function (options)
   {
      let _this = this;
      /**
       * @augments Barge.BubblyBalloon
       * @param el {Element}
       * @param dragOptions {{prevDef : Boolean, tolerance : Number }}
       * @constructor
       */
      function DraggableToast (el, dragOptions = {})
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
            var mouseDownX = event.clientX;

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

            if (event.target == el)
            {
               document.addEventListener("mouseup", dropMe, false);
               document.addEventListener("mousemove", dragMe, false);


            }
         };
         el.addEventListener("mousedown", move, false);
      }

      let drg = new DraggableToast(options.balloonEl, {
         prevDef : false,
         tolerance : 200 });
   };



   BubblyBalloon.prototype.handleBalloonClose = function (balloonEl)
   {let self = this;
      --this.balloonCount;
      //var balloons = document.querySelectorAll(".balloon");
      let balloonId = Bu.pInt(balloonEl.getAttribute("data-id"));

      Ba.forEach(this.balloons, function (balloon, i)
      {
         let IthBalloonId = Bu.pInt(balloon.getAttribute("data-id"));

         if (IthBalloonId > balloonId)
         {
            let cr = balloon.getBoundingClientRect();

            //MSG magic reduction formula (options.balloonSpace - (options.balSpace/4)) cr8s an offset
            let nextPosition = cr.height + (self.options.balloonSpace );

            Bd.css(balloon, {bottom: (Bu.getStyleValue("bottom",balloon) - nextPosition) + "px"});
            balloon.setAttribute("data-id", IthBalloonId - 1);

         }
      });
   };

   /**
    *
    * @param options {{balloonEl : Element, type : String, onDismiss : fn}}
    */
   BubblyBalloon.prototype.dismiss = function (options)
   {
      if(options.type === "balloon")
      {  //do what happens if a balloon is closed
         this.handleBalloonClose(options.balloonEl);

         let index =  this.balloons.indexOf(options.balloonEl);

         Bd.closeWin(options.balloonEl, true);
         Ba.removeAt(this.balloons, index);
      }
      else
      {
         //take care of tw  dismissal
      }

      //call the callback fn if it's provided
      if(Bu.defined(options.onDismiss) && Bu.isFunction(options.onDismiss))
      {
         options.onDismiss();
      }
   };

   /**
    *
    * @param options {{balloonEl : Element, type : String, onDismiss : fn}}
    */
   BubblyBalloon.prototype.dismissAll = function (options)
   {
      let self = this;
      if(options.type === "balloon")
      {
         this.pauseAllTimers(options);
         Ba.forEach(this.balloons, function (balloon, i)
         {
            self.dismiss(balloon);
         });
      }
   };

   BubblyBalloon.prototype.pauseAllTimers = function (options)
   {
      if(options.type === "balloon")
      {
         if(!Bo.isEmpty(this.balloonTimers))
         {
            Bo.forEach(this.balloonTimers, function (balloonTimer)
            {
               balloonTimer.pause();
            });
         }
      }
   };

   BubblyBalloon.prototype.resumeAllTimers = function (options)
   {
      if(options.type === "balloon")
      {
         if(!Bo.isEmpty(this.balloonTimers))
         {
            Bo.forEach(this.balloonTimers, function (balloonTimer)
            {
               balloonTimer.resume();
            });
         }
      }
   };


   BubblyBalloon.prototype.twb = BubblyBalloon.toolWindowBalloon;


   let Balloonies = new BubblyBalloon();

   Bee.BubblyBalloon = {
   /**
    *
    * @param options {{type : String, message : String, autoClose : Boolean,  delay : Number, icon : String, onDismiss : fn}}
    */
     balloon : function (options)
     {
        Balloonies.balloon(options);
     },
     toolWindowBalloon : function (options)
     {
        Balloonies.toolWindowBalloon(options);
     }
   };

   //going public whoop! whoop! lol
   return Bee.BubblyBalloon;
});