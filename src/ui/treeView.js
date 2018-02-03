/**
 * Created by ARCH on 11/07/2016.
 */
(function (Bu, Bs, Bd)
{

   Bee.CollapsibleLists.apply(false);
   var treeViewNodes = document.querySelectorAll(".treeViewNode"),
       treeViewRoots = document.querySelectorAll(".treeViewRoot"),
       paneHeading = document.getElementById('paneHeading'),

       filterInput = Bd.getEl("#treeListFilter"),
       tree = Bd.getEl("#tree"),

       i = 0, len = 0;

   // console.log(Bd);

   // console.log(filterInput);
   // console.log(tree);

   function _setActive(newActiveEL, classDeactivate, activeClassName)
   {
      if(newActiveEL)
      {
         var pel = newActiveEL.parentNode; // returns single entity
         var pelChin = pel.children; //array(node list)

         for (var i = 0, len = pelChin.length; i < len; i++)
         {
            pelChin[i].className = classDeactivate;
         }
         newActiveEL.className = activeClassName;
      }
   }

   function _getAjaxData(el, link)
   {
      var qStr  = el.getAttribute("data-pane");

       var request = new XMLHttpRequest();
       var url = link +'?activePane=' + qStr || '';
       request.onreadystatechange = function()
       {
          if(request.readyState === 4  && request.status == 200)
          {
          // console.log('?activePane=' + qStr);
          // console.log(url);
          // console.log(request.responseType, request.responseText);
            document.getElementById("paneBody").innerHTML = request.responseText;
          }
       };
       request.open('GET', url , true);
       request.send(null);
   }

   if(treeViewNodes)
   {
      for(i = 0, len = treeViewNodes.length; i < len; i++)
      {
         treeViewNodes[i].addEventListener("click", function(event)
         {
            var nextPane = Bee.utils.gebi(this.getAttribute("data-pane").toString()),
                link = this.getAttribute("data-href"),
                activePane = document.querySelector(".activePane");

            // _setActive(this, "treeViewNode", "ActiveNode");

            if(nextPane)
            {
               _setActive(nextPane, "pane", "activePane");
            }
            else
            {
               if(link && !Bs.isEmpty(link))
               {
                  Bu.redirectTo(link);

                  // _getAjaxData(this, link)
               }

            }
            if (paneHeading)
            {
               if(nextPane)
               {
                  var parent = this.parentElement.parentElement,
                      grandParent = this.parentElement.parentElement.parentElement.parentElement,
                      greatGrandParent = this.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;

                  console.log(grandParent);

                  var heading = (greatGrandParent &&
                     greatGrandParent.nodeName.toLocaleLowerCase() === 'li' ? greatGrandParent.innerHTML.split(' ')[0]
                     + ' <i class="fa fa-angle-right"></i> ' : '') +

                     (grandParent && grandParent.nodeName.toLocaleLowerCase() === 'li' ? grandParent.innerHTML.split(' ')[0]
                     + ' <i class="fa fa-angle-right"></i> ' : '') +

                     (parent ? parent.innerHTML.split(' ')[0] : '') +
                     ' <i class="fa fa-angle-right"></i> ' + this.innerText ;

                  Bu.extend(paneHeading, {
                     innerHTML : heading
                  });

                  Bu.css(paneHeading, {
                     display : 'block',
                     fontWeight : '400'
                  });

                  Bu.removeClass(paneHeading, 'pane');
               }
               // console.log(Bee.Dom.getInnerText(this), this.innerText);
               // console.log(Bee.Dom.getInnerText(this), this.innerHTML);
            }
            // event.stopPropagation();
         });
      }
   }

   if(treeViewRoots)
   {
      for(i = 0, len = treeViewRoots.length; i < len; i++)
      {
         treeViewRoots[i].addEventListener("click", function(event)
         {
            var nextPane = Bu.gebi(this.getAttribute("data-pane").toString());
            var activePane = document.querySelector(".activePane");

            // _setActive(this, "treeViewRoot", "ActiveNode");
            _setActive(nextPane, "pane", "activePane");
            // event.stopPropagation();
         });
      }
   }


   filterInput.addEventListener("keyup", function ()
   {
      if(!Bs.isEmpty(this.value.toString()))
      {
         Bee.CollapsibleLists.toggleCollapseAll();

         Bd.filterList(filterInput, tree, true);
      }
      else{

         var lis = tree.getElementsByTagName('li');

         for (i = 0, len = lis.length; i < len; i++)
         {
            lis[i].style.display = "";
         }
         Bee.CollapsibleLists.toggleCollapseAll();

      }
   });


   // Bee.CollapsibleLists.toggleCollapseAll()

})(Bee.utils, Bee.String, Bee.Dom);

/*TODO make tree stateful by keeping open list in local storage and the opening all previously open list on-load
* TODO make sure parent opens
* */