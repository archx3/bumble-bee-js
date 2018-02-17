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
      /**
       * @constructor
       * @param config
       */
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
         this.chrome = Bd.createEl("div",{});

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
/*
<div class="fpv pdtb10">
                  <div class="bdr2 bb0 fph h40 clr14 bg-clr20 bd-clr14 pdl10 rctl6 rctr6">
                     <span class="rc50p mtb10 mlr5 hw15 bg-clr4 iblk"></span>
                     <span class="rc50p mtb10 mr5 hw15 bg-clr14 iblk"></span>
                     <span class="rc50p mtb10 hw15 bg-clr27 iblk"></span>
                     <h3 class="fph-75 fr ctr m0a uc pd5 bld7 ltsp3 slogan ellipsify">SOFTWARE ENGINEERING</h3>
                  </div>
                  <div class="bdr2 fph fpv-40 clr14 bg-clr20 bd-clr14 pd10">
                     <p class="cmd clr22 bld4 fts20">
                        <span class="prompt"><span class="clr28">arch@kobina</span>:<span class="clr3">~</span>$</span>
                        <span class="td-u">#Frontend developer </span>
                     </p>

                     <p class="cmd clr22 bld4 fts20">
                        <span class="prompt"><span class="clr28">arch@kobina</span>:<span class="clr3">~</span>$</span>
                        <span class="td-u">#Backend developer </span>
                     </p>
                     <p class="cmd clr22 bld4 fts20">
                        <span class="prompt"><span class="clr28">arch@kobina</span>:<span class="clr3">~</span>$</span>
                        <span class="blinking-cursor">|</span>
                     </p>
                  </div>
               </div>


seo optimizer and suggester
*/