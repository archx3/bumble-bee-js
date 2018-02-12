/**
 * Created by arch on 12/29/16.
 */
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Activity Monitor.
 *
 * Fires throttled events when a user interacts with the specified document.
 * This class also exposes the amount of time since the last user event.
 *
 * If you would prefer to get BECOME_ACTIVE and BECOME_IDLE events when the
 * user changes states, then you should use the IdleTimer class instead.
 *
 */
var Barge = Bee || {};

// Bee.provide('Bee.ActivityMonitor');
//
// Bee.require('Bee.array');
// Bee.require('Bee.asserts');
// Bee.require('Bee.dom');
// Bee.require('Bee.events.EventHandler');
// Bee.require('Bee.events.EventTarget');
// Bee.require('Bee.events.EventType');

/**
 * Once initialized with a document, the activity monitor can be queried for
 * the current idle time.
 *
 * @param {Barge.Widget.DomHelper|Array<Barge.Dom.DomHelper>=} opt_domHelper
 *     DomHelper which contains the document(s) to listen to.  If null, the
 *     default document is usedinstead.
 * @param {boolean=} opt_useBubble Whether to use the bubble phase to listen for
 *     events. By default listens on the capture phase so that it won't miss
 *     events that get stopPropagation/cancelBubble'd. However, this can cause
 *     problems in IE8 if the page loads multiple scripts that include the
 *     closure event handling code.
 *
 * @constructor
 * @extends {Barge.events.EventTarget}
 */

Bee.ActivityMonitor = function (opt_domHelper, opt_useBubble)
{
   Bee.events.EventTarget.call(this);

   /**
    * Array of documents that are being listened to.
    * @type {Array<Document>}
    * @private
    */
   this._documents = [];

   /**
    * Whether to use the bubble phase to listen for events.
    * @type {boolean}
    * @private
    */
   this._useBubble = opt_useBubble;

   /**
    * The event handler.
    * @type {Barge.events.EventHandler<!Barge.ActivityMonitor>}
    * @private
    */
   this.eventHandler_ = new Bee.events.EventHandler(this);

   /**
    * Whether the current window is an iframe.
    * TODO(user): Move to Bee.dom.
    * @type {boolean}
    * @private
    */
   this._isIframe = window.parent !== window;

   if (!opt_domHelper)
   {
      this.addDocument(Bee.Widget.getDomHelper().getDocument());
   }
   else if (Bee.Utils.isArray(opt_domHelper))
   {
      for (var i = 0; i < opt_domHelper.length; i++)
      {
         this.addDocument(opt_domHelper[i].getDocument());
      }
   }
   else
   {
      this.addDocument(opt_domHelper.getDocument());
   }

   /**
    * The time (in milliseconds) of the last user event.
    * @type {number}
    * @private
    */
   this._lastEventTime = Bee.Utils.now();

};
Bee.inherits(Bee.ActivityMonitor, Bee.events.EventTarget);
Bee.tagUnsealableClass(Bee.ActivityMonitor);

/**
 * The last event type that was detected.
 * @type {string}
 * @private
 */
Bee.ActivityMonitor.prototype._lastEventType = '';

/**
 * The mouse x-position after the last user event.
 * @type {number}
 * @private
 */
Bee.ActivityMonitor.prototype._lastMouseX;

/**
 * The mouse y-position after the last user event.
 * @type {number}
 * @private
 */
Bee.ActivityMonitor.prototype._lastMouseY;

/**
 * The earliest time that another throttled ACTIVITY event will be dispatched
 * @type {number}
 * @private
 */
Bee.ActivityMonitor.prototype._minEventTime = 0;

/**
 * Minimum amount of time in ms between throttled ACTIVITY events
 * @type {number}
 */
Bee.ActivityMonitor.MIN_EVENT_SPACING = 3 * 1000;

/**
 * If a user executes one of these events, s/he is considered not idle.
 * @type {Array<Barge.events.EventType>}
 * @private
 */
Bee.ActivityMonitor.userEventTypesBody_ = [
   Bee.events.EventType.CLICK, Bee.events.EventType.DBLCLICK,
   Bee.events.EventType.MOUSEDOWN, Bee.events.EventType.MOUSEMOVE,
   Bee.events.EventType.MOUSEUP
];

/**
 * If a user executes one of these events, s/he is considered not idle.
 * Note: monitoring touch events within iframe cause problems in iOS.
 * @type {Array<Barge.events.EventType>}
 * @private
 */
Bee.ActivityMonitor.userTouchEventTypesBody_ = [
   Bee.events.EventType.TOUCHEND, Bee.events.EventType.TOUCHMOVE,
   Bee.events.EventType.TOUCHSTART
];

/**
 * If a user executes one of these events, s/he is considered not idle.
 * @type {Array<Barge.events.EventType>}
 * @private
 */
Bee.ActivityMonitor.userEventTypesDocuments_ =
   [Bee.events.EventType.KEYDOWN, Bee.events.EventType.KEYUP];

/**
 * Event constants for the activity monitor.
 * @enum {string}
 */
