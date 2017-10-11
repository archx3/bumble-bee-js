/**
 * Created by arch on 3/5/17.
 */
(function(Bu, Ba, Bs, Bd)
{
   var evt = new Barge.Event.EventManager();

   var comboBoxes = Bd.getEl('.comboBx', true);
   var allLists = document.querySelectorAll('.dropDownList');
   var openLists = [];

   function toggleDropListDisplay(myDropDownListDiv)
   {
      if (Bs.isEmpty(myDropDownListDiv.style.display) || Bd.getDisplayState(myDropDownListDiv) == 0)
      {
         closeAllOpenDropDownLists();

         Bd.setDisplayState(myDropDownListDiv, "block");
      }
      else
      {
         Bd.setDisplayState(myDropDownListDiv, "none");
      }
   }

   function closeAllOpenDropDownLists()
   {
      if(!Ba.isEmpty(openLists))
      {
         Ba.forEach(openLists, function (node)
         {
            Bd.css(node, {display : 'none'});
         });

         Ba.clear(openLists);
      }
   }

   Bu.forEach(comboBoxes, function (node, i)
   {
      var dropDownBtn = node.querySelector('.comboControl button.dropBtn');
      var myDropDownListDiv = node.querySelector('.dropDownList');

      Bd.closeOutOnBodyClick(myDropDownListDiv);

      evt.bind(dropDownBtn, 'click', function (e)
      {
//            Bd.toggleDisplay(myDropDownListDiv);

         toggleDropListDisplay(myDropDownListDiv);


         if(Bd.getDisplayState(myDropDownListDiv) === 1)
         {
            Bd.pushIntoView(myDropDownListDiv);

            openLists.push(myDropDownListDiv);
         }

      });

      var dropDownList = node.querySelectorAll('.dropDownList ul li:not(.hDivider):not(.heading)');


      evt.bindOnAll(dropDownList, 'click', function (e)
      {
         var input = node.querySelector('.comboControl input');

         input.value = this.getAttribute('data-value') ? this.getAttribute('data-value') : '';

         Bd.closeWin(myDropDownListDiv);
      });
   })
})(Barge.utils, Barge.Array, Barge.String, Barge.Dom)