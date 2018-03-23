/**
 *
 * @Author       Created by ${USER} on 29/06/17 using ${DATE}.
 * @Time         : 00:19
 * @Copyright (C) 2018
 * @version 2.3.5
 * Barge Studios Inc, The $ Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence MIT
 *
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *       \____/
 *      ( -_- )
 *     (   ___)
 *     ( _____)
 *     (_____)
 *
 * @fileOverview contains instruction[code] for creating a static helper class for managing events
 *
 * @requires {@link }
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Bee.Event'] = factory(global));
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
      global['Bee.Event'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(global)
{
   "use strict";

   //region protected globals
   //let's do this just once and speed up our stuff :-)
   //init time branching
   let addEve;
   addEve = (function (evtType, handler)
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
   //endregion


   /**
    * Utility class to help resolve cross browser issues
    * @class
    */
   class Event {
      /**
       * resolving the event to IE or W3C event object
       * @param e {Event}
       * @return {Event}
       * @static
       */
      static getEvent (e)
      {
         return window.event ? window.event : e;
      }

      /**
       * resolving the event target to IE or W3C event object target
       * @param e {Event}
       * @return {* | Event<target>}
       * @static
       */
      static getEventTarget (e)
      {
         /**
          * resolve event first
          * @type {Event}
          */
         const evt = Event.getEvent(e);

         return (evt.target) ? evt.target : evt.srcElement;
      }

      /**
       * old ie events must be dealt with specially
       * they're jst nt regular, lol
       * @param evtType
       * @param handler
       */
      static ieEvent (evtType, handler)
      {
         if (window.attachEvent) //thanks to DHTML CookBook for this
         {
            addEve = el.attachEvent("on" + evtType, handler);
         }
      }

      /**
       * Returns a prefixed event name for the current browser.
       * @param {string} eventName The name of the event.
       * @return {string} The prefixed event name.
       * @suppress {missingRequire|missingProvide}
       * @static
       */
      static getVendorPrefixedName(eventName)
      {
         return Bee.userAgent.WEBKIT ? 'webkit' + eventName :
                (Bee.userAgent.OPERA ? 'o' + eventName.toLowerCase() :
                 eventName.toLowerCase());
      }
   }

   //going public whoop! whoop! lol
   /**
    * Adding the event class to the Bee Namespace
    * @type {{EventManager : fn}}
    */
   Bee.Event = Event;
});