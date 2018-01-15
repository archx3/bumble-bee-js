/**
 * @Author       Created by arch on 01/07/17 using PhpStorm.
 * @Time         : 06:23
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
 * @fileOverview Vanilla Javascript timepicker that allows setting of minTime and maxTime
 *
 *  View below code for a list of available methods
 *
 *  Developer: Lance Jernigan
 *  Version: 1.0.4
 *
 * @requires
 */

/*
 *  Setup our arguments to pass to our timepicker
 *
 *  @args - format (boolean) - Whether to format the input value or leave in 24 hour
 *          minTime (string) - Minimum time the timepicker should reach (any valid time string Javascript's Date() will accept)
 *          maxTime (string) - Maximum time the timepicker should reach (any valid time string Javascript's Date() will accept)
 *          meridian (boolean) - Whether the timepicker should display the meridian (defaults to true if format is true and false if format is false)
 *          arrowColor (string) - Any valid color (Hex, RGB, RGBA, etc.) to use for the arrows
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.TimePicker'] = factory(global));
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
      global['Barge.TimePicker'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let Bu   = Barge.utils,
       Bd   = Barge.Dom,
       args = {
          // format: true,
          // minTime: '2:00 am',
          // maxTime: '1:00 pm',
          // meridian: false
       };
   //endregion

   /**
    *
    * @param element
    * @param args
    * @constructor
    */
   function Timepicker(element, args)
   {
      this.initialized = false;
      this.element = element ? element : null;
      this.elements = {};
      this.timepicker = null;
      this.time = new Date();
      this.settings = {
         format   : true,
         meridian : true,
         minTime  : new Date(new Date().toDateString() + " 00:00"),
         maxTime  : new Date(new Date().toDateString() + " 24:00"),
         onChange : false,
         twentyFourHour : true
      };
      this.active = false;

      this.init();
   }

   Timepicker.prototype.init = function ()
   {
      if (this.element.length)
      {
         console.warn("Timepicker selector must be for a specific element, not a list of elements.");

         return;
      }

      this.updateSettings(args);
      this.buildTimepicker();
   };

   Timepicker.prototype.updateSettings = function (args)
   {
      args = args || {};

      for (let a = 0; a < Object.keys(args).length; a++)
      {
         let key = Object.keys(args)[a];
         let val = args[Object.keys(args)[a]];

         this.settings[key] = args[Object.keys(args)[a]];
      }

      if (!this.settings.format && Bu.defined(args.meridian))
      {
         this.settings.meridian = false;
      }

      this.settings.meridian = this.settings.format ? true : this.settings.meridian;
      this.settings.minTime = !(this.settings.minTime.getDate !== undefined ||
                                this.settings.minTime.getDate !== null) ?
                              new Date(new Date().toDateString() + " " + this.settings.minTime) :
                              new Date(new Date().toDateString() + " 00:00");

      this.settings.maxTime =
         !(this.settings.maxTime.getDate !== undefined ||
         this.settings.maxTime.getDate !== null) ?
                              new Date(new Date().toDateString() + " " + this.settings.maxTime) :
                              this.settings.maxTime;

      if (this.settings.maxTime.toString() === this.settings.minTime.toString())
      {
         let maxTime = new Date(this.settings.minTime);

         maxTime.setHours(maxTime.getHours() + 24);

         this.settings.maxTime = maxTime;
      }

      if (this.element.value)
      {
         let newTime = new Date(new Date().toDateString() + " " + this.element.value);

         this.time = !isNaN(newTime.getTime()) ? newTime : this.time;
      }

      this.time.setMilliseconds(0);

      if (Object.keys(this.elements).length)
      {
         this.updateTime("minute", true, 0);

         this.render();
      }

      if (!this.validateTime())
      {
         this.time = this.settings.minTime
            ? this.settings.minTime
            : this.settings.maxTime;
      }
   };

   Timepicker.prototype.buildTimepicker = function ()
   {
      let wrapper = Bd.createEl("div", {className : "timepickerwrapper"});
      wrapper.setAttribute("id", "tp_" + (Math.floor(Math.random() * 100) + 1));
      let elements = ["hour", "minute", "meridian"];


      if (!Object.keys(this.elements).length)
      {
         for (let e = 0; e < elements.length; e++)
         {
            this.elements[elements[e]] = document.createElement("div");
            this.elements[elements[e]].className = "timepicker" + elements[e];

            let up = document.createElement("div");
            up.appendChild(document.createElement("div"));
            let display = document.createElement("p");
            let down = document.createElement("div");
            down.appendChild(document.createElement("div"));

            up.className = "timepickerbutton timepickerbuttonup";
            display.className = "display";
            down.className = "timepickerbutton timepickerbuttondown";

            if (this.settings.arrowColor)
            {
               up.childNodes[0].style["border-bottom-color"] = this.settings.arrowColor;
               down.childNodes[0].style["border-top-color"] = this.settings.arrowColor;
            }

            this.elements[elements[e]].appendChild(up);
            this.elements[elements[e]].appendChild(display);
            this.elements[elements[e]].appendChild(down);
         }
      }

      this.timepicker = wrapper;

      this.element.parentNode.insertBefore(wrapper, this.element.nextSibling);

      this.addListeners();

      this.render();
   };

   Timepicker.prototype.render = function ()
   {
      let wrapper = this.cleanWrapper(this.timepicker);

      if (this.settings.meridian)
      {
         wrapper.className = wrapper.className.indexOf(" timepickerwrapper-full") >=
                             0
            ? wrapper.className
            : wrapper.className + " timepickerwrapper-full";
      }

      for (let e = 0; e < Object.keys(this.elements).length; e++)
      {
         let key = Object.keys(this.elements)[e];
         let element = this.elements[key];
         let func = "get" + key.charAt(0).toUpperCase() + key.slice(1);

         element.querySelector(".display").innerText = this[func]();

         if (Object.keys(this.elements)[e] === "meridian" && !this.settings.meridian)
         {
            continue;
         }

         wrapper.appendChild(element);
      }

      this.timepicker = wrapper;

      this.updateInput();
   };

   Timepicker.prototype.cleanWrapper = function (wrapper)
   {
      while (wrapper.hasChildNodes())
      {
         wrapper.removeChild(wrapper.lastChild);
      }

      return wrapper;
   };

   Timepicker.prototype.handleClick = function (e, el)
   {
      let element = el ? e : e.currentTarget;

      let parent = element.parentNode.className.replace("timepicker", "");
      let add = element.className.indexOf("up") !== -1 ? true : false;

      this.updateTime(parent, add);
   };

   Timepicker.prototype.validateInput = function (e)
   {
      let value = e.currentTarget.value;
      let date = value.length
         ? new Date(new Date().toDateString() + " " + value)
         : false;

      if (date && !isNaN(date.getTime()))
      {
         this.time = date;
      }

      if (!this.validateTime())
      {
         let after = date.getTime() > this.settings.maxTime.getTime();
         date = after
            ? new Date(this.settings.maxTime)
            : new Date(this.settings.minTime);
         after
            ? date.setMinutes(date.getMinutes() - 1)
            : date.setMinutes(date.getMinutes() + 1);

         this.time = date;
      }

      this.render();
   };

   Timepicker.prototype.updateTime = function (method, add, amount)
   {
      amount = amount || 1;

      switch (method)
      {
         case "meridian":
            this.time.getHours() > 12
               ? this.time.setHours(this.time.getHours() - 12)
               : this.time.setHours(this.time.getHours() + 12);

            break;

         default:
            if (add)
            {
               this.add(method, amount);
            }
            else
            {
               this.subtract(method, amount);
            }
      }

      if (!this.validateTime())
      {
         let date = add
            ? new Date(this.settings.minTime)
            : new Date(this.settings.maxTime);
         add
            ? date.setMinutes(date.getMinutes() + 1)
            : date.setMinutes(date.getMinutes() - 1);

         this.time = date;
      }

      this.render();
   };

   Timepicker.prototype.add = function (method, amount)
   {
      amount = amount || 1;

      switch (method)
      {
         case "minute":
            this.time.setMinutes(this.time.getMinutes() + amount);

            break;

         case "hour":
            this.time.setHours(this.time.getHours() + amount);

            break;
      }
   };

   Timepicker.prototype.subtract = function (method, amount)
   {
      amount = amount || 1;

      switch (method)
      {
         case "minute":
            this.time.setMinutes(this.time.getMinutes() - amount);

            break;

         case "hour":
            this.time.setHours(this.time.getHours() - amount);

            break;
      }
   };

   Timepicker.prototype.validateTime = function ()
   {
      if (this.settings.minTime)
      {
         //this.settings.maxTime = this.settings.maxTime;

         this.time.setDate(new Date().getDate());

         return (
            this.time.getTime() < this.settings.maxTime.getTime() &&
            this.time.getTime() > this.settings.minTime.getTime()
         );
      }

      return true;
   };

   Timepicker.prototype.updateInput = function (parent)
   {
      if (this.initialized)
      {
         this.element.value = this.buildString();
      }
   };

   Timepicker.prototype.buildString = function ()
   {
      return (this.getHour() +
              ":" +
              this.getMinute() +
              " " +
              this.getMeridian()).trim();
   };

   Timepicker.prototype.toggleActive = function (e)
   {
      if (e.target === this.element)
      {
         if (!this.initialized)
         {
            this.initialized = true;

            this.updateInput();
         }

         this.updateBounds(this.timepicker, e.target);

         this.active = true;
      }
      else if (
         e.target.className.indexOf("timepicker") === -1 &&
         e.target.parentElement.className.indexOf("timepicker") === -1
      )
      {
         this.active = false;
      }

      this.timepicker.className = this.active
         ? this.timepicker.className.indexOf(" timepickerwrapper-active") >= 0
                                     ? this.timepicker.className
                                     : this.timepicker.className + " timepickerwrapper-active"
         : this.timepicker.className.replace(" timepickerwrapper-active", "");
   };

   Timepicker.prototype.updateBounds = function ()
   {
      let bounds = this.element.getBoundingClientRect();

      this.timepicker.style.top =
         this.element.offsetTop + this.element.innerHeight + "px";
      this.timepicker.style.width = bounds.width + "px";
   };

   Timepicker.prototype.addListeners = function ()
   {
      let elements = Object.keys(this.elements),
      self = this;

      for (let e = 0; e < elements.length; e++)
      {
         let element = this.elements[elements[e]];
         let buttons = [].slice.call(element.childNodes).filter(function (node)
                                                                {
                                                                   return node.className.indexOf("button") !== -1;
                                                                });

         for (let c = 0; c < buttons.length; c++)
         {
            let button = buttons[c];

            button.addEventListener("click", this.handleClick.bind(this));

            //let's add continuous update while mouse is held down
            let timer;
            button.addEventListener("mousedown", function (e)
            {
               let _this = this;
               timer = window.setInterval(function ()
                                          {
                                             self.handleClick(_this, true);
                                          }, 300)
            });

            window.addEventListener("mouseup", function (e)
            {
               clearInterval(timer);
            });
         }
      }

      this.element.addEventListener("change", this.validateInput.bind(this));
      document.body.addEventListener("click", this.toggleActive.bind(this));

      window.addEventListener("resize", this.updateBounds.bind(this));
   };

   Timepicker.prototype.getTime = function ()
   {
      return this.time;
   };


   Timepicker.prototype.getHour = function ()
   {
      if (!this.settings.format)
      {
         return this.time.getHours() < 10 ? "0" + this.time.getHours() : this.time.getHours();
      }
      else
      {
         if(this.settings.twentyFourHour === true)
         {
            return this.time.getHours();
         }
         else
         {
            return this.time.getHours() > 12 ? this.time.getHours() % 12 : this.time.getHours() === 0 ? 12 : this.time.getHours();
         }
      }
   };

   Timepicker.prototype.getMinute = function ()
   {
      let minutes = this.time.getMinutes();

      return minutes < 10 ? "0" + minutes : minutes;
   };

   Timepicker.prototype.getMeridian = function ()
   {
      if (!this.settings.meridian)
      {
         return "";
      }
      else
      {
         return this.time.getHours() >= 12 ? "pm" : "am";
      }
   };




   //going public whoop! whoop! lol
   return Barge.TimePicker = Timepicker;
});

