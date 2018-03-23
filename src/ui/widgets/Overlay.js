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
 * @fileOverview contains instruction[code] for creating Screen Overlay Widgets this
 *
 * @requires {@link Bee.Utils}
   @requires {@link Bee.Array}
   @requires {@link Bee.ObservableArray}
   @requires {@link Bee.Object}
   @requires {@link Bee.String}
   @requires {@link Bee.Dom;}
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Bee.Widget.Overlay'] = factory(global));
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
      global['Bee.Widget.Overlay'] = factory(global);
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
   let Be = new Bee.Event.EventManager();
   //endregion

   class Overlay extends Widget
   {
     //region class properties

     //endregion
     /**
       * @constructor
       * @param config {{
           opacity : Number<Float>,
           backgroundColor : String,
           dismissOnClick : Boolean,
           scrollX : Boolean,
           scrollY : Boolean,
           style : {}<StyleObject>
           }}
       */
     constructor(config = {})
     {
        super(config);
        let self = this;
        this.hostNode = null;
        this.options = {
           opacity : 0.8,
           backgroundColor : '#000',
           dismissOnClick : false,
           dismissCallback : null,
           scrollX : false,
           scrollY : false,
           style : {
              zIndex          : 200,
              position        : 'absolute',
              top             : 0,
              left            : 0,
              overflowX        : this.options.scrollX === true ? "auto" : 'hidden',
              overflowY        : this.options.scrollY === true ? "auto" : 'hidden',
              display         : 'block',
              width           : '100%',
              height          : '100%'
           }
        };
        Bo.extend(this.options, config);

        this.eventList = [{
           type : "click",
           target : self.boundingBox,
           handler : function(e)
           {

           }
        }];
         this.render();
     }

     //region methods
      init(){ // NIU atm cos the initialisation is being done in the constructor method
         return this;
      }

      /**
       * @private
       */
      render()
      {
         this.renderUI();
         this.bindEvents();
         return this;
      }

      /**
       * @private
       */
      renderUI()
      {
         this.boundingBox =  Bee.Dom.createEl('section', { className : 'bee-overlay overlay' });
         Bd.css(this.boundingBox, this.options.style);
         if(this.options.opacity === "transparent")
         {
            this.options.opacity = 0;
         }
         if(this.options.opacity === "opaque")
         {
            this.options.opacity = 1;
         }

         Bd.css(this.boundingBox, {
            opacity :  this.options.opacity,
            backgroundColor : this.options.backgroundColor
         });

         if(Bu.defined(this.options.hostNode))
         {
            Bd.appendTo(this.boundingBox, this.options.hostNode);
         }
         else
         {
            Bd.appendTo(this.boundingBox, document.body);
         }
         return this;
      }

      /**
       * @private
       */
      bindEvents()
      {
         let self = this;
         if(this.options.dismissOnClick)
         {
            Be.bind(self.boundingBox, "click", function()
            {
               if(!this.disabled)
               {
                  self.dismiss();
                  if(self.options.dismissCallback && Bu.isFunction(self.options.dismissCallback))
                  {
                     self.options.dismissCallback();
                  }
               }
            });
         }
         return this;
      }

      hide()
      {
         if(!this.disabled)
         {
            Bd.addClass(this.boundingBox, "hidden");
            Bd.css(this.boundingBox, {display : "none"});
         }
         return this;
      }

      dismiss()
      {
         if(!this.disabled)
         {
            Bd.removeEl(this.boundingBox);
            this.destroy();
         }
         return this;
      }

      show()
      {
         Bd.removeClass(this.boundingBox, "hidden");
         Bd.css(this.boundingBox, {display : "block"});
         return this;
      }
     //endregion

   }

   //the first instance
   //let x = new Overlay();
   //public methods object
   //let publicInterface = {
   //
   //};

   //let overlay = new Overlay();
   Bee.Widget.Overlay = Overlay;
   //console.log(Bee.Widget.Overlay);
   //going public whoop! whoop! lol
   return Overlay;
});