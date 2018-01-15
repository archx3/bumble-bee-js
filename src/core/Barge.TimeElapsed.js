/**
 * @Author Created by arch on 14/05/17.
 * @Time: 16:08
 * @Copyright (C) 2017
 * Barge Studios Inc, The Bumble Bee Authors
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
 *    @fileOverview contains instruction[code] for creating a $
 */
var Barge = Barge || {};
!function (root, factory)
{
   if (typeof module === 'object' && module.exports)
   {
      module.exports = factory(root); // nodejs support
      module.exports['default'] = module.exports; // es6 support
   }
   else
   {
      root.timeElapsed = factory(root);
   }
}(typeof window !== 'undefined' ? window : this,
  function ()
  {
     let Bu = Barge.utils;
     var indexMapEn    = 'second_minute_hour_day_week_month_year'.split('_'),
         indexMapZh    = '秒_分钟_小时_天_周_月_年'.split('_'),
         indexMapTw    = 'par_sima_donhwiri_da_nawotwe_bosome_afi'.split('_'),
         // built-in locales: en & zh_CN & tw
         locales       = {
            'en'    : function (number, index)
            {
               if (index === 0)
               {
                  return ['just now', 'right now'];
               }
               var unit = indexMapEn[parseInt(index / 2)];
               if (number > 1)
               {
                  unit += 's';
               }
               return [number + ' ' + unit + ' ago', 'in ' + number + ' ' + unit];
            },

            'zh_CN' : function (number, index)
            {
               if (index === 0)
               {
                  return ['刚刚', '片刻后'];
               }
               var unit = indexMapZh[parseInt(index / 2)];
               return [number + unit + '前', number + unit + '后'];
            },

            'tw' : function (number, index)
            {
               if (index === 0)
               {
                  return ['sesiara', 'nky33i'];
               }

               var unit = indexMapTw[parseInt(index / 2)];

               if (number > 1)
               {
                  if(unit === "da")
                  {
                     unit = " nnafua "
                  }

                  if(unit === "afi")
                  {
                     unit = " nnfie "
                  }
               }

               return [unit + " " + number + ' atwam ', unit + " " + number + ' mu ni '];
            }
         },
         // second, minute, hour, day, week, month, year(365 days)
         SEC_ARRAY     = [60, 60, 24, 7, 365 / 7 / 12, 12],
         SEC_ARRAY_LEN = 6,
         ATTR_DATETIME = 'datetime',
         ATTR_DATA_TID = 'data-tid',
         timers        = {}; // real-time render timers

     // format Date / string / timestamp to Date instance.
     /**
      *
      * @param input
      * @returns {Date}
      */
     function toDate(input)
     {
        if (input instanceof Date)
        {
           return input;
        }
        if (!isNaN(input))
        {
           return new Date(Bu.pInt(input));
        }
        if (/^\d+$/.test(input))
        {
           return new Date(Bu.pInt(input));
        }
        input = (input || '').trim().replace(/\.\d+/, '') // remove milliseconds
                             .replace(/-/, '/').replace(/-/, '/')
                             .replace(/(\d)T(\d)/, '$1 $2').replace(/Z/, ' UTC') // 2017-2-5T3:57:52Z -> 2017-2-5 3:57:52UTC
                             .replace(/([\+\-]\d\d)\:?(\d\d)/, ' $1$2'); // -04:00 -> -0400
        return new Date(input);
     }

     // format the diff second to *** time ago, with setting locale
     /**
      *
      * @param diff
      * @param locale
      * @param defaultLocale
      * @returns {*|XML|string|void}
      */
     function formatDiff(diff, locale, defaultLocale)
     {
        // if locale is not exist, use defaultLocale.
        // if defaultLocale is not exist, use build-in `en`.
        // be sure of no error when locale is not exist.
        locale = locales[locale] ? locale : (locales[defaultLocale] ? defaultLocale : 'en');
        // if (! locales[locale]) locale = defaultLocale;
        var i         = 0,
            agoin     = diff < 0 ? 1 : 0, // timein or TimeElapsed
            total_sec = diff = Math.abs(diff);

        for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY_LEN; i++)
        {
           diff /= SEC_ARRAY[i];
        }
        diff = Bu.pInt(diff);
        i *= 2;

        //if diff > (59 if unit == seconds ## 1 < if unit is anything apart from seconds) //imhere
        if (diff > (i === 0 ? 59 : 1))
        {
           i += 1;
        }
        return locales[locale](diff, i, total_sec)[agoin].replace('%s', diff);
     }

     // calculate the diff second between date to be formated an now date.
     /**
      *
      * @param date
      * @param nowDate
      * @returns {number}
      */
     function diffSec(date, nowDate)
     {
        nowDate = nowDate ? toDate(nowDate) : new Date();
        return (nowDate - toDate(date)) / 1000;
     }

     /**
      * nextInterval: calculate the next interval time.
      * - diff: the diff sec between now and date to be formated.
      *
      * What's the meaning?
      * diff = 61 then return 59
      * diff = 3601 (an hour + 1 second), then return 3599
      * make the interval with high performace.
      * @param diff
      **/
     function nextInterval(diff)
     {
        let rst = 1, i = 0, d = Math.abs(diff);
        for (; diff >= SEC_ARRAY[i] && i < SEC_ARRAY_LEN; i++)
        {
           diff /= SEC_ARRAY[i];
           rst *= SEC_ARRAY[i];
        }
        // return leftSec(d, rst);
        d = d % rst;
        d = d ? rst - d : rst;
        return Math.ceil(d);
     }

     // get the datetime attribute, jQuery and DOM
     /**
      *
      * @param node
      * @returns {*}
      */
     function getDateAttr(node)
     {
        if (node.dataset.timeago)
        {
           return node.dataset.timeago;
        } // data-timeago supported
        return getAttr(node, ATTR_DATETIME);
     }

     /**
      *
      * @param node
      * @param name
      * @returns {*}
      */
     function getAttr(node, name)
     {
        if (node.getAttribute)
        {
           return node.getAttribute(name);
        } // native
        if (node.attr)
        {
           return node.attr(name);
        } // jquery
     }

     /**
      *
      * @param node
      * @param val
      * @returns {*}
      */
     function setTidAttr(node, val)
     {
        if (node.setAttribute)
        {
           return node.setAttribute(ATTR_DATA_TID, val);
        } // native
        if (node.attr)
        {
           return node.attr(ATTR_DATA_TID, val);
        } // jquery
     }

     /**
      *
      * @param node
      * @returns {*}
      */
     function getTidFromNode(node)
     {
        return getAttr(node, ATTR_DATA_TID);
     }

     /**
      * timeElapsed: the function to get `TimeElapsed` instance.
      * - nowDate: the relative date, default is new Date().
      * - defaultLocale: the default locale, default is en. if your set it, then the `locale` parameter of format is not needed of
      * you.
      *
      * How to use it?
      * var TimeElapsedLib = require('TimeElapsed.js');
      * var TimeElapsed = TimeElapsedLib(); // all use default.
      * var TimeElapsed = TimeElapsedLib('2016-09-10'); // the relative date is 2016-09-10, so the 2016-09-11 will be 1 day ago.
      * var TimeElapsed = TimeElapsedLib(null, 'zh_CN'); // set default locale is `zh_CN`.
      * var TimeElapsed = TimeElapsedLib('2016-09-10', 'zh_CN'); // the relative date is 2016-09-10, and locale is zh_CN, so the 2016-09-11
      * will be 1天前.
      *
      * @param nowDate
      * @param defaultLocale
      * @constructor
      */
     function TimeElapsed(nowDate, defaultLocale)
     {
        this.nowDate = nowDate;
        // if do not set the defaultLocale, set it with `en`
        this.defaultLocale = defaultLocale || 'en'; // use default build-in locale
        // for dev test
        // this.nextInterval = nextInterval;
     }

     // what the timer will do
     /**
      *
      * @param node
      * @param date
      * @param locale
      */
     TimeElapsed.prototype.doRender = function (node, date, locale)
     {
        let diff = diffSec(date, this.nowDate),
            self = this,
            tid;
        // delete previously assigned timeout's id to node
        node.innerHTML = formatDiff(diff, locale, this.defaultLocale);
        // waiting %s seconds, do the next render
        timers[tid = setTimeout(function ()
                                {
                                   self.doRender(node, date, locale);
                                   delete timers[tid];
                                }, Math.min(nextInterval(diff) * 1000, 0x7FFFFFFF))] = 0; // there is no need to save node in object.
        // set attribute date-tid
        setTidAttr(node, tid);
     };
     /**
      * format: format the date to *** time ago, with setting or default locale
      * - date: the date / string / timestamp to be formated
      * - locale: the formated string's locale name, e.g. en / zh_CN
      *
      * How to use it?
      * var TimeElapsed = require('TimeElapsed.js')();
      * TimeElapsed.format(new Date(), 'pl'); // Date instance
      * TimeElapsed.format('2016-09-10', 'fr'); // formated date string
      * TimeElapsed.format(1473473400269); // timestamp with ms
      *
      * @param date
      * @param locale
      * @returns {*|XML|string|void}
      */
     TimeElapsed.prototype.format = function (date, locale)
     {
        return formatDiff(diffSec(date, this.nowDate), locale, this.defaultLocale);
     };
     /**
      * render: render the DOM real-time.
      * - nodes: which nodes will be rendered.
      * - locale: the locale name used to format date.
      *
      * How to use it?
      * var TimeElapsed = require('TimeElapsed.js')();
      * 1. javascript selector
      * TimeElapsed.render(document.querySelectorAll('.need_to_be_rendered'));
      * 2. use jQuery selector
      * TimeElapsed.render($('.need_to_be_rendered'), 'pl');
      *
      * Notice: please be sure the dom has attribute `datetime`.
      *
      * @param nodes
      * @param locale
      */
     TimeElapsed.prototype.render = function (nodes, locale)
     {
        if (nodes.length === undefined)
        {
           nodes = [nodes];
        }
        let i = 0, len = nodes.length;
        for (; i < len; i++)
        {
           this.doRender(nodes[i], getDateAttr(nodes[i]), locale); // render item
        }
     };
     /**
      * setLocale: set the default locale name.
      *
      * How to use it?
      * var TimeElapsed = require('TimeElapsed.js')();
      * TimeElapsed.setLocale('fr');
      *
      * @param locale
      */
     TimeElapsed.prototype.setLocale = function (locale)
     {
        this.defaultLocale = locale;
     };
     /**
      * TimeElapsed: the function to get `TimeElapsed` instance.
      * - nowDate: the relative date, default is new Date().
      * - defaultLocale: the default locale, default is en.
      * if your set it, then the `locale` parameter of format is not needed of
      * you.
      *
      * How to use it?
      * var Barge.TimeElapsed = require('TimeElapsed.js');
      * var TimeElapsed = Barge.TimeElapsed();
      *     all use default.
      * var TimeElapsed = Barge.TimeElapsed('2016-09-10');
      *     the relative date is 2016-09-10, so the 2016-09-11 will be 1 day ago.
      * var TimeElapsed = Barge.TimeElapsed(null, 'zh_CN');
      *     set default locale is `zh_CN`.
      * var TimeElapsed = Barge.TimeElapsed('2016-09-10', 'zh_CN');
      *     the relative date is 2016-09-10, and locale is zh_CN, so the
      * 2016-09-11 will be 1天前.
      *
      * @param nowDate
      * @param defaultLocale
      * @returns {TimeElapsed}
      */

     Barge.TimeElapsed = function (nowDate, defaultLocale)
     {
        return new TimeElapsed(nowDate, defaultLocale);
     };

     /**
      * register: register a new language locale
      * - locale: locale name, e.g. en / zh_CN, notice the standard.
      * - localeFunc: the locale process function
      *
      * How to use it?
      * var Barge.TimeElapsed = require('TimeElapsed.src');
      *
      * Barge.TimeElapsed.register('the locale name', the_locale_func);
      * // or
      * Barge.TimeElapsed.register('pl', require('TimeElapsed.src/locales/pl'));
      *
      *
      * @param locale
      * @param localeFunc
      */
     Barge.TimeElapsed.register = function (locale, localeFunc)
     {
        locales[locale] = localeFunc;
     };

     /**
      * cancel: cancels one or all the timers which are doing real-time render.
      *
      * How to use it?
      * For canceling all the timers:
      * var Barge.TimeElapsed = require('TimeElapsed.src');
      * var TimeElapsed = Barge.TimeElapsed();
      * TimeElapsed.render(document.querySelectorAll('.need_to_be_rendered'));
      * Barge.TimeElapsed.cancel(); // will stop all the timers, stop render in real time.
      *
      * For canceling single timer on specific node:
      * var Barge.TimeElapsed = require('TimeElapsed.src');
      * var TimeElapsed = Barge.TimeElapsed();
      * var nodes = document.querySelectorAll('.need_to_be_rendered');
      * TimeElapsed.render(nodes);
      * Barge.TimeElapsed.cancel(nodes[0]); // will clear a timer attached to the first node, stop render in real time.
      *
      *
      * @param node
      */
     Barge.TimeElapsed.cancel = function (node)
     {
        let tid;
        // assigning in if statement to save space
        if (node)
        {
           tid = getTidFromNode(node);
           if (tid)
           {
              clearTimeout(tid);
              delete timers[tid];
           }
        }
        else
        {
           for (tid in timers)
           {
              clearTimeout(tid);
           }
           timers = {};
        }
     };

     Barge.TimeElapsed.iso8601 = function (date)
     {
        return date.getUTCFullYear()
               + "-" + (date.getUTCMonth() + 1)
               + "-" + date.getUTCDate()
               + "T" + date.getUTCHours()
               + ":" + date.getUTCMinutes()
               + ":" + date.getUTCSeconds() + "Z";
     };

     Barge.TimeElapsed.apply = function ()
     {
        document.querySelectorAll('.load_time').setAttribute('datetime', Barge.TimeElapsed.iso8601(new Date()));
        var te = new Barge.TimeElapsed(null, 'tw');
        //var te = new Barge.TimeElapsed(null, navigator.language.replace('-', '_'));
        te.render(document.querySelectorAll('.timeago'));
     };

     return Barge.TimeElapsed;
  });