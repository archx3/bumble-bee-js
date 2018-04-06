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
         Bee.Widget = Bee.Widget || {};
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

   class Container extends Widget {
      /**
       * @constructor
       * @param config
       *
       * @type {{srcNode : null,
       * formFactor : {type : string, bezel : number,
       * chrome : {controls : {close : boolean, minimise : boolean, maximise :
       * boolean}, controlsLocation : string, theme : string,
       * style : {color : string, textAlign : string, backgroundColor :
       * string}}}, style : {width : string, height : string},
       * resizable : boolean, draggable : boolean}}
       *
       */
      constructor(config = {})
      {
         //call the super class
         super();

         this.options = {
            srcNode    : null,
            hostNode   : document.body,
            formFactor : {
               //the default form factor is just a container
               type    : "default", //can be of type window (in which case it comes w/ a chrome)
               //the thickness of the bezel around the container w/o the top if chrome exists (0 means no bezel)
               bezel   : {
                  width : 0,
                  color : "transparent"
               },
               scrollX : false,
               scrollY : false,
               chrome  : {
                  controls         : {
                     close    : true,
                     minimise : true,
                     maximise : true
                  },
                  title            : {
                     text      : "Untitled",
                     alignment : "center" //could be left or right
                  },
                  controlsLocation : "left",
                  //a set of pre-made chrome themes
                  //windows, mac, and flatabulous-dark[DEFAULT]
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

         //msg this is being handled by the
         //console.log(config);
         //the copy operation is not done in place and does require reassignment
         this.options = Bo.deepMerge(this.options, config);
         this.options.formFactor.bezel.width = "" + (this.options.formFactor.bezel.width === 0 ? "" :
                            (this.options.formFactor.bezel.width === 1 ? "bdr" :
                      "bdr" + this.options.formFactor.bezel.width));
         this.chrome = null;
         this.content = null;

         this.render();

      }

      setUp()
      {

      }

      render()
      {
         this.renderUI();
         this.options.hostNode.appendChild(this.boundingBox);
      }

      renderChrome()
      {
         let self = this;
         let bezelWidth = this.options.formFactor.bezel.width;
console.log(bezelWidth);
         this.chrome = Bd.createEl("div", {
            className : ["bee-chrome " + bezelWidth + " bb0 fph h40 clr14 bg-clr20 bd-clr14 pdl10 rctl6 rctr6"]
         });

         let createChromeButton = function (bgColor, spaceOut = true)
         {
            return Bd.createEl("span", {
               className : "rc50p mtb10 iblk  hw15 " +
                           (spaceOut ? " mlr5 " : " ") +
                           bgColor
            });
         };

         let titleAlignment = self.options.formFactor.chrome.title.alignment;
         console.log(titleAlignment);
         let chromeTitle = Bd.createEl("h3", {
            className : "fph-75 m0a uc pd5 bld7 ltsp3 slogan ellipsify " +
                        (!(self.options.formFactor.chrome.controlsLocation === "right") ? "fr " : "fl ") +
                        (titleAlignment === "right" ? "ar" : (titleAlignment === "left" ? "al" : "ctr")),
            innerHTML : self.options.formFactor.chrome.title.text
         });

         if (!(this.options.formFactor.chrome.controlsLocation === "right"))
         {
            if (this.options.formFactor.chrome.controls.close)
            {
               this.chrome.appendChild(createChromeButton("bg-clr4"));
            }
            if (this.options.formFactor.chrome.controls.minimise)
            {
               this.chrome.appendChild(createChromeButton("bg-clr14"));
            }
            if (this.options.formFactor.chrome.controls.maximise)
            {
               this.chrome.appendChild(createChromeButton("bg-clr27", false));
            }
         }
         else
         {
            if (this.options.formFactor.chrome.controls.maximise)
            {
               this.chrome.appendChild(createChromeButton("bg-clr27", false));
            }
            if (this.options.formFactor.chrome.controls.minimise)
            {
               this.chrome.appendChild(createChromeButton("bg-clr14"));
            }
            if (this.options.formFactor.chrome.controls.close)
            {
               this.chrome.appendChild(createChromeButton("bg-clr4"));
            }
         }

         //update view
         this.chrome.appendChild(chromeTitle);
         titleAlignment = bezelWidth = null;
         return this.chrome;
      }

      renderUI()
      {
         this.boundingBox = Bd.createEl("div", { classList : ["bee-container-bezel", "fpv", "fph"] });

         let formFactorType = this.options.formFactor.type;
         let bezelWidth = this.options.formFactor.bezel.width;
         let contentBoxHeight = "fpv";
         if (this.options.formFactor.type === "window")
         {
            this.boundingBox.appendChild(this.renderChrome());
            contentBoxHeight = "fpv-40";
         }

         this.contentBox = Bd.createEl("div", {
            className : ["bee-content-box " + bezelWidth + " fph " + contentBoxHeight +  " clr14 bg-clr20 bd-clr14 pd10"]
         });

         this.boundingBox.appendChild(this.contentBox);
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

      destroy()
      {
         super.destroy();
         Bd.removeEl(this.boundingBox);
      }
   }

   //let c = new Container({
   //                         draggable : true,
   //   }
   //                      });
   //public methods object
   //FIXME use revealing module pattern
   Bee.Widget.Container = Container;

   //going public whoop! whoop! lol
   return Container;
});

/*html
<div class="fpv pdtb10">
   <div class="bdr2 bb0 fph h40 clr14 bg-clr20 bd-clr14 pdl10 rctl6 rctr6">
      <span class="rc50p mtb10 mlr5 hw15 bg-clr4 iblk"></span>
      <span class="rc50p mtb10 mr5 hw15  iblk"></span>
      <span class="rc50p mtb10 hw15 bg-clr27 iblk"></span>

      <h3 class="fph-75 fr ctr m0a uc pd5 bld7 ltsp3 slogan ellipsify">SOFTWARE ENGINEERING</h3>
   </div>
   <div class="bdr2 fph fpv-40 clr14 bg-clr20 bd-clr14 pd10">

   </div>
</div>


seo optimizer and suggester
*/