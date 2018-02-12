/**
 *
 * @Author       Created by arch on 29/06/17 using 11/20/17.
 * @Time         : 00:19
 * @Copyright (C) 2017$
 * @version 2.3.5
 * Barge Studios Inc, The $ Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence      Licensed under the Barge Studios Eula
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
 * @fileOverview contains instruction[code] for creating $ this
 *
 * @requires {@link $}
 *
 */



(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.Array.ObservableArray'] = factory(global));
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
      global['Barge.Array.ObservableArray'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let Bu = Bee.Utils,
       Ba = Bee.Array;
   //endregion

   /**
    *
    * @param array {Array}
    * @param options {{subscribers : Array<*>, updateFn : fn}}
    * @constructor
    */
   function ObservableArray(array, options)
   {
      this.array = [];
      this.array = Bu.extend(array, new Bee.Observable());

      this.subscribers = options.subscribers;
      this.updateFn = function (val)
      {
         options.updateFn();
      };
      if(Bu.defined(options.subscribers))
      {
         this.addSubscribers();
      }

      //return this.array;
   }

   ObservableArray.prototype.applyOverrides = function ()
   {
      let self = this;

      //copying the implementation function of the Array.prototype.push()
      //into the psh property so that the original push could be overridden
      // and it's functionality extended
      this.array.psh = this.array["push"];
      /**
       * @override
       * overrides the array's push method
       * @param val
       */
      this.array.push = function (val)
      {
         self.array.psh(val);
         self.array.publish(self.array);
      };

      this.array.pp = this.array["pop"];

      //a modified version of the Array.prototype.pop() method;
      // works lyk the List.pop() method in python
      this.array.pop = function (index = null)
      {
         if(!index) {
            self.array.pp()
         }
         else
         {
            self.array.splice(index, 0)
         }
         self.array.publish(self.array);
      }
   };

   ObservableArray.prototype.push = function (element)
   {
      this.array.push(element)
   };

   ObservableArray.prototype.pop = function (index = null)
   {
      this.array.pop(index)
   };


   ObservableArray.prototype.addSubscribers = function ()
   {
      let self = this;
      Ba.forEach(self.subscribers, function (subscriber)
      {
         //set the subscriber u[ for subscription and then add it as a subscriber
         self.addSubscriber(subscriber, self["updateFn"])
      });
   };

   ObservableArray.prototype.addSubscriber = function (subscriber, updateFn)
   {
      let self = this;
      Bu.extend(subscriber, new Bee.Observable());
      self.array.subscribe(subscriber);

      //add the update callback fn to each of the subscribers
      if(Bu.isFunction(updateFn))
      {
         subscriber.update = updateFn;
      }
   };

   //going public whoop! whoop! lol
   Bee.Array.ObservableArray = ObservableArray;
});
