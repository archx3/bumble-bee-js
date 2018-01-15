// Copyright 2005 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview A disposable implementation of a custom
 * listenable/event target. See also: documentation for
 * {@code Barge.events.Listenable}.
 *
 * @author arv@Bargele.com (Erik Arvidsson) [Original implementation]
 * @see ../demos/eventtarget.html
 * @see Barge.events.Listenable
 */

// Barge.provide('Barge.events.EventTarget');
//
// Barge.require('Barge.Disposable');
// // Barge.require('Barge.asserts');
// Barge.require('Barge.events');
// Barge.require('Barge.events.Event');
// Barge.require('Barge.events.Listenable');
// Barge.require('Barge.events.ListenerMap');
// Barge.require('Barge.Object');

/**
 * An implementation of {@code Barge.events.Listenable} with full W3C
 * EventTarget-like support (capture/bubble mechanism, stopping event
 * propagation, preventing default actions).
 *
 * You may subclass this class to turn your class into a Listenable.
 *
 * Unless propagation is stopped, an event dispatched by an
 * EventTarget will bubble to the parent returned by
 * {@code getParentEventTarget}. To set the parent, call
 * {@code setParentEventTarget}. Subclasses that don't support
 * changing the parent can override the setter to throw an error.
 *
 * Example usage:
 * <pre>
 *   var source = new Barge.events.EventTarget();
 *   function handleEvent(e) {
 *     alert('Type: ' + e.type + '; Target: ' + e.target);
 *   }
 *   source.listen('foo', handleEvent);
 *   // Or: Barge.events.listen(source, 'foo', handleEvent);
 *   ...
 *   source.dispatchEvent('foo');  // will call handleEvent
 *   ...
 *   source.unlisten('foo', handleEvent);
 *   // Or: Barge.events.unlisten(source, 'foo', handleEvent);
 * </pre>
 *
 * @constructor
 * @extends {Barge.Disposable}
 * @implements {Barge.events.Listenable}
 */
Barge.events.EventTarget = function ()
{
   // Barge.Disposable.call(this); //IMHERE FIXME

   /**
    * Maps of event type to an array of listeners.
    * @private {!Barge.events.ListenerMap}
    */
   this.eventTargetListeners_ = new Barge.events.ListenerMap(this);

   /**
    * The object to use for event.target. Useful when mixing in an
    * EventTarget to another object.
    * @private {!Object}
    */
   this.actualEventTarget_ = this;

   /**
    * Parent event target, used during event bubbling.
    *
    * TODO(chrishenry): Change this to Barge.events.Listenable. This
    * currently breaks people who expect getParentEventTarget to return
    * Barge.events.EventTarget.
    *
    * @private {Barge.events.EventTarget}
    */
   this.parentEventTarget_ = null;
};
Barge.inherits(Barge.events.EventTarget, Barge.Disposable);
Barge.events.Listenable.addImplementation(Barge.events.EventTarget);

/**
 * An artificial cap on the number of ancestors you can have. This is mainly
 * for loop detection.
 * @const {number}
 * @private
 */
Barge.events.EventTarget.MAX_ANCESTORS_ = 1000;

/**
 * Returns the parent of this event target to use for bubbling.
 *
 * @return {Barge.events.EventTarget} The parent EventTarget or null if
 *     there is no parent.
 * @override
 */
Barge.events.EventTarget.prototype.getParentEventTarget = function ()
{
   return this.parentEventTarget_;
};

/**
 * Sets the parent of this event target to use for capture/bubble
 * mechanism.
 * @param {Barge.events.EventTarget} parent Parent listenable (null if none).
 */
Barge.events.EventTarget.prototype.setParentEventTarget = function (parent)
{
   this.parentEventTarget_ = parent;
};

/**
 * Adds an event listener to the event target. The same handler can only be
 * added once per the type. Even if you add the same handler multiple times
 * using the same type then it will only be called once when the event is
 * dispatched.
 *
 * @param {string} type The type of the event to listen for.
 * @param {function(?):?|{handleEvent:function(?):?}|null} handler The function
 *     to handle the event. The handler can also be an object that implements
 *     the handleEvent method which takes the event object as argument.
 * @param {boolean=} opt_capture In DOM-compliant browsers, this determines
 *     whether the listener is fired during the capture or bubble phase
 *     of the event.
 * @param {Object=} opt_handlerScope Object in whose scope to call
 *     the listener.
 * @deprecated Use {@code #listen} instead, when possible. Otherwise, use
 *     {@code Barge.events.listen} if you are passing Object
 *     (instead of Function) as handler.
 */
