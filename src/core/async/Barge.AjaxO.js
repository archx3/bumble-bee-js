/**
 * Created by ARCH on 2/16/17.
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
 * @fileOverview constructor and associated methods for creating and managing
 * a tabbed view
 * @requires {@link Barge.Utils, @link  Barge.String, @link  Barge.Object, @link  Barge.Widget< @link Barge.Timer}
 *
 *
 * @user msg: Some lines in this file use constructs from es6 or later
 */
var Barge = Bee || {};

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.Ajax'] = factory(global));
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
      global['Barge.Ajax'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   /**
    *
    * @type {{}}
    */
   Bee.Ajax = Bee.Ajax || {};

   /**
    *
    * @returns {XMLHttpRequest}
    */
   Bee.Ajax.createXHR = function ()
   {
      let xhr = null;

      try
      {
         if (window.XMLHttpRequest)
         {
            xhr = new XMLHttpRequest();
         }
         else if (window.ActiveXObject)
         {
            xhr = new ActiveXObject("Microsoft.XMLHTTP")
         }
      }
      catch (e)
      {
         xhr = null;
      }

      return xhr;
   };

   /**
    *
    * @param options{{url : string, method : string, target : Element, title : string}}
    * @param fn {fn}
    * @static
    */
   Bee.Ajax.insertHTML = function (options, fn)
   {
      let request = Bee.Ajax.createXHR();

      request.onreadystatechange = function ()
      {
         if (request.readyState === 4 && request.status === 200)
         {
            fn(request);
         }
      };
      request.open(options.method, options.url, true);
      request.send(null);

   };

   function getQueryString(object)
   {
      return Object.keys(object).reduce(function (acc, item)
                                        {
                                           var prefix = !acc ? '' : acc + '&';
                                           return prefix + encode(item) + '=' + encode(object[item])
                                        }, '')
   }

   function hasContentType(headers)
   {
      return Bu.defined(headers["Content-Type"])

      //Object.keys(headers).some(function (name)
      //                          {
      //                             return name.toLowerCase() === 'content-type'
      //                          })
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

   function objectToQueryString(data)
   {
      return Bu.isObject(data) ? getQueryString(data) : data
   }


   /**
    * todo write an ajax dialog form opener constructor for els with attr data-jx-dgf="<url>, <method>"
    * add overlay
    *
    * if the dialog host (fdg) isnt already loaded load
    *
    * edit heading
    *
    * load form and insert into dialog
    */

   //going public whoop! whoop! lol
   return Bee.Ajax;
});

(function (Bu)
{

})(Bee.Utils);