/*
 *  Create a new timepicker for our input and pass it our args
 */

//let tpicker = new Barge.TimePicker(document.querySelector("input.timepicker"));



/*
 *  Timepicker Methods
 *
 *  updateSettings()
 *     Update the settings originally passed to your timepicker
 *     @parameters - args (a list of available arguments is provided above the code)
 *
 *
 *  updateTime()
 *     Update the time based on parameters passed
 *     @parameters - method (string) - What method to affect ('hour', 'minute', 'meridian')
 *                   add (boolean) - True to add amount, false to subtract amount
 *                   amount /optional/ (number) - Number to add or subtract from method (defaults to 1)
 *
 *
 *  add()
 *     Add amount to selected method
 *     @parameters - method (string) - What method to affect ('hour', 'minute')
 *                   amount /optional/ (number) - Number to add to method (defaults to 1)
 *
 *  subtract()
 *     subtract amount from selected method
 *     @parameters - method (string) - What method to affect ('hour', 'minute')
 *                   amount /optional/ (number) - Number to subtract from method (defaults to 1)
 *
 *  buildString()
 *     Returns the string that will be sent to the input
 *
 *  getTime()
 *     Returns the date object for the current selected time
 *
 *  getHour()
 *     Returns the current hour for the timepicker
 *
 *  getMinute()
 *
 *     Returns the current Minute for the timepicker
 *  getMeridian()
 *
 *     Returns the current Meridian for the timepicker
 *
 *  get
 */
//tpicker.updateSettings({ minTime : "2:00 am" });