Barge.events.EventTarget.prototype.addEventListener = function (type, handler, opt_capture, opt_handlerScope)
{
   Barge.events.listen(this, type, handler, opt_capture, opt_handlerScope);
};

/**
 * Removes an event listener from the event target. The handler must be the
 * same object as the one added. If the handler has not been added then
 * nothing is done.
 *
 * @param {string} type The type of the event to listen for.
 * @param {function(?):?|{handleEvent:function(?):?}|null} handler The function
 *     to handle the event. The handler can also be an object that implements
 *     the handleEvent method which takes the event object as argument.
 * @param {boolean=} opt_capture In DOM-compliant browsers, this determines
 *     whether the listener is fired during the capture or bubble phase
 *     of the event.
 * @param {Object=} opt_handlerScope Object in whose scope to call
 *     the listener.
 * @deprecated Use {@code #unlisten} instead, when possible. Otherwise, use
 *     {@code Barge.events.unlisten} if you are passing Object
 *     (instead of Function) as handler.
 */
Barge.events.EventTarget.prototype.removeEventListener = function (type, handler, opt_capture, opt_handlerScope)
{
   Barge.events.unlisten(this, type, handler, opt_capture, opt_handlerScope);
};

/** @override */
Barge.events.EventTarget.prototype.dispatchEvent = function (e)
{
   // this.assertInitialized_();

   var ancestorsTree, ancestor = this.getParentEventTarget();
   if (ancestor)
   {
      ancestorsTree = [];
      var ancestorCount = 1;
      for (; ancestor; ancestor = ancestor.getParentEventTarget())
      {
         ancestorsTree.push(ancestor);
         // Barge.asserts.assert((++ancestorCount < Barge.events.EventTarget.MAX_ANCESTORS_), 'infinite loop');
      }
   }

   return Barge.events.EventTarget.dispatchEventInternal_(
      this.actualEventTarget_, e, ancestorsTree);
};

/**
 * Removes listeners from this object.  Classes that extend EventTarget may
 * need to override this method in order to remove references to DOM Elements
 * and additional listeners.
 * @override
 */
Barge.events.EventTarget.prototype.disposeInternal = function ()
{
   Barge.events.EventTarget.superClass_.disposeInternal.call(this);

   this.removeAllListeners();
   this.parentEventTarget_ = null;
};

/** @override */
Barge.events.EventTarget.prototype.listen = function (type, listener, opt_useCapture, opt_listenerScope)
{
   // this.assertInitialized_();
   return this.eventTargetListeners_.add(
      String(type), listener, false /* callOnce */, opt_useCapture,
      opt_listenerScope);
};

/** @override */
Barge.events.EventTarget.prototype.listenOnce = function (type, listener, opt_useCapture, opt_listenerScope)
{
   return this.eventTargetListeners_.add(
      String(type), listener, true /* callOnce */, opt_useCapture,
      opt_listenerScope);
};

/** @override */
Barge.events.EventTarget.prototype.unlisten = function (type, listener, opt_useCapture, opt_listenerScope)
{
   return this.eventTargetListeners_.remove(
      String(type), listener, opt_useCapture, opt_listenerScope);
};

/** @override */
Barge.events.EventTarget.prototype.unlistenByKey = function (key)
{
   return this.eventTargetListeners_.removeByKey(key);
};

/** @override */
Barge.events.EventTarget.prototype.removeAllListeners = function (opt_type)
{
   // TODO(chrishenry): Previously, removeAllListeners can be called on
   // uninitialized EventTarget, so we preserve that behavior. We
   // should remove this when usages that rely on that fact are purged.
   if (!this.eventTargetListeners_)
   {
      return 0;
   }
   return this.eventTargetListeners_.removeAll(opt_type);
};

