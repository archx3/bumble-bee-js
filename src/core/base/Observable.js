/**
 *
 * @Author       Created by arch on 29/06/17 using 11/18/17.
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
 * @requires {null}
 * No more requires {@link Barge.Array}
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.Array.Observable'] = factory(global));
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
      global['Barge.Array.Observable'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";
   //let's  create the namespace to house the observable array factory object
   Bee.Array = Bee.Array || {};
   //region protected globals
   //let Bu = Bee.Utils, Ba = Bee.Array;

   //endregion

   /**
    * The Observable Array class
    * @param config {{}|null} <T>
    * @constructor
    */
   function Observable(config = null)
   {
      this.observerArray = [];
   }

   /**
    *
    * @param obj
    */
   Observable.prototype.add = function (obj)
   {
      this.observerArray.push(obj);
   };

   /**
    *
    * @param index
    */
   Observable.prototype.remove = function (index)
   {
      this.observerArray.splice(index,  1);
   };

   /**
    *
    * @returns {Number}
    */
   Observable.prototype.count = function ()
   {
      return this.observerArray.length;
   };

   /**
    *
    * @param obj
    */
   Observable.prototype.indexOf = function (obj)
   {
      let i = 0, len = this.observerArray.length;
      for (; i < len; i++)
      {
         if (this.observerArray[i] === obj){
            return i;
         }
      }

   };

   /**
    *
    * @param index
    * @returns {*}
    */
   Observable.prototype.getObj = function (index)
   {
      return this.observerArray[index];
   };

   /**
    * The Subject Interface
    * simulating an interface (even tho it keeps state in addition to the methods)
    * interface
    * @constructor
    */
   function SubjectInterface()
   {
      this.observers = new Observable();
   }

   /**
    *
    * @param observer
    */
   SubjectInterface.prototype.subscribe = function (observer)
   {
     this.observers.add(observer);
   };

   /**
    *
    * @param observer
    */
   SubjectInterface.prototype.addSubscriber = function (observer)
   {
     this.observers.add(observer);
   };

   /**
    *
    * @type {SubjectInterface.subscribe|*}
    */
   SubjectInterface.prototype.addObserver = SubjectInterface.prototype.subscribe;

   /**
    *
    * @param observer
    */
   SubjectInterface.prototype.removeObserver = function (observer)
   {

     this.observers.remove(this.observers.indexOf(observer));
   };

   /**
    *
    * @param ctx
    */
   SubjectInterface.prototype.publish = function (ctx)
   {
     let i = 0, len = this.observers.count();
     for (; i < len; i++)
     {
        //msg the update method will be implemented on any observer object created
        // the new
      this.observers.getObj(i).update(ctx);
     }
   };

   SubjectInterface.prototype.notify = SubjectInterface.prototype.publish;

   /**
    * @interface
    */
   function ObserverInterface() {}

   /**
    * @override
    * @param val
    */
   ObserverInterface.prototype.update = function (val)
   {
      /*Implement in the concrete observer*/
   };

    Bee.Observable =  SubjectInterface;

   //public methods object
   //Bee.Array.ObservableArray = {
   //
   //};
   //going public whoop! whoop! lol
   //return ObservableArray;

});

//rewrite the prototypal constructor using classes