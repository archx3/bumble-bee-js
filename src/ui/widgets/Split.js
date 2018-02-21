// The programming goals of Split.js are to deliver readable, understandable and
// maintainable code, while at the same time manually optimizing for tiny minified file size,
// browser compatibility without additional requirements, graceful fallback (IE8 is supported)
// and very few assumptions about the user's page layout.
//
// Make sure all browsers handle this JS library correctly with ES5.
// More information here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
'use strict';

// A wrapper function that does a couple things:
//
// 1. Doesn't pollute the global namespace. This is important for a library.
// 2. Allows us to mount the library in different module systems, as well as
//    directly in the browser.

(function (Bu, Bd)
{
   (function ()
   {

// Save the global `this` for use later. In this case, since the library only
// runs in the browser, it will refer to `window`. Also, figure out if we're in IE8
// or not. IE8 will still render correctly, but will be static instead of draggable.
//
// Save a couple long function names that are used frequently.
// This optimization saves around 400 bytes.
      var global                = this,
          document              = global.document,
          addEvt                = 'addEventListener',
          removeEventListener   = 'removeEventListener',
          getBoundingClientRect = 'getBoundingClientRect',
          isIE8                 = global.attachEvent && !global[addEvt];

      // This library only needs two helper functions:
      //
      // The first determines which prefixes of CSS calc we need.
      // We only need to do this once on startup, when this anonymous function is called.
      //
      // Tests -webkit, -moz and -o prefixes. Modified from StackOverflow:
      // http://stackoverflow.com/questions/16625140/js-feature-detection-to-detect-the-usage-of-webkit-calc-over-calc/16625167#16625167

      let _calc = (function ()
      {
         var el,
             prefixes = ["", "-webkit-", "-moz-", "-o-"];

         for (var i = 0; i < prefixes.length; i++)
         {
            el = document.createElement('div');

            Bu.css(el, { cssText : "width:" + prefixes[i] + "calc(9px)" });
            // el.style.cssText = "width:" + prefixes[i] + "calc(9px)";

            if (el.style.length)
            {
               return prefixes[i] + "calc";
            }
         }
      })();
      /**
       * @use The second helper function allows elements and string selectors to be used
       interchangeably. In either case an element is returned. This allows us to
       do `SplitPanes(elem1, elem2)` as well as `SplitPanes('#id1', '#id2')`.
       * @param el
       * @returns {*}
       * @private
       */
      let _elementOrSelector = function (el)
      { //typeof el === 'string' || el instanceof String
         if (Bu.isString(el))
         {
            return document.querySelector(el);
         }
         else
         {
            return el;
         }
      };
      // The main function to initialize a split. SplitPanes.js thinks about each pair
      // of elements as an independent pair. Dragging the gutter between two elements
      // only changes the dimensions of elements in that pair. This is key to understanding
      // how the following functions operate, since each function is bound to a pair.
      //
      // A pair object is shaped like this:
      //
      // {
      //     a: DOM element,
      //     b: DOM element,
      //     aMin: Number,
      //     bMin: Number,
      //     dragging: Boolean,
      //     parent: DOM element,
      //     isFirst: Boolean,
      //     isLast: Boolean,
      //     direction: 'horizontal' | 'vertical'
      // }
      //
      // The basic sequence:
      //
      // 1. Set defaults to something sane. `options` doesn't have to be passed at all.
      // 2. Initialize a bunch of strings based on the direction we're splitting.
      //    A lot of the behavior in the rest of the library is paramatized down to
      //    rely on CSS strings and classes.
      // 3. Define the dragging helper functions, and a few helpers to go with them.
      // 4. Define a few more functions that "balance" the entire split instance.
      //    SplitPanes.js tries it's best to cope with min sizes that don't add up.
      // 5. Loop through the elements while pairing them off. Every pair gets an
      //    `pair` object, a gutter, and special isFirst/isLast properties.
      // 6. Actually size the pair elements, insert gutters and attach event listeners.
      // 7. Balance all of the pairs to accomodate min sizes as best as possible.
      /**
       *
       * @param els {Array} selector or object
       * @param options {Object}
       * @returns {{setSizes: setSizes, collapse: collapse, destroy: destroy}}
       * @constructor
       */
      Bd.SplitPanes = function (els, options)
      {
         var dimension,
             i,
             clientDimension,
             clientAxis,
             position,
             gutterClass,
             paddingA,
             paddingB,
             pairs = [];

         // 1. Set defaults to something sane. `options` doesn't have to be passed at all,
         // so create an options object if none exists. Pixel values 10, 100 and 30 are
         // arbitrary but feel natural.
         options = Bu.defined(options) ? options : {};

         if (!Bu.defined(options.gutterSize))
         {
            options.gutterSize = 10;
         }

         if (!Bu.defined(options.minSize))
         {
            options.minSize = 100;
         }

         if (!Bu.defined(options.snapOffset))
         {
            options.snapOffset = 30;
         }

         if (!Bu.defined(options.direction))
         {
            options.direction = 'horizontal';
         }
         /*if (typeof options.direction === 'undefined')
          {
          options.direction = 'horizontal';
          }*/

         // 2. Initialize a bunch of strings based on the direction we're splitting.
         // A lot of the behavior in the rest of the library is paramatized down to
         // rely on CSS strings and classes.
         if (options.direction === 'horizontal')
         {
            dimension = 'width';
            clientDimension = 'clientWidth';
            clientAxis = 'clientX';
            position = 'left';
            gutterClass = 'gutter gutter-horizontal';
            paddingA = 'paddingLeft';
            paddingB = 'paddingRight';

            if (!options.cursor)
            {
               options.cursor = 'ew-resize';
            }
         }
         else if (options.direction === 'vertical')
         {
            dimension = 'height';
            clientDimension = 'clientHeight';
            clientAxis = 'clientY';
            position = 'top';
            gutterClass = 'gutter gutter-vertical';
            paddingA = 'paddingTop';
            paddingB = 'paddingBottom';
            if (!options.cursor)
            {
               options.cursor = 'ns-resize';
            }
         }

         // 3. Define the dragging helper functions, and a few helpers to go with them.
         // Each helper is bound to a pair object that contains it's metadata. This
         // also makes it easy to store references to listeners that that will be
         // added and removed.
         //
         // Even though there are no other functions contained in them, aliasing
         // this to self saves 50 bytes or so since it's used so frequently.
         //
         // The pair object saves metadata like dragging state, position and
         // event listener references.
         //
         // startDragging calls `calculateSizes` to store the inital size in the pair object.
         // It also adds event listeners for mouse/touch events,
         // and prevents selection while dragging so avoid the selecting text.
         var startDragging  = function (e)
             {
                // Alias frequently used variables to save space. 200 bytes.
                var self = this,
                    a    = self.a,
                    b    = self.b;

                // Call the onDragStart callback.
                if (!self.dragging && options.onDragStart)
                {
                   options.onDragStart()
                }

                // Don't actually drag the element. We emulate that in the drag function.
                e.preventDefault();

                // Set the dragging property of the pair object.
                self.dragging = true;

                // Create two event listeners bound to the same pair object and store
                // them in the pair object.
                self.move = drag.bind(self);
                self.stop = stopDragging.bind(self);
                // All the binding. `window` gets the stop events in case we drag out of the elements.
                global[addEvt]('mouseup', self.stop);
                global[addEvt]('touchend', self.stop);
                global[addEvt]('touchcancel', self.stop);

                self.parent[addEvt]('mousemove', self.move);
                self.parent[addEvt]('touchmove', self.move);

                // Disable selection. Disable!
                a[addEvt]('selectstart', noop);
                a[addEvt]('dragstart', noop);
                b[addEvt]('selectstart', noop);
                b[addEvt]('dragstart', noop);
                //
                // a.style.userSelect = 'none';
                // a.style.webkitUserSelect = 'none';
                // a.style.MozUserSelect = 'none';
                // a.style.pointerEvents = 'none';

                Bd.css(a, {
                   userSelect       : 'none',
                   webkitUserSelect : 'none',
                   MozUserSelect    : 'none',
                   pointerEvents    : 'none'
                });

                Bd.css(b, {
                   userSelect       : 'none',
                   webkitUserSelect : 'none',
                   MozUserSelect    : 'none',
                   pointerEvents    : 'none'
                });

                // b.style.userSelect = 'none';
                // b.style.webkitUserSelect = 'none';
                // b.style.MozUserSelect = 'none';
                // b.style.pointerEvents = 'none';

                // Set the cursor, both on the gutter and the parent element.
                // Doing only a, b and gutter causes flickering.
                self.gutter.style.cursor = options.cursor;
                self.parent.style.cursor = options.cursor;

                // Cache the initial sizes of the pair.
                calculateSizes.call(self);
             },

             // stopDragging is very similar to startDragging in reverse.
             stopDragging   = function ()
             {
                var self = this,
                    a    = self.a,
                    b    = self.b;

                if (self.dragging && options.onDragEnd)
                {
                   options.onDragEnd();
                }

                self.dragging = false;

                // Remove the stored event listeners. This is why we store them.
                global[removeEventListener]('mouseup', self.stop);
                global[removeEventListener]('touchend', self.stop);
                global[removeEventListener]('touchcancel', self.stop);

                self.parent[removeEventListener]('mousemove', self.move);
                self.parent[removeEventListener]('touchmove', self.move);

                // Delete them once they are removed. I think this makes a difference
                // in memory usage with a lot of splits on one page. But I don't know for sure.
                delete self.stop;
                delete self.move;

                a[removeEventListener]('selectstart', noop);
                a[removeEventListener]('dragstart', noop);
                b[removeEventListener]('selectstart', noop);
                b[removeEventListener]('dragstart', noop);

                /* a.style.userSelect = '';
                 a.style.webkitUserSelect = '';
                 a.style.MozUserSelect = '';
                 a.style.pointerEvents = '';*/

                Bu.css(a, {
                   userSelect       : '',
                   webkitUserSelect : '',
                   MozUserSelect    : '',
                   pointerEvents    : ''
                });

                Bu.css(b, {
                   userSelect       : '',
                   webkitUserSelect : '',
                   MozUserSelect    : '',
                   pointerEvents    : ''
                });

                // b.style.userSelect = '';
                // b.style.webkitUserSelect = '';
                // b.style.MozUserSelect = '';
                // b.style.pointerEvents = '';

                // self.gutter.style.cursor = '';
                Bu.css(self.gutter, { cursor : '' });
                Bu.css(self.parent, { cursor : '' });

                // self.parent.style.cursor = '';
             },

             // drag, where all the magic happens. The logic is really quite simple:
             //
             // 1. Ignore if the pair is not dragging.
             // 2. Get the offset of the event.
             // 3. Snap offset to min if within snappable range (within min + snapOffset).
             // 4. Actually adjust each element in the pair to offset.
             //
             // ---------------------------------------------------------------------
             // |    | <- this.aMin               ||              this.bMin -> |    |
             // |    |  | <- this.snapOffset      ||     this.snapOffset -> |  |    |
             // |    |  |                         ||                        |  |    |
             // |    |  |                         ||                        |  |    |
             // ---------------------------------------------------------------------
             // | <- this.start                                        this.size -> |
             drag           = function (e)
             {
                var offset;

                if (!this.dragging) return;

                // Get the offset of the event from the first side of the
                // pair `this.start`. Supports touch events, but not multitouch, so only the first
                // finger `touches[0]` is counted.
                if ('touches' in e)
                {
                   offset = e.touches[0][clientAxis] - this.start
                }
                else
                {
                   offset = e[clientAxis] - this.start
                }

                // If within snapOffset of min or max, set offset to min or max.
                // snapOffset buffers aMin and bMin, so logic is opposite for both.
                // Include the appropriate gutter sizes to prevent overflows.
                if (offset <= this.aMin + options.snapOffset + this.aGutterSize)
                {
                   offset = this.aMin + this.aGutterSize
                }
                else if (offset >= this.size - (this.bMin + options.snapOffset + this.bGutterSize))
                {
                   offset = this.size - (this.bMin + this.bGutterSize)
                }

                // Actually adjust the size.
                adjust.call(this, offset);

                // Call the drag callback continously. Don't do anything too intensive
                // in this callback.
                if (options.onDrag)
                {
                   options.onDrag();
                }
             },

             // Cache some important sizes when drag starts, so we don't have to do that
             // continously:
             //
             // `size`: The total size of the pair. First element + second element + first gutter + second gutter.
             // `percentage`: The percentage between 0-100 that the pair occupies in the parent.
             // `start`: The leading side of the first element.
             //
             // ------------------------------------------------ - - - - - - - - - - -
             // |      aGutterSize -> |||                      |                     |
             // |                     |||                      |                     |
             // |                     |||                      |                     |
             // |                     ||| <- bGutterSize       |                     |
             // ------------------------------------------------ - - - - - - - - - - -
             // | <- start                             size -> |       parentSize -> |
             calculateSizes = function ()
             {
                // Figure out the parent size minus padding.
                var computedStyle = global.getComputedStyle(this.parent),
                    parentSize    = this.parent[clientDimension] -
                                    Bu.pInt(computedStyle[paddingA]) - Bu.pInt(computedStyle[paddingB]);

                this.size = this.a[getBoundingClientRect]()[dimension] +
                            this.b[getBoundingClientRect]()[dimension] + this.aGutterSize + this.bGutterSize;

                this.percentage = Math.min(this.size / parentSize * 100, 100);
                this.start = this.a[getBoundingClientRect]()[position]
             },

             // Actually adjust the size of elements `a` and `b` to `offset` while dragging.
             // calc is used to allow calc(percentage + gutterpx) on the whole split instance,
             // which allows the viewport to be resized without additional logic.
             // Element a's size is the same as offset. b's size is total size - a size.
             // Both sizes are calculated from the initial parent percentage, then the gutter size is subtracted.
             adjust         = function (offset)
             {
                this.a.style[dimension] = _calc + '(' + (offset / this.size * this.percentage) +
                                          '% - ' + this.aGutterSize + 'px)';

                this.b.style[dimension] = _calc + '(' + (this.percentage - (offset / this.size * this.percentage)) +
                                          '% - ' + this.bGutterSize + 'px)'
             },

             // 4. Define a few more functions that "balance" the entire split instance.
             // SplitPanes.js tries it's best to cope with min sizes that don't add up.
             // At some point this should go away since it breaks out of the calc(% - px) model.
             // Maybe it's a user error if you pass unComputable minSizes.
             fitMin         = function ()
             {
                var self = this,
                    a    = self.a,
                    b    = self.b;

                if (a[getBoundingClientRect]()[dimension] < self.aMin)
                {
                   a.style[dimension] = (self.aMin - self.aGutterSize) + 'px';
                   b.style[dimension] = (self.size - self.aMin - self.aGutterSize) + 'px'
                }
                else if (b[getBoundingClientRect]()[dimension] < self.bMin)
                {
                   a.style[dimension] = (self.size - self.bMin - self.bGutterSize) + 'px';
                   b.style[dimension] = (self.bMin - self.bGutterSize) + 'px'
                }
             },

             fitMinReverse  = function ()
             {
                var self = this,
                    a    = self.a,
                    b    = self.b;

                if (b[getBoundingClientRect]()[dimension] < self.bMin)
                {
                   a.style[dimension] = (self.size - self.bMin - self.bGutterSize) + 'px';
                   b.style[dimension] = (self.bMin - self.bGutterSize) + 'px'
                }
                else if (a[getBoundingClientRect]()[dimension] < self.aMin)
                {
                   a.style[dimension] = (self.aMin - self.aGutterSize) + 'px';
                   b.style[dimension] = (self.size - self.aMin - self.aGutterSize) + 'px'
                }
             },

             balancePairs   = function (pairs)
             {
                var i   = 0,
                    len = pairs.length;

                for (; i < len; i++)
                {
                   calculateSizes.call(pairs[i]);
                   fitMin.call(pairs[i])
                }

                for (i = len - 1; i >= 0; i--)
                {
                   calculateSizes.call(pairs[i]);
                   fitMinReverse.call(pairs[i])
                }
             },

             setElementSize = function (el, size, gutterSize)
             {
                // SplitPanes.js allows setting sizes via numbers (ideally), or if you must,
                // by string, like '300px'. This is less than ideal, because it breaks
                // the fluid layout that `calc(% - px)` provides. You're on your own if you do that,
                // make sure you calculate the gutter size by hand.
                if (typeof size !== 'string' && !(size instanceof String))
                {
                   if (!isIE8)
                   {
                      size = _calc + '(' + size + '% - ' + gutterSize + 'px)'
                   }
                   else
                   {
                      size = options.sizes[i] + '%'
                   }
                }

                el.style[dimension] = size
             },

             // No-op function to prevent default. Used to prevent selection.
             noop           = function () { return false },

             // All DOM elements in the split should have a common parent. We can grab
             // the first elements parent and hope users read the docs because the
             // behavior will be whacky otherwise.
             parent         = _elementOrSelector(els[0]).parentNode;

         // Set default options.sizes to equal percentages of the parent element.
         if (!options.sizes)
         {
            var percent = 100 / els.length;

            options.sizes = [];

            for (i = 0; i < els.length; i++)
            {
               options.sizes.push(percent);
            }
         }

         // Standardize minSize to an array if it isn't already. This allows minSize
         // to be passed as a number.
         if (!Array.isArray(options.minSize))
         {
            var minSizes = [];

            for (i = 0; i < els.length; i++)
            {
               minSizes.push(options.minSize);
            }

            options.minSize = minSizes;
         }

         // 5. Loop through the elements while pairing them off. Every pair gets a
         // `pair` object, a gutter, and isFirst/isLast properties.
         //
         // Basic logic:
         //
         // - Starting with the second element `i > 0`, create `pair` objects with
         //   `a = ids[i - 1]` and `b = ids[i]`
         // - Set gutter sizes based on the _pair_ being first/last. The first and last
         //   pair have gutterSize / 2, since they only have one half gutter, and not two.
         // - Create gutter elements and add event listeners.
         // - Set the size of the elements, minus the gutter sizes.
         //
         // -----------------------------------------------------------------------
         // |     i=0     |         i=1         |        i=2       |      i=3     |
         // |             |       isFirst       |                  |     isLast   |
         // |           pair 0                pair 1             pair 2           |
         // |             |                     |                  |              |
         // -----------------------------------------------------------------------
         for (i = 0; i < els.length; i++)
         {
            var el          = _elementOrSelector(els[i]),
                isFirstPair = (i === 1),
                isLastPair  = (i === els.length - 1),
                size        = options.sizes[i],
                gutterSize  = options.gutterSize,
                pair;

            if (i > 0)
            {
               // Create the pair object with it's metadata.
               pair = {
                  a         : _elementOrSelector(els[i - 1]),
                  b         : el,
                  aMin      : options.minSize[i - 1],
                  bMin      : options.minSize[i],
                  dragging  : false,
                  parent    : parent,
                  isFirst   : isFirstPair,
                  isLast    : isLastPair,
                  direction : options.direction
               };

               // For first and last pairs, first and last gutter width is half.
               pair.aGutterSize = options.gutterSize;
               pair.bGutterSize = options.gutterSize;

               if (isFirstPair)
               {
                  pair.aGutterSize = options.gutterSize / 2
               }

               if (isLastPair)
               {
                  pair.bGutterSize = options.gutterSize / 2
               }
            }

            // Determine the size of the current element. IE8 is supported by
            // staticly assigning sizes without draggable gutters. Assigns a string
            // to `size`.
            //
            // IE9 and above
            if (!isIE8)
            {
               // Create gutter elements for each pair.
               if (i > 0)
               {
                  var gutter = document.createElement('div');

                  gutter.className = gutterClass;
                  gutter.style[dimension] = options.gutterSize + 'px';

                  gutter[addEvt]('mousedown', startDragging.bind(pair));
                  gutter[addEvt]('touchstart', startDragging.bind(pair));

                  parent.insertBefore(gutter, el);

                  pair.gutter = gutter
               }

               // Half-size gutters for first and last elements.
               if (i === 0 || i === els.length - 1)
               {
                  gutterSize = options.gutterSize / 2
               }
            }

            // Set the element size to our determined size.
            setElementSize(el, size, gutterSize);

            // After the first iteration, and we have a pair object, append it to the
            // list of pairs.
            if (i > 0)
            {
               pairs.push(pair)
            }
         }

         // Balance the pairs to try to accomodate min sizes.
         balancePairs(pairs);

         return {
            setSizes : function (sizes)
            {
               for (var i = 0; i < sizes.length; i++)
               {
                  if (i > 0)
                  {
                     var pair = pairs[i - 1];

                     setElementSize(pair.a, sizes[i - 1], pair.aGutterSize);
                     setElementSize(pair.b, sizes[i], pair.bGutterSize)
                  }
               }
            },

            collapse : function (i)
            {
               var pair;

               if (i === pairs.length)
               {
                  pair = pairs[i - 1];

                  calculateSizes.call(pair);
                  adjust.call(pair, pair.size - pair.bGutterSize)
               }
               else
               {
                  pair = pairs[i];

                  calculateSizes.call(pair);
                  adjust.call(pair, pair.aGutterSize)
               }
            },

            destroy : function ()
            {
               for (var i = 0; i < pairs.length; i++)
               {
                  pairs[i].parent.removeChild(pairs[i].gutter);
                  pairs[i].a.style[dimension] = '';
                  pairs[i].b.style[dimension] = ''
               }
            }
         }
      };

// Play nicely with module systems, and the browser too if you include it raw.
      if (typeof exports !== 'undefined')
      {
         if (typeof module !== 'undefined' && module.exports)
         {
            var exports = module.exports = Split;
         }
         exports.Bd.SplitPanes = Bd.SplitPanes;
      }
      else
      {
         Bee.Widget.SplitPanes = Bd.SplitPanes;
      }

// Call our wrapper function with the current global. In this case, `window`.
   }).call(window);
})(Bee.Utils, Bee.Widget);