/** @override */
Barge.events.EventTarget.prototype.fireListeners = function (type, capture, eventObject)
{
   // TODO(chrishenry): Original code avoids array creation when there
   // is no listener, so we do the same. If this optimization turns
   // out to be not required, we can replace this with
   // getListeners(type, capture) instead, which is simpler.
   var listenerArray = this.eventTargetListeners_.listeners[String(type)];
   if (!listenerArray)
   {
      return true;
   }
   listenerArray = listenerArray.concat();

   var rv = true;
   for (var i = 0; i < listenerArray.length; ++i)
   {
      var listener = listenerArray[i];
      // We might not have a listener if the listener was removed.
      if (listener && !listener.removed && listener.capture == capture)
      {
         var listenerFn = listener.listener;
         var listenerHandler = listener.handler || listener.src;

         if (listener.callOnce)
         {
            this.unlistenByKey(listener);
         }
         rv = listenerFn.call(listenerHandler, eventObject) !== false && rv;
      }
   }

   return rv && eventObject.returnValue_ != false;
};

/** @override */
Barge.events.EventTarget.prototype.getListeners = function (type, capture)
{
   return this.eventTargetListeners_.getListeners(String(type), capture);
};

/** @override */
Barge.events.EventTarget.prototype.getListener = function (type, listener, capture, opt_listenerScope)
{
   return this.eventTargetListeners_.getListener(
      String(type), listener, capture, opt_listenerScope);
};

/** @override */
Barge.events.EventTarget.prototype.hasListener = function (opt_type, opt_capture)
{
   var id = Barge.utils.defined(opt_type) ? String(opt_type) : undefined;
   return this.eventTargetListeners_.hasListener(id, opt_capture);
};

/**
 * Sets the target to be used for {@code event.target} when firing
 * event. Mainly used for testing. For example, see
 * {@code Barge.testing.events.mixinListenable}.
 * @param {!Object} target The target.
 */
Barge.events.EventTarget.prototype.setTargetForTesting = function (target)
{
   this.actualEventTarget_ = target;
};

/**
 * Asserts that the event target instance is initialized properly.
 * @private
 */
Barge.events.EventTarget.prototype.assertInitialized_ = function ()
{
   Barge.asserts.assert(this.eventTargetListeners_,
      'Event target is not initialized. Did you call the superclass ' +
      '(Barge.events.EventTarget) constructor?');
};

/**
 * Dispatches the given event on the ancestorsTree.
 *
 * @param {!Object} target The target to dispatch on.
 * @param {Barge.events.Event|Object|string} e The event object.
 * @param {Array<Barge.events.Listenable>=} opt_ancestorsTree The ancestors
 *     tree of the target, in reverse order from the closest ancestor
 *     to the root event target. May be null if the target has no ancestor.
 * @return {boolean} If anyone called preventDefault on the event object (or
 *     if any of the listeners returns false) this will also return false.
 * @private
 */
Barge.events.EventTarget.dispatchEventInternal_ = function (target, e, opt_ancestorsTree)
{
   var type = e.type || /** @type {string} */ (e);

   // If accepting a string or object, create a custom event object so that
   // preventDefault and stopPropagation work with the event.
   if (Barge.utils.isString(e))
   {
      e = new Barge.events.Event(e, target);
   }
   else if (!(e instanceof Barge.events.Event))
   {
      var oldEvent = e;
      e = new Barge.events.Event(type, target);
      Barge.Object.extend(e, oldEvent);
   }
   else
   {
      e.target = e.target || target;
   }

   var rv = true, currentTarget;

   // Executes all capture listeners on the ancestors, if any.
   if (opt_ancestorsTree)
   {
      for (var i = opt_ancestorsTree.length - 1; !e.propagationStopped_ && i >= 0;
           i--)
      {
         currentTarget = e.currentTarget = opt_ancestorsTree[i];
         rv = currentTarget.fireListeners(type, true, e) && rv;
      }
   }

   // Executes capture and bubble listeners on the target.
   if (!e.propagationStopped_)
   {
      currentTarget = /** @type {?} */ (e.currentTarget = target);
      rv = currentTarget.fireListeners(type, true, e) && rv;
      if (!e.propagationStopped_)
      {
         rv = currentTarget.fireListeners(type, false, e) && rv;
      }
   }

   // Executes all bubble listeners on the ancestors, if any.
   if (opt_ancestorsTree)
   {
      for (i = 0; !e.propagationStopped_ && i < opt_ancestorsTree.length; i++)
      {
         currentTarget = e.currentTarget = opt_ancestorsTree[i];
         rv = currentTarget.fireListeners(type, false, e) && rv;
      }
   }

   return rv;
};
