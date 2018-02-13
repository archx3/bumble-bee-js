/**
 * @Author Created by arch on 11/05/17.
 * @Time: 11:14
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
 *    @fileOverview contains instruction[code] for managing Cookies$
 *       Enhanced to support object serialisation
 *    Forked from JavaScript Cookie v2.1.4
 *    https://github.com/js-cookie/js-cookie
 */
var Barge = Bee || {};
(function (global, Bu)
{
   'use strict';

   var factory = function (window)
   {
      if (typeof window.document !== 'object')
      {
         throw new Error('Barge.Cookies requires a `window` with a `document` object');
      }

      /**
       * Can be used to set and get
       * @param key
       * @param value
       * @param options
       * @returns {*}
       * @constructor
       */
      Bee.Cookies = function (key, value, options)
      {
         return arguments.length === 1 ?
                Bee.Cookies.get(key) : Bee.Cookies.set(key, value, options);
      };

      /**
       * Allows for setter injection in unit tests
       * @type {HTMLDocument}
       * @private
       */
      Bee.Cookies._document = window.document;

      /**
       * Used to ensure cookie keys do not collide with
       * built-in `Object` properties
       * @type {string}
       * @private
       */
      Bee.Cookies._cacheKeyPrefix = 'cookey.'; // Hurr hurr, :)

      /**
       *
       * @type {Date}
       * @private
       */
      Bee.Cookies._maxExpireDate = new Date('Fri, 31 Dec 9999 23:59:59 UTC');

      /**
       *
       * @type {{path: string, secure: boolean}}
       */
      Bee.Cookies.defaults = {
         path   : '/',
         secure : false
      };

      /**
       *
       * @param key
       * @param {Boolean} [json]
       * @returns {*}
       */
      Bee.Cookies.get = function (key, json)
      {
         if (Bee.Cookies._cachedDocumentCookie !== Bee.Cookies._document.cookie)
         {
            Bee.Cookies._renewCache();
         }

         var value = Bee.Cookies._cache[Bee.Cookies._cacheKeyPrefix + key];

         return value === undefined ? undefined :
                json ? JSON.parse(value) :
                decodeURIComponent(value);
      };

      /**
       *
       * @param key
       * @param value
       * @param options
       */
      Bee.Cookies.toggle = function (key, value, options = null)
      {
         /*jshint ignore*/
         if (this.get(key) !== undefined)
         {
            this.expire(key, options);
         }
         else
         {
            this.set(key, value, options);
         }
      };

      /**
       *
       * @param key
       * @param value
       * @param options {{expires:Number|String<Date>|Date|Infinity, domain: String , secure: Boolean, json : Boolean }}
       * @returns {Barge.Cookies|*}
       */
      Bee.Cookies.set = function (key, value, options)
      {
         options = Bee.Cookies._getExtendedOptions(options);
         options.expires = Bee.Cookies._getExpiresDate(value === undefined ? -1 :
                                                       Bu.defined(options.expires) ? options.expires : Bee.Cookies._maxExpireDate);

         if (options.json)
         {
            value = JSON.stringify(value);
         }

         let cookeiString = "";
         if(Bu.defined(value))
         {
            key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
            key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
            value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);

            cookeiString = key.toString() + "=" + value.toString() +
                           "; expires=" + (Bu.defined(options.expires) ? options.expires : Bee.Cookies._maxExpireDate);
            document.cookie = cookeiString;
         }
         else
         {
            cookeiString = key.toString() + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=abacus.edu";
            document.cookie = cookeiString;
         }
         //console.log(Bee.Cookies._generateCookieString(key, value, options));
         Bee.Cookies._document.cookie = Bee.Cookies._generateCookieString(key, value, options);
         return Bee.Cookies;
      };

      /**
       * remove cookie
       * @param key
       * @param options
       * @returns {Barge.Cookies|*}
       */
      Bee.Cookies.expire = function (key, options)
      {
         return Bee.Cookies.set(key, undefined, options);
      };

      /**
       * Alias
       * @type {*}
       */
      Bee.Cookies.remove = Bee.Cookies.expire;

      /**
       *
       * @param options
       * @returns {{path: (*|string), domain: *, expires: *, secure: boolean}}
       * @private
       */
      Bee.Cookies._getExtendedOptions = function (options)
      {
         return {
            path    : options && options.path || Bee.Cookies.defaults.path,
            domain  : options && options.domain || Bee.Cookies.defaults.domain,
            expires : options && options.expires || Bee.Cookies.defaults.expires,
            secure  : options && options.secure !== undefined ? options.secure : Bee.Cookies.defaults.secure
         };
      };

      /**
       *
       * @param date
       * @returns {boolean}
       * @private
       */
      Bee.Cookies._isValidDate = function (date)
      {
         return Object.prototype.toString.call(date) === '[object Date]' && !isNaN(date.getTime());
      };

      /**
       *
       * @param expires
       * @param now
       * @returns {*}
       * @private
       */
      Bee.Cookies._getExpiresDate = function (expires, now)
      {
         now = now || new Date();

         if (typeof expires === 'number')
         {
            expires = expires === Infinity ?
                      Bee.Cookies._maxExpireDate : new Date(now.getTime() + expires * 1000);
         }
         else if (typeof expires === 'string')
         {
            expires = new Date(expires);
         }

         if (expires && !Bee.Cookies._isValidDate(expires))
         {
            throw new Error('`expires` parameter cannot be converted to a valid Date instance');
         }

         return expires;
      };

      /**
       *
       * @param key
       * @param value
       * @param options
       * @returns {string}
       * @private
       */
      Bee.Cookies._generateCookieString = function (key, value, options)
      {
         key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
         key = key.replace(/\(/g, '%28').replace(/\)/g, '%29');
         value = (value + '').replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
         options = options || {};

         var cookieString = key + '=' + value;
         //cookieString += options.path ? ';path=' + options.path : '';
         //cookieString += options.domain ? ';domain=' + options.domain : '';
         cookieString += options.expires ? ';expires=' + options.expires.toUTCString() : '';
         cookieString += options.secure ? ';secure' : '';

         //console.log("gcsCs", cookieString);
         return cookieString;
      };

      /**
       *
       * @param documentCookie
       * @returns {{}}
       * @private
       */
      Bee.Cookies._getCacheFromString = function (documentCookie)
      {
         var cookieCache = {};
         var cookiesArray = documentCookie ? documentCookie.split('; ') : [];

         for (var i = 0; i < cookiesArray.length; i++)
         {
            var cookieKvp = Bee.Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);

            if (cookieCache[Bee.Cookies._cacheKeyPrefix + cookieKvp.key] === undefined)
            {
               cookieCache[Bee.Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
            }
         }

         return cookieCache;
      };

      /**
       *
       * @param cookieString
       * @returns {{key: *, value: string}}
       * @private
       */
      Bee.Cookies._getKeyValuePairFromCookieString = function (cookieString)
      {
         // "=" is a valid character in a cookie value according to RFC6265, so cannot `split('=')`
         var separatorIndex = cookieString.indexOf('=');

         // IE omits the "=" when the cookie value is an empty string
         separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;

         var key = cookieString.substr(0, separatorIndex);
         var decodedKey;
         try
         {
            decodedKey = decodeURIComponent(key);
         }
         catch (e)
         {
            if (console && typeof console.error === 'function')
            {
               console.error('Could not decode cookie with key "' + key + '"', e);
            }
         }

         return {
            key   : decodedKey,
            value : cookieString.substr(separatorIndex + 1) // Defer decoding value until accessed
         };
      };

      /**
       *
       * @private
       */
      Bee.Cookies._renewCache = function ()
      {
         Bee.Cookies._cache = Bee.Cookies._getCacheFromString(Bee.Cookies._document.cookie);
         Bee.Cookies._cachedDocumentCookie = Bee.Cookies._document.cookie;
      };

      /**
       *
       * @returns {boolean}
       * @private
       */
      Bee.Cookies._areEnabled = function ()
      {
         var testKey = 'cookies.js';
         var areEnabled = Bee.Cookies.set(testKey, 1).get(testKey) === '1';
         Bee.Cookies.expire(testKey);
         return areEnabled;
      };

      /**
       *
       * @type {boolean}
       */
      Bee.Cookies.enabled = Bee.Cookies._areEnabled();

      return Bee.Cookies;
   };

   var cookiesExport = (global && typeof global.document === 'object') ? factory(global) : factory;

   // AMD support
   if (typeof define === 'function' && define.amd)
   {
      define(function () { return cookiesExport; });
      // CommonJS/Node.js support
   }
   else if (typeof exports === 'object')
   {
      // Support Node.js specific `module.exports` (which can be a function)
      if (typeof module === 'object' && typeof module.exports === 'object')
      {
         module.exports = cookiesExport;
      }
      // But always support CommonJS module 1.1.1 spec (`exports` cannot be a function)
      exports.Bee.Cookies = cookiesExport;
   }
   else
   {
      global.Bee.Cookies = cookiesExport;
   }
})(typeof window === 'undefined' ? this : window, Bee.Utils);