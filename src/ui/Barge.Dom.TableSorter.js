/**
 * @Author Created by arch on 16/05/17.
 * @Time: 20:33
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
 *    @fileOverview contains instruction[code] for creating a $
 *
 *    @requires {@link Barge.utils}
 *    @requires {@link Barge.Array}
 *    @requires {@link Barge.Dom} aka DomCore
 *    @requires {@link Barge.Event}
 */

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
         return (global['tSorter'] = factory(global));
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
      global['tSorter'] = factory(global);
   }
})(typeof window !== undefined ? window : this, function factory(window)
{
   "use strict";

   //region protected globals
   let Bu = Barge.utils,
       Ba = Barge.Array,
       Bd = Barge.Dom;//NIU atm

   let Be = new Barge.Event.EventManager();

   let stIsIE = /*@cc_on!@*/false;
   let the            = null,
       row_array      = null,
       col            = null,
       mtch           = null,
       hasInputs      = null,
       first          = null,
       second         = null,
       tfo            = null,
       tb             = null,
       rows           = null,
       headrow        = null,
       theadrow       = null,
       sortrevind     = null,
       sortfwdind     = null,
       sortbottomrows = null,
       aa, newrows, bb, y, dt2, dt1, m, d;
   //endregion

   /**
    *
    * @param {Element<Table>} [tableEl]
    * provide a single el or add "sortable to your tables' classlist"
    * @param {{rowStepping : Number}} options
    * @constructor
    */
   function TableSorter(tableEl, options)
   {
      this.tableEl = tableEl;
      this.DATE_RE = null;

      //this.headrow = null;
      //
      //this.row_array = null;
      //
      //this.col = null;
      //this.mtch = null;
      this.hasInputs = null;
      //this.first = null;
      //this.second = null;
      //this.tfo = null;
      //this.tb = null;
      //this.rows = null;
      //this.headrow = null;
      //this.theadrow = null;
      //this.sortrevind = null;
      //this.sortfwdind = null;
      //this.sortbottomrows = null;
      //this.aa = null;
      //this.newrows = null;
      //this.bb = null;
      //this.y = null;
      //this.dt2 = null;
      //this.dt1 = null;
      //this.m = null;
      //this.d = null;
      //this.stIsIE = false;
      //this.the = null;

      this.options = {
        rowStepping : 1,
        DATE_RE : null
      };

      if(Bu.defined(options))
      {
         this.options = Bu.extend(this.options, options);
      }
   }

   /**
    * initialiser
    */
   TableSorter.prototype.init = function ()
   {
      let self = this;
      // quit if this function has already been called
      //if (arguments.callee.done)
      //{
      //   return;
      //}
      // flag this function so we don't do the same thing twice
      //arguments.callee.done = true;
      // kill the timer
      //if (Bu.defined(_timer))
      //{
      //   clearInterval(_timer);
      //}

      Bu.assert((document.createElement || document.getElementsByTagName),
                "TableSorter requires document.createElement and document.getElementsByTagName");

      //needs to be changed FIXME
      this.DATE_RE = /^(\d\d?)[\/\.-](\d\d?)[\/\.-]((\d\d)?\d\d)$/;

      if (Bu.defined(this.tableEl))
      {
         //this.tableEl.classList.add("sortable");
         Bd.addClass(this.tableEl, "sortable");
         self.makeSortable(this.tableEl);
      }
      else
      {
         Ba.forEach(document.getElementsByTagName('table'), function (table)
         {

            if (Bd.classListContains(table, "sortable"))
            {
               console.log(self);
               self.makeSortable(table);
            }
         })
      }

   };

   /**
    * make a table sortable by setting the required attributes
    * @param table
    */
   TableSorter.prototype.makeSortable = function (table)
   {
      const _this = this;
      if (table.getElementsByTagName('thead').length === 0)
      {
         // table doesn't have a tHead. Since it should have, create one and
         // put the first table row in it.
         the = document.createElement('thead');
         the.appendChild(table.rows[0]);
         table.insertBefore(the, table.firstChild);
      }
      // Safari doesn't support table.tHead, sigh
      if (table.tHead === null)
      {
         table.tHead = table.getElementsByTagName('thead')[0];
      }

      if (table.tHead.rows.length !== 1)
      {
         return;
      } // can't cope with two header rows

      // sortable v1 put rows with a class of "sortbottom" at the bottom (as
      // "total" rows, for example). This is B&R, since what you're supposed
      // to do is put them in a tfoot. So, if there are sortbottom rows,
      // for backwards compatibility, move them to tfoot (creating it if needed).
      sortbottomrows = [];
      for (let j = 0; j < table.rows.length; j++)
      {
         if (Bd.hasClass(table.rows[j], "sortbottom"))
         {
            sortbottomrows[sortbottomrows.length] = table.rows[j];
         }
      }

      if (sortbottomrows)
      {
         if (table.tFoot === null)
         {
            // table doesn't have a tfoot. Create one.
            tfo = document.createElement('tfoot');
            table.appendChild(tfo);
         }
         for (let t = 0; t < sortbottomrows.length; t++)
         {
            tfo.appendChild(sortbottomrows[t]);
         }
         sortbottomrows = null;
      }

      // work through each column and calculate its type
      headrow = table.tHead.rows[0].cells;
      for (let i = 0; i < headrow.length; i++)
      {
         // manually override the type with a sortable_type attribute
         if (!Bd.hasClass(headrow[i], "sortable_nosort") && !Bd.hasClass(headrow[i],"noSort"))
         {

            Bd.addClass(headrow[i], "sortableHead");
            // skip this col
            mtch = headrow[i].className.match(/\bsortable_([a-z0-9]+)\b/);

            let override;

            if (mtch)
            {
               override = mtch[1];
            }
            if (mtch && typeof this["sort_" + override] === 'function')
            {
               headrow[i].sortable_sortfunction = this["sort_" + override];
            }
            else
            {
               headrow[i].sortable_sortfunction = this.guessType(table, i);
            }

            // make it clickable to sort
            headrow[i].sortable_columnindex = i;
            headrow[i].sortable_tbody = table.tBodies[0];

            Be.bind(headrow[i], "click", _this.innerSortFunction = function (e)
            {

               if (Bd.classListContains(this, "sortable_sorted"))
               {
                  // if we're already sorted by this column, just
                  // reverse the table, which is quicker imhere
                  _this.reverse(this.sortable_tbody);
                  this.className = this.className.replace('sortable_sorted',
                                                          'sortable_sorted_reverse');
                  //remove the sort direction indicator el
                  //this.removeChild(document.getElementById('sortable_sortfwdind'));

                  /*sortrevind = Bd.createEl("span", { //imhere
                                              id        : "sortable_sortrevind",
                                              className : "",
                                              innerHTML : stIsIE ? '<font face="webdings">5</font>' : '&#x25B4;'
                                           },
                                           { padding : "1px 5px" });*/

                  //this.appendChild(sortrevind);
                  return;
               }
               if (this.className.search(/\bsortable_sorted_reverse\b/) !== -1)
               {
                  // if we're already sorted by this column in reverse, just
                  // re-reverse the table, which is quicker
                  _this.reverse(this.sortable_tbody);
                  this.className = this.className.replace('sortable_sorted_reverse',
                                                          'sortable_sorted');
                  /*this.removeChild(document.getElementById('sortable_sortrevind')); //imhere
                  sortfwdind = Bd.createEl("span", {
                     id        : "sortable_sortfwdind",
                     innerHTML : stIsIE ? '<font face="webdings">6</font>' : '&#x25BE;'
                  },
                                           { padding : "1px 5px" });

                  this.appendChild(sortfwdind);*/
                  return;
               }

               // remove sortable_sorted classes
               theadrow = this.parentNode;
               Ba.forEach(theadrow.childNodes, function (cell)
               {
                  if (cell.nodeType === 1)
                  { // an element
                     cell.className = cell.className.replace('sortable_sorted_reverse', '');
                     cell.className = cell.className.replace('sortable_sorted', '');
                  }
               });
               sortfwdind = document.getElementById('sortable_sortfwdind');
               if (sortfwdind)
               { sortfwdind.parentNode.removeChild(sortfwdind); }
               sortrevind = document.getElementById('sortable_sortrevind');
               if (sortrevind)
               { sortrevind.parentNode.removeChild(sortrevind); }

               this.className += ' sortable_sorted';
               /*sortfwdind = Bd.createEl("span", { //imhere
                                           id        : "sortable_sortfwdind",
                                           innerHTML : stIsIE ? '<font face="webdings">6</font>' : '&#x25BE;'
                                        },
                                        { padding : "1px 5px" });
               this.appendChild(sortfwdind);*/

               // build an array to sort. This is a Schwartzian transform thing,
               // i.e., we "decorate" each row with the actual sort key,
               // sort based on the sort keys, and then put the rows back in order
               // which is a lot faster because you only do getInnerText once per row
               row_array = [];
               col = this.sortable_columnindex;
               rows = this.sortable_tbody.rows;

               //generate Array of rows to sor
               for (let j = 0; j < rows.length; j+= _this.options.rowStepping)
               {
                  row_array[row_array.length] = [_this.getInnerText(rows[j].cells[col]), rows[j]];
               }
               /* If you want a stable sort, uncomment the following line */
               _this.shakerSort(row_array, this.sortable_sortfunction);
               /* and comment out _this one */
               //row_array.sort(this.sortable_sortfunction);

               tb = this.sortable_tbody;
               for (let q = 0; q < row_array.length; q++)
               {
                  tb.appendChild(row_array[q][1]);
               }

               row_array = null;
            });

            /*dean_addEvent(headrow[i], "click", sortable.innerSortFunction = function (e)
             {

             if (this.className.search(/\bsortable_sorted\b/) != -1)
             {
             // if we're already sorted by this column, just
             // reverse the table, which is quicker
             sortable.reverse(this.sortable_tbody);
             this.className = this.className.replace('sortable_sorted',
             'sortable_sorted_reverse');
             this.removeChild(document.getElementById('sortable_sortfwdind'));

             sortrevind = document.createElement('span');
             sortrevind.id = "sortable_sortrevind";
             sortrevind.innerHTML = stIsIE ? '<font face="webdings">5</font>' : '&#x25B4;';
             this.appendChild(sortrevind);
             return;
             }
             if (this.className.search(/\bsortable_sorted_reverse\b/) != -1)
             {
             // if we're already sorted by this column in reverse, just
             // re-reverse the table, which is quicker
             sortable.reverse(this.sortable_tbody);
             this.className = this.className.replace('sortable_sorted_reverse',
             'sortable_sorted');
             this.removeChild(document.getElementById('sortable_sortrevind'));
             sortfwdind = document.createElement('span');
             sortfwdind.id = "sortable_sortfwdind";
             sortfwdind.innerHTML = stIsIE ? '<font face="webdings">6</font>' : '&#x25BE;';
             this.appendChild(sortfwdind);
             return;
             }

             // remove sortable_sorted classes
             theadrow = this.parentNode;
             Ba.forEach(theadrow.childNodes, function (cell)
             {
             if (cell.nodeType === 1)
             { // an element
             cell.className = cell.className.replace('sortable_sorted_reverse', '');
             cell.className = cell.className.replace('sortable_sorted', '');
             }
             });
             sortfwdind = document.getElementById('sortable_sortfwdind');
             if (sortfwdind)
             { sortfwdind.parentNode.removeChild(sortfwdind); }
             sortrevind = document.getElementById('sortable_sortrevind');
             if (sortrevind)
             { sortrevind.parentNode.removeChild(sortrevind); }

             this.className += ' sortable_sorted';
             sortfwdind = document.createElement('span');
             sortfwdind.id = "sortable_sortfwdind";
             sortfwdind.innerHTML = stIsIE ? '<font face="webdings">6</font>' : '&#x25BE;';
             this.appendChild(sortfwdind);

             // build an array to sort. This is a Schwartzian transform thing,
             // i.e., we "decorate" each row with the actual sort key,
             // sort based on the sort keys, and then put the rows back in order
             // which is a lot faster because you only do getInnerText once per row
             row_array = [];
             col = this.sortable_columnindex;
             rows = this.sortable_tbody.rows;
             for (var j = 0; j < rows.length; j++)
             {
             row_array[row_array.length] = [sortable.getInnerText(rows[j].cells[col]), rows[j]];
             }
             /!* If you want a stable sort, uncomment the following line *!/
             //sortable.shakerSort(row_array, this.sortable_sortfunction);
             /!* and comment out this one *!/
             row_array.sort(this.sortable_sortfunction);

             tb = this.sortable_tbody;
             for (var q = 0; q < row_array.length; q++)
             {
             tb.appendChild(row_array[q][1]);
             }

             delete row_array;
             });*/
         }
      }
   };

   /**
    * guess the type of a column based on its first non-blank row
    * @param table
    * @param column
    * @returns {*}
    */
   TableSorter.prototype.guessType = function (table, column)
   {
      //the fn to use {default sortAlpha}
      let sortfn = this.sortAlpha, possdate, text;

      for (let i = 0; i < table.tBodies[0].rows.length; i++)
      {
         text = this.getInnerText(table.tBodies[0].rows[i].cells[column]);
         if (text !== '')
         {
            if (text.match(/^-?[£$¤]?[\d,.]+%?$/))
            {
               return this.sortNumeric;
            }
            //MSG can only handle numeric date
            // check for a date: dd/mm/yyyy or dd/mm/yy
            // can have / or . or - as separator
            // can be mm/dd as well
            possdate = text.match(this.DATE_RE);
            if (possdate)
            {
               // looks like a date
               first = parseInt(possdate[1]);
               second = parseInt(possdate[2]);
               if (first > 12)
               {
                  // definitely dd/mm
                  return this.sortDdMm;
               }
               else if (second > 12)
               {
                  return this.sortMmDd;
               }
               else
               {
                  // looks like a date, but we can't tell which format, so assume
                  // that it's dd/mm (English imperialism!) and keep looking
                  sortfn = this.sortDdMm;
               }
            }
         }
      }
      return sortfn;
   };

   /**
    *
    * @param node
    * @returns {*}
    */
   TableSorter.prototype.getInnerText = function (node)
   {
      // gets the text we want to use for sorting for a cell.
      // strips leading and trailing whitespace.
      // this is *not* a generic getInnerText function; it's special to sortable.
      // for example, you can override the cell text with a customkey attribute.
      // it also gets .value for <input> fields.

      if (!node)
      {
         return "";
      }

      this.hasInputs = (Bu.isFunction(node.getElementsByTagName)) &&
                       node.getElementsByTagName('input').length;

      if (Bu.defined(node.getAttribute) && node.getAttribute("sortable_customkey") !== null)
      {
         return node.getAttribute("sortable_customkey");
      }
      else if (Bu.defined(node.textContent) && !this.hasInputs)
      {
         return node.textContent.replace(/^\s+|\s+$/g, '');
      }
      else if (Bu.defined(node.innerText) && !this.hasInputs)
      {
         return node.innerText.replace(/^\s+|\s+$/g, '');
      }
      else if (Bu.defined(node.text) && !this.hasInputs)
      {
         return node.text.replace(/^\s+|\s+$/g, '');
      }
      else
      {
         switch (node.nodeType)
         {
            case 3:
               if (node.nodeName.toLowerCase() === 'input')
               {
                  return node.value.replace(/^\s+|\s+$/g, '');
               }
            case 4:
               return node.nodeValue.replace(/^\s+|\s+$/g, '');
               break;
            case 1:
            case 11:
               let innerText = '';
               for (let i = 0; i < node.childNodes.length; i++)
               {
                  innerText += this.getInnerText(node.childNodes[i]);
               }
               return innerText.replace(/^\s+|\s+$/g, '');
               break;
            default:
               return '';
         }
      }
   };

   /**
    * reverse the sorting order
    * @param tbody {Element}
    */
   TableSorter.prototype.reverse = function (tbody)
   {
      // reverse the rows in a tbody
      newrows = [];
      for (let i = 0; i < tbody.rows.length; i++)
      {
         newrows[newrows.length] = tbody.rows[i];
      }
      for (let j = newrows.length - 1; j >= 0; j--)
      {
         tbody.appendChild(newrows[j]);
      }
      newrows = null;
   };

   //region sort functions
   /*
    each sort function takes two parameters, a and b
    you are comparing a[0] and b[0] */

   /**
    *
    * @param a
    * @param b
    * @returns {number}
    */
   TableSorter.prototype.sortNumeric = function (a, b)
   {
      aa = parseFloat(a[0].replace(/[^0-9.-]/g, ''));
      if (isNaN(aa))
      {
         aa = 0;
      }
      bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''));
      if (isNaN(bb))
      {
         bb = 0;
      }
      return aa - bb;
   };

   /**
    *
    * @param a
    * @param b
    * @returns {number}
    */
   TableSorter.prototype.sortAlpha = function (a, b)
   {
      if (a[0] == b[0])
      {
         return 0;
      }
      if (a[0] < b[0])
      {
         return -1;
      }
      return 1;
   };

   /**
    *
    * @param a
    * @param b
    * @returns {number}
    */
   TableSorter.prototype.sortDdMm = function (a, b)
   {
      mtch = a[0].match(this.DATE_RE);
      y = mtch[3];
      m = mtch[2];
      d = mtch[1];
      if (m.length === 1)
      {
         m = '0' + m;
      }
      if (d.length === 1)
      {
         d = '0' + d;
      }
      dt1 = y + m + d;
      mtch = b[0].match(this.DATE_RE);
      y = mtch[3];
      m = mtch[2];
      d = mtch[1];
      if (m.length === 1)
      {
         m = '0' + m;
      }
      if (d.length === 1)
      {
         d = '0' + d;
      }
      dt2 = y + m + d;
      if (dt1 === dt2)
      {
         return 0;
      }
      if (dt1 < dt2)
      {
         return -1;
      }
      return 1;
   };

   /**
    *
    * @param a
    * @param b
    * @returns {number}
    */
   TableSorter.prototype.sortMmDd = function (a, b)
   {
      mtch = a[0].match(this.DATE_RE);
      y = mtch[3];
      d = mtch[2];
      m = mtch[1];
      if (m.length === 1)
      {
         m = '0' + m;
      }
      if (d.length === 1)
      {
         d = '0' + d;
      }
      dt1 = y + m + d;
      mtch = b[0].match(this.DATE_RE);
      y = mtch[3];
      d = mtch[2];
      m = mtch[1];
      if (m.length === 1)
      {
         m = '0' + m;
      }
      if (d.length === 1)
      {
         d = '0' + d;
      }
      dt2 = y + m + d;
      if (dt1 === dt2)
      {
         return 0;
      }
      if (dt1 < dt2)
      {
         return -1;
      }
      return 1;
   };

   //endregion

   /**
    * A stable sort function to allow multi-level sorting of data
    * {@see: http://en.wikipedia.org/wiki/Cocktail_sort}
    * thanks to Joseph Nahmias
    * @param list
    * @param comp_func {fn}
    */
   TableSorter.prototype.shakerSort = function (list, comp_func)
   {

      let b = 0;
      let t = list.length - 1;
      let swap = true;

      while (swap)
      {
         swap = false;
         for (let i = b; i < t; ++i)
         {
            if (comp_func(list[i], list[i + 1]) > 0)
            {
               let d = list[i];
               list[i] = list[i + 1];
               list[i + 1] = d;
               swap = true;
            }
         } // for
         t--;

         if (!swap)
         {
            break;
         }

         for (let c = t; c > b; --c)
         {
            if (comp_func(list[c], list[c - 1]) < 0)
            {
               let q = list[c];
               list[c] = list[c - 1];
               list[c - 1] = q;
               swap = true;
            }
         } // for
         b++;

      } // while(swap)
   };

   //going public whoop! whoop! lol
   return Barge.Dom.TableSorter = TableSorter;
});

/**
 * TODO : fix mem leaks
 */
