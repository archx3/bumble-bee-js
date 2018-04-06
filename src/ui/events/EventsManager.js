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
//var Bee = Bee || {}; //Declaring the Bee Namespace

(function (Bu, Ba, Bo) // don't litter the global scope
{
   'use strict';

   /**
    * An object that has an element and an object
    * containing events for the element
    * @param element {Element}
    * @constructor
    */
   function EventElement(element)
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
   }



   /**
    *
    * @param el
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   EventElement.prototype.addEvent = function (el, evtType, handler, useCapture)
   {
      useCapture = useCapture || false;
      if (el)
      {
         if (el.addEventListener)
         {
            el.addEventListener(evtType, handler, useCapture);

            // Handle old IE implementation
         }
         else if (el.attachEvent)
         {
            el.attachEvent("on" + evtType, handler);
         }
      }

   };

   /**
    *
    * @param el
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   EventElement.prototype.removeEvent = function (el, evtType, handler, useCapture = false)
   {
      //MSG uncomment the line below for backward compatibility
      //useCapture = useCapture || false;

      if (el.removeEventListener)
      {
         el.removeEventListener(evtType, handler, useCapture);

         // Handle old IE implementation
      }
      else if (el.detachEvent)
      {
         el.detachEvent("on" + evtType, handler);
      }
      else
      {  // for IE/Mac, NN4, and older
         el["on" + evtType] = null;
      }

   };

   /**
    *
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   EventElement.prototype.bind = function (evtType, handler, useCapture = false)
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
    * @use unbinds an event in {@link EventElement.events} from an elements
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   EventElement.prototype.unbind = function (evtType, handler, useCapture = false)
   {
      /**
       *
       * @type {any|Boolean}
       */
      const handlerProvided = (Bu.defined(handler));

      if (evtType in this.events)
      {
         this.events[evtType] = this.events[evtType].filter(function (hndlr)
                                                            {
                                                               if (handlerProvided && hndlr !== handler)
                                                               {
                                                                  return true;
                                                               }

                                                               this.removeEvent(this.element, evtType, hndlr, useCapture);
                                                               //this.element.removeEventListener(evtType, hndlr, false);
                                                               return false;

                                                            }, this);
      }
   };

   /**
    *@use unbinds all events in {@link EventElement.events} from their elements
    */
   EventElement.prototype.unbindAll = function ()
   {
      for (let name in this.events)
      {
         this.unbind(name);
      }
   };

   /**
    * @use instantiates an eventManager Object from the constructor
    * @example var ev = new EventManager();
    * @example ev.bind(el, 'click', fn);
    *
    * @constructor
    */
   function EventManager()
   {
      /**
       * All els with bound Events that we are managing
       * @type {Array}
       */
      this.eventElements = [];

   }

   /**
    * @use resolves IE and w3C browser incompatibility for event object
    * @param e {Event}
    * @return {Event}
    */
   EventManager.prototype.getEvent = function (e)
   {
      return Event.getEvent(e);
   };

   /**
    * @use resolves IE and w3C browser incompatibility for {@link event.target}
    * @param e
    * @return {* | Event<target>}
    */
   EventManager.prototype.getEventTarget = function (e)
   {
      /**
       *
       * @type {Event}
       */
      const evt = this.getEvent(e);

      return Event.getEventTarget(evt);
   };
   /**
    *
    * @param element
    * @param eventCount
    * @returns {{evEl: *, eventCount: (*|null)}}
    * @constructor
    */
   EventManager.prototype.eventElement = function (element, eventCount)
   {
      let eventElement = this.eventElements.filter(function (eventElement)
                                                   {
                                                      /**
                                                       * @returns {Boolean}
                                                       */
                                                      return eventElement.element === element;

                                                   })[0];

      if (!Bu.defined(eventElement))
      {
         //instantiating eventElement(element)
         eventElement = new EventElement(element);

         //add this el to the els whose event we are managing
         this.eventElements.push(eventElement);
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
   EventManager.prototype.bind = function (element, evtType, handler, useCapture = false)
   {
      this.eventElement(element).evEl.bind(evtType, handler, useCapture);
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
   EventManager.prototype.longClick = function (element, handler, duration = 600, once = false, useCapture = false)
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
   EventManager.prototype.bindOnAll = function (elsArr, evtType, handler, useCapture = false)
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
   EventManager.prototype.unbind = function (element, evtType, handler, useCapture = false)
   {
      this.eventElement(element)
          .evEl //get the evEl prop from the element if it exists in the event elements array
          .unbind(evtType, handler, useCapture);
   };

   /**
    * @use removes en event from an array or list of els
    * @param element {Array<Element>}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param useCapture {Boolean}
    */
   EventManager.prototype.unbindOnAll = function (element, evtType, handler, useCapture = false)
   {
      const self = this;
      Ba.forEach(element, function (node) //crazy but works, Thanks Jehovah!
      {
         self.unbind(node, evtType, handler, useCapture);
      });

      /*for(var i = 0, len = element.length; i < len; i++)
       {this.unbind(element[i], evtType, handler);}*/
   };

   /**
    * @use Removes all events from from the event Object {@link Barge.EventManager.eventElement}
    */
   EventManager.prototype.unbindAll = function ()
   {
      for (let i = 0; i < this.eventElements.length; i++)
      {
         this.eventElements[i].unbindAll();
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
   EventManager.prototype.bindOnce = function (element, evtType, handler, useCapture = false)
   {
      /**
       * event Element
       * @type {*|Element}
       */
      let ee = this.eventElement(element).evEl;

      /**
       * executes event handler and removes events from el
       * @param e {Event | String}
       */
      let onceHandler = function (e)
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
   EventManager.prototype.bindOnceOnAll = function (elsArr, evtType, handler, useCapture = false)
   {
      if (Bu.isArray(elsArr) || Bu.isArrayLike(elsArr))
      {
         /**
          * workaround for wrong this binding
          * @type {Barge.EventManager}
          */
         let self = this;
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
    * same as {@see Barge.EventManager.prototype.bindNTimes}
    * @param element {Element}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param numberOfTimes {Number}
    * @param useCapture {Boolean}
    */
   EventManager.prototype.bindXTimes = function (element, evtType, handler, numberOfTimes = 1, useCapture = false)
   {
      /**
       * event Element
       * @type {*|Element}
       */
      let ee = this.eventElement(element).evEl,
          ec = this.eventElement(element).eventCount || 0;
      /**
       * executes event handler and removes events from el
       * @param e {Event | String}
       */
      let xTimesHandler = function (e)
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
    * same as {@see Barge.EventManager.prototype.bindNTimesOnAll}
    * MSG #01 makes this bind to {@code window} so use {@link Barge.Event.getEventTarget}
    * to get target instead
    * MSG which is a lil fool proof
    * @param elsArr {Array<Element> | NodeList | HTMLElement[] | HTMLCollection}
    * @param evtType {Event | String}
    * @param handler {Function}
    * @param numberOfTimes {Number}
    * @param useCapture {Boolean}
    */
   EventManager.prototype.bindXTimesOnAll = function (elsArr, evtType, handler, numberOfTimes = 1, useCapture = false)
   { //fixme use of default param values may have to be changed for backward compatibility if not transpiled
      let self = this;
      if (Bu.isArray(elsArr) || Bu.isArrayLike(elsArr))
      {
         if (Bu.isNumber(numberOfTimes) && numberOfTimes > 0)
         {

            Ba.forEach(elsArr, function (node) //crazy but works, Thanks Jehovah!
            {
               //issue #01
               //MSG a workaround for this is to get the el thru the e.target
               self.bindXTimes(node, evtType, handler, numberOfTimes, useCapture);
            });
         }
      }
      self = null;
   };

   /**
    * same as {@see Barge.EventManager.prototype.bindXTimes}
    * @type {Barge.EventManager | any}
    */
   EventManager.prototype.bindNTimes = EventManager.prototype.bindXTimes;

   /**
    * same as {@see Barge.EventManager.prototype.bindXTimesOnAll}
    * MSG xTimes only, before but nTimes seems more intuitive
    * @type {Barge.EventManager | any}
    */
   EventManager.prototype.bindNTimesOnAll = EventManager.prototype.bindXTimesOnAll;

   /***********************************************************************************************/




   Bee.Event.EventManager = EventManager;

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