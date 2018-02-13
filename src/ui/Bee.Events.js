/**
 * Created by ARCH on 25/08/2016.
 * @Copyright (C) 2016
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
 * @fileOverview Static and constructor methods for managing events
 * for keyboard specific events {@see Barge.Keyboard}
 * @user MSG: Some lines in this file use constructs from es6 or later
 * @requires {@link Barge.Utils}
 * @requires {@link Barge.Array}
 * @requires {@link Barge.Object} NIU atm
 *
 * @version 1.8
 */
/**
 * @namespace
 * @type {{}}
 */
var Bee = Bee || {}; //Declaring the Bee Namespace

(function (Bu, Ba, Bo) // don't litter the global scope
{
   'use strict';

   /**
    * Adding the event class to the Bee Namespace
    * @type {{EventManager : fn}}
    */
   Bee.Event = Bee.Event || {};

   /**
    * resolving the event to IE or W3C event object
    * @param e {Event}
    * @return {Event}
    * @static
    */
   Bee.Event.getEvent = function (e)
   {
      return window.event ? window.event : e
   };

   /**
    * resolving the event target to IE or W3C event object target
    * @param e {Event}
    * @return {* | Event<target>}
    * @static
    */
   Bee.Event.getEventTarget = function (e)
   {
      /**
       *
       * @type {Event}
       */
      const evt = Bee.Event.getEvent(e);

      return (evt.target) ? evt.target : evt.srcElement;
   };

   /**
    * An object that has an element and an object
    * containing events for the element
    * @param element {Element}
    * @constructor
    */
   Bee.Event.EventElement = function (element)
   {
      /**
       * @type {Element}
       */
      this.element = element;
      /**
       *
       * @type {{}}
       */
      this.events = {};
   };

   //old ie event must be dealt with specially, lol
   //they're jst nt regular
   let ieEvent = function (evtType, handler)
   {
      if (window.attachEvent) //thanks to DHTML CookBook for this fix
      {
         addEve = el.attachEvent("on" + evtType, handler);
      }
   };

   //let's do this just once and speed up our stuff :-)
   //init time branching
   let addEve = (function (evtType, handler)
   {
      if (window.addEventListener)
      {
         addEve = window.addEventListener;
      }
      else if (window.attachEvent)
      {
         // Handle old IE implementation
         addEve = window.attachEvent;
      }
   }());

   /**
    *
    * @param el
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventElement.prototype.addEvent = function (el, evtType, handler, useCapture)
   {
      useCapture = useCapture || false;
      if (el)
      {
         if (el.addEventListener)
         {
            el.addEventListener(evtType, handler, useCapture);

            // Handle old IE implementation
         }
         else if (el.attachEvent) //thanks to DHTML CookBook for this fix
         {

            el.attachEvent("on" + evtType, handler);
         }
      }

   };

   //

   /**
    *
    * @param el
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventElement.prototype.removeEvent = function (el, evtType, handler, useCapture = false)
   {
      //MSG uncomment the line below for backward compatibility
      //useCapture = useCapture || false;

      if (el.removeEventListener)
      {
         el.removeEventListener(evtType, handler, useCapture);

         // Handle old IE implementation
      }
      else if (el.detachEvent) //thanks to DHTML CookBook
      {

         el.detachEvent("on" + evtType, handler);
      }
      else
      {
         // for IE/Mac, NN4, and older
         el["on" + evtType] = null;
      }

   };

   /**
    *
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventElement.prototype.bind = function (evtType, handler, useCapture = false)
   {
      if (!Bu.defined(this.events[evtType]))
      {
         this.events[evtType] = [];
      }

      this.events[evtType].push(handler);

      this.addEvent(this.element, evtType, handler, useCapture);
      //this.element.addEventListener(evtType, handler, false);
   };

   /**
    * @use unbinds an event in {@link Barge.Event.EventElement.events} from an elements
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventElement.prototype.unbind = function (evtType, handler, useCapture = false)
   {
      /**
       *
       * @type {any|Boolean}
       */
      const handlerProvided = (Bu.defined(handler));

      if (evtType in this.events)
      {
         this.events[evtType] = this.events[evtType].filter(function (hdlr)
                                                            {
                                                               if (handlerProvided && hdlr !== handler)
                                                               {
                                                                  return true;
                                                               }

                                                               this.removeEvent(this.element, evtType, hdlr, useCapture);
                                                               //this.element.removeEventListener(evtType, hdlr, false);
                                                               return false;

                                                            }, this);
      }
   };

   /**
    *@use unbinds all events in {@link Barge.Event.EventElement.events} from their elements
    */
   Bee.Event.EventElement.prototype.unbindAll = function ()
   {
      for (let name in this.events)
      {
         this.unbind(name);
      }
   };

   /**
    * @use instantiates an eventManager Object from the constructor
    * @example var ev = new Bee.Event.EventManager();
    * @example ev.bind(el, 'click', fn);
    *
    * @constructor
    */
   Bee.Event.EventManager = function ()
   {
      /**
       * All els with bound Events that we are managing
       * @type {Array}
       */
      this.EventElements = [];

   };

   /**
    * @use resolves IE and w3C browser incompatibility for event object
    * @param e {Event}
    * @return {Event}
    */
   Bee.Event.EventManager.prototype.getEvent = function (e)
   {
      return Bee.Event.getEvent(e);
   };

   /**
    * @use resolves IE and w3C browser incompatibility for {@link event.target}
    * @param e
    * @return {* | Event<target>}
    */
   Bee.Event.EventManager.prototype.getEventTarget = function (e)
   {
      /**
       *
       * @type {Event}
       */
      const evt = this.getEvent(e);

      return Bee.Event.getEventTarget(evt);
   };
   /**
    *
    * @param element
    * @param eventCount
    * @returns {{evEl: *, eventCount: (*|null)}}
    * @constructor
    */
   Bee.Event.EventManager.prototype.EventElement = function (element, eventCount)
   {
      let eventElement = this.EventElements.filter(function (EventElement)
                                                   {
                                                      /**
                                                       * @returns {Boolean}
                                                       */
                                                      return Bee.Event.EventElement.element === element;

                                                   })[0];

      if (!Bu.defined(eventElement))
      {
         //instantiating EventElement(element)
         eventElement = new Bee.Event.EventElement(element);

         //add this el to the els whose event we are managing
         this.EventElements.push(eventElement);
      }

      return {
         evEl       : eventElement,
         eventCount : eventCount || null
      };
   };

   /**
    * @use Attaches en event to an el
    * @param element {Element}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture Boolean
    */
   Bee.Event.EventManager.prototype.bind = function (element, evtType, handler, useCapture = false)
   {
      this.EventElement(element).evEl.bind(evtType, handler, useCapture);
   };

   /**
    * @use Attaches en event to an el simulating long or click and hold down
    * @param element {Element|Array<Element>}
    * @param handler {Function}
    * @param duration {Number}
    * @param once {Boolean}
    * @param useCapture {Boolean}
    * @Warning No side effects
    */
   Bee.Event.EventManager.prototype.longClick = function (element, handler, duration = 600, once = false, useCapture = false)
   {
      let timer = null;

      if (Bu.isArrayLike(element))
      {
         if (once)
         {
            this.bindOnceOnAll(element, 'mousedown', function (e)
            {
               timer = setTimeout(function ()
                                  {
                                     clearTimeout(timer);
                                     handler();
                                  }, duration);
            }, useCapture);
            this.bindOnceOnAll(element, 'mouseup', function (e)
            {
               clearTimeout(timer);
            }, useCapture);
         }
         else
         {
            this.bindOnAll(element, 'mousedown', function (e)
            {
               timer = setTimeout(function ()
                                  {
                                     clearTimeout(timer);
                                     handler();
                                  }, duration);
            }, useCapture);
            this.bindOnAll(element, 'mouseup', function (e)
            {
               clearTimeout(timer);
            }, useCapture);
         }

      }
      else
      {
         if (once)
         {
            this.bindOnce(element, 'mousedown', function (e)
            {
               timer = setTimeout(function ()
                                  {
                                     clearTimeout(timer);
                                     handler();
                                  }, duration);
            }, useCapture);

            this.bindOnce(element, 'mouseup', function (e)
            {
               clearTimeout(timer);
            }, useCapture);
         }
         else
         {
            this.bind(element, 'mousedown', function (e)
            {
               timer = setTimeout(function ()
                                  {
                                     clearTimeout(timer);
                                     handler();
                                  }, duration);
            }, useCapture);

            this.bind(element, 'mouseup', function (e)
            {
               clearTimeout(timer);
            }, useCapture);
         }
      }
   };

   /**
    * @use Attaches en event to an array or list of  els
    * @param elsArr {Array<Element> | NodeList}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventManager.prototype.bindOnAll = function (elsArr, evtType, handler, useCapture = false)
   {

      if (Bu.isArray(elsArr) || Bu.isArrayLike(elsArr))
      {
         const self = this;
         Ba.forEach(elsArr, function (node) //crazy but works, Thanks Jehovah!
         {
            self.bind(node, evtType, handler, useCapture);
         });
      }

   };

   /**
    * @use removes en event from an el
    * @param element {Element}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventManager.prototype.unbind = function (element, evtType, handler, useCapture = false)
   {
      this.EventElement(element).evEl.unbind(evtType, handler, useCapture);
   };

   /**
    * @use removes en event from an array or list of els
    * @param element {Array<Element>}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventManager.prototype.unbindOnAll = function (element, evtType, handler, useCapture = false)
   {
      var self = this;
      Ba.forEach(element, function (node) //crazy but works, Thanks Jehovah!
      {
         self.unbind(node, evtType, handler, useCapture);
      });

      /*for(var i = 0, len = element.length; i < len; i++)
       {this.unbind(element[i], evtType, handler);}*/
   };

   /**
    * @use Removes all events from from the event Object {@link Barge.Event.EventManager.EventElement}
    */
   Bee.Event.EventManager.prototype.unbindAll = function ()
   {
      for (var i = 0; i < this.EventElements.length; i++)
      {
         this.EventElements[i].unbindAll();
      }
   };

   /**
    * @use Attaches en event to an el and removes it after the handler has executed once
    * This can be made to use bindXTimes() but that will require an extra param
    * and also we are making it native to maintain integrity as the inspiration for x times
    * @param element {Element}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventManager.prototype.bindOnce = function (element, evtType, handler, useCapture = false)
   {
      /**
       * event Element
       * @type {*|Element}
       */
      var ee = this.EventElement(element).evEl;

      /**
       * executes event handler and removes events from el
       * @param e {Event | String}
       */
      var onceHandler = function (e)
      {
         handler(e);
         ee.unbind(evtType, onceHandler, useCapture);
      };

      ee.bind(evtType, onceHandler, useCapture);
   };

   /**
    * @use Attaches en event to an array or a list of els and removes it after their handler has executed once
    * MSG #01 makes this bind to {@code window} so use {@link Barge.Event.getEventTarget} to get target instead
    * MSG which is a lil fool proof
    * @param elsArr {Array<Element> | NodeList | HTMLElement[] | HTMLCollection}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventManager.prototype.bindOnceOnAll = function (elsArr, evtType, handler, useCapture = false)
   {
      if (Bu.isArray(elsArr) || Bu.isArrayLike(elsArr))
      {
         /**
          * workaround for wrong this binding
          * @type {Barge.Event.EventManager}
          */
         var self = this;
         Ba.forEach(elsArr, function (node) //crazy but works, Thanks Jehovah!
         {
            //issue #01
            //MSG a workaround for this is to get the el thru the e.target
            self.bindOnce(node, evtType, handler, useCapture);
         });
      }
   };

   /**
    * @use Attaches en event to an el and removes it after the handler has executed a numberOfTimes
    * same as {@see Barge.Event.EventManager.prototype.bindNTimes}
    * @param element {Element}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param numberOfTimes {Number}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventManager.prototype.bindXTimes = function (element, evtType, handler, numberOfTimes = 1, useCapture = false)
   {
      /**
       * event Element
       * @type {*|Element}
       */
      var ee = this.EventElement(element).evEl,
          ec = this.EventElement(element).eventCount || 0;
      /**
       * executes event handler and removes events from el
       * @param e {Event | String}
       */
      var xTimesHandler = function (e)
      {
         ec++;
         if (ec === numberOfTimes)
         {
            ee.unbind(evtType, xTimesHandler, useCapture);
         }
         /*console.log('numberOfTimes', numberOfTimes);console.log('ec', ec);*/
         handler(e);
      };

      ee.bind(evtType, xTimesHandler, useCapture);
   };

   /**
    * @use Attaches en event to an array or a list of els and
    * removes it after their handler has executed a numberOfTimes
    * same as {@see Barge.Event.EventManager.prototype.bindNTimesOnAll}
    * MSG #01 makes this bind to {@code window} so use {@link Barge.Event.getEventTarget}
    * to get target instead
    * MSG which is a lil fool proof
    * @param elsArr {Array<Element> | NodeList | HTMLElement[] | HTMLCollection}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param numberOfTimes {Number}
    * @param useCapture {Boolean}
    */
   Bee.Event.EventManager.prototype.bindXTimesOnAll = function (elsArr, evtType, handler, numberOfTimes = 1, useCapture = false)
   { //fixme use of default param values may have to be changed for backward compatibility

      if (Bu.isArray(elsArr) || Bu.isArrayLike(elsArr))
      {
         if (Bu.isNumber(numberOfTimes) && numberOfTimes > 0)
         {
            var self = this;
            Ba.forEach(elsArr, function (node) //crazy but works, Thanks Jehovah!
            {
               //issue #01
               //MSG a workaround for this is to get the el thru the e.target
               self.bindXTimes(node, evtType, handler, numberOfTimes, useCapture);
            });
         }
      }
   };

   /**
    * same as {@see Barge.Event.EventManager.prototype.bindXTimes}
    * @type {Barge.Event.EventManager | any}
    */
   Bee.Event.EventManager.prototype.bindNTimes = Bee.Event.EventManager.prototype.bindXTimes;

   /**
    * same as {@see Barge.Event.EventManager.prototype.bindXTimesOnAll}
    * MSG xTimes only, before but nTimes seems more intuitive
    * @type {Barge.Event.EventManager | any}
    */
   Bee.Event.EventManager.prototype.bindNTimesOnAll = Bee.Event.EventManager.prototype.bindXTimesOnAll;

   /***********************************************************************************************/

})(Bee.Utils, Bee.Array, Bee.Object);

/**
 *
 * TODO Add Touch Support by resolving {mousedown to touchstart} and {mouseup to touchend}
 * msg for this the userAgent.platform has to be tested first
 * msg to determine if it's a mobile device with touch support or not
 * TODO Make useCapture dynamic DONE
 * MSG NB: click simulates both mouse - down | up and touch - start | end tho
 * Fixme issue #02 {@link e.preventDefault()} seems not to work [DONE] depends on node type
 * Fixme issue #03 {@link e.stopPropagation()} too may not be working
 * TODO Implement the number of times feature for all
 * MSG (cud be used to implement calling the event handler like say every three times)
 * */

/**
 *@change log
 *
 * @since V 1.8: No more support for browsers that don't have either addEventListener() or attacheEvent()
 *               Init time branching used to resolve browser differences
 * */