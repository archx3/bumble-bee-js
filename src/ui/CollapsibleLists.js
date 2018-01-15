/*
An object allowing lists to dynamically expand and collapse

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:
http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

var Barge = Barge || {};

/**
 * IICE Immidiately instantiated constructor expression
 * creates An object (CollapsibleLists)
 * @constructor
 */
(function (/*Bu, Bs, Bo, Bd*/)
{
   Barge.CollapsibleLists = new function()
{
      /**Makes all lists with the class 'collapsibleList' collapsible.
       *@param doNotRecurse {boolean}- true if sub-lists should not be made collapsible
       */

      this.apply = function(doNotRecurse)
      {
        // loop over the unordered lists
        var uls = document.getElementsByTagName('ul');

        for (var index = 0, len = uls.length; index < len; index ++)
        {
          // check whether this list should be made collapsible
          if (uls[index].className.match(/(^| )collapsibleList( |$)/)){

            // make this list collapsible
            this.applyTo(uls[index], true, true);

            // check whether sub-lists should also be made collapsible
            if (!doNotRecurse)
            {
              // add the collapsibleList class to the sub-lists
              var subUls = uls[index].getElementsByTagName('ul');
              for (var subIndex = 0; subIndex < subUls.length; subIndex ++)
              {
                subUls[subIndex].classList.add('collapsibleList');
              }
            }
          }
        }
      };

      /** Makes the specified list collapsible. The parameters are:
       *
       *@param node {boolean}       - the list element
       *@param doNotRecurse {boolean}- true if sub-lists should not be made collapsible
       *@param addEvent {boolean}
       */
      this.applyTo = function(node, doNotRecurse, addEvent)
      {
        // loop over the list items within this node
        var lis = node.getElementsByTagName('li');
        for (var index = 0; index < lis.length; index ++)
        {
          // check whether this list item should be collapsible
          if (!doNotRecurse || node == lis[index].parentNode)
          {
            // prevent text from being selected unintentionally
            /*if (lis[index].addEventListener)
            {
              lis[index].addEventListener('mousedown', function (e)
              {
                 e.preventDefault();
              }, false);
            }
            else
            {
              lis[index].attachEvent('onselectstart', function()
              {
                 event.returnValue = false;
              });
            }*/
            // add the click listener
           if(addEvent)
           {
              _addEventTo(lis[index]);
           }
            // close the unordered lists within this list item
            _toggle(lis[index]);
          }
        }
      };

   this.toggleCollapseAll = function (node, doNotRecurse)
   {
      // loop over the unordered lists
      const uls = document.getElementsByTagName('ul');

      let i = 0, len = uls.length;
      for (; i < len; i ++)
      {
         // check whether this list should be made collapsible
         if (uls[i].className.match(/(^| )collapsibleList( |$)/)){

            // make this list collapsible
            this.applyTo(uls[i], true, false);

            // check whether sub-lists should also be made collapsible
            if (!doNotRecurse)
            {
               // add the collapsibleList class to the sub-lists
               var subUls = uls[i].getElementsByTagName('ul');
               for (var subIndex = 0; subIndex < subUls.length; subIndex ++)
               {
                  subUls[subIndex].classList.add('collapsibleList');
               }
            }
         }
      }
   };


   function _addEventTo(li)
   {
      // add the click listener
      if (li.addEventListener)
      {
         li.addEventListener('click', _clickHandler(li), true);
      }
      else
      {
         li.attachEvent('onclick', _clickHandler(li));
      }
   }

      /** Returns a function that toggles the display status of any unordered
       *@use list elements within the specified node. The parameter is:
       * @param node - the node containing the unordered list elements
       * @returns {function}
       */
      function _clickHandler(node)
		{
        // return the function
        return function(e)
		  {
          // ensure the event object is defined
          if (!e){ e = window.event;}

          // find the list item containing the target of the event
          var li = (e.target ? e.target : e.srcElement);
          while (li.nodeName !== 'LI')
          {
             li = li.parentNode;
          }

          // toggle the state of the node if it was the target of the event
          if (li === node)
          {
             _toggle(node);
          }

        };
      }

      /** Opens or closes the unordered list elements directly within the
       * specified node. The parameter is:
       * @param node - the node containing the unordered list elements
       */
      function _toggle(node)
		{
        // determine whether to open or close the unordered lists
        // var open = node.className.match(/(^| )collapsibleListClosed( |$)/);
        var open = node.classList.contains('collapsibleListClosed');

        // loop over the unordered list elements with the node
        var uls = node.getElementsByTagName('ul');
        for (var index = 0; index < uls.length; index ++)
		  {
          // find the parent list item of this unordered list
          var li = uls[index];
          while (li.nodeName !== 'LI')
			 {
             li = li.parentNode;
          }
          // style the unordered list if it is directly within this node
          if (li === node)
          {
             uls[index].style.display = (open ? 'block' : 'none');
          }
        }

        // remove the current class from the node
        // node.className = node.className.replace(/(^| )collapsibleList(Open|Closed)( |$)/, '');
        node.className = node.className.replace(/(^| )collapsibleList(Open|Closed)( |$)/, '');


        // if the node contains unordered lists, set its class
        if (uls.length > 0)
		  {
          // node.className += ' collapsibleList' + (open ? 'Open' : 'Closed');
          node.classList.add('collapsibleList' + (open ? 'Open' : 'Closed'));
        }
      }

    }();
})(/*Barge.utils, Barge.String, Barge.Object, Barge.Dom*/);

/*TODO ADD keyboard support for collapsing and expanding as well as cycling through list up and down*/
