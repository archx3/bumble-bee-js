/**
 *
 * @Author       Created by ${USER} on 29/06/17 using ${DATE}.
 * @Time         : 00:19
 * @Copyright (C) 2018
 * @version 2.3.5
 * Barge Studios Inc, The Bumblebee Authors
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
 *     ( _____)
 *     ( _____)
 *     (_____)
 *
 * @fileOverview contains instruction[code] for creating  this
 *
 * @requires {@link }
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Bee.Widget.Container'] = factory(global));
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
      global['Bee.Widget.Container'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(global)
{
   "use strict";

   //region protected globals
   let Bu = Bee.Utils,
       Ba = Bee.Array,
       Bo = Bee.Object,
       Bs = Bee.String,
       Bd = Bee.Dom;

   //endregion

   class Container {
      constructor(config = {})
      {
         this.options = {
            el         : null,
            formFactor : {
               //the default form factor is just a container
               type   : "default", //can be of type window (in which case it comes w/ a chrome)
               //the thickness of the bezel around the container w/o the top if chrome exists (0 means no bezel)
               bezel  : 0,
               chrome : {
                  controls         : {
                     close    : true,
                     minimise : true,
                     maximise : true
                  },
                  controlsLocation : "left",
                  //a set of pre-made chrome themes
                  //windows, mac, and flatabulous-dark
                  theme            : "default", //
                  style            : {
                     color           : "#fff",
                     textAlign       : "center", //the style for the title + ellipses
                     backgroundColor : "#000",
                  },

               }
            },
            style      : {
               width  : "100%",
               height : "100%"
            },
            resizable  : false,
            draggable  : false
         };

         this.options = Bo.extend(this.options, config);

         this.chrome = null;
         this.content = null;

      }

      setUp()
      {

      }

      renderChrome()
      {
         this.chrome = Bd.createEl("div",)

      }

      render(){

      }

      create()
      {

      }

      /**
       *
       * @param content {Element}
       * @param fluid {Boolean}
       * @returns {null|*}
       */
      setContent(content, fluid = false)
      {
         //this.content = content;
         this.content.appendChild(content);
         if (fluid)
         {return this.content;}
      }

      getContent()
      {
         return this.content;
      }

      removeContent()
      {
         this.content = null;
      }

      swapContent(newContent)
      {

      }

      dismiss(newContent)
      {

      }

      destroy(newContent)
      {

      }
   }

   let c = new Container();

   //public methods object
   Bee.Widget.Container = {};

   //going public whoop! whoop! lol
   return Bee.Widget.Container;
});