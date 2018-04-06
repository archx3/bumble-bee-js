;(function (root, factory)
{
   'use strict';
   /* istanbul ignore next */
   if (typeof define === 'function' && define.amd)
   {
      define('ajax', factory)
   }
   else if (typeof exports === 'object')
   {
      exports = module.exports = factory()
   }
   else
   {
      root.ajax = factory()
   }
})(this, function ()
{
   'use strict';

   function ajax(options)
   {
      var methods = ['get', 'post', 'put', 'delete'];
      options = options || {};
      options.baseUrl = options.baseUrl || '';
      if (options.method && options.url)
      {
         return xhrConnection(options.method,
            options.baseUrl + options.url,
            maybeData(options.data),
            options
         )
      }
      return methods.reduce(function (acc, method)
                            {
                               acc[method] = function (url, data)
                               {
                                  return xhrConnection(
                                     method,
                                     options.baseUrl + url,
                                     maybeData(data),
                                     options
                                  )
                               };
                               return acc
                            }, {})
   }

   function maybeData(data)
   {
      return data || null
   }

   function xhrConnection(type, url, data, options)
   {
      var returnMethods = ['then', 'catch', 'always'];
      var promiseMethods = returnMethods.reduce(function (promise, method)
                                                {
                                                   promise[method] = function (callback)
                                                   {
                                                      promise[method] = callback;
                                                      return promise
                                                   };

                                                   return promise
                                                }, {});
      var xhr = new XMLHttpRequest();
      xhr.open(type, url, true);
      xhr.withCredentials = options.hasOwnProperty('withCredentials');
      setHeaders(xhr, options.headers);
      xhr.addEventListener('readystatechange', ready(promiseMethods, xhr), false);
      xhr.send(objectToQueryString(data));
      promiseMethods.abort = function ()
      {
         return xhr.abort()
      };
      return promiseMethods
   }

   function setHeaders(xhr, headers)
   {
      headers = headers || {};
      if (!hasContentType(headers))
      {
         headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
      Object.keys(headers).forEach(function (name)
                                   {
                                      (headers[name] && xhr.setRequestHeader(name, headers[name]))
                                   })
   }

   function hasContentType(headers)
   {
      return Object.keys(headers).some(function (name)
                                       {
                                          return name.toLowerCase() === 'content-type'
                                       })
   }

   function ready(promiseMethods, xhr)
   {
      return function handleReady()
      {
         if (xhr.readyState === xhr.DONE)
         {
            xhr.removeEventListener('readystatechange', handleReady, false);
            promiseMethods.always.apply(promiseMethods, parseResponse(xhr));

            if (xhr.status >= 200 && xhr.status < 300)
            {
               promiseMethods.then.apply(promiseMethods, parseResponse(xhr))
            }
            else
            {
               promiseMethods.catch.apply(promiseMethods, parseResponse(xhr))
            }
         }
      }
   }

   function parseResponse(xhr)
   {
      var result;
      try
      {
         result = JSON.parse(xhr.responseText)
      }
      catch (e)
      {
         result = xhr.responseText
      }
      return [result, xhr]
   }

   function objectToQueryString(data)
   {
      return isObject(data) ? getQueryString(data) : data
   }

   function isObject(data)
   {
      return Object.prototype.toString.call(data) === '[object Object]'
   }

   function getQueryString(object)
   {
      return Object.keys(object).reduce(function (acc, item)
                                        {
                                           var prefix = !acc ? '' : acc + '&';
                                           return prefix + encode(item) + '=' + encode(object[item])
                                        }, '')
   }

   function encode(value)
   {
      return encodeURIComponent(value)
   }

   return ajax
});
/**
 * @Author       Created by arch on 05/06/17 using PhpStorm.
 * @Time         : 06:18
 * @Copyright (C) 2017
 * Bee Studios Inc, The $ Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence      Licensed under the Bee Studios Eula
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
 * @fileOverview contains instruction[code] for creating a $
 *
 * @requires
 */