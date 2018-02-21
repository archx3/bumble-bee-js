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
         return (global['Widget'] = factory(global));
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
      global['Widget'] = factory(global);
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

   Bee.Widget = Bee.Widget || {};

   /**
    * This is the base class from which all Widgets are derived and sets up the
    * properties and methods common to all widgets
    * @class
    */
   class Widget {

      /**
       * @constructor
       * @param config
       */
      constructor(config = {})
      {
         //region class properties

         this.options = {
            srcNode : null,
            hostNode : null,
            formFactor : {
               //the default form factor is just a container
               type  : "default", //can be of type window (in which case it comes w/ a chrome)
               //the thickness of the bezel around the container w/o the top if chrome exists (0 means no bezel)
               bezel : 0
            },
            style      : {
               /**
                * String with units, or a number, representing the height of the widget.
                * If a number is provided, the
                * default unit, defined by Widget's DEFAULT_UNIT, property is used.
                * The height is applied to the bounding box.
                * @type {Boolean}
                */
               width  : "100%",
               /**
                * String with units, or a number, representing the width of the widget.
                * If a number is provided, the
                * default unit, defined by Widget's DEFAULT_UNIT, property is used.
                * The width is applied to the bounding box.
                * @type {String|Number}
                */
               height : "100%"
            },
         };

         Bo.extend(this.options, config);

         /**
          * The widget's outermost node, used for sizing and positioning;
          * this element can also serve as a containing node for any decorator elements
          * used for skinning.
          * @type {Node|Element|null}
          */
         this.boundingBox = null;

         /**
          * A node that is a direct descendant of a widget's bounding box and houses its content.
          * This will
          * generally be the node that establishes the look and feel for the widget.
          * @type {Node|Element|null}
          */
         this.contentBox = null;

         /**
          * An existing node in the document provided by application developers when progressively enhancing
          * existing markup to create the widget. By default, this resolves to the contentBox.
          * @type {Node|Element|String|null}
          */
         this.srcNode = this.options.srcNode;

         /**
          * The tabIndex, applied to the bounding box.
          * @type {Number|null}
          */
         this.tabIndex = null;

         /**
          *Flag, indicating if the widget currently has focus.
          *Widget marks the bounding box with a "focused"
          *class, but other than that the focus implementation is left to the specific widget class.
          * @type {Boolean}
          */
         this.focused = false;

         /**
          * Flag, indicating if the widget is disabled.
          * Widget marks the bounding box with a "disabled" class,
          but other than that the disabled implementation is left to the specific widget class.
          * @type {Boolean}
          */
         this.disabled = false;

         /**
          * Flag, indicating whether or not the widget is visible.
          * Widget marks the bounding box with a "hidden"
          * class. The hidden implementation is left to the CSS delivered by the specific widget class (viz.
          * whether or not the widget uses visibility, display or off screen positioning to actually hide the
          * widget).
          * @type {Boolean}
          */
         this.visible = false;

         /**
          * The collection of strings used to label elements of the widget's UI.
          * These should ideally be packaged
          * separately from the Widget code, as discussed in the Language Resource Bundles example.
          * @type {String|Number}
          */
         this.strings = null;

         this.eventList = [];
         //endregion

      }

      //region methods
      /**
       * the initializer method
       */
      init()
      {

      }

      /**
       *
       */
      render(pipelineItems, renderConfig, eventList)
      {
         this.renderUI(pipelineItems, renderConfig);
         this.bindEvents(eventList);
         return this;
      }

      /**
       *This method is responsible for
       * creating and adding the nodes which the widget needs into the document
       * (or modifying existing nodes, in the case of progressive enhancement).
       * It is usually the point at which the DOM is first modified by the widget.
       * @param pipelineItems{Array}
       * @param config{{}}
       * Must be overridden
       */
      renderUI(pipelineItems, config)
      {

      }

      /**
       * This method is responsible for attaching event listeners which bind the UI to the widget state.
       * These listeners are generally attribute change listeners
       * — used to update the state of the UI in response to changes in the attribute's value.
       * It also attaches DOM event listeners to the UI to map user interactions to the widget's API.
       *
       * @param eventList {Array<{type : String, target : Element|String<Selector>, handler:functionn, numberOfTimes : Number}>}
       * The events to be handled by Widget
       * Must be overridden
       */
      bindEvents(eventList = this.eventList)
      {
         Ba.forEach(eventList, function(event, i)
         {
            if(!(event.numberOfTimes))
            {
               Be.bind(event.target, event.type, event.handler);
            }
         });
         return this;
      }

      /**
       * This method is responsible for setting the initial state of the UI
       * based on the current state of the widget at the time of rendering.
       */
      syncUI(){
      }

      disable(callback)
      {
         this.disabled = true;
         if(callback && Bu.isFunction(callback))
         {
            callback(this);
         }
         return this;
      }

      enable(callback)
      {
         this.disabled = false;
         if(callback && Bu.isFunction(callback))
         {
            callback(this);
         }
         return this;
      }

      /**
       * This kills the Widget instance (but does not remove it from the Dom atm)
       * Node removal should be handled at Child Widget level
       */
      destroy()
      {
         Bu.destroy(this);
      }
      //endregion
   }

   //the first dummy instance NIU
   //let widget = new Widget();

   //public methods object
   //going public whoop! whoop! lol
   Bee.Widget = Bee.Widget || {};
   return Widget;
});