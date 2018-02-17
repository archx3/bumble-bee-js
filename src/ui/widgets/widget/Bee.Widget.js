/**
 *
 * @Author       Created by ${USER} on 29/06/17 using ${DATE}.
 * @Time         : 00:19
 * @Copyright (C) 2018
 * @version 2.3.5
 * Barge Studios Inc, The $ Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence MIT
 *
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *       \____/
 *      ( -_- )
 *     (   ___)
 *     ( _____)
 *     (_____)
 *
 * @fileOverview contains instruction[code] for creating and managing Widgets
 * @requires {@link base}
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Bee.Widget'] = factory(global));
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
      global['Bee.Widget'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(global)
{
   "use strict";

   //region protected globals
   let Bu  = Bee.Utils,
       Ba  = Bee.Array,
       Boa = Bee.ObservableArray,
       Bo  = Bee.Object,
       Bs  = Bee.String,
       Bd  = Bee.Dom;
   //endregion


   class Widget
   {
     //region class properties

     //endregion
     /**
       * @constructor
       * @param config
       */
     constructor(config = {})
     {
        this.options = {};
        Bo.extend(this.options, config);

        this.boundingBox = null;
     }
     //region methods

     //endregion

   }

   //the first instance
   let widget = new Widget();

   //public methods object
   //going public whoop! whoop! lol
   return {

   };
});