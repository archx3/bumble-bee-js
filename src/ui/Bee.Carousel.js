/**
 *
 * @Author       Created by arch on 29/06/17 using 12/31/17.
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
         return (global['Barge.Dom.Carousel'] = factory(global));
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
      global['Barge.Dom.Carousel'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let Bu = Bee.utils,
       Ba = Bee.Array,
       Bs = Bee.String,
       Bd = Bee.Dom;
   //endregion

   /**
    *
    * @param config{{}}
    * @constructor
    */
   function Carousel(config = null)
   {
      this.host = null;
      this.panels = null;

      this.controlPanel = null;
   }

   //let ca = new Carousel();

   //public methods object
   Bee.Dom.Carousel = {
      create : function (config)
      {
         let ca = new Carousel(config);
      }
   };

   //going public whoop! whoop! lol
   return Bee.Dom.Carousel;
});