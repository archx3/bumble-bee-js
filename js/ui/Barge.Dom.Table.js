/**
 * @Author Created by arch on 15/05/17.
 * @Time: 14:09
 * @Copyright (C) 2017
 * Barge Studios Inc, The Bumble Bee Authors
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
 *    @fileOverview contains instruction[code] for managing HTML 5 tables
 *    @using the factory pattern + single
 *    attaching the module returned to the Barge namespace
 *
 *    @requires {@link Barge.utils}
 *    @requires {@link Barge.Array}
 *    @requires {@link Barge.String}
 *    @requires {@link Barge.Math}
 *    @requires {@link Barge.Dom} aka DomCore
 *    @requires {@link Barge.Event}
 *
 *   @requires {@link Barge.Dom.TableSorter}
 *
 *    MSG: row and col indexing is not zero based for friendliness sake
 *    MSG: indexes and IDs are all numeric
 */

"use strict";
/**
 * @namespace
 * @type {{}}
 */
var Barge = Barge || {};

(function (global, factory)
{
   if (typeof define === 'function' && define.amd)
   {
      // AMD. Register as an anonymous module unless amdModuleId is set
      define([], function ()
      {
         return (global[''] = factory(global));
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
      global['Tables'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   let Bu = Barge.utils,
       Ba = Barge.Array,
       Bs = Barge.String, //NIU atm
       Bm = Barge.Math,
       Bd = Barge.Dom;


   /**
    *
    * @param tableEl {Element<table>}
    * @param options {{sortable : Boolean, stickyHead :Boolean, scrollableContainer : Boolean,
      * stickOnScroll : Boolean, hasCheckboxes : Boolean, lastColIsCheckCol : Boolean, manageCheckboxGroup : { onAllChecked: fn, onSomeChecked: fn,onNoneChecked: fn}}}
    * @constructor
    */
   function Table(tableEl, options)
   {
      //ensure window exists else don't create
      Bu.assert(Bu.defined(window) && Bu.defined(document),
                'Barge.Dom.Table requires a window object as host');

      //MSG force the Object constructor to return an instance of the Object
      //MSG even when the new keyword hasn't been used:
      if (!(this instanceof Table)) {return new Table(tableEl, options);} // magic line!

      /**
       * default settings
       * @type {Object}
       */
      let self = this;

      this.options = {
         sortable     : true,
         sortingRowStepping : 1,
         stickyHead   : false,
         stickOnScroll : true,
         paginate     : false,
         colResizable : false,
         rowResizable : true,
         scrollableContainer : null,

         hasCheckboxes       : false,
         hasRevealer         : false,
         lastColIsCheckCol   : true,
         manageCheckboxGroup : {
            headCheckboxClass : "fatherCheckBx",
            checkBoxesClass   : "checkBx",

            bdTable : self,
            editableRow : false,
            inputSet : null
         },

         showOrHideCols : true
      };

      if (options)
      {
         this.options = Bu.extend(this.options, options);
      }

      if (options.manageCheckboxGroup)
      {
         this.options.manageCheckboxGroup = Bu.extend(this.options.manageCheckboxGroup, options.manageCheckboxGroup);

         if(!Bu.defined(this.options.manageCheckboxGroup.bdTable))
         {
            this.options.manageCheckboxGroup["bdTable"] = self;
         }
         //console.log(this.options.manageCheckboxGroup.bdTable);

      }


      this.tableEl = Bu.isString(tableEl) ? Barge.Dom.getEl(tableEl) : tableEl;

      //ensure that the table element is available
      Bu.assert(Bu.defined(this.tableEl),
                '@param tableEl is missing; Barge.Dom.Table requires a table element to manage',
                function ()
                {
                   for(let i in self)
                   {
                      delete self[i];
                   }
                });

      /**
       *
       * @type {NodeList}
       */
      this.rows = this.tableEl.getElementsByTagName("TR");

      /**
       *
       * @type {NodeList}
       */
      this.head = this.tableEl.getElementsByTagName("THEAD")[0];

      //console.log(this.head);

      /**
       *
       * @type {NodeList}
       */
      this.body = this.tableEl.getElementsByTagName("TBODY")[0];
      /**
       *
       * @type {NodeList}
       */
      this.foot = this.tableEl.getElementsByTagName("TFOOT")[0];

      /**
       *
       */
      this.rowsCount = this.rows.length - 1;

      this.colsCount = this.rows[0].children.length;

      //this.foot = tableEl.getElementsByTagName("TFOOT");

      this.pageRowsPerView = 25;

      this.sets = null;

      this.pages = null;

      this.lastPageIndex = null;

      this.densityStyle = null;

      this.stickyHead = this.options.stickyHead;

      this.init();
   }

   Table.prototype.init = function ()
   {
      let self = this;
      if (this.options.sortable === true)
      {
         this.makeRowsSortable();
      }

      this.applyDimensionsPrimer();


      if (this.options.stickyHead === true)
      {
         this.makeHeadSticky();

      }

      //MSG OFF by default
      //MSG unstable, use w/ care
      if (this.options.paginate === true)
      {
         this.paginate();
      }

      if (this.options.colResizable === true)
      {
         this.makeColsResizable();
      }

      if (this.options.rowResizable === true)
      {
         this.makeRowsResizable();
      }

      if (this.options.stickOnScroll === true)
      {
         this.stickOnScroll();
      }

      if (this.options.hasCheckboxes === true)
      {
         var chBxMgr = new Barge.Input.Checkbox(this.options.manageCheckboxGroup);

         chBxMgr.manageCheckboxGroup(null, this.tableEl);
      }

      if(this.options.showOrHideCols)
      {
         let Be = new Barge.Event.EventManager(),
             showOrHideCols = Barge.Dom.getEl(".showOrHideCol", true);

         Be.bindOnAll(showOrHideCols, "click", function (e)
         {
            let checked = this.checked;

            if(checked)
            {
               self.openCol(Barge.utils.pInt(this.value))
            }
            else
            {
               self.closeCol(Barge.utils.pInt(this.value))
            }
         });
      }
   };

   /**
    * @use for inserting a row at index or
    * end of table if index isn't supplied
    * @param index
    * @param empty
    */
   Table.prototype.insertRowAt = function (index, empty = false)
   {
      if (!empty)
      {
         for (let i = 0; i < this.colsCount; i++)
         {
            row.appendChild(Bd.createEl("td"));
         }
         Ba.insertAt(this.tbody, index);
         //this.tbody.appendChild(row);
      }
      else
      {
         this.tableEl.appendChild(row);
      }
   };

   /**
    * @use
    * @param index {Number}
    */
   Table.prototype.insertCol = function (index)
   {
      let col = this.getCol(index ? index : this.colsCount);
      let rows = this.getRows();

      Ba.forEach(rows, function (row, i)
      {
         if (index)
         {
            if (i === 0)
            {
               Bd.insertChildAt(row, Bu.createEl("th"), index);
            }
            else
            {
               Bd.insertChildAt(row, Bu.createEl("td"), index);
            }
         }
         else
         {
            if (i === 0)
            {
               row.appendChild(Bu.createEl("th"));
            }
            else
            {
               row.appendChild(Bu.createEl("td"));
            }
         }
      });
   };

   /**
    *
    * @param qty {Number}
    * @param index {Number}
    */
   Table.prototype.insertCols = function (qty, index)
   {
      for (let i = 0; i < qty; i++)
      {
         this.insertCol(index);
      }
   };

   /**
    *
    * @param index {Number|null}
    * @param checkColIndex
    * @param cloneContent
    * @param autoGenTds {Boolean}
    */
   Table.prototype.insertRow = function (index, cloneContent = false, checkColIndex = null , autoGenTds = false)
   {
      let row = null;
      if (cloneContent)
      {
         row = Bd.cloneNode(this.getRow("last"));
      }
      else if(autoGenTds)
      {
         row = Bd.createEl("tr");
         for (let i = 0; i < this.colsCount; i++)
         {
            row.appendChild(Bd.createEl("td"));
         }
      }

      if (index)
      {
         Bd.insertChildAt(this.body, row, index);
      }
      else
      {
         this.body.appendChild(row);
      }

      return row;
   };

   /**
    *
    * @param rowIndex {Number}
    * @param colIndex {Number}
    */
   Table.prototype.insertCellAt = function (rowIndex, colIndex)
   {
      let row = this.rows[rowIndex - 1];
      Bd.insertChildAt(row, Bd.createEl("td"), colIndex + 1);
   };

   /**
    * inserts a number of rows {@code qty} at the bottom or a specified index
    * @param qty {Number}
    * @param index  {Number}
    */
   Table.prototype.insertRows = function (qty, index)
   {
      for (let i = 0; i < qty; i++)
      {
         this.insertRow(index);
      }
   };

   /**
    * getRow(3)
    * @param rowId {Number|Array<Number>|String}
    * @returns {Element<tr>}
    */
   Table.prototype.getRow = function (rowId)
   {
      if (Bu.isString(rowId))
      {
         if (rowId === "first")
         {
            return this.rows[0];
         }
         else if (rowId === "last")
         {
            return this.rows[this.rows.length - 1];
         }
      }
      return this.rows[rowId - 1];
   };

   Table.prototype.rowIndex = function (row)
   {return row.rowIndex - 1;};

   /**
    *
    * @param startingRowId {Number}
    * @param endingRowId {Number}
    * @returns {Array}
    */
   Table.prototype.getRows = function (startingRowId, endingRowId)
   {
      const self = this;
      if (!startingRowId && !endingRowId)
      {
         return self.rows;
      }

      let rowArray = [];

      if (startingRowId && !endingRowId)
      {

         Ba.forEach(self.rows, function (node, i)
         {
            if (Barge.Math.isBetweenInclusive(i + 1, { min : startingRowId, max : self.rows.length }))
            {
               rowArray.push(node);
            }
         });
         return rowArray;
      }
      else if (startingRowId && endingRowId)
      {
         Ba.forEach(self.rows, function (node, i)
         {
            if (Barge.Math.isBetweenInclusive(i + 1, { min : startingRowId, max : endingRowId }))
            {
               rowArray.push(node);
            }
         });
         return rowArray;
      }
   };



   /**
    * @returns an array of column arrays
    * @param startingColId
    * @param endingColId
    * @return {Array<Array<Element>>}
    */
   Table.prototype.getCols = function (startingColId, endingColId)
   {
      const self = this;

      let colsArray = [];

      if (!startingColId && !endingColId)
      {
         return self.rows;
      }

      if (startingColId && !endingColId)
      {
         let colsCount = this.colsCount - startingColId;
         for (let i = 0; i <= colsCount; i++)
         {
            colsArray.push(this.getCol(startingColId + i));
         }
         return colsArray;
      }
      else if (startingColId && endingColId)
      {
         let colsCount = endingColId - startingColId;
         for (let i = 0; i <= colsCount; i++)
         {
            colsArray.push(this.getCol(startingColId + i));
         }
         return colsArray;
      }
   };

   /**
    *
    * @param colId
    * @param rows {Array<Element>|NodeList}
    * @returns {Array}
    * @private
    */
   Table.prototype._getCol = function (colId, rows = null)
   {
      const self = this;
      let colArray = [];
      //rows     = rows || self.rows;

      Ba.forEach(rows ? rows : self.rows, function (node)
      {
         Ba.forEach(node.children, function (nd, j)
         {
            if (j + 1 === colId)
            {
               colArray.push(nd)
            }
         })
      });
      return colArray;
   };

   /**
    *
    * @param colId
    * @returns {Array}
    */
   Table.prototype.getCol = function (colId)
   {
      return this._getCol(colId);
   };

   /**
    * @use returns a sing cell for the table
    * @param rowId {Number}
    * @param colId {Number}
    * @returns {HTMLElement}
    */
   Table.prototype.getCell = function (rowId, colId)
   {
      let row = this.getRow(rowId);
      return row.children[colId - 1];
   };

   /**
    *
    * @param rowId
    * @param remove
    */
   Table.prototype.closeRow = function (rowId, remove)
   {
      let row = this.getRow(rowId);
      if (row)
      {
         if (remove)
         {
            Bd.closeWin(row, true);
         }
         else
         {
            Bd.closeWin(row, false);
         }
      }
   };

   /**
    *
    * @param startingRowId
    * @param endingRowId
    * @param remove
    * @returns {void}
    */
   Table.prototype.closeRows = function (startingRowId, endingRowId, remove)
   {
      if (startingRowId && endingRowId)
      {
         let rows = this.getRows(startingRowId, endingRowId);

         Ba.forEach(rows, function (row, i)
         {
            if (rows)
            {
               if (remove)
               {
                  Bd.closeWin(row, true);
               }
               else
               {
                  Bd.closeWin(row, false);
               }
            }
         });
      }

      if (startingRowId && !endingRowId)
      {
         let rows = this.getRows(startingRowId, this.rowsCount + 1);

         Ba.forEach(rows, function (row, i)
         {
            if (rows)
            {
               if (remove)
               {
                  Bd.closeWin(row, true);
               }
               else
               {
                  Bd.closeWin(row, false);
               }
            }
         });
      }
      else
      {
         let rows = this.getRows();

         Ba.forEach(rows, function (row, i)
         {
            if (rows)
            {
               if (remove)
               {
                  Bd.closeWin(row, true);
               }
               else
               {
                  Bd.closeWin(row, false);
               }
            }
         });
      }

   };

   /**
    *
    * @param rowId
    */
   Table.prototype.openRow = function (rowId)
   {
      let row = this.getRow(rowId);
      if (row)
      {
         Bd.css(row, { display : "" });
      }
   };

   Table.prototype.openRows = function (startingRowId, endingRowId)
   {
      if (startingRowId && endingRowId)
      {
         let rows = this.getRows(startingRowId, endingRowId);

         Ba.forEach(rows, function (row, i)
         {
            if (rows)
            {
               Bd.css(row, { display : "" });
            }
         });
      }
      else
      {
         let rows = this.getRows();

         Ba.forEach(rows, function (row, i)
         {
            if (rows)
            {
               Bd.css(row, { display : "" });
            }
         });
      }
   };

   /**
    * for hiding or removing a col
    * @param colId  {Number}
    * @param remove  {Boolean}
    */
   Table.prototype.closeCol = function (colId, remove)
   {
      console.log("called");
      let col = this.getCol(colId);
      if (col)
      {
         if (remove)
         {
            Ba.forEach(col, function (node, i)
            {
               Bd.closeWin(node, true);
            });
         }
         else
         {
            Ba.forEach(col, function (node)
            {
               Bd.closeWin(node);
            });
         }
      }
   };

   /**
    * for hiding or removing a range of cols
    * @param startingColId {Number}
    * @param endingColId {Number}
    * @param remove {Boolean}
    */
   Table.prototype.closeCols = function (startingColId, endingColId, remove)
   {
      let cols = null;
      if (!startingColId && !endingColId)
      {
         cols = this.getCols(1, this.colsCount);
      }
      else if (startingColId && !endingColId)
      {
         cols = this.getCols(startingColId, this.colsCount);
      }
      else if (startingColId && endingColId)
      {
         cols = this.getCols(startingColId, endingColId);
      }

      if (cols)
      {
         Ba.forEach(cols, function (col)
         {
            Ba.forEach(col, function (cell)
            {
               if (remove)
               {
                  Bd.closeWin(cell, true);
               }
               else
               {
                  Bd.closeWin(cell);
               }
            })
         })
      }
   };

   /**
    * for unhiding a range of hidden columns
    * @param startingColId
    * @param endingColId
    */
   Table.prototype.openCols = function (startingColId, endingColId)
   {
      let cols = null;
      if (!startingColId && !endingColId)
      {
         cols = this.getCols(1, this.colsCount);
      }
      else if (startingColId && !endingColId)
      {
         cols = this.getCols(startingColId, this.colsCount);
      }
      else if (startingColId && endingColId)
      {
         cols = this.getCols(startingColId, endingColId);
      }

      if (cols)
      {
         Ba.forEach(cols, function (col)
         {
            Ba.forEach(col, function (cell)
            {
               Bd.css(cell, { display : "" });
            })
         })
      }
   };

   /**
    * for unhiding a hidden col
    * @param colId {Number}
    */
   Table.prototype.openCol = function (colId)
   {
      let col = this.getCol(colId);
      //console.log(col);
      if (col)
      {
         Ba.forEach(col, function (node)
         {
            Bd.css(node, { display : "" });
         });

      }
   };

   /**
    * @use for getting a subTable form the table
    * this subTable is an array of cols
    * @param arguments {Number} Max 4
    * @param row {{startingRowId:Number, endingRowId:Number}}
    * @param cols {{startingColId:Number, endingColId:Number}}
    *
    * @returns {Array}
    */
   Table.prototype.getSubTable = function (row, cols)
   {
      let rows, colsCount;
      let colsArray = [];

      if (arguments.length > 2)
      {
         Bu.extend(row, { startingRowId : arguments[0], endingRowId : arguments[1] });
         Bu.extend(cols, { startingColId : arguments[2], endingColId : arguments[2] });
      }

      if (arguments.length > 2)
      {
         rows = this.getRows(arguments[0], arguments[1]);
      }
      else
      {
         rows = this.getRows(row.startingRowId, row.endingRowId);
      }

      if (arguments.length > 2)
      {
         colsCount = arguments[3] - arguments[2];
      }
      else
      {
         colsCount = cols.endingColId - cols.startingColId;
      }

      for (let i = 0; i <= colsCount; i++)
      {
         colsArray.push(this._getCol(arguments.length > 2 ? arguments[2] + i : cols.startingColId + i, rows));
      }
      return colsArray;
   };

   /**
    * @Use for setting the font size of the cells
    * @example Barge.Table.setTextDensity("s")
    * @example Barge.Table.setTextDensity("small")
    * @example Barge.Table.setTextDensity("1")
    * @example Barge.Table.setTextDensity(14)
    * @param density{String<Alpha|Number>|Number}
    * @returns {null|*|Element}
    */
   Table.prototype.setTextDensity = function (density)
   {
      if (!Bd.getEl("#densityStyle"))
      {
         this.densityStyle = Bd.createEl("style", { id : "densityStyle" });

         Bd.appendToHead(this.densityStyle);
      }

      if (Bu.isNumber(density))
      {
         this.densityStyle.innerHTML = "table td{ font-size : " + density + "px; padding: 8px 15px;}"
      }
      else
      {
         if (density === "small" || density === "s" || density === "1")
         {
            this.densityStyle.innerHTML = "table td{ font-size : 13px; padding: 5px 15px;}"
         }
         else if (density === "medium" || density === "m" || density === "2")
         {
            this.densityStyle.innerHTML = "table td{ font-size : 15px; padding: 8px 15px;}"
         }
         else if (density === "large" || density === "l" || density === "3")
         {
            this.densityStyle.innerHTML = "table td{ font-size : 16px; padding: 10px 15px;}"
         }
      }

      if (this.stickyHead === true)
      {
         //reset the widths of the THs to the new widths od the TDs
         this.makeHeadSticky();
      }

      return this.densityStyle;
   };

   Table.prototype.makeRowsSortable = function ()
   {
      let self = this,
          tSorter = new Barge.Dom.TableSorter(this.tableEl, {rowStepping : self.options.sortingRowStepping});

      tSorter.init();
   };

   /**
    * painting the ths and tds with CSS width property
    */
   Table.prototype.applyDimensionsPrimer = function ()
   {
      let self = this,
          row1 = this.getRow(1),
          ths  = row1.children;
      let firstTds  = this.getRow(2).children,
          allTdRows = this.getRows(2);
      let thsCount = ths.length - 1,
          widths   = [];

      //Bd.css(row1, { boxShadow : "0px 4px 3px rgba(0, 0, 0, .2)" });
      Bu.forEach(ths, function (th, i)
      {
         let lastIndex = self.options.hasRevealer === true ? thsCount - 1 : thsCount,
             width = ((firstTds[i].offsetWidth - ( i === 0 || i === lastIndex ? 1 : 2)) - 18);

         width = i === lastIndex ? width + 40 : width;

         //if(self.options.lastColIsCheckCol && (i === thsCount - 1))
         //{width = i === lastIndex ? width + 55 : width;
         //}

         Bd.css(th, { width : width + "px" });
         widths.push(width);
      });

      Ba.forEach(allTdRows, function (row)
      {
         Ba.forEach(row.children, function (cell, i)
         {
            Bd.css(cell, { width : (i === thsCount ?
                                    (widths[i] + 8) + "px" : i === 0 ?
                                                             (widths[i] - 1) + "px" : widths[i] + "px" ) });
         });
      });

      widths = row1 = ths = firstTds = allTdRows = thsCount = null;
   };

   /**
    * @use make the header of the table sticky
    * @param reapply
    */
   Table.prototype.makeHeadSticky = function (reapply)
   {
      let row1 = this.getRow(1);

      //let thsCount = ths.length - 1;

      Bd.css(row1, { boxShadow : "0px 4px 3px rgba(0, 0, 0, .2)" });
      if (reapply)
      {

         let ths  = row1.children;
         let firstTds = this.getRow(2).children;

         Bu.forEach(ths, function (th, i)
         {
            //assign the widths of the first tds to the corresponding ths
            //subtract a border offset of 1 if 1st or lst th and 2 for the rest
            Bd.css(th, { width : ((firstTds[i].offsetWidth ) + 10) + "px" });
         });
         ths = firstTds /*= thsCount*/ = null;

      }

      let cell11 = this.getCell(1, 1);

      Bd.css(this.head, { position : "fixed" });
      Bd.css(cell11, { width : "39px !important" });
      Bd.css(this.body, { marginTop : (this.head.offsetHeight /* - 1*/) + "px", display : "block" });

      if (Bu.defined(cell11.style.zIndex))
      {
         Bd.css(this.head, { zIndex : cell11.style.zIndex + 1 });
      }
      else
      {
         Bd.css(this.head, { zIndex : 30 });
      }

      this.stickyHead = true;
   };

   /**
    * @use disables sticky table head
    * @param reapply
    */
   Table.prototype.unstickHead = function (reapply)
   {

      let row1 = this.getRow(1);
      Bd.css(row1, { boxShadow : "" });

      if (reapply)
      {
         let ths = row1.children;

         Bu.forEach(ths, function (th)
         {
            Bd.css(th, { width : "" });
         });

         ths = null;
      }

      Bd.css(this.head, { position : "" });
      Bd.css(this.body, { marginTop : "0px", display : "" });

      this.stickyHead = false;
   };

   Table.prototype.stickOnScroll = function ()
   {
      let self = this;
      this.options.scrollableContainer.onscroll = function ()
      {

         if (this.scrollTop > 18)
         {
            self.makeHeadSticky();
         }
         else
         {
            self.unstickHead();
         }
      };
   };

   /**
    * @Warning Please do not use this!
    * MSG has unusual behaviour
    * Needs a lot of fixes
    */
   Table.prototype.makeFirstColSticky = function ()
   {
      let col = this.getCol(1);
      let col2 = this.getCol(2);

      let margin = col[0].offsetWidth + "px";

      Bu.forEach(col, function (cell, i)
      {
         Bd.css(cell, { width : (cell.offsetWidth - 1) + "px" });
         Bd.css(cell, { position : "fixed" });

         Bd.css(col2[i], { marginLeft : margin, display : "block" });
      });
   };

   Table.prototype.makeRowsResizable = function (index)
   {
      //
   };

   Table.prototype.ResizeCol = function (colId, dW)
   {

      let cells    = this.getCol(colId),
          self     = this,
          head     = this.getCell(1, colId),
          newWidth = Bu.pInt(Bu.getStyleValue("width", head)) + dW;

      console.log(newWidth);
      console.log(head);

      if (this.stickyHead === true)
      {
         this.unstickHead();
      }

      Ba.forEach(cells, function (cell, i)
      {
         //if(!Bs.isEmpty(cell.style.width))
         //{
         //console.log(cell.getBoundingClientRect().width);
         Bd.css(cell, { width : (newWidth + dW) + "px" });
         //}
      });
   };

   Table.prototype.makeColsResizable = function ()
   {
      const self = this;
      let row1        = this.getRow(1),
          ths         = row1.children,
          thumbHeight = ths[0].offsetHeight;

      Ba.forEach(ths, function (th, i)
      {
         if (i < self.colsCount - 1)
         {
            let resizeThumb = Bd.createEl("span",
                                          { className : "hResizeThumb" },
                                          {
                                             height : thumbHeight + "px",
                                             width  : "4px",
                                             //float : "right",
                                             left   : (Bd.getRight(th) + 15 + i) + "px",
                                             top    : th.parentElement.offsetTop + 23 + "px"
                                          });
            th.appendChild(resizeThumb);
         }
      });
   };

   /**
    *
    * @param row rowId {Element<tr>|Number}
    * @returns {*|string}
    */
   Table.prototype.getRowText = function (row)
   {
      let crow = Bu.isNumber(row) ? this.getRow(row) : row;
      let text = "";
      Ba.forEach(crow.children, function (td)
      {
         text += Bs.trim(td.textContent) + " ";
      });

      return Bs.trim(text);
   };

   Table.prototype.search = function (searchQuery)
   {
      if (!Bs.isEmpty(searchQuery))
      {
         let rows = this.getRows(2),
             self = this;
         this.matchFound = false;

         this.closeRows(2);

         Ba.forEach(rows, function (row, i)
         {
            if (self.getRowText(row).toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1)
            {
               self.openRow(i + 2);

               if (self.matchFound === false)
               {
                  self.matchFound = true;
               }
            }

         });

         //check if there is a match
         /*let mf = Ba.someOf(rows, function (row)
          {
          return self.getRowText(row).toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
          });*/

         //console.log(mf);

         // issue #05 unstable code for inserting a row that says no match found if matchFound === false
         /*if (!mf)
          {
          let noMatchRow = Bd.createEl("tr", {id : "noMatchRow"});
          let col = Bd.createEl("td",
          {colSpan : self.colsCount, innerHTML : "No match found for " + searchQuery},
          {textAlign: "center"});

          if(!Bu.defined(self.body.querySelector("#noMatchRow")))
          {

          noMatchRow.appendChild(col);
          self.body.appendChild(noMatchRow);
          }
          }

          if(mf)
          {
          Bd.removeEl(self.body.querySelector("#noMatchRow"));
          }*/
      }
      else if (this.options.stickyHead)
      {
         this.openRows();
         this.makeHeadSticky();
      }

      if (this.stickyHead === true && !Bs.isEmpty(searchQuery))
      {
         this.unstickHead();
      }
   };

   /**
    *
    * @param colId
    * @returns {Array}
    */
   Table.prototype.getFilterKeys = function (colId)
   {
      let col        = this.getCol(colId),
          filterKeys = [];

      Ba.forEach(col, function (cell)
      {
         if (filterKeys.indexOf(cell.textContent) < 0)
         {
            filterKeys.push(cell.textContent);
         }
      });

      col = null;
      return filterKeys;
   };

   /**
    * search by a single column only
    * @param colId
    * @param keyword
    * @returns {Array}
    */
   Table.prototype.filter = function (colId, keyword)
   {
      if (!Bs.isEmpty(keyword))
      {
         const self = this;

         this.closeRows(2);
         let rows = this.getRows(2);

         Ba.forEach(rows, function (row, i)
         {
            //let cells = ;
            if (row.children[colId - 1].textContent === keyword)
            {
               self.openRow(i + 2);
            }

         });

         rows = null;
      }
      else if (this.options.stickyHead)
      {
         this.openRows();
         this.makeHeadSticky();
      }

      if (this.stickyHead === true && !Bs.isEmpty(keyword))
      {
         this.unstickHead();
      }
   };

   /**
    *
    * @param rowsPerView
    * @private
    */
   Table.prototype._setRowsPerView = function (rowsPerView)
   {
      if (rowsPerView)
      {
         this.pageRowsPerView = rowsPerView;
      }
   };

   /**
    * @use for setting the number of rows to show in pagination
    * @param rowsPerView  {Number}
    */
   Table.prototype.setRowsPerView = function (rowsPerView)
   {
      if (rowsPerView)
      {
         this.paginate(rowsPerView);
      }
   };

   /**
    *
    * @param rowsPerView
    */
   Table.prototype.paginate = function (rowsPerView)
   {
      this._setRowsPerView(rowsPerView);
      let canBePaged = this.rowsCount > this.pageRowsPerView;
      this.sets = Math.ceil(this.rowsCount / this.pageRowsPerView);
      let lastPageRowsCount = Barge.Math.modulo(this.rowsCount, this.pageRowsPerView);
      let paginationHooks = [];
      this.pages = [];

      for (let i = 0; i < this.sets; i++)
      {
         //start form the second row, i.e the row after the header
         //at the 1st run of the loop the vals will be assuming {rowsPerView = 10}
         //MSG 2 + (10 * 0), 10 * (0 + 1) = 2, 10
         //at the 2nd run of the loop the vals will be assuming {rowsPerView = 10}
         //MSG 2 + (10 * 1), 10 * (1 + 1) = 12, 20
         this.pages.push(this.getRows(2 + (rowsPerView * i), rowsPerView * (i + 1)))//MSG magic formula
      }

      this.closeRows(this.pageRowsPerView + 1);
      this.lastPageIndex = 0;
   };

   /**
    *
    */
   Table.prototype.nextPage = function ()
   {
      let index = this.lastPageIndex + (this.lastPageIndex === 0 ? 2 : 1 );
      if (this.canNavigate(index))
      {
         this.showPage(index);
         this.lastPageIndex++;
      }
      index = null;
   };

   /**
    *
    */
   Table.prototype.previousPage = function ()
   {
      let index = this.lastPageIndex - 1;
      if (this.canNavigate(index))
      {
         this.showPage(index);
         this.lastPageIndex--;
      }
      index = null;
   };

   /**
    *
    * @param index
    */
   Table.prototype.goToPage = function (index)
   {
      if (this.canNavigate(index))
      {
         this.showPage(index);
         this.lastPageIndex = index;
      }
   };

   /**
    * @private
    * @param index
    * @returns {*|boolean}
    */
   Table.prototype.canNavigate = function (index)
   {
      return Bm.isBetweenInclusive(index, { min : 0, max : this.pages.length });
   };

   /**
    * returns void
    * @param index
    */
   Table.prototype.showPage = function (index)
   {
      this.closeRows(2);
      let rows = this.pages[index - 1];

      Ba.forEach(rows, function (row, i)
      {
         Bd.css(row, { display : "" });
      });
      rows = null;
   };

   //sadly we're going into the public domain (IPO), but thank God we're a lil safe. :-),
   return Barge.Dom.Table = Table;
});

/**
 * TODO return a public object and privatise the whole "enterprise", lol
 */
