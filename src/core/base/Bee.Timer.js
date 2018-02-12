/**
 * @Author Created by Arch on 26/04/2017.
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
 * @fileOverview contains instruction[code] for creating and manging a Timer
 * with pause and resume, restart ans stop capability, can be ;
 * MUST NOT be confused with a generator function
 * @Version 1.3.0
 * @Version 1.3.7
 * @requires {@link window.document}
 */

/**
 * @namespace
 * @type {{}}
 */

(function (/*Bu, Bs, Bo, Bd*/)
{
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
    * @Note: Currently supports timeout only
    *        Starts automatically
    *
    *
    * @since
    * @param callback {fn}
    * @param delay {Number} [milliseconds]
    * the timeout delay or interval delay
    * @param autoStart {Boolean}
    * @param type {String} [timeout|interval]
    * @constructor
    */
   Bee.Timer = function (callback, delay, type = "timeout", autoStart = true)
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

      this.autoStart = autoStart;
      //this.play = function () {};

      this.states = {
        started : false,
        playing : false,
        paused : false,
        stopped : false,
      };

      this.init();
   };

   Bee.Timer.prototype.init = function ()
   {
      if(this.type === "timeout")
      {
         /**
          * @type {Date}
          * @private
          */
         this.startTime = new Date();
      }

      if(this.autoStart)
      {
         /**
          * AUTO START THE TIMER
          */
         this.play();
      }
   };

   Bee.Timer.prototype.getRemaining = function ()
   {
      return this.remaining -= new Date() - this.startTime;
   };

   Bee.Timer.prototype.getElapsed = function ()
   {
      return this.remaining -= Math.abs(this.startTime - new Date());
   };

   /**
    * starts the timer
    * and can be used to resume a paused timer
    */
   Bee.Timer.prototype.play = function ()
   {
      if(this.states.playing !== true )
      {
         this.stop();

         if(this.type === "timeout")
         {
            this.timerId = setTimeout(this.callback, this.remaining);
         }
         else
         {
            this.timerId = setInterval(this.callback, this.delay);
         }
         this.states.stopped = false;
         this.states.paused = false;
      }
   };

   /**
    * pauses the timer
    */
   Bee.Timer.prototype.pause = function ()
   {
      if(!this.states.paused)
      {
         this.stop();

         if(this.type === "timeout")
         {
            this.remaining -= new Date() - this.startTime;
         }

         this.states.paused = true;
         this.states.playing = false;
      }
   };

   /**
    *
    */
   Bee.Timer.prototype.stop = function ()
   {
      if(!this.states.stopped)
      {
         if(this.type === "timeout")
         {
            window.clearTimeout(this.timerId);
         }
         else
         {
            window.clearInterval(this.timerId);
         }
         this.states.stopped = true;
         this.states.playing = false;
      }
   };

   /**
    * Alias for {@see Barge.Timer.stop}
    * Goes beyond stopping to destroying
    * and setting the instance up for garbage collection
    * @type {*}
    */
   Bee.Timer.prototype.clear = function ()
   {
      this.stop();
      this.destroy();
   };

   /**
    * restarts the timing
    */
   Bee.Timer.prototype.restart = function ()
   {
      this.stop();
      this.play();
   };

   /**
    * Alias for {@see Barge.Timer.restart}
    * @type {*}
    */
   Bee.Timer.prototype.reset = Bee.Timer.prototype.restart;

   /**
    * resumes a paused timer
    * works jus like the play method
    * @type {*}
    */
   Bee.Timer.prototype.start = Bee.Timer.prototype.play;

   /**
    * Alias for {@see Barge.Timer.play}
    * resumes a paused timer
    * works jus like the play method
    * @type {*}
    */
   Bee.Timer.prototype.resume = Bee.Timer.prototype.play;

   /**
    * Nullifies all properties
    * and sets them up for garbage collection
    * @Destructor
    */
   Bee.Timer.prototype.destroy = function ()
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

   Bee.Timer.TimerManager = function ()
   {
      this.timers = [];
   };
   
   //we're going public :-) lol
   return Timer = Bee.Timer;
})(/*Bee.Utils, Bee.String, Bee.Object, Bee.Widget*/);

//TODO reveal other methods by returning an object
//TODO make the params after callback properties of an options object

