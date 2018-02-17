/**
 * Created by ARCH on 10/09/2016.
 */

var Bee = Bee || {};
Bee.CopyCat =
{
   getSelectionText : function ()
   {
   var selectedText = "";
   if (window.getSelection)
   { // all modern browsers and IE9+
      selectedText = window.getSelection().toString();
   }
   return selectedText;
   },

   selectElementText : function (el)
   {
      var range = document.createRange(); // create new range object
      range.selectNodeContents(el); // set range to encompass desired element text
      var selection = window.getSelection(); // get Selection object from currently user selected text
      selection.removeAllRanges(); // unselect any user selected text (if any)
      selection.addRange(range); // add range to Selection object to select it
   },

   getSelectedInputText : function (targetInputEl)
   {
      return targetInputEl.value.substring(targetInputEl.selectionStart, targetInputEl.selectionEnd);
   },

   copySelectionText : function ()
   {
      var copysuccess = null; // var to check whether execCommand successfully executed
      try{
         copysuccess = document.execCommand("copy"); // run command to copy selected text to clipboard
      }
      catch(e)
      {
         copysuccess = false;
      }
      return copysuccess;
   },

   selectALl : function ()
   {
      var copysuccess = null; // var to check whether execCommand successfully executed
      try{
         copysuccess = document.execCommand("selectAll"); // run command to copy selected text to clipboard
      }
      catch(e)
      {
         copysuccess = false;
      }
      return copysuccess;
   },

   pasteTextFromClipBoard : function ()
   {
      var copysuccess = null; // var to check whether execCommand successfully executed
      try{
         copysuccess = document.execCommand("paste"); // run command to copy selected text to clipboard
      }
      catch(e)
      {
         copysuccess = false;
      }
      return document.execCommand("paste");
   }
};

/*document.addEventListener('mouseup', function(){
   var thetext = getSelectionText();
   if (thetext.length > 0)
   { // check there's some text selected
      //console.log(thetext); // logs whatever textual content the user has selected on the page
   }
}, false);*/
/******** Trying the custom paste thing*/

function handlePaste (e)
{
   var types, clipBoardData, pastedData;

   if(e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData)
   {
      types = e.clipboardData
   }

   e.stopPropagation();
   e.preventDefault();

   clipBoardData = e.clipboardData || window.clipboardData;
   pastedData = clipBoardData.getData("Text");

   alert(pastedData);
}