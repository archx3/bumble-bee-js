/**!
 * renamed Sortable to DragSorter in order to avoid confusion
 * Edited to make use of Bumble Bee Utility methods to reduce file size and redundancy
 * @author   RubaXa   <trash@rubaxa.org>
 * @license MIT
 */

(function ()
{
   let Bu  = Bee.Utils,
       Ba  = Bee.Array,
       Boa = Bee.ObservableArray,
       Bo  = Bee.Object,
       Bs  = Bee.String,
       Bd  = Bee.Dom;
   
   (function sortableModule(factory)
   {
      "use strict";

      if (typeof define === "function" && define.amd)
      {
         define(factory);
      }
      else if (typeof module != "undefined" && typeof module.exports != "undefined")
      {
         module.exports = factory();
      }
      else if (typeof Package !== "undefined")
      {
         //noinspection JSUnresolvedVariable
         DragSorter = factory();  // export for Meteor.js
      }
      else
      {
         /* jshint sub:true */
         window["DragSorter"] = factory();
      }
   })(function sortableFactory()
      {
         "use strict";

         if (typeof window === "undefined" || !window.document)
         {
            return function sortableError()
            {
               throw new Error("DragSorter.js requires a window with a document");
            };
         }

         var dragEl,
             parentEl,
             ghostEl,
             cloneEl,
             rootEl,
             nextEl,

             scrollEl,
             scrollParentEl,
             scrollCustomFn,

             lastEl,
             lastCSS,
             lastParentCSS,

             oldIndex,
             newIndex,

             activeGroup,
             putSortable,

             autoScroll              = {},

             tapEvt,
             touchEvt,

             moved,

             /** @const */
             RSPACE                  = /\s+/g,

             expando                 = 'DragSorter' + (new Date).getTime(),

             win                     = window,
             document                = win.document,

             //supportDraggable        = !!('draggable' in document.createElement('div')),
             supportDraggable        = !!('draggable' in document.createElement('div')),
             supportCssPointerEvents = (function (el)
             {
                // false when IE11
                if (!!navigator.userAgent.match(/Trident.*rv[ :]?11\./))
                {
                   return false;
                }
                el = document.createElement('x');
                el.style.cssText = 'pointer-events:auto';
                return el.style.pointerEvents === 'auto';
             })(),

             _silent                 = false,

             abs                     = Math.abs,
             min                     = Math.min,
             slice                   = [].slice,

             touchDragOverListeners  = [],

             Be = new Bee.Event.EventManager(),

             _autoScroll             = _throttle(function (/**Event*/evt, /**Object*/options, /**HTMLElement*/rootEl)
             {
                                                    // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
                if (rootEl && options.scroll)
                {
                   var _this     = rootEl[expando],
                       el,
                       rect,
                       sens      = options.scrollSensitivity,
                       speed     = options.scrollSpeed,

                       x         = evt.clientX,
                       y         = evt.clientY,

                       winWidth  = window.innerWidth,
                       winHeight = window.innerHeight,

                       vx,
                       vy,

                       scrollOffsetX,
                       scrollOffsetY
                      ;

                   // Delect scrollEl
                   if (scrollParentEl !== rootEl)
                   {
                      scrollEl = options.scroll;
                      scrollParentEl = rootEl;
                      scrollCustomFn = options.scrollFn;

                      if (scrollEl === true)
                      {
                         scrollEl = rootEl;

                         do {
                            if ((scrollEl.offsetWidth < scrollEl.scrollWidth) ||
                               (scrollEl.offsetHeight < scrollEl.scrollHeight)
                            )
                            {
                               break;
                            }
                            /* jshint boss:true */
                         }
                         while (scrollEl = scrollEl.parentNode);
                      }
                   }

                   if (scrollEl)
                   {
                      el = scrollEl;
                      rect = scrollEl.getBoundingClientRect();
                      vx = (abs(rect.right - x) <= sens) - (abs(rect.left - x) <= sens);
                      vy = (abs(rect.bottom - y) <= sens) - (abs(rect.top - y) <= sens);
                   }

                   if (!(vx || vy))
                   {
                      vx = (winWidth - x <= sens) - (x <= sens);
                      vy = (winHeight - y <= sens) - (y <= sens);

                      /* jshint expr:true */
                      (vx || vy) && (el = win);
                   }

                   if (autoScroll.vx !== vx || autoScroll.vy !== vy || autoScroll.el !== el)
                   {
                      autoScroll.el = el;
                      autoScroll.vx = vx;
                      autoScroll.vy = vy;

                      clearInterval(autoScroll.pid);

                      if (el)
                      {
                         autoScroll.pid = setInterval(function ()
                                                      {
                                                         scrollOffsetY = vy ? vy * speed : 0;
                                                         scrollOffsetX = vx ? vx * speed : 0;

                                                         if ('function' === typeof(scrollCustomFn))
                                                         {
                                                            return scrollCustomFn.call(_this, scrollOffsetX, scrollOffsetY, evt);
                                                         }

                                                         if (el === win)
                                                         {
                                                            win.scrollTo(win.pageXOffset + scrollOffsetX, win.pageYOffset + scrollOffsetY);
                                                         }
                                                         else
                                                         {
                                                            el.scrollTop += scrollOffsetY;
                                                            el.scrollLeft += scrollOffsetX;
                                                         }
                                                      }, 24);
                      }
                   }
                }
             }, 30),

             _prepareGroup           = function (options)
             {
                function toFn(value, pull)
                {
                   if (value === void 0 || value === true)
                   {
                      value = group.name;
                   }

                   if (typeof value === 'function')
                   {
                      return value;
                   }
                   else
                   {
                      return function (to, from)
                      {
                         var fromGroup = from.options.group.name;

                         return pull
                            ? value
                            : value && (value.join
                               ? value.indexOf(fromGroup) > -1
                               : (fromGroup == value)
                         );
                      };
                   }
                }

                var group = {};
                var originalGroup = options.group;

                if (!originalGroup || typeof originalGroup != 'object')
                {
                   originalGroup = { name : originalGroup };
                }

                group.name = originalGroup.name;
                group.checkPull = toFn(originalGroup.pull, true);
                group.checkPut = toFn(originalGroup.put);

                options.group = group;
             };

         /**
          * @class  DragSorter
          * @param el {HTMLElement}
          * @param options {Object} [options]
          * @constructor
          */
         function DragSorter(el, options)
         {
            if (!(el && el.nodeType && el.nodeType === 1))
            {
               throw 'DragSorter: `el` must be HTMLElement, and not ' + {}.toString.call(el);
            }

            this.el = el; // root element
            this.options = options = Bo.extend({}, options, true);

            // Export instance
            el[expando] = this;

            // Default options
            var defaults = {
               group             : Math.random(),
               sort              : true,
               disabled          : false,
               touchSupport      : false,
               store             : null,
               handle            : null,
               scroll            : true,
               scrollSensitivity : 30,
               scrollSpeed       : 10,
               draggable         : /[uo]l/i.test(el.nodeName) ? 'li' : '>*',
               ghostClass        : 'sortable-ghost',
               chosenClass       : 'sortable-chosen',
               dragClass         : 'sortable-drag',
               ignore            : 'a, img',
               filter            : null,
               animation         : 0,
               setData           : function (dataTransfer, dragEl)
               {
                  dataTransfer.setData('Text', dragEl.textContent);
               },
               dropBubble        : false,
               dragoverBubble    : false,
               dataIdAttr        : 'data-id',
               delay             : 0,
               forceFallback     : false,
               fallbackClass     : 'sortable-fallback',
               fallbackOnBody    : false,
               fallbackTolerance : 0,
               fallbackOffset    : { x : 0, y : 0 }
            };

            // Set default options
            for (var name in defaults)
            {
               !(name in options) && (options[name] = defaults[name]);
            }

            _prepareGroup(options);

            // Bind all private methods
            for (var fn in this)
            {
               if (fn.charAt(0) === '_' && typeof this[fn] === 'function')
               {
                  this[fn] = this[fn].bind(this);
               }
            }

            // Setup drag mode
            this.nativeDraggable = options.forceFallback ? false : supportDraggable;

            // Bind events
            Be.bind(el, 'mousedown', this._onTapStart);
            Be.bind(el, 'pointerdown', this._onTapStart);

            //console.log('options.touchSupport', options.touchSupport);
            if(options.touchSupport === true)
            {
               Be.bind(el, 'touchstart', this._onTapStart);
            }


            if (this.nativeDraggable)
            {
               Be.bind(el, 'dragover', this);
               Be.bind(el, 'dragenter', this);
            }

            touchDragOverListeners.push(this._onDragOver);

            // Restore sorting
            options.store && this.sort(options.store.get(this));
         }

         /** @lends DragSorter.prototype */
         DragSorter.prototype = {
            constructor : DragSorter,

            /**
             *
             * @param evt {Event|TouchEvent}
             * @private
             */
            _onTapStart : function (evt)
            {
               var _this          = this,
                   el             = this.el,
                   options        = this.options,
                   type           = evt.type,
                   touch          = evt.touches && evt.touches[0],
                   target         = (touch || evt).target,
                   originalTarget = evt.target.shadowRoot && evt.path[0] || target,
                   filter         = options.filter,
                   startIndex;

               // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set
               // option.group.
               if (dragEl)
               {
                  return;
               }

               if (type === 'mousedown' && evt.button !== 0 || options.disabled)
               {
                  return; // only left button or enabled
               }

               if (options.handle && !_closest(originalTarget, options.handle, el))
               {
                  return;
               }

               target = _closest(target, options.draggable, el);

               if (!target)
               {
                  return;
               }

               // Get the index of the dragged element within its parent
               startIndex = Bd.index(target, options.draggable);

               // Check filter
               if (typeof filter === 'function')
               {
                  if (filter.call(this, evt, target, this))
                  {
                     _dispatchEvent(_this, originalTarget, 'filter', target, el, startIndex);
                     evt.preventDefault();
                     return; // cancel dnd
                  }
               }
               else if (filter)
               {
                  filter = filter.split(',').some(function (criteria)
                                                  {
                                                     criteria = _closest(originalTarget, criteria.trim(), el);

                                                     if (criteria)
                                                     {
                                                        _dispatchEvent(_this, criteria, 'filter', target, el, startIndex);
                                                        return true;
                                                     }
                                                  });

                  if (filter)
                  {
                     evt.preventDefault();
                     return; // cancel dnd
                  }
               }

               // Prepare `dragstart`
               this._prepareDragStart(evt, touch, target, startIndex);
            },

            /**
             *
             * @param evt
             * @param touch
             * @param target
             * @param startIndex
             * @private
             */
            _prepareDragStart : function (evt, touch, target, startIndex)
            {
               var _this         = this,
                   el            = _this.el,
                   options       = _this.options,
                   ownerDocument = Bu.defined(el) ? el.ownerDocument : null,
                   dragStartFn;

               if (target && !dragEl && (target.parentNode === el))
               {
                  tapEvt = evt;

                  rootEl = el;
                  dragEl = target;
                  parentEl = dragEl.parentNode;
                  nextEl = dragEl.nextSibling;
                  activeGroup = options.group;
                  oldIndex = startIndex;

                  this._lastX = (touch || evt).clientX;
                  this._lastY = (touch || evt).clientY;

                  dragEl.style['will-change'] = 'transform';

                  dragStartFn = function ()
                  {
                     // Delayed drag has been triggered
                     // we can re-enable the events: touchmove/mousemove
                     _this._disableDelayedDrag();

                     // Make the element draggable
                     dragEl.draggable = _this.nativeDraggable;

                     // Chosen item
                     _toggleClass(dragEl, options.chosenClass, true);

                     // Bind the events: dragstart/dragend
                     _this._triggerDragStart(evt, touch);

                     // Drag start event
                     _dispatchEvent(_this, rootEl, 'choose', dragEl, rootEl, oldIndex);
                  };

                  // Disable "draggable"
                  options.ignore.split(',').forEach(function (criteria)
                  {
                     _find(dragEl, criteria.trim(), _disableDraggable);
                  });

                  Be.bind(ownerDocument, 'mouseup', _this._onDrop);
                  Be.bind(ownerDocument, 'pointercancel', _this._onDrop);

                  if(options.touchSupport === true)
                  {
                     Be.bind(ownerDocument, 'touchend', _this._onDrop);
                     Be.bind(ownerDocument, 'touchcancel', _this._onDrop);
                  }

                  if (options.delay)
                  {
                     // If the user moves the pointer or let go the click or touch
                     // before the delay has been reached:
                     // disable the delayed drag
                     Be.bind(ownerDocument, 'mouseup', _this._disableDelayedDrag);
                     Be.bind(ownerDocument, 'mousemove', _this._disableDelayedDrag);
                     Be.bind(ownerDocument, 'pointermove', _this._disableDelayedDrag);

                     if(options.touchSupport === true)
                     {
                        Be.bind(ownerDocument, 'touchend', _this._disableDelayedDrag);
                        Be.bind(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
                        Be.bind(ownerDocument, 'touchmove', _this._disableDelayedDrag);

                     }

                     _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
                  }
                  else
                  {
                     dragStartFn();
                  }
               }
            },

            _disableDelayedDrag : function ()
            {
               var ownerDocument = this.el.ownerDocument;

               clearTimeout(this._dragStartTimer);
               Be.unbind(ownerDocument, 'mouseup', this._disableDelayedDrag);
               Be.unbind(ownerDocument, 'touchend', this._disableDelayedDrag);
               Be.unbind(ownerDocument, 'touchcancel', this._disableDelayedDrag);
               Be.unbind(ownerDocument, 'mousemove', this._disableDelayedDrag);
               Be.unbind(ownerDocument, 'touchmove', this._disableDelayedDrag);
               Be.unbind(ownerDocument, 'pointermove', this._disableDelayedDrag);
            },

            /**
             *
             * @param evt
             * @param touch
             * @private
             */
            _triggerDragStart : function (evt, touch)
            {
               touch = touch || (evt.pointerType == 'touch' ? evt : null);
               if (touch)
               {
                  // Touch device support
                  tapEvt = {
                     target  : dragEl,
                     clientX : touch.clientX,
                     clientY : touch.clientY
                  };

                  this._onDragStart(tapEvt, 'touch');
               }
               else if (!this.nativeDraggable)
               {
                  this._onDragStart(tapEvt, true);
               }
               else
               {
                  Be.bind(dragEl, 'dragend', this);
                  Be.bind(rootEl, 'dragstart', this._onDragStart);
               }

               try
               {
                  if (document.selection)
                  {
                     // Timeout neccessary for IE9
                     setTimeout(function ()
                                {
                                   document.selection.empty();
                                });
                  }
                  else
                  {
                     window.getSelection().removeAllRanges();
                  }
               }
               catch (err)
               {
               }
            },

            _dragStarted : function ()
            {
               if (rootEl && dragEl)
               {
                  var options = this.options;

                  // Apply effect
                  _toggleClass(dragEl, options.ghostClass, true);
                  _toggleClass(dragEl, options.dragClass, false);

                  DragSorter.active = this;

                  // Drag start event
                  _dispatchEvent(this, rootEl, 'start', dragEl, rootEl, oldIndex);
               }
            },

            _emulateDragOver : function ()
            {
               if (touchEvt)
               {
                  if (this._lastX === touchEvt.clientX && this._lastY === touchEvt.clientY)
                  {
                     return;
                  }

                  this._lastX = touchEvt.clientX;
                  this._lastY = touchEvt.clientY;

                  if (!supportCssPointerEvents)
                  {
                     Bu.css(ghostEl, {display: 'none'});
                  }

                  var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY),
                      parent = target,
                      i      = touchDragOverListeners.length;

                  if (parent)
                  {
                     do {
                        if (parent[expando])
                        {
                           while (i--)
                           {
                              touchDragOverListeners[i]({
                                                           clientX : touchEvt.clientX,
                                                           clientY : touchEvt.clientY,
                                                           target  : target,
                                                           rootEl  : parent
                                                        });
                           }

                           break;
                        }

                        target = parent; // store last element
                     }
                        /* jshint boss:true */
                     while (parent = parent.parentNode);
                  }

                  if (!supportCssPointerEvents)
                  {
                     Bu.css(ghostEl, {'display': ''});
                  }
               }
            },

            _onTouchMove : function (/**TouchEvent*/evt)
            {
               if (tapEvt)
               {
                  var options           = this.options,
                      fallbackTolerance = options.fallbackTolerance,
                      fallbackOffset    = options.fallbackOffset,
                      touch             = evt.touches ? evt.touches[0] : evt,
                      dx                = (touch.clientX - tapEvt.clientX) + fallbackOffset.x,
                      dy                = (touch.clientY - tapEvt.clientY) + fallbackOffset.y,
                      translate3d       = evt.touches ? 'translate3d(' + dx + 'px,' + dy + 'px,0)' : 'translate(' + dx + 'px,' + dy + 'px)';

                  // only set the status to dragging, when we are actually dragging
                  if (!DragSorter.active)
                  {
                     if (fallbackTolerance &&
                        min(abs(touch.clientX - this._lastX), abs(touch.clientY - this._lastY)) < fallbackTolerance
                     )
                     {
                        return;
                     }

                     this._dragStarted();
                  }

                  // as well as creating the ghost element on the document body
                  this._appendGhost();

                  moved = true;
                  touchEvt = touch;

                  Bu.css(ghostEl, {'webkitTransform' : translate3d});
                  Bu.css(ghostEl, {'mozTransform' : translate3d});
                  Bu.css(ghostEl, {'msTransform' : translate3d});
                  Bu.css(ghostEl, {'transform' : translate3d});

                  evt.preventDefault();
               }
            },

            _appendGhost : function ()
            {
               if (!ghostEl)
               {
                  var rect    = dragEl.getBoundingClientRect(),
                      css     = _css(dragEl),
                      options = this.options,
                      ghostRect;

                  ghostEl = dragEl.cloneNode(true);

                  _toggleClass(ghostEl, options.ghostClass, false);
                  _toggleClass(ghostEl, options.fallbackClass, true);
                  _toggleClass(ghostEl, options.dragClass, true);

                  Bu.css(ghostEl, {'top': rect.top - Bu.pInt(css.marginTop, 10)});
                  Bu.css(ghostEl, {'left': rect.left - Bu.pInt(css.marginLeft, 10)});
                  Bu.css(ghostEl, {width: rect.width});
                  Bu.css(ghostEl, {'height': rect.height});
                  Bu.css(ghostEl, {'opacity': '0.8'});
                  Bu.css(ghostEl, {'position': 'fixed'});
                  Bu.css(ghostEl, {'zIndex': '100000'});
                  Bu.css(ghostEl, {'pointerEvents': 'none'});

                  options.fallbackOnBody && document.body.appendChild(ghostEl) || rootEl.appendChild(ghostEl);

                  // Fixing dimensions.
                  ghostRect = ghostEl.getBoundingClientRect();
                  Bu.css(ghostEl, {'width': rect.width * 2 - ghostRect.width});
                  Bu.css(ghostEl, {'height': rect.height * 2 - ghostRect.height});
               }
            },

            /**
             *
             * @param evt
             * @param useFallback
             * @private
             */
            _onDragStart : function (evt, useFallback)
            {
               var dataTransfer = evt.dataTransfer,
                   options      = this.options;

               this._offUpEvents();

               if (activeGroup.checkPull(this, this, dragEl, evt) == 'clone')
               {
                  cloneEl = Bd.cloneNode(dragEl);
                  Bu.css(cloneEl, {'display' : 'none'});
                  rootEl.insertBefore(cloneEl, dragEl);
                  _dispatchEvent(this, rootEl, 'clone', dragEl);
               }

               _toggleClass(dragEl, options.dragClass, true);

               //console.log('useFallback', useFallback);

               if (useFallback)
               {
                  if (useFallback === 'touch')
                  {
                     // Bind touch events
                     Be.bind(document, 'touchmove', this._onTouchMove);
                     Be.bind(document, 'touchend', this._onDrop);
                     Be.bind(document, 'touchcancel', this._onDrop);
                     Be.bind(document, 'pointermove', this._onTouchMove);
                     Be.bind(document, 'pointerup', this._onDrop);
                  }
                  else
                  {
                     // Old brwoser
                     Be.bind(document, 'mousemove', this._onTouchMove);
                     Be.bind(document, 'mouseup', this._onDrop);
                  }

                  this._loopId = setInterval(this._emulateDragOver, 50);
               }
               else
               {
                  if (dataTransfer)
                  {
                     dataTransfer.effectAllowed = 'move';
                     options.setData && options.setData.call(this, dataTransfer, dragEl);
                  }

                  Be.bind(document, 'drop', this);
                  setTimeout(this._dragStarted, 0);
               }
            },

            /**
             *
             * @param evt
             * @private
             */
            _onDragOver : function (evt)
            {
               var el             = this.el,
                   target,
                   dragRect,
                   targetRect,
                   revert,
                   options        = this.options,
                   group          = options.group,
                   activeSortable = DragSorter.active,
                   isOwner        = (activeGroup === group),
                   canSort        = options.sort;

               if (evt.preventDefault !== void 0)
               {
                  evt.preventDefault();
                  !options.dragoverBubble && evt.stopPropagation();
               }

               moved = true;

               if (activeGroup && !options.disabled &&
                  (isOwner
                        ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
                        : (
                      putSortable === this ||
                      activeGroup.checkPull(this, activeSortable, dragEl, evt) && group.checkPut(this, activeSortable, dragEl, evt)
                   )
                  ) &&
                  (evt.rootEl === void 0 || evt.rootEl === this.el) // touch fallback
               )
               {
                  // Smart auto-scrolling
                  _autoScroll(evt, options, this.el);

                  if (_silent)
                  {
                     return;
                  }

                  target = _closest(evt.target, options.draggable, el);
                  dragRect = dragEl.getBoundingClientRect();
                  putSortable = this;

                  if (revert)
                  {
                     _cloneHide(true);
                     parentEl = rootEl; // actualization

                     if (cloneEl || nextEl)
                     {
                        rootEl.insertBefore(dragEl, cloneEl || nextEl);
                     }
                     else if (!canSort)
                     {
                        rootEl.appendChild(dragEl);
                     }

                     return;
                  }

                  if ((el.children.length === 0) || (el.children[0] === ghostEl) ||
                     (el === evt.target) && (target = _ghostIsLast(el, evt))
                  )
                  {
                     if (target)
                     {
                        if (target.animated)
                        {
                           return;
                        }

                        targetRect = target.getBoundingClientRect();
                     }

                     _cloneHide(isOwner);

                     if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt) !== false)
                     {
                        if (!dragEl.contains(el))
                        {
                           el.appendChild(dragEl);
                           parentEl = el; // actualization
                        }

                        this._animate(dragRect, dragEl);
                        target && this._animate(targetRect, target);
                     }
                  }
                  else if (target && !target.animated && target !== dragEl && (target.parentNode[expando] !== void 0))
                  {
                     if (lastEl !== target)
                     {
                        lastEl = target;
                        lastCSS = _css(target);
                        lastParentCSS = _css(target.parentNode);
                     }

                     targetRect = target.getBoundingClientRect();

                     var width       = targetRect.right - targetRect.left,
                         height      = targetRect.bottom - targetRect.top,

                         floating    = /left|right|inline/.test(lastCSS.cssFloat + lastCSS.display) ||
                                       (lastParentCSS.display == 'flex' && lastParentCSS['flex-direction'].indexOf('row') === 0),

                         isWide      = (target.offsetWidth > dragEl.offsetWidth),
                         isLong      = (target.offsetHeight > dragEl.offsetHeight),
                         halfway     = (floating ? (evt.clientX - targetRect.left) / width :
                                        (evt.clientY - targetRect.top) / height) > 0.5,

                         nextSibling = target.nextElementSibling,
                         moveVector  = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt),
                         after
                        ;

                     if (moveVector !== false)
                     {
                        _silent = true;
                        setTimeout(_unsilent, 30);

                        _cloneHide(isOwner);

                        if (moveVector === 1 || moveVector === -1)
                        {
                           after = (moveVector === 1);
                        }
                        else if (floating)
                        {
                           var elTop = dragEl.offsetTop,
                               tgTop = target.offsetTop;

                           if (elTop === tgTop)
                           {
                              after = (target.previousElementSibling === dragEl) && !isWide || halfway && isWide;
                           }
                           else if (target.previousElementSibling === dragEl || dragEl.previousElementSibling === target)
                           {
                              after = (evt.clientY - targetRect.top) / height > 0.5;
                           }
                           else
                           {
                              after = tgTop > elTop;
                           }
                        }
                        else
                        {
                           after = (nextSibling !== dragEl) && !isLong || halfway && isLong;
                        }

                        if (!dragEl.contains(el))
                        {
                           if (after && !nextSibling)
                           {
                              el.appendChild(dragEl);
                           }
                           else
                           {
                              target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
                           }
                        }

                        parentEl = dragEl.parentNode; // actualization

                        this._animate(dragRect, dragEl);
                        this._animate(targetRect, target);
                     }
                  }
               }
            },

            _animate : function (prevRect, target)
            {
               var ms = this.options.animation;

               if (ms)
               {
                  var currentRect = target.getBoundingClientRect();

                  Bu.css(target, {'transition': 'none'});
                  Bu.css(target, {'transform': 'translate3d(' +
                         (prevRect.left - currentRect.left) + 'px,' +
                         (prevRect.top - currentRect.top) + 'px,0)'}
                  );

                  target.offsetWidth; // repaint

                  Bu.css(target, {'transition': 'all ' + ms + 'ms'});
                  Bu.css(target, {'transform': 'translate3d(0,0,0)'});

                  clearTimeout(target.animated);
                  target.animated = setTimeout(function ()
                    {
                       Bu.css(target, {'transition': ''});
                       Bu.css(target, {'transform': ''});
                       target.animated = false;
                    }, ms);
               }
            },

            _offUpEvents : function ()
            {
               if(Bu.defined(this.el))
               {
                  var ownerDocument = this.el.ownerDocument;

                  Be.unbind(document, 'pointermove', this._onTouchMove);
                  Be.unbind(ownerDocument, 'mouseup', this._onDrop);
                  Be.unbind(ownerDocument, 'pointerup', this._onDrop);

                  if (this.options.touchSupport === true)
                  {
                     Be.unbind(document, 'touchmove', this._onTouchMove);
                     Be.unbind(ownerDocument, 'touchend', this._onDrop);
                     Be.unbind(ownerDocument, 'touchcancel', this._onDrop);
                  }
               }
            },

            _onDrop : function (/**Event*/evt)
            {
               var el      = this.el,
                   options = this.options;

               clearInterval(this._loopId);
               clearInterval(autoScroll.pid);
               clearTimeout(this._dragStartTimer);

               // Unbind events
               Be.unbind(document, 'mousemove', this._onTouchMove);

               if (this.nativeDraggable)
               {
                  Be.unbind(document, 'drop', this);
                  Be.unbind(el, 'dragstart', this._onDragStart);
               }

               this._offUpEvents();

               if (evt)
               {
                  if (moved)
                  {
                     evt.preventDefault();
                     !options.dropBubble && evt.stopPropagation();
                  }

                  ghostEl && ghostEl.parentNode.removeChild(ghostEl);

                  if (dragEl)
                  {
                     if (this.nativeDraggable)
                     {
                        Be.unbind(dragEl, 'dragend', this);
                     }

                     _disableDraggable(dragEl);
                     dragEl.style['will-change'] = '';

                     // Remove class's
                     _toggleClass(dragEl, this.options.ghostClass, false);
                     _toggleClass(dragEl, this.options.chosenClass, false);

                     if (rootEl !== parentEl)
                     {
                        newIndex = Bd.index(dragEl, options.draggable);

                        if (newIndex >= 0)
                        {

                           // Add event
                           _dispatchEvent(null, parentEl, 'add', dragEl, rootEl, oldIndex, newIndex);

                           // Remove event
                           _dispatchEvent(this, rootEl, 'remove', dragEl, rootEl, oldIndex, newIndex);

                           // drag from one list and drop into another
                           _dispatchEvent(null, parentEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                           _dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                        }
                     }
                     else
                     {
                        // Remove clone
                        cloneEl && cloneEl.parentNode.removeChild(cloneEl);

                        if (dragEl.nextSibling !== nextEl)
                        {
                           // Get the index of the dragged element within its parent
                           newIndex = Bd.index(dragEl, options.draggable);

                           if (newIndex >= 0)
                           {
                              // drag & drop within the same list
                              _dispatchEvent(this, rootEl, 'update', dragEl, rootEl, oldIndex, newIndex);
                              _dispatchEvent(this, rootEl, 'sort', dragEl, rootEl, oldIndex, newIndex);
                           }
                        }
                     }

                     if (DragSorter.active)
                     {
                        /* jshint eqnull:true */
                        if (newIndex == null || newIndex === -1)
                        {
                           newIndex = oldIndex;
                        }

                        _dispatchEvent(this, rootEl, 'end', dragEl, rootEl, oldIndex, newIndex);

                        // Save sorting
                        this.save();
                     }
                  }

               }

               this._nulling();
            },

            _nulling : function ()
            {
               rootEl = dragEl = parentEl =
               ghostEl = nextEl = cloneEl =
               scrollEl = scrollParentEl =

               tapEvt = touchEvt = moved =
               newIndex = lastEl = lastCSS =
               putSortable = activeGroup = DragSorter.active = null;
            },

            handleEvent : function (/**Event*/evt)
            {
               var type = evt.type;

               if (type === 'dragover' || type === 'dragenter')
               {
                  if (dragEl)
                  {
                     this._onDragOver(evt);
                     _globalDragOver(evt);
                  }
               }
               else if (type === 'drop' || type === 'dragend')
               {
                  this._onDrop(evt);
               }
            },

            /**
             * Serializes the item into an array of string.
             * @returns {String[]}
             */
            toArray : function ()
            {
               var order    = [],
                   el,
                   children = this.el.children,
                   i        = 0,
                   n        = children.length,
                   options  = this.options;

               for (; i < n; i++)
               {
                  el = children[i];
                  if (_closest(el, options.draggable, this.el))
                  {
                     order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
                  }
               }

               return order;
            },

            /**
             * Sorts the elements according to the array.
             * @param  {String[]}  order  order of the items
             */
            sort : function (order)
            {
               var items = {}, rootEl = this.el;

               this.toArray().forEach(function (id, i)
                                      {
                                         var el = rootEl.children[i];

                                         if (_closest(el, this.options.draggable, rootEl))
                                         {
                                            items[id] = el;
                                         }
                                      }, this);

               order.forEach(function (id)
                             {
                                if (items[id])
                                {
                                   rootEl.removeChild(items[id]);
                                   rootEl.appendChild(items[id]);
                                }
                             });
            },

            /**
             * Save the current sorting
             */
            save : function ()
            {
               var store = this.options.store;
               store && store.set(this);
            },

            /**
             * For each element in the set, get the first element that matches the selector by testing the element itself and
             * traversing up through its ancestors in the DOM tree.
             * @param   {HTMLElement}  el
             * @param   {String}       [selector]  default: `options.draggable`
             * @returns {HTMLElement|null}
             */
            closest : function (el, selector)
            {
               return _closest(el, selector || this.options.draggable, this.el);
            },

            /**
             * Set/get option
             * @param   {string} name
             * @param   {*}      [value]
             * @returns {*}
             */
            option : function (name, value)
            {
               var options = this.options;

               if (value === void 0)
               {
                  return options[name];
               }
               else
               {
                  options[name] = value;

                  if (name === 'group')
                  {
                     _prepareGroup(options);
                  }
               }
            },

            /**
             * Destroy
             */
            destroy : function ()
            {
               var el = this.el;

               el[expando] = null;

               Be.unbind(el, 'mousedown', this._onTapStart);
               Be.unbind(el, 'pointerdown', this._onTapStart);

               if (options.touchSupport === true)
               {
                  Be.unbind(el, 'touchstart', this._onTapStart);

               }


               if (this.nativeDraggable)
               {
                  Be.unbind(el, 'dragover', this);
                  Be.unbind(el, 'dragenter', this);
               }

               // Remove draggable attributes
               Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el)
               {
                  el.removeAttribute('draggable');
               });

               touchDragOverListeners.splice(touchDragOverListeners.indexOf(this._onDragOver), 1);

               this._onDrop();

               this.el = el = null;
            }
         };

         function _cloneHide(state)
         {
            if (cloneEl && (cloneEl.state !== state))
            {
               Bu.css(cloneEl, 'display', state ? 'none' : '');

               !state && cloneEl.state && rootEl.insertBefore(cloneEl, dragEl);
               cloneEl.state = state;
            }
         }

         function _closest(/**HTMLElement*/el, /**String*/selector, /**HTMLElement*/ctx)
         {
            if (el)
            {
               ctx = ctx || document;

               do {
                  if ((selector === '>*' && el.parentNode === ctx) || Bd.matches(el, selector))
                  {
                     return el;
                  }
                  /* jshint boss:true */
               }
               while (el = Bd.getParentOrHost(el));
            }

            return null;
         }


         function _globalDragOver(/**Event*/evt)
         {
            if (evt.dataTransfer)
            {
               evt.dataTransfer.dropEffect = 'move';
            }
            evt.preventDefault();
         }



         function _toggleClass(el, name, state)
         {
            if (el)
            {
               if (el.classList)
               {
                  el.classList[state ? 'add' : 'remove'](name);
               }
               else
               {
                  var className = (' ' + el.className + ' ').replace(RSPACE, ' ').replace(' ' + name + ' ', ' ');
                  el.className = (className + (state ? ' ' + name : '')).replace(RSPACE, ' ');
               }
            }
         }

         function _css(el, prop, val)
         {
            var style = el && el.style;

            if (style)
            {
               if (val === void 0)
               {
                  if (document.defaultView && document.defaultView.getComputedStyle)
                  {
                     val = document.defaultView.getComputedStyle(el, '');
                  }
                  else if (el.currentStyle)
                  {
                     val = el.currentStyle;
                  }

                  return prop === void 0 ? val : val[prop];
               }
            }
         }

         /**
          *
          * @param ctx
          * @param tagName
          * @param iterator
          * @returns {*}
          * @private
          */
         function _find(ctx, tagName, iterator)
         {
            if (ctx)
            {
               var list = ctx.getElementsByTagName(tagName),
                   i    = 0,
                   n    = list.length;

               if (iterator)
               {
                  for (; i < n; i++)
                  {
                     iterator(list[i], i);
                  }
               }

               return list;
            }

            return [];
         }

         /**
          *
          * @param sortable
          * @param rootEl
          * @param name
          * @param targetEl
          * @param fromEl
          * @param startIndex
          * @param newIndex
          * @private
          */
         function _dispatchEvent(sortable, rootEl, name, targetEl, fromEl, startIndex, newIndex)
         {
            sortable = (sortable || rootEl[expando]);

            var evt     = document.createEvent('Event'),
                options = sortable.options,
                onName  = 'on' + name.charAt(0).toUpperCase() + name.substr(1);

            evt.initEvent(name, true, true);

            evt.to = rootEl;
            evt.from = fromEl || rootEl;
            evt.item = targetEl || rootEl;
            evt.clone = cloneEl;

            evt.oldIndex = startIndex;
            evt.newIndex = newIndex;

            rootEl.dispatchEvent(evt);

            if (options[onName])
            {
               options[onName].call(sortable, evt);
            }
         }

         /**
          *
          * @param fromEl
          * @param toEl
          * @param dragEl
          * @param dragRect
          * @param targetEl
          * @param targetRect
          * @param originalEvt
          * @returns {*}
          * @private
          */
         function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvt)
         {
            var evt,
                sortable = fromEl[expando],
                onMoveFn = sortable.options.onMove,
                retVal;

            evt = document.createEvent('Event');
            evt.initEvent('move', true, true);

            evt.to = toEl;
            evt.from = fromEl;
            evt.dragged = dragEl;
            evt.draggedRect = dragRect;
            evt.related = targetEl || toEl;
            evt.relatedRect = targetRect || toEl.getBoundingClientRect();

            fromEl.dispatchEvent(evt);

            if (onMoveFn)
            {
               retVal = onMoveFn.call(sortable, evt, originalEvt);
            }

            return retVal;
         }

         /**
          *
          * @param el
          * @private
          */
         function _disableDraggable(el)
         {
            el.draggable = false;
         }

         function _unsilent()
         {
            _silent = false;
         }

         /**
          *
          * @param el
          * @param evt
          * @returns {boolean|Element}
          * @private
          */
         function _ghostIsLast(el, evt)
         {
            var lastEl = el.lastElementChild,
                rect   = lastEl.getBoundingClientRect();

            // 5 — min delta
            // abs — нельзя добавлять, а то глюки при наведении сверху
            return ((evt.clientY - (rect.top + rect.height) > 5) ||
                  (evt.clientX - (rect.right + rect.width) > 5)) && lastEl;
         }

         /**
          * Generate id
          * @param   {HTMLElement} el
          * @returns {String}
          * @private
          */
         function _generateId(el)
         {
            var str = el.tagName + el.className + el.src + el.href + el.textContent,
                i   = str.length,
                sum = 0;

            while (i--)
            {
               sum += str.charCodeAt(i);
            }

            return sum.toString(36);
         }

         /**
          *
          * @param callback
          * @param ms
          * @returns {Function}
          * @private
          */
         function _throttle(callback, ms)
         {
            var args,
                _this;

            return function ()
            {
               if (args === void 0)
               {
                  args = arguments;
                  _this = this;

                  setTimeout(function ()
                             {
                                if (args.length === 1)
                                {
                                   callback.call(_this, args[0]);
                                }
                                else
                                {
                                   callback.apply(_this, args);
                                }

                                args = void 0;
                             }, ms);
               }
            };
         }

         // Export Utils
         /**
          *
          * @type {{on: *, off: *, css: _css, find: _find, is: DragSorter.utils.is, extend: Bee.Utils.extend, throttle: _throttle, closest: _closest, toggleClass: _toggleClass, clone: Bee.Widget.cloneNode, index: Bee.Dom.index}}
          */
         DragSorter.Utils = {
            on          : Be.bind,
            off         : Be.unbind,
            css         : _css,
            find        : _find,
            is          : function (el, selector)
            {
               return !!_closest(el, selector, el);
            },
            extend      : Bo.extend,
            throttle    : _throttle,
            closest     : _closest,
            toggleClass : _toggleClass,
            clone       : Bd.cloneNode,
            index       : Bd.index
         };

         /**
          * Create sortable instance in the global scope
          * @param {HTMLElement}  el
          * @param {Object}      [options]
          */
         DragSorter.create = function (el, options)
         {
            return new DragSorter(el, options);
         };

         // Export
         DragSorter.version = '1.5.0-rc1';
         return DragSorter;
      });
})();
