

/**
 * @Author Created by ARCH on 25/08/2016.
 * @Copyright (C) 2016
 * Bee Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Bee Studios Eula
 * you may not use this file except in compliance with the License.
 *
 * You may obtain a copy of the License at
 * http://www.bargestudios.com/bumblebee/licence
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
 *
 * @fileOverview A fork of datepicker.js by 2017 Patrick Kunka / KunkaLabs Ltd
 * Added support for paasing strings to the constructor to and resolving the string into an el
 * made monday the first day to appear
 * Enhanced to support calender changing while mouse is help down (this speeds up over time)
 *
 * @requires Barge.Utils
 * @requires Barge.String
 * @requires Barge.Array
 * @requires Barge.Object
 * @requires Barge.Widget
 *
 *
 * @user MSG: Some lines in this file use constructs from es6 or later
 * to make it es5 compatible check for es6+ or #es6+ in comments
 * you may also want to convert all let cond cost to var
 */
(function (root, factory)
{
   if (typeof exports === 'object' && typeof module === 'object')
   {
      module.exports = factory();
   }
   else if (typeof define === 'function' && define.amd)
   {
      define([], factory);
   }
   else if (typeof exports === 'object')
   {
      exports["datepicker"] = factory();
   }
   else
   {
      root["datepicker"] = factory();
   }
})(this, function ()
{/*region*/
   let Bu = Bee.Utils,
       Bd = Bee.Widget;
   /*endregion*/
   return (function (modules)
   { // webpackBootstrap
      // The module cache
      let installedModules = {};

      // The require function
      function __webpack_require__(moduleId)
      {
         // Check if module is in cache
         if (installedModules[moduleId])
         {
            return installedModules[moduleId].exports;
         }

         // Create a new module (and put it into the cache)
         let module = installedModules[moduleId] = {
            exports : {},
            id      : moduleId,
            loaded  : false
         };

         // Execute the module function
         modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

         // Flag the module as loaded
         module.loaded = true;

         // Return the exports of the module
         return module.exports;
      }

      // expose the modules object (__webpack_modules__)
      __webpack_require__.m = modules;

      // expose the module cache
      __webpack_require__.c = installedModules;

      // __webpack_public_path__
      __webpack_require__.p = "";

      // Load entry module and return exports
      return __webpack_require__(0);
   })
   /************************************************************************/
   ([
       /* 0 */
       function (module, exports, __webpack_require__)
       {

          'use strict';

          let _Facade = __webpack_require__(23);

          let _Facade2 = _interopRequireDefault(_Facade);

          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default : obj }; }

          /**
           * @param {(HTMLInputElement|string)}   input
           * @param {object}                      [config={}]
           */

          function factory(input)
          {
             let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

             let instance = null;

             if (typeof input === 'string')
             {
                input = document.querySelector(input);
             }

             for (let i = 0; instance = _Facade2.default.cache[i]; i++)
             {
                if (instance.input === input) return instance;
             }

             instance = new _Facade2.default(input, config);

             _Facade2.default.cache.push(instance);

             return instance;
          }

          module.exports = factory;

       },
       /* 1 */
       function (module, exports, __webpack_require__)
       {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _typeof = typeof Symbol === "function" &&
                        typeof Symbol.iterator === "symbol" ? function (obj)
                        { return typeof obj; } : function (obj)
                        {
                           return obj &&
                                  typeof Symbol ===
                                  "function" &&
                                  obj.constructor ===
                                  Symbol &&
                                  obj !==
                                  Symbol.prototype ? "symbol" : typeof obj;
                        };

          let _createClass = function ()
          {
             function defineProperties(target, props)
             {
                for (let i = 0; i < props.length; i++)
                {
                   let descriptor = props[i];
                   descriptor.enumerable = descriptor.enumerable || false;
                   descriptor.configurable = true;
                   if ("value" in descriptor) descriptor.writable = true;
                   Object.defineProperty(target, descriptor.key, descriptor);
                }
             }

             return function (Constructor, protoProps, staticProps)
             {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
             };
          }();

          //region vars
          let _Actions = __webpack_require__(15);

          let _Actions2 = _interopRequireDefault(_Actions);

          let _ConfigRoot = __webpack_require__(24);

          let _ConfigRoot2 = _interopRequireDefault(_ConfigRoot);

          let _CssTranslates = __webpack_require__(16);

          let _CssTranslates2 = _interopRequireDefault(_CssTranslates);

          let _Dom = __webpack_require__(9);

          let _Dom2 = _interopRequireDefault(_Dom);

          let _EventBinding = __webpack_require__(10);

          let _EventBinding2 = _interopRequireDefault(_EventBinding);

          let _eventsInput = __webpack_require__(12);

          let _eventsInput2 = _interopRequireDefault(_eventsInput);

          let _eventsCalendar = __webpack_require__(13);

          let _eventsCalendar2 = _interopRequireDefault(_eventsCalendar);

          let _State = __webpack_require__(2);

          let _State2 = _interopRequireDefault(_State);

          let _Templates = __webpack_require__(14);

          let _Templates2 = _interopRequireDefault(_Templates);

          let _Util = __webpack_require__(11);

          let _Util2 = _interopRequireDefault(_Util);

          let _Month = __webpack_require__(18);

          let _Month2 = _interopRequireDefault(_Month);

          let _Day = __webpack_require__(20);

          let _Day2 = _interopRequireDefault(_Day);

          let _DayMarker = __webpack_require__(21);

          let _DayMarker2 = _interopRequireDefault(_DayMarker);

          let _Week = __webpack_require__(22);

          let _Week2 = _interopRequireDefault(_Week);
          //endregion

          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default : obj }; }

          function _toConsumableArray(arr)
          {
             if (Array.isArray(arr))
             {
                let arr2 = Array(arr.length);
                for (var i = 0; i < arr.length; i++)
                {
                   arr2[i] = arr[i];
                }
                return arr2;
             }
             else
             { return Array.from(arr); }
          }

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          let Datepicker = function ()
          {
             /**
              * @constructor
              * @param {HTMLInputElement} input
              * @param {object}           [config={}]
              */
             function Datepicker(input)
             {
                let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

                _classCallCheck(this, Datepicker);

                this.value = '';
                this.state = null;
                this.dom = new _Dom2.default();
                this.config = new _ConfigRoot2.default();
                this.isOpen = false;
                this.isFocussing = false;
                this.isTransitioning = false;
                this.bindingsInput = [];
                this.bindingsCalendar = [];

                Object.seal(this);

                this.init(input, config);
             }

             /* Private Methods
              ---------------------------------------------------------------------- */
             /**
              * @private
              * @return {void}
              */
             _createClass(Datepicker, [{
                key   : 'init',
                value : function init(input, config)
                {
                   let _bindingsInput;

                   if (Bu.isString(input))
                   {
                      input = Bd.getEl(input);
                   }

                   if (!(input instanceof HTMLInputElement))
                   {
                      throw new TypeError('[Datepicker] Invalid input element provided');
                   }

                   input.onkeydown = function (e)
                   {
                      e.preventDefault();
                   };

                   if (!config || (typeof config === 'undefined' ? 'undefined' : _typeof(config)) !== 'object')
                   {
                      throw new TypeError('[Datepicker] Invalid configuration object provided');
                   }

                   this.dom.input = input;

                   this.configure(config);
                   this.parseInitialValue();
                   (_bindingsInput = this.bindingsInput).push.apply(_bindingsInput, _toConsumableArray(this.bindEvents(_eventsInput2.default)));
                }

                /**
                 * @private
                 * @param   {object} config
                 * @return  {void}
                 */

             }, {
                key   : 'configure',
                value : function configure(config)
                {
                   _Util2.default.extend(this.config, config, true, Datepicker.handleConfigureError.bind(this));
                }

                /**
                 * @private
                 * @return {void}
                 */

             }, {
                key   : 'parseInitialValue',
                value : function parseInitialValue()
                {
                   let value = '';
                   let transform = null;

                   if (!(value = this.dom.input.value)) return;

                   if (typeof (transform = this.config.transform.input) !== 'function')
                   {
                      this.value = value;

                      return;
                   }

                   this.value = transform(value);

                   if (!this.value || typeof this.value !== 'string')
                   {
                      throw new TypeError('[Datepicker] Transform functions must return a valid string');
                   }
                }

                /**
                 * @private
                 * @param   {Array.<object>} eventsRaw
                 * @return  {Array.<EventBinding>}
                 */

             }, {
                key   : 'bindEvents',
                value : function bindEvents(eventsRaw)
                {
                   let _this = this;

                   return eventsRaw.map(function (eventRaw)
                                        {
                                           return _this.bindEvent(eventRaw);
                                        });
                }

                /**
                 * @private
                 * @param   {object} eventRaw
                 * @return  {EventBinding}
                 */

             }, {
                key   : 'bindEvent',
                value : function bindEvent(eventRaw)
                {
                   let binding = _Util2.default.extend(new _EventBinding2.default(), eventRaw);

                   let fn = null;
                   let el = null;

                   if (typeof (fn = this[binding.bind]) !== 'function')
                   {
                      throw new Error('No method found with name "' + binding.bind + '"');
                   }

                   binding.fn = fn.bind(this);

                   if (binding.el && !((el = this.dom[binding.el]) instanceof HTMLElement))
                   {
                      throw new Error('No element reference with name "' + binding.el + '"');
                   }
                   else if (!binding.el)
                   {
                      el = window;
                   }

                   binding.ref = el;

                   binding.ref.addEventListener(binding.on, binding.fn);

                   return binding;
                }

                /**
                 * @private
                 * @param   {Array.<EventBinding>} eventBindings
                 * @return  {void}
                 */

             }, {
                key   : 'unbindEvents',
                value : function unbindEvents(eventBindings)
                {
                   while (eventBindings.length)
                   {
                      let binding = eventBindings.pop();

                      binding.ref.removeEventListener(binding.on, binding.fn);
                   }
                }

                /**
                 * @private
                 * @return {void}
                 */

             }, {
                key   : 'handleFocus',
                value : function handleFocus()
                {
                   let _this2 = this;
                   //
                   if (this.isOpen) return;
                   //
                   this.isFocussing = true;
                   //
                   setTimeout(function ()
                              {
                                 return _this2.isFocussing = false;
                              }, Datepicker.FOCUS_BLOCK_DURATION);
                   //
                   this.build();
                }

                /**
                 * @private
                 * @return {void}
                 */

             }, {
                key   : 'handleWindowClick',
                value : function handleWindowClick()
                {
                   if (!this.isOpen || this.isFocussing) return;

                   this.unbuild();
                }

                /**
                 * @private
                 * @param   {MouseEvent} e
                 * @return  {void}
                 */

             }, {
                key   : 'handleHeaderClick',
                value : function handleHeaderClick(e)
                {

                   let self = this,
                       button = _Util2.default.closestParent(e.target, '[data-ref~="button"]', true);

                   let action = '';

                   e.stopPropagation();

                   if (!button || this.isTransitioning) return;

                   action = button.getAttribute('data-action');

                   this.updateState(action);

                   //MSG added support for spinning calender while mouse is held down
                   //MSG spinning speeds up 2x and 4x after 400ms x 7 and 200ms x 7 respectively
                   let interval = null,
                       i = 0;

                   interval = window.setInterval(function ()
                                                 {
                                                    i++;
                                                    if (i ===7)
                                                    {
                                                       clearInterval(interval);
                                                       speedUpTime2x();
                                                    }
                                                    self.updateState(action);
                                                    //400 milliseconds is okay if you want the
                                                 }, 400);

                   function speedUpTime2x()
                   {
                      i=0;
                      interval = window.setInterval(function ()
                                                    {
                                                       i++;
                                                       if (i ===7)
                                                       {
                                                          clearInterval(interval);
                                                          speedUpTime4x();
                                                       }
                                                       self.updateState(action);
                                                       //400 milliseconds is okay if you want the
                                                    }, 200);
                   }

                   function speedUpTime4x()
                   {
                      interval = window.setInterval(function ()
                                                    {
                                                       self.updateState(action);
                                                       //400 milliseconds is okay if you want the
                                                    }, 100);
                   }

                   function clearTickInterval()
                   {
                      clearInterval(interval);
                      window.removeEventListener("mouseup", clearTickInterval);
                   }

                   window.addEventListener("mouseup", clearTickInterval);

                }

                /**
                 * @param   {MouseEvent} e
                 * @return  {void}
                 */

             }, {
                key   : 'handleTbodyClick',
                value : function handleTbodyClick(e)
                {
                   let _this3 = this;

                   let cell = _Util2.default.closestParent(e.target, '[data-ref="day"]', true);
                   let eventConfig = { bubbles : true };
                   let toEmit = [new Event('input', eventConfig), new Event('change', eventConfig)];

                   let day = -1;
                   let month = -1;
                   let date = '';
                   let callback = null;
                   let transform = null;

                   e.stopPropagation();

                   if (!cell) return;

                   day = parseInt(cell.getAttribute('data-day'));
                   month = parseInt(cell.getAttribute('data-month'));

                   date = this.state.year + '-' + _Util2.default.pad(month) + '-' + _Util2.default.pad(day);

                   this.value = date;

                   if (typeof (transform = this.config.transform.output) === 'function')
                   {
                      this.dom.input.value = transform(this.value);
                   }
                   else
                   {
                      this.dom.input.value = this.value;
                   }

                   if (!this.dom.input.value)
                   {
                      throw new TypeError('[Datepicker] Transform must return a valid string');
                   }

                   if (typeof (callback = this.config.callbacks.onSelect) === 'function')
                   {
                      callback(this.value);
                   }

                   toEmit.forEach(function (e)
                                  {
                                     return _this3.dom.input.dispatchEvent(e);
                                  });

                   if (this.config.behavior.closeOnSelect)
                   {
                      this.unbuild();
                   }
                   else
                   {
                      this.updateState();
                   }
                }

                /**
                 * @private
                 * @param   {string} [action='']
                 * @return  {Promise}
                 */

             }, {
                key   : 'updateState',
                value : function updateState()
                {
                   let _this4 = this;

                   let action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

                   let state = action ? Datepicker.getStateFromAction(this.state, action) : Datepicker.getStateFromDate(this.value);
                   let data = this.getMonthData(state);
                   let html = this.render(data);

                   this.state = state;

                   return this.updateView(html, action).then(function ()
                                                             {
                                                                let callback = null;

                                                                if (action)
                                                                {
                                                                   callback = _this4.config.callbacks.onChangeView;
                                                                }

                                                                if (typeof callback === 'function')
                                                                {
                                                                   callback();
                                                                }
                                                             }).catch(function (err)
                                                                      {
                                                                         //MSG: silensing the error
                                                                         //return console.error(err);
                                                                      });
                }

                /**
                 * @private
                 * @return {Promise}
                 */

             }, {
                key   : 'build',
                value : function build()
                {
                   let _this5 = this;

                   let state = this.value ? Datepicker.getStateFromDate(this.value) : Datepicker.getStateFromToday();
                   let data = this.getMonthData(state);
                   let html = this.render(data);

                   return this.show(html).then(function ()
                                               {
                                                  let _bindingsCalendar;

                                                  let callback = null;

                                                  _this5.cacheCalendarDom();

                                                  (_bindingsCalendar = _this5.bindingsCalendar).push.apply(_bindingsCalendar, _toConsumableArray(_this5.bindEvents(_eventsCalendar2.default)));

                                                  _this5.state = state;

                                                  _this5.isOpen = true;

                                                  if (typeof (callback = _this5.config.callbacks.onOpen) === 'function')
                                                  {
                                                     callback();
                                                  }
                                               }).catch(function (err)
                                                        {
                                                           return console.error(err);
                                                        });
                }

                /**
                 * @private
                 * @return {void}
                 */

             }, {
                key   : 'cacheCalendarDom',
                value : function cacheCalendarDom()
                {
                   this.dom.header = this.dom.root.querySelector('[data-ref="header"]');
                   this.dom.calendar = this.dom.root.querySelector('[data-ref="calendar"]');
                   this.dom.month = this.dom.root.querySelector('[data-ref="month"]');
                   this.dom.tbody = this.dom.root.querySelector('[data-ref="tbody"]');
                }

                /**
                 * @private
                 * @return {Promise}
                 */

             }, {
                key   : 'unbuild',
                value : function unbuild()
                {
                   let _this6 = this;

                   return this.hide().then(function ()
                                           {
                                              let callback = null;

                                              if (_this6.dom.root)
                                              {
                                                 _this6.dom.root.parentElement.removeChild(_this6.dom.root);
                                              }

                                              _this6.unbindEvents(_this6.bindingsCalendar);

                                              _this6.dom.root = _this6.dom.buttonPrevYear = _this6.dom.buttonNextYear =
                                                 _this6.dom.buttonPrevMonth = _this6.dom.buttonNextMonth = null;

                                              _this6.isOpen = false;

                                              if (typeof (callback = _this6.config.callbacks.onClose) === 'function')
                                              {
                                                 callback();
                                              }
                                           }).catch(function (err)
                                                    {
                                                       return console.error(err);
                                                    });
                }

                /**
                 * @private
                 * @param   {State} state
                 * @return  {Month}
                 */
             }, {
                key   : 'getMonthData',
                value : function getMonthData(state)
                {
                   let month = new _Month2.default();
                   let totalWeeks = Math.ceil((state.startDayIndex + state.totalDays) / 7); // eslint-disable-line no-magic-numbers

                   let currentDayNumber = state.previousTotalDays - (state.startDayIndex - 1);
                   let zone = 'PREV';

                   month.calendarClassName = this.getClassName('calendar');
                   month.monthClassName = this.getClassName('month');
                   month.headerClassName = this.getClassName('header');
                   month.headingClassName = this.getClassName('heading');
                   month.buttonGroupClassName = this.getClassName('button-group');
                   month.containerClassName = this.config.classNames.block;

                   month.buttonPrevMonthClassName = [this.getClassName('button'), this.getClassName('button', 'prev-month')].join(' ');

                   month.buttonNextMonthClassName = [this.getClassName('button'), this.getClassName('button', 'next-month')].join(' ');

                   month.buttonPrevYearClassName = [this.getClassName('button'), this.getClassName('button', 'prev-year')].join(' ');

                   month.buttonNextYearClassName = [this.getClassName('button'), this.getClassName('button', 'next-year')].join(' ');

                   month.monthIndex = state.monthIndex;
                   month.year = state.year;

                   for (let i = 0; i < totalWeeks; i++)
                   {
                      let week = new _Week2.default();

                      week.className = this.getClassName('week');

                      for (let j = 0; j < 7; j++)
                      {
                         // eslint-disable-line no-magic-numbers
                         let classList = [];
                         let day = new _Day2.default();

                         if (i === 0)
                         {
                            let marker = new _DayMarker2.default();

                            classList.push(this.getClassName('marker'));

                            if ([5, 6].indexOf(j) > -1)
                            {
                               // eslint-disable-line no-magic-numbers
                               classList.push(this.getClassName('marker', 'weekend'));
                            }

                            marker.dayIndex = j;
                            marker.className = classList.join(' ');

                            month.dayMarkers.push(marker);
                         }

                         if (i === 0 && j === state.startDayIndex)
                         {
                            zone = 'SELF';

                            currentDayNumber = 1;
                         }

                         if (i !== 0 && currentDayNumber > state.totalDays)
                         {
                            zone = 'NEXT';

                            currentDayNumber = 1;
                         }

                         day.dayIndex = j;
                         day.dayNumber = currentDayNumber;
                         day.isPadding = zone !== 'SELF';
                         day.isToday = currentDayNumber === state.today;

                         if (currentDayNumber === state.selectedDay && month.monthIndex === state.selectedMonth &&
                             state.year === state.selectedYear && zone === 'SELF')
                         {
                            day.isSelected = true;
                         }

                         day.monthNumber = state.monthIndex + 1;

                         if (zone === 'PREV')
                         {
                            day.monthNumber--;
                         }
                         else if (zone === 'NEXT')
                         {
                            day.monthNumber++;
                         }

                         classList.push(this.getClassName('day'));

                         if (day.isPadding)
                         {
                            classList.push(this.getClassName('day', 'padding'));
                         }

                         if (day.isToday)
                         {
                            classList.push(this.getClassName('day', 'today'));
                         }

                         if (day.isSelected)
                         {
                            classList.push(this.getClassName('day', 'selected'));
                         }

                         if ([5, 6].indexOf(j) > -1)
                         {
                            // eslint-disable-line no-magic-numbers
                            classList.push(this.getClassName('day', 'weekend'));

                         }

                         day.className = classList.join(' ');

                         currentDayNumber++;

                         week.days.push(day);
                      }

                      month.weeks.push(week);
                   }

                   return month;
                }

                /**
                 * @private
                 * @param   {Month} data
                 * @return  {string}
                 */

             }, {
                key   : 'render',
                value : function render(data)
                {
                   data.legendHtml = data.dayMarkers.map(_Templates2.default.marker).join('');
                   data.weeksHtml = data.weeks.map(this.renderWeek.bind(this)).join('');

                   return _Templates2.default.container(data);
                }

                /**
                 * @private
                 * @param   {Week} data
                 * @return  {string}
                 */

             }, {
                key   : 'renderWeek',
                value : function renderWeek(data)
                {
                   data.daysHtml = data.days.map(_Templates2.default.day).join('');

                   return _Templates2.default.week(data);
                }

                /**
                 * @private
                 * @param   {string} elementName
                 * @param   {string} modifierName
                 * @return  {string}
                 */

             }, {
                key   : 'getClassName',
                value : function getClassName(elementName, modifierName)
                {
                   let output = '';
                   let block = '';
                   let element = '';
                   let modifier = '';

                   if (block = this.config.classNames.block)//this tests for emptiness
                   {
                      output += block + this.config.classNames.delineatorElement;
                   }

                   if (element = this.config.classNames[_Util2.default.camelCase('element-' + elementName)])
                   {
                      output += element;
                   }

                   if (modifierName && (modifier = this.config.classNames[_Util2.default.camelCase('modifier-' + modifierName)]))
                   {
                      output += this.config.classNames.delineatorModifier + modifier;
                   }

                   return output;
                }

                /**
                 * @private
                 * @param   {string} html
                 * @return  {Promise}
                 */

             }, {
                key   : 'show',
                value : function show(html)
                {
                   let _this7 = this;

                   return Promise.resolve().then(function ()
                                                 {
                                                    let temp = document.createElement('div');

                                                    temp.innerHTML = html;

                                                    _this7.dom.root = temp.firstElementChild;

                                                    _this7.dom.root.style.opacity = '0';

                                                    _this7.dom.input.parentElement.insertBefore(_this7.dom.root, _this7.dom.input.nextElementSibling);
                                                    //reposition
                                                    Bd.dynamicSpaceElPositioner(_this7.dom.input.nextElementSibling);

                                                    _this7.dom.root.style.transition = 'opacity ' + _this7.config.animation.duration +
                                                                                       'ms';

                                                    return new Promise(function (resolve)
                                                                       {
                                                                          _this7.dom.root.addEventListener('transitionend', function handler(e)
                                                                          {
                                                                             if (e.propertyName !== 'opacity') return;

                                                                             resolve();

                                                                             parent.removeEventListener('transitionend', handler);
                                                                          });

                                                                          setTimeout(function ()
                                                                                     {
                                                                                        return _this7.dom.root.style.opacity = '1';
                                                                                     });
                                                                       });
                                                 }).then(function ()
                                                         {
                                                            _this7.dom.root.style.transition = '';
                                                            _this7.dom.root.style.opacity = '';
                                                         });
                }

                /**
                 * @private
                 * @return  {Promise}
                 */

             }, {
                key   : 'hide',
                value : function hide()
                {
                   if (this.dom.root)
                   {
                      this.dom.root.style.opacity = 0;
                   }

                   return Promise.resolve();
                }

                /**
                 * @private
                 * @param   {string} html
                 * @param   {string} action
                 * @return  {void}
                 */

             }, {
                key   : 'updateView',
                value : function updateView(html, action)
                {
                   let _this8 = this;

                   return Promise.resolve().then(function ()
                                                 {
                                                    let temp = document.createElement('div');

                                                    let newHeader = null;
                                                    let newMonth = null;

                                                    temp.innerHTML = html;

                                                    _this8.unbindEvents(_this8.bindingsCalendar);

                                                    if (action)
                                                    {
                                                       newHeader = temp.querySelector('[data-ref="header"]');
                                                       newMonth = temp.querySelector('[data-ref="month"]');

                                                       _this8.dom.root.replaceChild(newHeader, _this8.dom.header);
                                                       _this8.dom.calendar.appendChild(newMonth, _this8.dom.month);

                                                       return _this8.animateMonthTransition(_this8.dom.calendar.lastElementChild, _this8.dom.month, action);
                                                    }

                                                    _this8.dom.root.innerHTML = temp.firstChild.innerHTML;
                                                 }).then(function ()
                                                         {
                                                            let _bindingsCalendar2;

                                                            _this8.cacheCalendarDom();

                                                            (_bindingsCalendar2 = _this8.bindingsCalendar).push.apply(_bindingsCalendar2, _toConsumableArray(_this8.bindEvents(_eventsCalendar2.default)));
                                                         });
                }

                /**
                 * @private
                 * @param   {HTMLElement} newMonth
                 * @param   {HTMLElement} oldMonth
                 * @param   {string}      action
                 * @return  {Promise}
                 */

             }, {
                key   : 'animateMonthTransition',
                value : function animateMonthTransition(newMonth, oldMonth, action)
                {
                   let _this9 = this;

                   let parent = oldMonth.parentElement;

                   return new Promise(function (resolve)
                                      {
                                         let duration = _this9.config.animation.duration;
                                         let easing = _this9.config.animation.easing;
                                         let translate = _CssTranslates2.default[action];

                                         _this9.isTransitioning = true;

                                         parent.addEventListener('transitionend', function handler(e)
                                         {
                                            if (e.propertyName !== 'transform' || !e.target.matches('[data-ref="month"]')) return;

                                            resolve();

                                            parent.removeEventListener('transitionend', handler);
                                         });

                                         oldMonth.style.transform = 'translate(' + translate.oldXBefore + '%, ' +
                                                                    translate.oldYBefore + '%)';
                                         newMonth.style.transform = 'translate(' + translate.newXBefore + '%, ' +
                                                                    translate.newYBefore + '%)';

                                         setTimeout(function ()
                                                    {
                                                       oldMonth.style.transition = newMonth.style.transition = 'transform ' +
                                                                                                               duration + 'ms' +
                                                                                                               (easing ? ' ' +
                                                                                                               easing : '');

                                                       oldMonth.style.transform = 'translate(' + translate.oldXAfter + '%, ' +
                                                                                  translate.oldYAfter + '%)';
                                                       newMonth.style.transform = 'translate(' + translate.newXAfter + '%, ' +
                                                                                  translate.newYAfter + '%)';
                                                    });
                                      }).then(function ()
                                              {
                                                 parent.removeChild(oldMonth);

                                                 newMonth.style.transition = '';
                                                 newMonth.style.transform = '';

                                                 _this9.isTransitioning = false;
                                              });
                }

                /* Static Methods
                 ---------------------------------------------------------------------- */

                /**
                 * @private
                 * @static
                 * @param   {string} inputDate
                 * @return  {State}
                 */

             }, {
                key : 'open',

                /* Public Methods
                 ---------------------------------------------------------------------- */

                /**
                 * @public
                 * @return {Promise}
                 */

                value : function open()
                {
                   if (this.isOpen) return Promise.resolve();

                   return this.build();
                }

                /**
                 * @public
                 * @return {Promise}
                 */

             }, {
                key   : 'close',
                value : function close()
                {
                   if (!this.isOpen) return Promise.resolve();

                   return this.unbuild();
                }

                /**
                 * @public
                 * @return {string}
                 */

             }, {
                key   : 'getValue',
                value : function getValue()
                {
                   let transform = this.config.transform.output;
                   let value = '';

                   if (typeof transform === 'function')
                   {
                      value = transform(this.value);
                   }
                   else
                   {
                      value = this.value;
                   }

                   if (!value)
                   {
                      throw new TypeError('[Datepicker] Transform must return a valid string');
                   }

                   return value;
                }

                /**
                 * @public
                 * @param   {string} value
                 * @return  {void}
                 */

             }, {
                key   : 'setValue',
                value : function setValue(value)
                {
                   let transform = this.config.transform.input;

                   if (!value || typeof value !== 'string')
                   {
                      throw new TypeError('[Datepicker] Invalid value');
                   }

                   if (typeof transform !== 'function')
                   {
                      this.value = value;

                      return;
                   }

                   this.value = transform(value);

                   if (this.isOpen)
                   {
                      this.updateState();
                   }
                }

                /**
                 * @public
                 * @return {void}
                 */

             }, {
                key   : 'destroy',
                value : function destroy()
                {
                   let cacheIndex = Datepicker.cache.indexOf(this);

                   if (this.dom.root)
                   {
                      this.unbindEvents(this.bindingsCalendar);

                      this.dom.root.parentElement.removeChild(this.dom.root);
                   }

                   this.unbindEvents(this.bindingsInput);

                   Datepicker.cache.splice(cacheIndex, 1);
                }
             }], [{
                key   : 'getStateFromDate',
                value : function getStateFromDate(inputDate)
                {
                   let state = new _State2.default();
                   let date = new Date(inputDate);

                   state.year = date.getFullYear();
                   state.monthIndex = date.getMonth();
                   state.selectedYear = state.year;
                   state.selectedMonth = state.monthIndex;
                   state.selectedDay = date.getDate();

                   return Object.freeze(state);
                }

                /**
                 * @private
                 * @static
                 * @return {State}
                 */

             }, {
                key   : 'getStateFromToday',
                value : function getStateFromToday()
                {
                   let state = new _State2.default();
                   let date = new Date();

                   state.year = date.getFullYear();
                   state.monthIndex = date.getMonth();

                   return Object.freeze(state);
                }

                /**
                 * @private
                 * @static
                 * @param   {State}   oldState
                 * @param   {string}  type
                 * @return  {State}
                 */

             }, {
                key   : 'getStateFromAction',
                value : function getStateFromAction(oldState, type)
                {
                   let fn = null;

                   if (typeof (fn = _Actions2.default[type]) !== 'function')
                   {
                      throw new Error('Action "' + type + '" not found');
                   }

                   return Object.freeze(fn(oldState));
                }

                /**
                 * @private
                 * @static
                 * @param {Error}   err
                 * @param {object}  target
                 */

             }, {
                key   : 'handleConfigureError',
                value : function handleConfigureError(err, target)
                {
                   let re = /property "?(\w*)"?[,:] object/i;

                   let matches = null;
                   let illegalPropName = '';
                   let bestMatch = '';
                   let suggestion = '';

                   if (!(err instanceof TypeError) || !(matches = re.exec(err.message))) throw err;

                   illegalPropName = matches[1];

                   for (let key in target)
                   {
                      let i = 0;

                      while (i < illegalPropName.length && illegalPropName.charAt(i).toLowerCase() === key.charAt(i).toLowerCase())
                      {
                         i++;
                      }

                      if (i > bestMatch.length)
                      {
                         bestMatch = key;
                      }
                   }

                   if (bestMatch)
                   {
                      suggestion = '. Did you mean "' + bestMatch + '"?';
                   }

                   throw new TypeError('[Datepicker] Invalid configuration property "' + illegalPropName + '"' + suggestion);
                }
             }]);

             return Datepicker;
          }();

          Datepicker.FOCUS_BLOCK_DURATION = 200;

          exports.default = Datepicker;
       },
       /* 2 */
       function (module, exports)
       {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _createClass = function ()
          {
             function defineProperties(target, props)
             {
                for (let i = 0; i < props.length; i++)
                {
                   let descriptor = props[i];
                   descriptor.enumerable = descriptor.enumerable || false;
                   descriptor.configurable = true;
                   if ("value" in descriptor) descriptor.writable = true;
                   Object.defineProperty(target, descriptor.key, descriptor);
                }
             }

             return function (Constructor, protoProps, staticProps)
             {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
             };
          }();

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          let State = function ()
          {
             function State()
             {
                _classCallCheck(this, State);

                this.year = -1;
                this.monthIndex = -1;
                this.selectedDay = -1;
                this.selectedMonth = -1;
                this.selectedYear = -1;

                Object.seal(this);
             }

             _createClass(State, [{
                key : "totalDays",
                get : function get()
                {
                   return new Date(this.year, this.monthIndex + 1, 0).getDate();
                }
             }, {
                key : "previousTotalDays",
                get : function get()
                {
                   return new Date(this.year, this.monthIndex, 0).getDate();
                }
             }, {
                key : "startDayIndex",
                get : function get()
                {
                   return new Date(this.year, this.monthIndex, 0).getDay();
                }
             }, {
                key : "today",
                get : function get()
                {
                   let date = new Date();

                   if (this.monthIndex === date.getMonth() && this.year === date.getFullYear())
                   {
                      return date.getDate();
                   }

                   return -1;
                }
             }]);

             return State;
          }();

          exports.default = State;

       },
       /* 3 */,
       /* 4 */
       function (module, exports)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function ConfigAnimation()
          {
             _classCallCheck(this, ConfigAnimation);

             this.duration = 200;
             this.easing = 'cubic-bezier(0.86, 0, 0.07, 1)';

             Object.seal(this);
          }

          exports.default = ConfigAnimation;

       },
       /* 5 */
       function (module, exports)
       {

          "use strict";

          Object.defineProperty(exports, "__esModule",
                                {
                                   value : true
                                });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function ConfigBehavior()
          {
             _classCallCheck(this, ConfigBehavior);

             this.closeOnSelect = true;

             Object.seal(this);
          }

          exports.default = ConfigBehavior;
       },
       /* 6 */
       function (module, exports)
       {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function ConfigCallbacks()
          {
             _classCallCheck(this, ConfigCallbacks);

             this.onSelect = null;
             this.onOpen = null;
             this.onClose = null;
             this.onChangeView = null;

             Object.seal(this);
          }

          exports.default = ConfigCallbacks;
       },
       /* 7 */
       function (module, exports)
       {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function ConfigClassNames()
          {
             _classCallCheck(this, ConfigClassNames);

             this.block = 'datepicker';
             this.elementCalendar = 'calendar';
             this.elementDay = 'day';
             this.elementWeek = 'week';
             this.elementMonth = 'month';
             this.elementHeader = 'header';
             this.elementMarker = 'marker';
             this.elementButton = 'button';
             this.elementButtonGroup = 'button-group';
             this.elementHeading = 'heading';
             this.modifierActive = 'active';
             this.modifierToday = 'today';
             this.modifierSelected = 'selected';
             this.modifierPadding = 'padding';
             this.modifierWeekend = 'weekend';
             this.modifierNextMonth = 'next-month';
             this.modifierPrevMonth = 'prev-month';
             this.modifierNextYear = 'next-year';
             this.modifierPrevYear = 'prev-year';
             this.delineatorElement = '_';
             this.delineatorModifier = '__';

             Object.seal(this);
          }

          exports.default = ConfigClassNames;
       },
       /* 8 */
       function (module, exports)
       {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function ConfigTransform()
          {
             _classCallCheck(this, ConfigTransform);

             this.input = null;
             this.output = null;

             Object.seal(this);
          }

          exports.default = ConfigTransform;
       },
       /* 9 */
       function (module, exports)
       {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function Dom()
          {
             _classCallCheck(this, Widget);

             this.input = null;
             this.root = null;
             this.header = null;
             this.calendar = null;
             this.month = null;
             this.tbody = null;
             this.buttonNextMonth = null;
             this.buttonPrevMonth = null;
             this.buttonNextYear = null;
             this.buttonPrevYear = null;

             Object.seal(this);
          }
          exports.default = Widget;

       },
       /* 10 */
       function (module, exports)
       {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function EventBinding()
          {
             _classCallCheck(this, EventBinding);

             this.el = '';
             this.on = '';
             this.bind = '';
             this.ref = null;
             this.fn = null;

             Object.seal(this);
          }

          exports.default = EventBinding;

       },
       /* 11 */
       function (module, exports)
       {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _typeof = typeof Symbol === "function" &&
                        typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj)
                        {
                           return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !==
                                                                                                       Symbol.prototype ? "symbol" : typeof obj;
                        };

          let _createClass = function ()
          {
             function defineProperties(target, props)
             {
                for (let i = 0; i < props.length; i++)
                {
                   let descriptor = props[i];
                   descriptor.enumerable = descriptor.enumerable || false;
                   descriptor.configurable = true;
                   if ("value" in descriptor) descriptor.writable = true;
                   Object.defineProperty(target, descriptor.key, descriptor);
                }
             }

             return function (Constructor, protoProps, staticProps)
             {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
             };
          }();

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          let Util = function ()
          {
             function Util()
             {
                _classCallCheck(this, Util);
             }

             _createClass(Util, null, [{
                key : 'template',

                /**
                 * Compiles a provided string with interpolated dynamic values
                 * (e.g "Lorem ${foo.bar} dolor") into a template function which
                 * receives an arbitrary data object and returns a populated version
                 * of that string.
                 *
                 * @param   {string}    str
                 * @param   {boolean}   [isSingleValue=false]
                 * @return  {function}
                 */

                value : function template(str)
                {
                   let isSingleValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

                   let re = /\${([\w.]*)}/g;
                   let dynamics = {};

                   let matches = null;

                   while (matches = re.exec(str))
                   {
                      dynamics[matches[1]] = new RegExp('\\${' + matches[1] + '}', 'g');
                   }

                   /**
                    * @param   {object} data
                    * @return  {*}
                    */

                   return function (data)
                   {
                      let key = '';
                      let value = '';
                      let output = str;

                      data = data || {};

                      for (key in dynamics)
                      {
                         value = Util.getValueByStringKey(key, data) || '';

                         if (isSingleValue)
                         {
                            // Break on the first dynamic and return raw value

                            return value;
                         }

                         output = output.replace(dynamics[key], value);
                      }

                      return output;
                   };
                }

                /**
                 * Retrieves a value from a provided object using a dot-notation
                 * string key (e.g. "foo.bar").
                 *
                 * @param   {string} stringKey
                 * @param   {object} data
                 * @return  {*}
                 */

             }, {
                key   : 'getValueByStringKey',
                value : function getValueByStringKey(stringKey, data)
                {
                   let parts = stringKey.split('.');

                   let i = 0;

                   while (i < parts.length && data)
                   {
                      let arrayIndex = -1;

                      stringKey = parts[i] || stringKey;

                      if (stringKey.indexOf(']') === stringKey.length - 1)
                      {
                         arrayIndex = parseInt(stringKey.slice(stringKey.indexOf('[') + 1, stringKey.indexOf(']')));

                         stringKey = stringKey.substring(0, stringKey.indexOf('['));
                      }

                      data = data[stringKey];

                      if (Array.isArray(data) && arrayIndex > -1)
                      {
                         data = data[arrayIndex];
                      }

                      i++;
                   }

                   if (typeof data !== 'undefined')
                   {
                      return data;
                   }

                   return null;
                }

                /**
                 * Merges properties from a source object into a target object,
                 * optionally using a recursive deep extend.
                 *
                 * @param   {object}    target
                 * @param   {object}    source
                 * @param   {boolean}   [deep=false]
                 * @param   {function}  [errorHandler=null]
                 * @return  {object}
                 */

             }, {
                key   : 'extend',
                value : function extend(target, source)
                {
                   let deep = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                   let errorHandler = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

                   let sourceKeys = [];

                   if (!target || (typeof target === 'undefined' ? 'undefined' : _typeof(target)) !== 'object')
                   {
                      throw new TypeError('[Util#extend] Target must be a valid object');
                   }

                   if (Array.isArray(source))
                   {
                      for (let i = 0; i < source.length; i++)
                      {
                         sourceKeys.push(i);
                      }
                   }
                   else if (source)
                   {
                      sourceKeys = Object.keys(source);
                   }

                   for (let _i = 0; _i < sourceKeys.length; _i++)
                   {
                      let key = sourceKeys[_i];
                      let descriptor = Object.getOwnPropertyDescriptor(source, key);

                      // Skip virtual properties
                      if (typeof descriptor.get === 'function') continue;

                      if (!deep || _typeof(source[key]) !== 'object')
                      {
                         // All non-object primitives, or all properties if
                         // shallow extend
                         try
                         {
                            target[key] = source[key];
                         }
                         catch (err)
                         {
                            if (typeof errorHandler !== 'function') throw err;

                            errorHandler(err, target);
                         }
                      }
                      else if (Array.isArray(source[key]))
                      {
                         // Arrays
                         if (!target[key])
                         {
                            target[key] = [];
                         }
                         Util.extend(target[key], source[key], deep, errorHandler);
                      }
                      else
                      {
                         // Objects
                         if (!target[key])
                         {
                            target[key] = {};
                         }

                         Util.extend(target[key], source[key], deep, errorHandler);
                      }
                   }

                   return target;
                }

                /**
                 * Converts a dash or snake-case string to camel case.
                 *
                 * @param   {string}    str
                 * @return  {string}
                 */
             }, {
                key   : 'camelCase',
                value : function camelCase(str)
                {
                   return str.toLowerCase().replace(/([_-][a-z0-9])/g, function ($1)
                   {
                      return $1.toUpperCase().replace(/[_-]/, '');
                   });
                }

                /**
                 * Returns the closest parent of a given element matching the
                 * provided selector, optionally including the element itself.
                 *
                 * @param   {HTMLElement}       el
                 * @param   {string}            selector
                 * @param   {boolean}           [includeSelf]
                 * @return  {HTMLElement|null}
                 */
             }, {
                key   : 'closestParent',
                value : function closestParent(el, selector, includeSelf)
                {
                   let parent = el.parentNode;

                   if (includeSelf && el.matches(selector))
                   {
                      return el;
                   }

                   while (parent && parent !== document.body)
                   {
                      if (parent.matches && parent.matches(selector))
                      {
                         return parent;
                      }
                      else if (parent.parentNode)
                      {
                         parent = parent.parentNode;
                      }
                      else
                      {
                         return null;
                      }
                   }

                   return null;
                }

                /**
                 * Pads a given number with a leading 0 if less than 10.
                 *
                 * @param   {(string|number)} int
                 * @return  {string}
                 */
             }, {
                key   : 'pad',
                value : function pad(int)
                {
                   int = parseInt(int);

                   return int < 10 ? '0' + int.toString() : int.toString(); // eslint-disable-line no-magic-numbers
                }
             }]);

             return Util;
          }();

          exports.default = Util;

       },
       /* 12 */
       function (module, exports)
       {
          module.exports = [
             {
                "el"   : "input",
                "on"   : "click",
                "bind" : "handleFocus"
             }
          ];
       },
       /* 13 */
       function (module, exports)
       {
          module.exports = [
             {
                "on"   : "click",
                "bind" : "handleWindowClick"
             },
             {
                "el"   : "header",
                "on"   : "mousedown",
                "bind" : "handleHeaderClick"
             },
             {
                "el"   : "tbody",
                "on"   : "click",
                "bind" : "handleTbodyClick"
             }
          ];

       },
       /* 14 */
       function (module, exports, __webpack_require__)
       {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _Util = __webpack_require__(11);

          let _Util2 = _interopRequireDefault(_Util);

          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default : obj }; }

          let Templates = {};
          /* eslint-disable max-len */

          Templates.day = _Util2.default.template('<td class="${className}" data-ref="day" data-month="${monthNumber}" data-day="${dayNumber}">${dayNumber}</td>');
          Templates.marker = _Util2.default.template('<th class="${className}">${dayShortName}</th>');
          Templates.week = _Util2.default.template('<tr class="${className}">${daysHtml}</tr>');

          Templates.container = _Util2.default.template('' +
                                                        '<div class="${containerClassName}">' +
                                                        '<header data-ref="header" class="${headerClassName}">' +
                                                        '<span class="${buttonGroupClassName}">' +
                                                        '<button class="${buttonPrevYearClassName}" type="button" data-ref="button" data-action="GO_TO_PREV_YEAR"> </button> ' +
                                                        '<button class="${buttonPrevMonthClassName}" type="button" data-ref="button" data-action="GO_TO_PREV_MONTH"></button> ' +
                                                        '</span> ' +
                                                        '<span class="${headingClassName}">${monthName} ${year}</span> ' +
                                                        '<span class="${buttonGroupClassName}">' +
                                                        '<button class="${buttonNextMonthClassName}" type="button" data-ref="button" data-action="GO_TO_NEXT_MONTH"></button> ' +
                                                        '<button class="${buttonNextYearClassName}" type="button" data-ref="button" data-action="GO_TO_NEXT_YEAR"></button>' +
                                                        '</span>' + '</header>' +
                                                        '<div class="${calendarClassName}" data-ref="calendar">' +
                                                        '<table class="${monthClassName}" data-ref="month">' + '<thead>' +
                                                        '<tr>${legendHtml}</tr>' + '</thead>' +
                                                        '<tbody data-ref="tbody">${weeksHtml}</tbody>' + '</table>' + '</div>' +
                                                        '</div>');

          exports.default = Templates;

       },
       /* 15 */
       function (module, exports, __webpack_require__)
       {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _State = __webpack_require__(2);
          let _State2 = _interopRequireDefault(_State);
          let _Util = __webpack_require__(11);
          let _Util2 = _interopRequireDefault(_Util);

          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default : obj }; }

          let Actions = {};

          Actions.GO_TO_NEXT_MONTH = function (prevState)
          {
             let newState = _Util2.default.extend(new _State2.default(), prevState);

             if (newState.monthIndex === 11)
             {
                // eslint-disable-line no-magic-numbers
                newState.monthIndex = 0;
                newState.year++;
             }
             else
             {
                newState.monthIndex++;
             }

             return newState;
          };

          Actions.GO_TO_PREV_MONTH = function (prevState)
          {
             let newState = _Util2.default.extend(new _State2.default(), prevState);

             if (newState.monthIndex === 0)
             {
                newState.monthIndex = 11;
                newState.year--;
             }
             else
             {
                newState.monthIndex--;
             }

             return newState;
          };

          Actions.GO_TO_NEXT_YEAR = function (prevState)
          {
             let newState = _Util2.default.extend(new _State2.default(), prevState);

             newState.year++;

             return newState;
          };

          Actions.GO_TO_PREV_YEAR = function (prevState)
          {
             let newState = _Util2.default.extend(new _State2.default(), prevState);

             newState.year--;

             return newState;
          };

          exports.default = Actions;

       },
       /* 16 */
       function (module, exports, __webpack_require__)
       {
          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _CssTranslate = __webpack_require__(17);
          let _CssTranslate2 = _interopRequireDefault(_CssTranslate);

          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default : obj }; }

          let Transforms = {};
          /* eslint-disable no-magic-numbers */

          Transforms.GO_TO_NEXT_MONTH = new _CssTranslate2.default([0, 0], [0, 0], [-100, 0], [-100, 0]);
          Transforms.GO_TO_PREV_MONTH = new _CssTranslate2.default([0, 0], [-200, 0], [100, 0], [-100, 0]);
          Transforms.GO_TO_NEXT_YEAR = new _CssTranslate2.default([0, 0], [-100, 100], [0, -100], [-100, 0]);
          Transforms.GO_TO_PREV_YEAR = new _CssTranslate2.default([0, 0], [-100, -100], [0, 100], [-100, 0]);

          exports.default = Transforms;

       },
       /* 17 */
       function (module, exports)
       {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function CssTranslate(oldCoordsBefore, newCoordsBefore, oldCoordsAfter, newCoordsAfter)
          {
             _classCallCheck(this, CssTranslate);

             this.newXBefore = newCoordsBefore[0];
             this.newYBefore = newCoordsBefore[1];
             this.oldXBefore = oldCoordsBefore[0];
             this.oldYBefore = oldCoordsBefore[1];
             this.newXAfter = newCoordsAfter[0];
             this.newYAfter = newCoordsAfter[1];
             this.oldXAfter = oldCoordsAfter[0];
             this.oldYAfter = oldCoordsAfter[1];

             Object.seal(this);
          }

          exports.default = CssTranslate;

       },
       /* 18 */
       function (module, exports, __webpack_require__)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _createClass = function ()
          {
             function defineProperties(target, props)
             {
                for (let i = 0; i < props.length; i++)
                {
                   let descriptor = props[i];
                   descriptor.enumerable = descriptor.enumerable || false;
                   descriptor.configurable = true;
                   if ("value" in descriptor) descriptor.writable = true;
                   Object.defineProperty(target, descriptor.key, descriptor);
                }
             }

             return function (Constructor, protoProps, staticProps)
             {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
             };
          }();

          let _ConstantsEn = __webpack_require__(25);

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          let Month = function ()
          {
             function Month()
             {
                _classCallCheck(this, Month);

                this.weeks = [];
                this.dayMarkers = [];
                this.monthIndex = -1;
                this.year = -1;
                this.weeksHtml = '';
                this.legendHtml = '';
                this.calendarClassName = '';
                this.monthClassName = '';
                this.headerClassName = '';
                this.headingClassName = '';
                this.containerClassName = '';
                this.buttonGroupClassName = '';
                this.buttonPrevMonthClassName = '';
                this.buttonNextMonthClassName = '';
                this.buttonPrevYearClassName = '';
                this.buttonNextYearClassName = '';

                Object.seal(this);
             }

             _createClass(Month, [{
                key : 'monthName',
                get : function get()
                {
                   return _ConstantsEn.MONTHS[this.monthIndex];
                }
             }]);

             return Month;
          }();

          exports.default = Month;

       },
       /* 19 */,
       /* 20 */
       function (module, exports)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function Day()
          {
             _classCallCheck(this, Day);

             this.dayIndex = -1;
             this.dayNumber = -1;
             this.monthNumber = -1;
             this.isToday = false;
             this.isPadding = false;
             this.isSelected = false;
             this.className = '';

             Object.seal(this);
          }

          exports.default = Day;

       },
       /* 21 */
       function (module, exports, __webpack_require__)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _createClass = function ()
          {
             function defineProperties(target, props)
             {
                for (let i = 0; i < props.length; i++)
                {
                   let descriptor = props[i];
                   descriptor.enumerable = descriptor.enumerable || false;
                   descriptor.configurable = true;
                   if ("value" in descriptor) descriptor.writable = true;
                   Object.defineProperty(target, descriptor.key, descriptor);
                }
             }

             return function (Constructor, protoProps, staticProps)
             {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
             };
          }();

          let _ConstantsEn = __webpack_require__(25);

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          let DayMarker = function ()
          {
             function DayMarker()
             {
                _classCallCheck(this, DayMarker);

                this.dayIndex = -1;
                this.className = '';

                Object.seal(this);
             }

             _createClass(DayMarker, [{
                key : 'dayName',
                get : function get()
                {
                   return _ConstantsEn.DAYS[this.dayIndex];
                }
             }, {
                key : 'dayShortName',
                get : function get()
                {
                   return this.dayName.charAt(0);
                }
             }]);

             return DayMarker;
          }();

          exports.default = DayMarker;

       },
       /* 22 */
       function (module, exports)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          function Week()
          {
             _classCallCheck(this, Week);

             this.days = [];
             this.daysHtml = '';
             this.className = '';

             Object.seal(this);
          }

          exports.default = Week;

       },
       /* 23 */
       function (module, exports, __webpack_require__)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _Datepicker2 = __webpack_require__(1);

          let _Datepicker3 = _interopRequireDefault(_Datepicker2);

          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default : obj }; }

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             { throw new TypeError("Cannot call a class as a function"); }
          }

          let Datepicker = function Datepicker()
          {
             _classCallCheck(this, Datepicker);

             let _ = new (Function.prototype.bind.apply(_Datepicker3.default,
                                                        [null].concat(Array.prototype.slice.call(arguments))))();

             this.open = _.open.bind(_);
             this.close = _.close.bind(_);
             this.getValue = _.getValue.bind(_);
             this.setValue = _.setValue.bind(_);
             this.destroy = _.destroy.bind(_);

             Object.defineProperties(this, {
                input : {
                   get : function get()
                   {
                      return _.dom.input;
                   }
                }
             });

             Object.freeze(this);
          };

          Datepicker.cache = [];

          exports.default = Datepicker;

       },
       /* 24 */
       function (module, exports, __webpack_require__)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });

          let _ConfigAnimation = __webpack_require__(4);

          let _ConfigAnimation2 = _interopRequireDefault(_ConfigAnimation);

          let _ConfigBehavior = __webpack_require__(5);

          let _ConfigBehavior2 = _interopRequireDefault(_ConfigBehavior);

          let _ConfigCallbacks = __webpack_require__(6);

          let _ConfigCallbacks2 = _interopRequireDefault(_ConfigCallbacks);

          let _ConfigClassNames = __webpack_require__(7);

          let _ConfigClassNames2 = _interopRequireDefault(_ConfigClassNames);

          let _ConfigTransform = __webpack_require__(8);

          let _ConfigTransform2 = _interopRequireDefault(_ConfigTransform);

          function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default : obj }; }

          function _classCallCheck(instance, Constructor)
          {
             if (!(instance instanceof Constructor))
             {
                throw new TypeError("Cannot call a class as a function");
             }
          }

          function ConfigRoot()
          {
             _classCallCheck(this, ConfigRoot);

             this.animation = new _ConfigAnimation2.default();
             this.behavior = new _ConfigBehavior2.default();
             this.callbacks = new _ConfigCallbacks2.default();
             this.classNames = new _ConfigClassNames2.default();
             this.transform = new _ConfigTransform2.default();

             Object.seal(this);
             Object.freeze(this);
          }

          exports.default = ConfigRoot;

       },
       /* 25 */
       function (module, exports)
       {

          'use strict';

          Object.defineProperty(exports, "__esModule", {
             value : true
          });
          let MONTHS = exports.MONTHS = ['Jan,', 'Feb,', 'Mar,', 'Apr,', 'May,', 'Jun,', 'Jul,', 'Aug,', 'Sept,',
                                         'Oct,', 'Nov,', 'Dec,'];

          let DAYS = exports.DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

       }
    ])
});
