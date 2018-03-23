/**
 * @Author Created by Arch on 26/04/2017.
 * @Copyright (C) 2017
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence MIT
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
 * @fileOverview contains instruction[code] for creating and manging a Timer
 * with pause and resume, restart ans stop capability, can be ;
 * MUST NOT be confused with a generator function
 * @Version 1.3.0
 * @Version 1.3.7
 *
 */
(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Bee.Timer'] = factory(global));
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
      global['Bee.Timer'] = factory(global);
   }
})( this, function factory(global)
{
   "use strict";

   //region protected globals
   //let Bu  = Bee.Utils,
   //    Ba  = Bee.Array,
   //    Boa = Bee.ObservableArray;

   //endregion

   class Timer {
      //region class properties

      //endregion
      /**
       * @example
       * {@code
       *    let timer = new Bee.Timer(function ()
       *    {
       *       alert("Done!");
       *    }, 1000);
       *    timer.pause();
       *    // Do some stuff...
       *    timer.play();
       *}
       * @Note: Starts automatically
       *
       *
       * @param callback {fn|Array<fn>}
       * @param delay {Number} [milliseconds]
       * the timeout delay or interval delay
       * @param autoStart {Boolean}
       * @param type {String} [timeout|interval]
       * @constructor
       */
      constructor(callback, delay, type = "timeout", autoStart = true)
      {
         /**
          *
          * @type {String}
          */
         this.type = type;
         /**
          * @type {null|Object}
          * @private
          */
         this.timerId = null;
         /**
          * @type {Null|Date}
          * @private
          */
         this.startTime = null;
         /**
          *
          * @type {Number}
          */
         this.delay = delay;
         /**
          *
          * @type {Number}
          * @private
          */
         this.remaining = delay;
         /**
          *
          * @type {fn}
          */
         this.callback = callback;

         /**
          *
          * @type {Boolean}
          */
         this.autoStart = autoStart;

         /**
          *
          * @type {{started : boolean, playing : boolean, paused : boolean, stopped : boolean}}
          */
         this.states = {
            started : false,
            playing : false,
            paused  : false,
            stopped : false,
         };

         /**
          * Alias for {@see Bee.Timer.restart}
          * @type {*}
          */
         this.reset = this.restart;

         /**
          * resumes a paused timer
          * works just like the play method
          * @type {*}
          */
         this.start = this.play;

         /**
          * Alias for {@see Bee.Timer.play}
          * resumes a paused timer
          * works jus like the play method
          * @type {*}
          */
         this.resume = this.play;

         this.init();

      }

      //region methods
      init()
      {
         if (this.type === "timeout")
         {
            /**
             * @type {Date}
             * @private
             */
            this.startTime = new Date();
         }

         if (this.autoStart)
         {
            /**
             * AUTO START THE TIMER
             */
            this.play();
         }
      };

      getRemaining()
      {
         return this.remaining -= new Date() - this.startTime;
      };

      getElapsed()
      {
         return this.remaining -= Math.abs(this.startTime - new Date());
      };

      /**
       * starts the timer
       * and can be used to resume a paused timer
       */
      play()
      {
         let self = this;
         if (this.states.playing !== true)
         {
            this.stop();

            if (this.type === "timeout")
            {
               this.timerId = setTimeout(function (data)
                                         {
                                            self.callback(data);
                                         }, self.remaining);
            }
            else
            {
               this.timerId = setInterval(function (data)
                                          {
                                             self.callback(data);
                                          }, self.remaining);
            }
            this.states.stopped = false;
            this.states.paused = false;
         }
      };

      /**
       * pauses the timer
       * If it's a timeout the current time is saved and reused on resumption
       * In case of intervals the interval is just cleared
       */
      pause()
      {
         if (!this.states.paused)
         {
            this.stop();

            if (this.type === "timeout")
            {
               //calc the number of number seconds left of assigned number of second
               this.remaining -= new Date() - this.startTime;
            }

            this.states.paused = true;
            this.states.playing = false;
         }
      };

      /**
       * Halts the timer and prevents the timer from executing the callback function bound to it
       * If it's a timeout the current time is saved and reused on resumption
       * THE interval OR timeout is just cleared and the state of the timer at the timerId set to stopped
       */
      stop()
      {
         if (!(this.states.stopped))
         {
            if (this.type === "timeout")
            {
               clearTimeout(this.timerId);
            }
            else
            {
               clearInterval(this.timerId);
            }
            this.states.stopped = true;
            this.states.playing = false;
         }
      };

      /**
       * Alias for {@see Bee.Timer.stop}
       * Goes beyond stopping to destroying
       * and setting the instance up for garbage collection
       * @type {*}
       */
      clear()
      {
         this.stop();
         this.destroy();
      };

      /**
       * restarts the timing
       */
      restart()
      {
         this.stop();
         this.play();
      };

      /**
       * Nullifies all properties
       * and sets them up for garbage collection
       * @Destructor
       */
      destroy()
      {
         this.timerId = null;
         this.startTime = null;
         this.delay = null;
         this.remaining = null;
         this.callback = null;

         this.pause = null;
         this.play = null;
         this.stop = null;
         this.resume = null;
         this.restart = null;
         this.reset = null;
         //this.constructor = null;
      };

      //endregion
   }

   //going public whoop! whoop! lol
   return  Timer;
});

//let Timer  = require("Timer");
//let timer = new Timer(function(){
//   console.log("time is, ", this);
//}, 3000);

//TODO reveal other methods by returning an object
//TODO make the params after callback properties of an options object
//TODO In future look into swapping a timer b/n an interval and a timeout at runtime

