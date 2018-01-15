/**
 * @Author       Created by arch on 29/06/17 using PhpStorm.
 * @Time         : 00:19
 * @Copyright (C) 2017
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
 * @fileOverview contains instruction[code] for creating Dialog Box
 * A replacement for the LEGACY Barge.Dialog which is now deprecated in favour of this
 *
 * @requires {@link Barge.utils}
 * @requires {@link Barge.String}
 * @requires {@link Barge.Dom}
 *
 */

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global['Barge.DiceyDialog'] = factory(global));
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
      global['Barge.DiceyDialog'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let Bu = Barge.utils,
       Ba = Barge.Array,
       Bs = Barge.String,
       Bd = Barge.Dom;
   //endregion

   /**
    *
    * @param config {{affirmBtn: {name: string, el: null}, cancelBtn: {name: string, el: null},
    * buttonAlignment: string, draggable: boolean, navigateWithArrowKeys: boolean, dismissOnEscape: boolean,
    * highlightDefaultBtn: boolean}}
    *
    * @constructor
    */
   function DiceyDialog(config = null)
   {
      this.options = null;

      this.dialog = null;
      this.overlay = null;
      this.head = null;
      this.body = null;
      this.foot = null;

      this.title = null;
      this.message = null;

      this.closeBtn = null;
      this.backBtn = null;

      this.icon = null;

      this.inputEl = null;

      /**
       *
       * @type {
       * {affirmBtn: {name: string, el: null},cancelBtn: {name: string, el: null},
       buttonAlignment:string,draggable:boolean,navigateWithArrowKeys: boolean, dismissOnEscape: boolean,
       highlightDefaultBtn: boolean, files : Array<{ name : String, type : String, iconClass : String}>, accept : String,
      dismissOnOverlayClick : String}
      }
       */
      this.options = {
         affirmBtn             : {
            name : "OK",
            el   : null
         },
         cancelBtn             : {
            name : "Cancel",
            el   : null
         },
         buttonAlignment       : "center",
         draggable             : true,
         navigateWithArrowKeys : true,
         dismissOnEscape       : true,
         highlightDefaultBtn   : true,
         dismissOnOverlayClick : false
      };

      if (config)
      {
         this.options = Bu.extend(this.options, config);
      }


   }

   /**
    *
    * @param object {Object}
    * @param newPropertyName {String}
    * @param oldPropertyName {String}
    */
   function setAlias(object, newPropertyName, oldPropertyName)
   {
      if (Bu.defined(object[newPropertyName]))
      {
         object[oldPropertyName] = object[newPropertyName];
      }
   }

   /**
    *
    * @param options {{title : String, t : String, message : String, b : String, affirm : fn, onAffirm : fn
      cancelBtnNumber : Number, iconType : String, affirmBtnTitle :String}}
    */
   DiceyDialog.prototype.alert = function (options = {})
   {
      let self = this;
      setAlias(options, "t", "title");

      setAlias(options, "b", "affirmBtnTitle");

      this.render(true, options);
   };

   DiceyDialog.prototype.progressDialog = function (options = {})
   {
      options["isProgressDialog"] = true;
      options["icon"] = "p";

      setAlias(options, "m", "message");

      if (Bu.defined(options["dismissible"]) && options.dismissible === true)
      {
         options["dismissOnOverlayClick"] = true;
      }

      this.render(false, options);
   };
   /**
    *
    * @param options {{title : String, t : String, message : String, m : String, affirmBtnTitle : String, cancelBtnTitle : String,
    *    onAffirm : fn, affirm : fn, button2Text : String, onCancel : fn, cancel : fn, cancelBtnNumber : Number, icon :
    *    String<"a|w|q|i|f|s"> , i : String<"w|q|i|f"> }}
    */
   DiceyDialog.prototype.confirm = function (options = null)
   {
      setAlias(options, "i", "icon");

      setAlias(options, "t", "title");

      setAlias(options, "m", "message");

      setAlias(options, "b", "affirmBtnTitle");

      setAlias(options, "b2", "cancelBtnTitle");

      this.render(false, options)
   };

   DiceyDialog.prototype.fileDialog = function (options = null)
   {
      setAlias(options, "b", "affirmBtnTitle");

      setAlias(options, "b2", "cancelBtnTitle");

      options["isFileDialog"] = true;

      this.render(false, options, true);
   };

   /**
    * MSG This is the Render Engine
    * the head, body foot rendering passed through this pipeline
    * @param isAlert {Boolean}
    * @param isFileDialog {Boolean}
    * @param options {{title : String, message : String, button1Text : String, affirm : fn,
     button2Text : String, cancel : fn, cancelBtnNumber : Number, iconType : String, hasPrompt : Boolean,
     affirmBtnTitle : String, cancelBtnTitle : String, primaryBtnNumber : Number, icon : String<"w|q|i|f|a|s|p">, dismissible : Boolean}}
    */
   DiceyDialog.prototype.render = function (isAlert = true, options = null, isFileDialog = false)
   {
      //console.log("here");
      //msg if a dialog is already showing dismiss it
      //issue #50 this makes it impossible to create overlapping dialog boxes
      if (Bu.defined(this.dialog))
      {
         this.dismiss();
      }

      //this.options = Bu.extend(this.options, options);

      this.dialog = Bd.createEl("div", { className : "msgBx " + (isFileDialog ? "fl-dg" : "") });

      if (!options.isProgressDialog)
      {
         let head = this.createTitle(options.title, options.hasPrompt);
         this.dialog.appendChild(head);
      }

      if (!isAlert)
      {
         let body = this.createBody(options);

         this.dialog.appendChild(body);
      }

      /*{
       affirmBtnTitle : options.affirmBtnTitle,
       cancelBtnTitle : options.cancelBtnTitle, primaryBtnNumber : options.primaryBtnNumber
       }*/
      if (!options.isProgressDialog || (options.isProgressDialog && options.dismissible))
      {
         let foot = this.createFoot(isAlert, options, isFileDialog);

         this.dialog.appendChild(foot);
      }

      this.overlay = Bd.appendOverlay(null, { opacity : .7, backgroundColor : "" });

      this.addClickEvents(options);
      this.addKeyboardNavEvents();

      if (this.options.draggable === true && !options.isProgressDialog)
      {
         this.makeDraggable();
      }

      Bd.appendToWindow(this.dialog);

      Bd.centerToPageHorizontally(this.dialog);
   };

   /**
    *
    * @param title {String}
    * @param hasPrompt {Boolean}
    * @returns {null|*|Element}
    */
   DiceyDialog.prototype.createTitle = function (title = "", hasPrompt = false)
   {
      let self = this;
      this.head = Bd.createEl("div", { classList : ["msgTitle"] });

      this.title = Bd.createEl("h1", { innerHTML : title });

      this.closeBtn = Bd.createEl("button", { className : "closeBtn", innerHTML : "&times;" });

      this.closeBtn.addEventListener("click", function ()
      {
         self.dismiss();
      });

      this.head.appendChild(this.title);
      this.head.appendChild(this.closeBtn);

      if (hasPrompt)
      {
         this.backBtn = Bd.createEl("button", { classList : ["backBtn", "hide"], innerHTML : "&leftarrow;" });
         this.head.appendChild(this.backBtn);
      }

      return this.head;
   };

   /**
    *
    * @param options {{}}
    //* @param message {String}
    //* @param icon {String}
    * @param isPrompt {Boolean}
    * @param isFileDialog {Boolean}
    * @param isProgDialog
    */
   DiceyDialog.prototype.createBody = function (options, isPrompt = false, isFileDialog = false, isProgDialog = false)
   {
      this.body = Bd.createEl("div", { className : "msgBody" });

      //add the icon div if an icon option is provided
      if (Bu.defined(options.icon) && !Bs.isEmpty(options.icon))
      {
         this.icon = Bd.createEl("div", { classList : ["msgIcon", options.icon] });

         if (options.icon === "p")
         {
            this.icon.innerHTML = "<div class='loader'></div>"
         }

         this.body.appendChild(this.icon);
      }

      //confirms will be used more that the rest so check if it's that one first
      if (!options.isFileDialog && !options.isPrompt)
      {
         let msgContent = Bd.createEl("div", { className : "msgContent" });

         options.message = options.isProgressDialog &&
                           Bs.isEmpty(options.message) ? "Working on it, ;nl Please have patience" : options.message;

         //MSG format the message w/ mark-down style formatting
         // _my_ for italics
         // *my* for bold
         options.message = options.message.replace(/\*(\w+)*(\W+)*\*/ig, "<b/>");
         options.message = options.message.replace(/_[A-z]+_/ig, "<b/>");

         this.message = Bd.createEl("p", { innerHTML : options.message.replace(/;nl/ig, "<br/>") },
                                    { marginRight : (Bu.defined(options.icon) && !Bs.isEmpty(options.icon) ? "10px" : "") });

         msgContent.appendChild(this.message);

         this.body.appendChild(msgContent);
         msgContent = null;
      }
      else if (options.isFileDialog === true)
      {
         let filesContainer = Bd.createEl("div", { className : "fileContainer fp" });
         let fileList = Bd.createEl("ul", { id : "existingFileList" });

         if (Bu.defined(options.files))
         {
            Ba.forEach(options.files, function (file, i)
            {
               let fileName = (Bu.defined(file.name) ? file.name : "");
               let li = Bd.createEl("li", {
                  innerHTML : "<div class='file'><div class='fileIcon" +
                              (Bu.defined(file.iconClass) ? file.iconClass : "") + "'></div>" +
                              " <div class='fileName tc ellipsify' title='" + fileName + "'>" + fileName +
                              " </div> " + "</div>"
               });
               fileList.appendChild(li);
               fileName = li = null;
            });

            filesContainer.appendChild(fileList);
         }

         this.body.appendChild(filesContainer);

         //keep the city clean
         fileList = filesContainer = null;
      }
      else if (options.isPrompt)
      {
         //create the appropriate body
      }

      return this.body;
   };

   /**
    *
    * @param isAlert
    * @param options {{affirmBtnTitle : String, cancelBtnTitle : String, primaryBtnNumber : Number, defaultFileName}}
    * @param isFileDialog {Boolean}
    * @returns {*|Element}
    */
   DiceyDialog.prototype.createFoot = function (isAlert = true, options = {}, isFileDialog = false)
   {
      let p    = options.primaryBtnNumber,
          self = this;

      this.foot = Bd.createEl("div", { className : "msgFoot" }, { textAlign : self.options.buttonAlignment });

      if (isFileDialog)
      {
         let inputContainer = Bd.createEl("div", { className : "inputContainer" });
         let table = Bd.createEl("table", { className : "dataTable medium" });
         let row = Bd.createEl("tr", { className : "noHov footRow" });

         let col1 = Bd.createEl("td", { className : "fileNameInputLabel", innerHTML : "File Name" });
         let col2 = Bd.createEl("td");

         this.inputEl = Bd.createEl("input", {
            id    : "filnameInp",
            value : (options.defaultFileName ? options.defaultFileName : "")
         });

         col2.appendChild(this.inputEl);
         let col3 = Bd.createEl("td", { className : "shortest", innerHTML : "Type" });
         let col4 = Bd.createEl("td", {
            className : "shorter fileType",
            innerHTML : "<select name='' id='' title='' class='disabled'>" +
                        "<option value='gsys'>" +
                        (Bu.defined(options.accept) ? options.accept : "all") +
                        "</option></select>"
         });

         let tbody = Bd.createEl("tbody");
         Bd.appendChildren(row, [col1, col2, col3, col4]);

         tbody.appendChild(row);

         table.appendChild(tbody);
         inputContainer.appendChild(table);

         this.foot.appendChild(inputContainer);

         //it's memory freedom day Yaaaay
         col1 = col2 = col3 = col4 = tbody = table = inputContainer = row = null;
      }

      this.options.affirmBtn.el = Bd.createEl("button", {
         classList : ["msgBxBtns", p && p === 1 ? "primary" : "x", p && p === 1 ? "defaultBtn" : "d"],
         innerHTML : Bu.defined(options.affirmBtnTitle) ?
                     options.affirmBtnTitle : self.options.affirmBtn.name
      });

      this.foot.appendChild(this.options.affirmBtn.el);

      if (!isAlert && !options.isProgressDialog)
      {
         this.options.cancelBtn.el = Bd.createEl("button", {
            classList : ["msgBxBtns", p && p === 2 ? "primary" : "x"],
            innerHTML : Bu.defined(options.cancelBtnTitle) ?
                        options.cancelBtnTitle : self.options.cancelBtn.name
         });
         this.foot.appendChild(this.options.cancelBtn.el);
      }

      //FIXME do some clean up exercise here
      p = null;

      return this.foot;
   };

   DiceyDialog.prototype.addKeyboardNavEvents = function ()
   {
      let self = this;
      if (this.options.dismissOnEscape === true)
      {
         window.addEventListener("keyup", function (e)
         {
            if (e.keyCode === 27)// escape key
            {
               self.dismiss();
            }
         });
      }

      if (this.options.navigateWithArrowKeys === true)
      {
         window.addEventListener("keydown", function (e)
         {
            if (e.keyCode === 13)
            {
               e.preventDefault();
               if (Bu.defined(self.options.affirmBtn.el) && Bd.hasClass(self.options.affirmBtn.el, "primary"))
               {
                  console.log("yes");
                  self.options.affirmBtn.el.focus();
                  self.options.affirmBtn.el.click();
               }
               else if (Bu.defined(self.options.cancelBtn.el) && Bd.hasClass(self.options.cancelBtn.el, "primary"))
               {
                  self.options.cancelBtn.el.click();
               }
            }

            if (Bu.defined(self.inputEl))
            {
               if (e.target !== self.inputEl)
               {
                  if (e.keyCode === 37 || e.keyCode === 40)// left and down key
                  {
                     e.preventDefault();

                     if (Bu.defined(self.options.affirmBtn.el) && !Bu.defined(self.options.cancelBtn.el))
                     {
                        Bd.addClass(self.options.affirmBtn.el, "primary");
                     }
                     else if (Bu.defined(self.options.affirmBtn.el) && Bu.defined(self.options.cancelBtn.el))
                     {
                        if (!self.options.affirmBtn.el.classList.contains("primary"))
                        {
                           self.options.affirmBtn.el.classList.add("primary");
                        }
                        if (self.options.cancelBtn.el.classList.contains("primary"))
                        {
                           self.options.cancelBtn.el.classList.remove("primary");
                        }
                     }

                  }
                  else if (e.keyCode === 39 || e.keyCode === 38) // right n up key
                  {
                     e.preventDefault();
                     if (Bu.defined(self.options.affirmBtn.el) && !Bu.defined(self.options.cancelBtn.el))
                     {
                        Bd.addClass(self.options.affirmBtn.el, "primary");
                     }
                     else if (Bu.defined(self.options.affirmBtn.el) && Bu.defined(self.options.cancelBtn.el))
                     {
                        if (!self.options.cancelBtn.el.classList.contains("primary"))
                        {
                           self.options.cancelBtn.el.classList.add("primary");
                        }
                        if (self.options.affirmBtn.el.classList.contains("primary"))
                        {
                           self.options.affirmBtn.el.classList.remove("primary");
                        }
                     }
                  }
               }
            }
            else
            {
               if (e.keyCode === 37 || e.keyCode === 40)// left and down key
               {
                  e.preventDefault();

                  if (Bu.defined(self.options.affirmBtn.el) && !Bu.defined(self.options.cancelBtn.el))
                  {
                     Bd.addClass(self.options.affirmBtn.el, "primary");
                  }
                  else if (Bu.defined(self.options.affirmBtn.el) && Bu.defined(self.options.cancelBtn.el))
                  {
                     if (!self.options.affirmBtn.el.classList.contains("primary"))
                     {
                        self.options.affirmBtn.el.classList.add("primary");
                     }
                     if (self.options.cancelBtn.el.classList.contains("primary"))
                     {
                        self.options.cancelBtn.el.classList.remove("primary");
                     }
                  }

               }
               else if (e.keyCode === 39 || e.keyCode === 38) // right n up key
               {
                  e.preventDefault();
                  if (Bu.defined(self.options.affirmBtn.el) && !Bu.defined(self.options.cancelBtn.el))
                  {
                     Bd.addClass(self.options.affirmBtn.el, "primary");
                  }
                  else if (Bu.defined(self.options.affirmBtn.el) && Bu.defined(self.options.cancelBtn.el))
                  {
                     if (!self.options.cancelBtn.el.classList.contains("primary"))
                     {
                        self.options.cancelBtn.el.classList.add("primary");
                     }
                     if (self.options.affirmBtn.el.classList.contains("primary"))
                     {
                        self.options.affirmBtn.el.classList.remove("primary");
                     }
                  }
               }
            }
         });
      }

   };

   /**
    *
    * @param options {{affirm : fn, cancel : fn, onAffirm : fn, onCancel : fn}}
    */
   DiceyDialog.prototype.addClickEvents = function (options)
   {
      let self = this;

      if (Bu.defined(this.options.affirmBtn.el))
      {
         this.options.affirmBtn.el.addEventListener("click", function (e)
         {
            self.dismiss();

            if (Bu.defined(options.onAffirm) && Bu.isFunction(options.onAffirm))
            {
               options.onAffirm(Bu.defined(self.inputEl) ? self.inputEl.value : null);
            }
            else if (Bu.defined(options.affirm) && Bu.isFunction(options.affirm))
            {
               options.affirm(Bu.defined(self.inputEl) ? self.inputEl.value : null);
            }

         });
      }

      if (Bu.defined(this.options.cancelBtn.el))
      {
         this.options.cancelBtn.el.addEventListener("click", function (e)
         {
            self.dismiss();

            if (Bu.defined(options.onCancel) && Bu.isFunction(options.onCancel))
            {
               options.onCancel(Bu.defined(self.inputEl) ? self.inputEl.value : null);
            }
            else if (Bu.defined(options.cancel) && Bu.isFunction(options.cancel))
            {
               options.cancel(Bu.defined(self.inputEl) ? self.inputEl.value : null);
            }

         });
      }

      if (options.dismissOnOverlayClick === true)
      {
         this.overlay.addEventListener("click", function (e)
         {
            self.dismiss();
         });
      }
   };

   DiceyDialog.prototype.makeDraggable = function ()
   {
      let drg = new Barge.Drag.Movable(this.dialog);
   };

   DiceyDialog.prototype.dismiss = function ()
   {
      Bd.closeWin(this.dialog, true);
      Bd.closeWin(this.overlay, true);
   };

   DiceyDialog.prototype.close = DiceyDialog.prototype.dismiss;

   let Dialog = new DiceyDialog({ buttonAlignment : "right" });

   //public methods object
   Barge.DiceyDialog = {
      /**
       *
       * @param options {{title : String, t : String, b : String, affirm : fn, onAffirm : fn
      cancelBtnNumber : Number, iconType : String, affirmBtnTitle :String, dismissOnOverlayClick : Boolean}}
       */
      alert   : function (options)
      {
         Dialog.alert(options);
      },
      /**
       *
       * @param options {{title : String, t : String, message : String, m : String, b : String, affirmBtnTitle : String,
       *    cancelBtnTitle : String, b2 : String, onAffirm : fn, affirm : fn, button2Text : String, onCancel : fn, cancel : fn,
       *    cancelBtnNumber : Number, icon : String<"w|q|i|f"> , i : String<"w|q|i|f">, primaryBtnN : Number, , dismissOnOverlayClick
       *    : Boolean }}
       */
      confirm : function (options)
      {
         Dialog.confirm(options);
      },

      /**
       *
       * @param options {{title : String, t : String, message : String, m : String, b : String, affirmBtnTitle : String,
       *    cancelBtnTitle : String, b2 : String, onAffirm : fn, affirm : fn, button2Text : String, onCancel : fn, cancel : fn,
       *    cancelBtnNumber : Number, icon : String<"w|q|i|f"> , i : String<"w|q|i|f">, primaryBtnN : Number, files : Array<{ name :
       *    String, type : String, iconClass : String}>, accept : String, , dismissOnOverlayClick : Boolean, defaultFileName}}
       */
      fileDialog : function (options)
      {
         Dialog.fileDialog(options);
      },

      /**
       *
       * @param options {{t message : String, m : String, b : String, affirmBtnTitle : String,    cancelBtnTitle : String, b2 :
       *    String, onAffirm : fn, affirm : fn, button2Text : String, onCancel : fn, cancel : fn,    cancelBtnNumber : Number, icon :
       *    String<"w|q|i|f"> , i : String<"p">, primaryBtnN : Number, dismissible : Boolean, dismissOnOverlayClick : Boolean }}
       */
      progressDialog : function (options)
      {
         Dialog.progressDialog(options);
      },

      /**
       * Dismisses or closes an open Dialog
       */
      dismiss : function ()
      {
         Dialog.dismiss();
      }
   };

   //going public whoop! whoop! lol
   return Barge.DiceyDialog;
});

/**
 *TODO add support for prompts and prompts that work alongside confirms, if you know wat i mean
 */