Bee.ActivityMonitor.Event = {
   /** Event fired when the user does something interactive */
   ACTIVITY : 'activity'
};

/** @override */
Bee.ActivityMonitor.prototype.disposeInternal = function ()
{
   Bee.ActivityMonitor.superClass_.disposeInternal.call(this);
   this.eventHandler_.dispose();
   this.eventHandler_ = null;
   delete this._documents;
};

/**
 * Adds a document to those being monitored by this class.
 *
 * @param {Document} doc Document to monitor.
 */
Bee.ActivityMonitor.prototype.addDocument = function (doc)
{
   if (Bee.array.contains(this._documents, doc))
   {
      return;
   }
   this._documents.push(doc);
   var useCapture = !this._useBubble;

   var eventsToListenTo = Bee.array.concat(
      Bee.ActivityMonitor.userEventTypesDocuments_,
      Bee.ActivityMonitor.userEventTypesBody_);

   if (!this._isIframe)
   {
      // Monitoring touch events in iframe causes problems interacting with text
      // fields in iOS (input text, textarea, contenteditable, select/copy/paste),
      // so just ignore these events.
      // This shouldn't matter much given that a touchstart event followed by touchend event produces a click event,
      // which is being monitored correctly.
      Bee.array.extend(
         eventsToListenTo, Bee.ActivityMonitor.userTouchEventTypesBody_);
   }

   this.eventHandler_.listen(
      doc, eventsToListenTo, this.handleEvent_, useCapture);
};

/**
 * Removes a document from those being monitored by this class.
 *
 * @param {Document} doc Document to monitor.
 */
Bee.ActivityMonitor.prototype.removeDocument = function (doc)
{
   if (this.isDisposed())
   {
      return;
   }
   Bee.array.remove(this._documents, doc);
   var useCapture = !this._useBubble;

   var eventsToUnlistenTo = Bee.array.concat(
      Bee.ActivityMonitor.userEventTypesDocuments_,
      Bee.ActivityMonitor.userEventTypesBody_);

   if (!this._isIframe)
   {
      // See note above about monitoring touch events in iframe.
      Bee.array.extend(
         eventsToUnlistenTo, Bee.ActivityMonitor.userTouchEventTypesBody_);
   }

   this.eventHandler_.unlisten(doc, eventsToUnlistenTo, this.handleEvent_, useCapture);
};

/**
 * Updates the last event time when a user action occurs.
 * @param {Barge.events.BrowserEvent} e Event object.
 * @private
 */
Bee.ActivityMonitor.prototype.handleEvent_ = function (e)
{
   var update = false;
   switch (e.type)
   {
      case Bee.events.EventType.MOUSEMOVE:
         // In FF 1.5, we get spurious mouseover and mouseout events when the UI
         // redraws. We only want to update the idle time if the mouse has moved.
         if (typeof this._lastMouseX === 'number' &&
             this._lastMouseX !== e.clientX ||
             typeof this._lastMouseY === 'number' &&
             this._lastMouseY !== e.clientY)
         {
            update = true;
         }
         this._lastMouseX = e.clientX;
         this._lastMouseY = e.clientY;
         break;
      default:
         update = true;
   }

   if (update)
   {
      var type = Bee.asserts.assertString(e.type);
      this.updateIdleTime(Bee.Utils.now(), type);
   }
};

/**
 * Updates the last event time to be the present time, useful for non-DOM
 * events that should update idle time.
 */
Bee.ActivityMonitor.prototype.resetTimer = function ()
{
   this.updateIdleTime(Bee.Utils.now(), 'manual');
};

/**
 * Updates the idle time and fires an event if time has elapsed since
 * the last update.
 * @param {number} eventTime Time (in MS) of the event that cleared the idle
 *     timer.
 * @param {string} eventType Type of the event, used only for debugging.
 * @protected
 */
Bee.ActivityMonitor.prototype.updateIdleTime = function (eventTime, eventType)
{
   // update internal state noting whether the user was idle
   this._lastEventTime = eventTime;
   this._lastEventType = eventType;

   // dispatch event
   if (eventTime > this._minEventTime)
   {
      this.dispatchEvent(Bee.ActivityMonitor.Event.ACTIVITY);
      this._minEventTime = eventTime + Bee.ActivityMonitor.MIN_EVENT_SPACING;
   }
};

/**
 * Returns the amount of time the user has been idle.
 * @param {number=} opt_now The current time can optionally be passed in for the
 *     computation to avoid an extra Date allocation.
 * @return {number} The amount of time in ms that the user has been idle.
 */
Bee.ActivityMonitor.prototype.getIdleTime = function (opt_now)
{
   var now = opt_now || Bee.Utils.now();
   return now - this._lastEventTime;
};

/**
 * Returns the type of the last user event.
 * @return {string} event type.
 */
Bee.ActivityMonitor.prototype.getLastEventType = function ()
{
   return this._lastEventType;
};

/**
 * Returns the time of the last event
 * @return {number} last event time.
 */
Bee.ActivityMonitor.prototype.getLastEventTime = function ()
{
   return this._lastEventTime;
};
