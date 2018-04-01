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
 * @fileOverview contains instruction[code] for creating Form Input Widgets this
 *
 *    @requires {@link Bee.Utils, @link Bee.Array, @link Bee.Dom (DOM_CORE)}
 *    @requires {@link Bee.Object, @link Bee.ObservableArray}
 *    @requires{@link Bee.String, @link Bee.Keyboard}
 *    @requires{@link Bee.Event, @link Bee.Keyboard.KeyCodes}
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Bee.Widget.Input'] = factory(global));
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
      global['Bee.Input'] = factory(global);
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

   /**
    * For creating and maintaining form input widgets ranging from
    * TEXT, PASSWORD, TEXT, [ ] CHECK, (.) RADIO,
    * [  v]SELECT, COMBO-BOX,
    * DATE-PICKER, TIME-PICKER, SPINNER(NUMBER, TIME, DATE)
    * SLIDER
    * @class Input
    * @extends Widget
    */
   class Input extends Widget
   {
     //region class properties

     //endregion
      /**
       * @constructor
       * @param config {{type : String, group : null | String, name : String, id : String, label : String, placeholder : String, autoFocus : Boolean, default : String | Boolean | Number, requiredFieldIndicator : Boolean}}
       * @returns {*|Element}
       */
     constructor(config = {})
     {
        super();

        /**
         * @override
         * @type {{type : string}}
         */
        this.options = {
           type : "text",
           requiredFieldIndicator : false,
           autoFocus : false
        };
        Bo.extend(this.options, config);

        this.model = {
           value : ""
        };

        return this.boundingBox;
     }
     //region methods

      /**
       *
       * @param legendTitle {String}
       * @returns {*|Element}
       */
      static createFieldSet(legendTitle = "")
      {
         let fieldSet = Bd.createEl("fieldset");

         if(!(Bs.isEmpty( legendTitle)))
         {
            fieldSet.appendChild(Bd.createEl("legend", {innerHTML : legendTitle}))
         }
         return fieldSet;
      }

      /**
       *
       * @private
       */
      createField()
      {
         let self = this;

         this.boundingBox = Bd.createEl("div", {className : "fields-row"});

         this.label = Bd.createEl("label", { "for" : self.options.id || "", innerHTML : self.options.label || ""});
         if(self.options.requiredFieldIndicator)
         {this.label.appendChild(Bd.createEl("span", {innerHTML : "*", className : "req-field"}));}


         this.boundingBox.appendChild(this.label);
      }
     //endregion

   }

   //the first instance
   //let x = new ();

   //public methods object
   //let publicInterface = {
   //
   //};

   //going public whoop! whoop! lol
   return {

   };
});

/*
* TODO finish the createField method input
* */