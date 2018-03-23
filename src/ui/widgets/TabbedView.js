/**
 * Created by ARCH on 10/07/2016.
 * @Copyright (C) 2016
 * Barge Studios Inc, The Bumble-Bee Authors
 * <bargestd@gmail.com>
 * <bumble.bee@bargestd.com>
 *
 * @licence Licensed under the Barge Studios Eula
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
 * @fileOverview constructor and associated methods for creating and managing
 * a tabbed view
 * @requires {@link Barge.Utils, * @link  Barge.String,
 * @link  Barge.Widget<?>, * @link  Barge.Object}
 *
 *
 * @user msg: Some lines in this file use constructs from es6 or later
 */

   //Declaring the Bee Namespace

(function (global, factory)// don't litter the global scope
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['TabbedView'] = factory(global));
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
      global['TabbedView'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{

   "use strict";

   //endregion
   let Bu = Bee.Utils,
       Bs = Bee.String,
       Bo = Bee.Object,
       Bd = Bee.Dom;

   //region protected globals
   Bee.Widget = Bee.Widget || {};

   let Be = new Bee.Event.EventManager();

   /**
    *
    * @param parent {String<css> | Element}
    * @param tabHeadNames {Array.<String>|{
                                 containerID : String,
                                 tabName     : String,
                                 style : {}
                              }}
    * @param options {{sortHeads : Boolean, defaultActiveTabNumber : Number, closeButtons : Boolean,
      icons : Boolean, keepState : Boolean, canAddTab : Boolean, addButtonCallback : fn, canRemoveTab : Boolean, keepSortHeadsState : Boolean, tabbedViewID : String, style : Object, panesHostStyle : {}, panesHostProps :{} }}
    * @constructor
    */
   function TabbedView (parent, tabHeadNames, options)
   {
      //region properties
      /**
       *
       * @type {String<css>|Element}
       */
      this.parent = parent;

      this.INDEX = 0;
      /**
       *
       * @type {{tabName: string, containerID: string,
       style: {overflowY: string}, activeTab: boolean, icon: {show: boolean, className: string, style: {}}}| Array.<String>}
       */
      this.tabHeadNames = tabHeadNames;

      /**
       * the container el of the tabHeads view <div></div>
       * @type {Element|null}
       */
      this.tabsHost = null;

      /**
       * the container el of the tabHeads view <div></div>
       * @type {Element|null}
       */
      this.panesHost = null;

      /**
       * the tabs list view el <UL></UL>
       * @type {null}
       */
      this.list = null;

      /**
       * tabs list items <LI></LI>
       * @type {Array<Element>}
       */
      this.tabs = [];

      /**
       * the list of panes
       * @type {Array<Element>}
       */
      this.panes = [];

      //the add button object
      this.addButton = null;

      //the show tabs list button
      this.showTabsList = null;

      /**
       * tracking the active tab
       * @type {Object}
       */
      this.activeTab = null;

      /**
       * tracking the active pane
       * @type {Object}
       */
      this.activePane = null;

      this.sortable = null;
      //endregion
      /**
       * the default config setting
       * @type {{defaultActiveTabNumber: number,
       * closeButtons: boolean, tabHeadLocation: string,
       * sortHeads: boolean, icons: boolean,
       * keepState: boolean, keepSortHeadsState: boolean,
       * tabbedViewID: null,panesHostStyle : null, style : null}}
       */
      this.options = {
         defaultActiveTabNumber : 1,
         closeButtons           : false,
         tabHeadLocation        : 'top',
         sortHeads              : false,
         icons                  : false,
         keepState              : true,
         keepSortHeadsState     : true,
         tabbedViewID           : null,
         canAddTab              : false,
         addButtonCallback      : null,
         canRemoveTab           : false,
         maxNumberOfTabs        : 9,
         genericTabName         : "Untitled Tab",
         autoCreate : true,
         scrollablePanes : false
      };

      /*tab = {
         title : "",
         canClose : False,
         icon : "",

         * */

      //replace the default options w/ the user set ones if any is available
      if (options)
      {
         this.options = Bo.extend(this.options, options);
      }

      //check if the auto create option is set to true and create the view component if so
      if(this.options.autoCreate === true)
      {
         this.create();
      }
   }

   /**
    *
    */
   TabbedView.prototype.create = function ()
   {
      //console.log(this.options.style);
      /**
       * the DIV that contains the whole tabbedView
       * @type {any|Element}
       */
      let tabbedView = Bd.createEl("div", { className : 'tabbedView' },
                                    this.options.style);

      /**
       *
       * @type {TabbedView}
       */
      const self = this;

      //make
      tabbedView.appendChild(this._renderTabHeads(this.tabHeadNames));
      tabbedView.appendChild(this._renderPanes(this.tabHeadNames));

      //insert the tabbed view created into the parent el supplied if any (else : FIXME)
      if (this.parent)
      {
         if (Bu.isString(this.parent))
         {
            this.parent = Bd.getEl(this.parent);
         }

         //this.parent.appendChild(tabbedView)
         Bd.insertChildAt(this.parent, tabbedView, this.INDEX);
      }

      /**
       *
       * @type {NodeList}
       */
      let tabHeads = document.querySelectorAll(".tabbedView .tabHead");

      //let's add the click event that switches the tabs
      this._addClickEvent();

      //making the tabbed view state persistent
      if (self.options.keepState === true) //imhere fixme
      {
         if (Bu.defined(self.options.tabbedViewID) && !Bs.isEmpty(self.options.tabbedViewID))
         {
            //let lastActive      = localStorage.getItem(self.options.tabbedViewID)
            let lastActive = localStorage.getItem(self.options.tabbedViewID);

            let lastTabHead = Bd.getElementsByAttribute("data-pane", lastActive, true);

            //console.log(lastActive);
            /*let nextPane = Bd.gebi(this.getAttribute("data-pane").toString());
             let activePane = document.querySelector(".activePane");

             self._setActive(this, "tabHead", "activeTabHead");
             self._setActive(nextPane, "pane", "activePane");*/

            if (Bu.defined(lastTabHead) && Bu.defined(lastTabHead.click))
            {
               lastTabHead.click();
            }
         }
      }

      //let's join the memory freedom movement
      tabbedView = tabHeads = null;
   };

   TabbedView.prototype._addClickEvent = function ()
   {
      const self = this;

      Be.bind(this.list, "click", function (event)
      {
         let target = event.target;
         if (target.classList.contains("tabCloseBtn"))
         {
            self.closeTab(target);
         }
         else
         {
            let nextPane = Bd.gebi(target.getAttribute("data-pane").toString());
            let activePane = document.querySelector(".activePane");

            self._setActive(target, "tabHead", "activeTabHead");
            self.activeTab = target;
            self._setActive(nextPane, "pane", "activePane");
            self.activePane = nextPane;

            if (self.options.keepState === true)
            {
               localStorage.setItem(self.options.tabbedViewID, target.getAttribute("data-pane").toString());
            }
            target = nextPane = activePane = null;
         }

         event.stopPropagation();
      });
   };

   /**
    *
    * @private
    */
   TabbedView.prototype._createSorter = function ()
   {
      if (Bu.defined(window.DragSorter))
      {
         let self = this;

         self.sortable = null;
         /**
          *
          * @type {DragSorter}
          */
         self.sortable = new DragSorter(self.list,
                                        {
                                           group       : '',
                                           animation   : 200,
                                           delay       : 0,
                                           chosenClass : "chosenSortItem",
                                           store       : self.options.keepSortHeadsState === true ? {
                                              get : function (sortable)
                                              {
                                                 let order = localStorage.getItem("tv" + sortable.options.group);
                                                 return order ? order.split('|') : [];
                                              },
                                              set : function (sortable)
                                              {
                                                 let order = sortable.toArray();
                                                 localStorage.setItem("tv" + sortable.options.group, order.join('|'));
                                              }
                                           } : null
                                        });
      }
   };

   /**
    *
    * @param {Number}count
    * @param {*} [tabName]
    * @param activeTab
    * @param addButton {Boolean}
    * @param iconObj {string }
    */
   TabbedView.prototype.createTab = function (count, tabName = null, activeTab = "", addButton = false, iconObj = null)
   {
      const self = this;
      //tabName = tabName || node.tabName;
      let li = Bd.createEl("li",
                           { 'className' : (addButton ? "addButton" : 'tabHead') + activeTab },
                           {
                              userSelect   : 'none',
                              paddingRight : self.options.canRemoveTab ? "3px" : "10px"
                           });

      li.setAttribute('data-pane', 'pane' + Bu.pInt(count + 1));
      li.setAttribute('data-count', count + 1);

      let a = Bd.createEl("a", {
                             href      : '#',
                             innerHTML : tabName ? tabName : self.options.genericTabName
                          },
                          { userSelect : 'none', pointerEvents : 'none' });

      //console.log(iconObj);
      if(Bu.defined(iconObj))
      {
         let span = Bd.createEl("span", { 'className' : "tabIcon tabIco" },
                                Bu.defined(iconObj.style) ? iconObj.style : null);

         li.appendChild(span);
         //span = null;
      }

      li.appendChild(a);

      if (this.options.canRemoveTab)
      {
         let closeBtn = Bd.createEl("span",
                                    { 'className' : "tabCloseBtn", innerHTML : "&times;" },
                                    {
                                       marginLeft : "10px"
                                    });
         li.appendChild(closeBtn);
      }

      //add the tab to the list of tabs in the model
      self.tabs.push({el : li, tabName : tabName, index : count, });

      //add the tab <li> to the view
      self.list.appendChild(li);

      //let's free up some mem, shall we?
      li = activeTab = a = null;
   };

   /**
    *
    * @returns {*|Element}
    * @private
    */
   TabbedView.prototype._renderTabHeads = function ()
   {
      //let tabHeadsDiv = Bd.createEl("div", {className : "tabHeads"});
      let self = this;

      this.tabsHost = Bd.createEl("div", { className : "tabHeads" });

      this.list = Bd.createEl("ul", { id : 'tHeadsUl' });

      //create and insert the tabHeads
      if (Bu.isArray(self.tabHeadNames))
      {
         Bu.forEach(self.tabHeadNames, function (node, i)
         {
            /**
             * if the tab is the default active tab
             * @type {string}
             */
            let activeTab = i === self.options.defaultActiveTabNumber - 1 ? ' activeTabHead' : '';

            self.createTab(i, self.tabHeadNames[i], activeTab);

            /*let li = Bd.createEl("li", { 'className' : 'tabHead' + activeTab }, {
             userSelect : 'none'
             });

             li.setAttribute('data-pane', 'pane' + Bu.pInt(i + 1));
             li.setAttribute('data-count', i + 1);

             let a = Bd.createEl("a", {
             href      : '#',
             innerHTML : self.tabHeadNames[i]
             }, {
             userSelect : 'none'
             });

             let span = Bd.createEl("span", { 'className' : "tabIcon" });

             li.appendChild(span);
             li.appendChild(a);

             self.tabs.push(li);
             self.list.appendChild(li);

             li = activeTab = a = span = null;*/
         });
      }
      else if (Bu.isObject(self.tabHeadNames))
      {
         let i = 0;
         Bo.forEach(self.tabHeadNames, function (node)
         {
            i++;
            let activeTab = Bu.defined(node.activeTab) && node.activeTab === true ? ' activeTabHead' : '';

            self.createTab(i, node.tabName, activeTab, false, Bu.defined(node.icon) ? node.icon : null);
         });
      }

      this.tabsHost.appendChild(this.list);

      //this.list =  null;

      if (this.options.sortHeads === true)
      {
         this._createSorter();
      }

      function creatLi(text)
      {
         let li = Bd.createEl("li", { 'className' : 'addButton' }, {
            userSelect : 'none',
            padding    : "2px",
            fontWeight : 600,
            lineHeight : 1,
            minWidth   : "19px",
            textAlign  : "center"
         });
         let a = Bd.createEl("span", {
            href : '#', innerHTML : text

         }, { userSelect : 'none', });

         li.appendChild(a);
         return li;
      }

      if (self.options.canAddTab === true || self.options.showTabsList === true)
      {
         let ul = Bd.createEl("ul"), li = null;

         if(self.options.canAddTab === true)
         {
            li = creatLi("+");
            ul.appendChild(li);
            self.addButton = li;

            Be.bind(self.addButton, "click", function (e)
            {
               //imhere ADD TAB fn
               self.addTab(self.options.genericTabName + " " + (self.list.children.length + 1));

               if (self.options.addButtonCallback !== null)
               {
                  self.options.addButtonCallback();
               }
            });
         }

         if(self.options.showTabsList === true)
         {
            li = creatLi("&equiv;");
            ul.appendChild(li);
            self.showTabsList = li;
         }

         li = null;
         self.tabsHost.appendChild(ul);
      }

      return this.tabsHost;
   };

   /**
    *
    * @param activePane
    * @param count
    * @param containerID {String} must be pascalCase
    * @param tabName
    * @param style
    * @param {Element} [content]
    */
   TabbedView.prototype.createPane = function (activePane = "", count, containerID = false,
                                                         tabName = "Untitled Tab ", style = {}, content = null)
   {
      const self = this;
      let div = Bd.createEl("div",
                            { className : 'pane' + activePane, id : 'pane' + Bu.pInt(count + 1) },
                            style);

      if(this.options.scrollablePanes === true)
      {
         Bd.css(div, {overflowY : "auto"});
      }

      let paneContent = containerID ? document.getElementById(containerID) :
                        content ? content : null;

      if (paneContent)
      {
         div.appendChild(paneContent);
      }
      //else
      //{
      //   div.innerHTML = tabName;
      //}

      //add the pane and it's properties to the model
      self.panes.push({el : div, tabName : tabName, index : count});
      //update the view with the generated pane el
      self.panesHost.appendChild(div);

      //let the sea give up the dead in it
      div = activePane = paneContent = null;
   };

   /**
    *
    * @returns {*|Element}
    * @private
    */
   TabbedView.prototype._renderPanes = function ()
   {
      //let panesDiv = Bd.createEl("div", { className : "panes" }),
      let self = this;
      this.panesHost = Bd.createEl("div", { className : "panes" },
                                   Bu.defined(self.options.panesHostStyle) ? self.options.panesHostStyle : null );


      if (Bu.isArray(self.tabHeadNames))
      {
         Bu.forEach(self.tabHeadNames, function (node, i)
         {
            let activePane = i === self.options.defaultActiveTabNumber - 1 ? ' activePane' : '';
            let div = Bd.createEl("div", { className : 'pane' + activePane, id : 'pane' + Bu.pInt(i + 1) });

            let paneContent = document.getElementById(Bs.toPascalCase(self.tabHeadNames[i], true));

            if (paneContent)
            {
               div.appendChild(paneContent);
               //Bu.removeEl(paneContent);
            }
            //else
            //{
            //   div.innerHTML = self.tabHeadNames[i];
            //}

            self.panes.push(div);
            self.panesHost.appendChild(div);

            //let's free up some mem again
            div = activePane = paneContent = null;
         });
      }
      else if (Bu.isObject(self.tabHeadNames))
      {
         let i = 0;
         Bo.forEach(self.tabHeadNames, function (pane)
         {
            i++;
            //console.log(i);
            let activePane = Bu.defined(pane.activeTab) && pane.activeTab === true ? ' activePane' : '';
            //this.createPane(activePane, i, node, self);

            self.createPane(activePane, i, pane.containerID, pane.tabName, Bu.defined(pane.style) ? pane.style : {});
         });
      }

      return this.panesHost;
   };

   /**
    * used to set a tab and its pane as the active tab AND  pane respectively
    *
    * @param newActiveEL {Element}
    * @param classDeactivate {String}
    * @param activeClassName {String}
    * @protected
    */
   TabbedView.prototype._setActive = function (newActiveEL, classDeactivate, activeClassName)
   {
      const self = this;

      if (newActiveEL && !newActiveEL.classList.contains(activeClassName))
      {
         let pel = newActiveEL.parentNode; // returns single entity (container of the tabs)

         let pelChin = pel.children; //array(node list)

         for (let i = 0, len = pelChin.length; i < len; i++)
         {
            pelChin[i].className = classDeactivate;

         }
         newActiveEL.className = activeClassName;

         if (classDeactivate === "tabHead")
         {
            this.activeTab = newActiveEL;
         }
         else if (classDeactivate === "pane")
         {
            this.activePane = newActiveEL;
         }

         //if(Bu.defined(self.sortable))
         //{
         //self.sortable.destroy();
         //this.sortable = null;
         //console.log(this.sortable);
         //self._createSorter();
         //console.log(this.sortable);
         //}
         pel = pelChin = null;
      }


   };

   TabbedView.prototype.addTab = function (tabName)
   {
      if (this.list.children.length < this.options.maxNumberOfTabs)
      {
         let UID = this.tabs.length + 1;
         this.createTab(UID, tabName, "");
         this.createPane("", UID, false, tabName);

         this.list.children[this.list.children.length - 1].click();

         UID = null;
      }
   };

   TabbedView.prototype.closeTab = function (target)
   {
      const self = this;
      let paneToClose = Bd.gebi(target.parentElement.getAttribute("data-pane").toString());

      //if the tab is the current active tab
      if (target.parentElement.classList.contains("activeTabHead"))
      {
         if (this.list.children.length > 1)
         {
            let index = Bd.indexOf(this.list, target.parentElement);

            //if its the first tab set the next (second) tab to be active tab
            //else set the previous tab to be active tab
            if (index === 0)
            {
               this.list.children[1].click();
            }
            else
            {
               this.list.children[index - 1].click();
            }
         }
      }

      Bd.closeWin(target.parentElement, true);
      Bd.closeWin(paneToClose, true);
   };

   TabbedView.prototype.getActiveTabHead = function () //msg
   {};

   TabbedView.prototype.getActivePane = function ()
   {
      return this.activePane;
   };

   TabbedView.prototype.getActiveTab = function ()
   {
      return this.activeTab;
   };

   //TODO change a tab's title
   TabbedView.prototype.setTabName = function (tabName)
   {
   };

   TabbedView.prototype.destroy = function ()
   {
      //kill all the properties
   };

   //tabHeads = panesDiv = ul = null;
   //var activeTab = document.querySelector(".activeTabHead");
   //var panes = document.querySelectorAll(".pane");*/
   //var tvCloseButtons = document.querySelectorAll(".tvCloseBtn");
   //createTabbedView("#tiles", tabHeadNames);
   /*for (var cb = 0; cb < tvCloseButtons.length; cb++)
    {
    tvCloseButtons[cb].addEventListener("click", function (event)
    { var pel = this.parentElement;
    if(this.parentElement.classList.contains("activeTabHead"))
    {
    //console.log(parseInt(this.parentElement.getAttribute("data-count")));
    for(var d = 0; d < tabHeads.length; d++)
    {
    //console.log(parseInt(tabHeads[d].getAttribute("data-count")));
    if(parseInt(this.parentElement.getAttribute("data-count")) != 1)
    {
    if((parseInt(this.parentElement.getAttribute("data-count"))- parseInt(tabHeads[d].getAttribute("data-count"))) == 1)
    {
    Bee.Utils.setActive(tabHeads[d], "tabHead", "activeTabHead");
    var nextActivePane = Bd.gebi(tabHeads[d].getAttribute("data-pane").toString());
    Bee.Utils.setActive(nextActivePane, "pane", "activePane");
    break;
    }
    }
    else
    {
    if((parseInt(tabHeads[d].getAttribute("data-count"))- parseInt(this.parentElement.getAttribute("data-count"))) == 1)
    {
    if(tabHeads.length == 1)
    {
    var lastTabHead = document.querySelector("tabHead");
    var lastPane = document.querySelector("pane");
    Bee.Utils.setActive(lastTabHead, "tabHead", "activeTabHead");
    Bee.Utils.setActive(lastPane, "pane", "activePane");
    //break;
    }
    console.log("tabHead " + tabHeads[d]);
    console.log("tabHead " + tabHeads[d].parentElement);

    Bee.Utils.setActive(tabHeads[d], "tabHead", "activeTabHead");
    var nextActivePane2 = Bd.gebi(tabHeads[d].getAttribute("data-pane").toString());
    Bee.Utils.setActive(nextActivePane2, "pane", "activePane");
    //break;
    }
    }
    }
    }
    var toBeDeletedPane = Bd.gebi(this.parentElement.getAttribute("data-pane").toString());

    Bee.Utils.closeWin(pel, "remove", true);
    Bee.Utils.closeWin(toBeDeletedPane, "remove", true);
    // region resetting data-count(s)
    for (var t = 0; t < tabHeads.length; t++)
    {
    if(parseInt(tabHeads[t].getAttribute("data-count")) > parseInt(this.parentElement.getAttribute("data-count")))
    {
    var newCount = parseInt(tabHeads[t].getAttribute("data-count")) - 1;
    tabHeads[t].setAttribute("data-count", newCount.toString());
    }
    }
    //endregion
    event.stopPropagation();
    })
    }*/
   /*
    function _renderTabHeads(tabHeadNames)
    {
    var tabHeadsDiv = Bd.createEl("div", {className : "tabHeads"});

    var ul = Bd.createEl("ul");

    //create and insert the tabheads

    Bu.forEach(tabHeadNames, function (node, i)
    {
    let activeTab = i === 0 ? ' activeTabHead' : '';
    let li = Bd.createEl("li", {'className' : 'tabHead' + activeTab });

    li.setAttribute('data-pane', 'pane' + Bu.pInt(i+1));
    li.setAttribute('data-count', i+1);

    let a = Bd.createEl("a", { href : '#', innerHTML : tabHeadNames[i]});

    let span = Bd.createEl("span", {'className' : "tabIcon"});

    li.appendChild(span);
    li.appendChild(a);

    ul.appendChild(li);

    li = activeTab = a = span =null;
    });

    tabHeadsDiv.appendChild(ul);
    /!*for(let i = 0, len = tabHeadNames.length; i < len; i++)
    {

    }*!/
    //tabViews[0].insertBefore(tabHeadsDiv, tabViews[0].childNodes[1]);
    //tabViews[0].appendChild(tabHeadsDiv);
    ul =  null;

    return tabHeadsDiv;
    }


    function _renderPanes(tabHeadNames)
    {
    var panesDiv = Bd.createEl("div", {className : "panes"});

    Bu.forEach(tabHeadNames, function (node, i)
    {
    let activePane = i === 0 ? ' activePane' : '';
    let div = Bd.createEl("div", {className : 'pane' + activePane, id : 'pane' + Bu.pInt(i+1)});

    let paneContent = document.getElementById(Bs.toPascalCase(tabHeadNames[i], true));

    if(paneContent)
    {
    div.appendChild(paneContent);
    //Bu.removeEl(paneContent);
    }
    else {
    div.innerHTML = tabHeadNames[i];
    }

    panesDiv.appendChild(div);
    div = activePane = paneContent = null;
    });
    //for(let i = 0, len = tabHeadNames.length; i < len; i++)
    //{
    //
    //}
    //tabViews[0].appendChild(panesDiv);
    return panesDiv;
    }

    function createTabbedView(parent, tabHeadNames)
    {
    let tabbedView = Bd.createEl("div", {className : 'tabbedView'});

    tabbedView.appendChild(_renderTabHeads(tabHeadNames));
    tabbedView.appendChild(_renderPanes(tabHeadNames));

    if(parent)
    {
    if(Bu.isString(parent))
    {
    parent = Bd.getEl(parent);
    }

    parent.appendChild(tabbedView)
    }

    var tabHeads = document.querySelectorAll(".tabbedView .tabHead");

    Be.bindOnAll(tabHeads, "click", function (event)
    {
    var nextPane = Bd.gebi(this.getAttribute("data-pane").toString());
    var activePane = document.querySelector(".activePane");

    _setActive(this, "tabHead", "activeTabHead");
    _setActive(nextPane, "pane", "activePane");

    event.stopPropagation();

    });

    tabbedView = tabHeads =  null;
    }*/

   //FIXME remember to create an object literal and
   //FIXME put only methods that reference the public methods in there
   //FIXME then return the object.

   //we're going public whoop! whoop!, lol
   //return Bee.Widget.TabbedView = TabbedView;
   return TabbedView;
});

/*
 * TODO : Add options DONE
 * TODO : Add close btn option DONE
 * TODO : tabHead location{top <default>, right, bottom, left}
 * TODO : tabHead repositioning by drag sorting DONE
 * TODO : tabHead icons
 * TODO : special tabHead colors (changeability)
 * TODO : a last tab head item that has a list of all tabs
 * TODO : the ability to return to the previous tab from which
 * the current tab as moved to if the current tab is closed
 * TODO : add feature that dynamically calculates tabHead widths from the number of tabs
 * */