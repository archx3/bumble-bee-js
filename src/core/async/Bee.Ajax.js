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
//var Bee = Bee || {};

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

   let Bu = Bee.Utils,
       Bo = Bee.Object;

   /**
    * @class
    */
   class Ajax {
      /**
       *
       * @param options {{baseUrl : String, data : {}, method  : "GET"} | null}
       * @constructor
       */
      constructor(options = null)
      {
         this.options = {
            baseUrl : "",
            data    : null,
            method  : "GET"
         };

         if (options)
         {
            this.options = Bo.extend(this.options, options);
         }

         this.request = null;
         return this;
      }

      /**
       *
       * @returns {XMLHttpRequest}
       */
      static createXHR()
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
               xhr = new ActiveXObject("Microsoft.XMLHTTP");
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
       * @param options{{url : string, method : string, target : Element, title : string, error : fn,  success : fn, abort : fn,
       *    progress : fn, data: {}, status : { code : fn, 404 : fn, 200 : fn, ...} }}
       * @returns {XMLHttpRequest}
       */
      send(options)
      {
         this.request = Ajax.createXHR();
         this.queryString = "";
         this.formData = null;

         let self    = this,
             request = this.request;

         if (options)
         {
            this.options = Bo.extend(this.options, options);
         }

         this.request.onreadystatechange = function ()
         {
            if (request.readyState === 4 && request.status === 200)
            {
               if (self.options.success && Bu.isFunction(self.options.success))
               {
                  self.options.success(request);
               }
            }
            if (request.status === 404)
            {
               if (self.options.error && Bu.isFunction(self.options.error))
               {
                  self.options.error(request);
               }
            }

            if (Bu.defined(self.options.status) && !Bo.isEmpty(self.options.status))
            {
               for (let key in self.options.status) //issue linear search my need improvement
               {
                  if (self.options.status.hasOwnProperty(key))
                  {
                     if (request.status.toString() === key && Bu.isFunction(self.options.status[key]))
                     {
                        self.options.status[key](request); //call the status code callback and pass it the request object
                     }
                  }
               }

            }
         };

         //region add the necessary events to the request object
         let events = ["error", "abort", "progress"];

         events.forEach(function (event)
                        {
                           request.addEventListener(event, function (e)
                           {
                              if (Bu.defined(self.options[event]))
                              {
                                 self.options[event](request);
                              }
                           })
                        });
         //endregion

         //region add header to the request object
         //@warning only one header can be added to a request object
         let header = self.options.headers, headerName = Bo.getKeyAt(header, 0);
         request.setRequestHeader(headerName, header[headerName]);

         //let's do some clean up exercise
         header = headerName = null;
         //endregion

         //let's open the url to send the data to
         //Don't add the data as query string except the requset method is "GET"
         request.open(this.options.method,
            this.options.baseUrl + this.options.url + self.toQueryString(self.options.data), true);

         //region creating form data param to be sent along the request object
         let formData = null;

         if(!(this.options.method.toLocaleUpperCase() === "GET"))
         {
            formData = new FormData();
            for (let name in self.options.data)
            {
               if (self.options.data.hasOwnProperty(name))
               {
                  formData.append(name, self.options.data[name]);
               }
            }
         }
         //endregion

         //now that all data have been passed and headers set, we can send the request
         request.send(formData);

         return this;
      };

      /**
       * Abort the request
       * @returns {Ajax}
       */
      abort()
      {
         this.request.abort();
         return this;
      };

      /**
       * @private
       * @param object
       */
      makeQueryString(object)
      {
         let firstKey = Object.keys(object)[0];

         this.queryString = "?";

         this.queryString += firstKey + "=" + Ajax.encode(object[firstKey]);

         for (let key in object)
         {
            this.queryString += "&" + key + "=" + Ajax.encode(object[key]);
         }
      }

      /**
       *
       * @param object {{}}
       * @returns {string|string|*}
       */
      getQueryString(object)
      {
         this.makeQueryString(object);
         return this.queryString;
         //Object.keys(object).reduce(function (acc, item){//var prefix = ;//return (!acc ? '' : acc + '&') +
         // self.encode(item) + '=' + self.encode(object[item])//}, '') //msg Legacy code
      };

      /**
       *
       * @param value {String}
       * @returns {string}
       */
      static encode(value)
      {
         return encodeURIComponent(value);
      };

      /**
       *
       * @param value {String}
       * @returns {string}
       */
      static decode(value)
      {
         return decodeURIComponent(value);
      }

      /**
       *
       * @param headers
       * @returns {boolean}
       */
      static hasContentType(headers)
      {  //return Bu.defined(headers["Content-Type"])
         return Object.keys(headers).some(function (name) {return name.toLowerCase() === 'content-type';});
      };

      /**
       * @deprecated
       * @param xhr
       * @param headers
       * @returns {Ajax}
       */
      setHeaders(xhr, headers = {})
      {
         let self = this;
         //headers = headers || {};
         if (!Ajax.hasContentType(headers))
         {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
         }
         Object.keys(headers).forEach(function (name)
                                      {
                                         (headers[name] && self.request.setRequestHeader(name, headers[name]));
                                      });
         return this;
      };

      toQueryString(data)
      {  //this.makeQueryString(data);
         return Bu.isObject(data) ? this.getQueryString(data) : data;
      };
   }

   //going public whoop! whoop! lol
   return Bee.Ajax = Ajax;
});



