/**
 * Created by ARCH on 29/08/2016.
 */

var UITheme = document.head.getAttribute("data-theme") !== "" ? document.head.getAttribute("data-theme") : "light";

function makeGradeRowEditable(checkboxes, midTerms, exams)
{
   for(var i = 0 ; i < checkboxes.length ;  i++ )
   {
      (function (j)
      {
         checkboxes[j].addEventListener("click", function()
         {
            console.log(midTerms[j]);
            console.log(exams[j]);

            if(checkboxes[j].checked === true)
            {
               midTerms[j].readOnly = false;
               exams[j].readOnly = false;
            }
            else
            {
               midTerms[j].readOnly = true;
               exams[j].readOnly = true;
            }
         });
      })(i);
   }
}


function doThis(source, checkboxes, midTerms, exams)
{
   //exm srcInputEl tag
   for(var i = 0; i < checkboxes.length ; i++ )
   {
      checkboxes[i].checked = source.checked;
      var myDad = checkboxes[i].parentElement.parentElement.parentElement;

      if(checkboxes[i].checked === true)
      {
         midTerms[i].readOnly = false;
         exams[i].readOnly = false;
         myDad.style.backgroundColor = "var(--rowHighLightColor)";
         myDad.style.borderBottom = "1px dotted #555";
         myDad.style.color = "#000";
      }
      else
      {
         midTerms[i].readOnly = true;
         exams[i].readOnly = true;
         myDad.style.backgroundColor = "";
         myDad.style.color = "";
         myDad.style.borderBottom = "";

      }
   }
}

function consolidateTiles(tileRows)
{
   var tempRow = null;
   if(tileRows[0].children.length < 0 && tileRows[1].children.length > 0)
   {
      tileRows[0].clientHeight = 20;
      tileRows[0].style.height = "0px";
      console.log(tileRows[0].clientHeight);
   }
   
   if(tileRows[0].children.length === 1 && tileRows[1].children.length === 1)
   {
      tempRow = tileRows[0].innerHTML;
      tileRows[0].innerHTML = tempRow + tileRows[1].innerHTML;
      tempRow = null;
      tileRows[1].innerHTML = "";
   }
   if(tileRows[0].children.length === 2 && tileRows[1].children.length === 2)
   {
      //tempRow = tileRows[0].innerHTML;
      tileRows[0].insertBefore(tileRows[1].children[0], tileRows[0].children[3]);
      //tileRows[0].innerHTML = tempRow + tileRows[1].innerHTML;
      //tempRow = null;
      //console.log(tileRows[1].children[1]);
      //tileRows[1].removeChild(tileRows[1].children[1]);
   }

   if((tileRows[0].children.length === 2 && tileRows[1].children.length === 1) || (tileRows[0].children.length === 1 && tileRows[1].children.length === 2))
   {
      tempRow = tileRows[0].innerHTML;
      //console.log(tempRow);
      tileRows[0].innerHTML = tempRow + tileRows[1].innerHTML;
      tempRow = null;
      tileRows[1].innerHTML = "";
   }
   else if(tileRows[0].children.length < tileRows[1].children.length)
   {
      tempRow = tileRows[0].innerHTML;
      tileRows[0].innerHTML = tileRows[1].innerHTML;
      tileRows[1].innerHTML = tempRow;
      tempRow = null;
      if(tileRows[1].children[0] !== undefined && tileRows[1].children[0].innerHTML.indexOf("Register Student") > -1)
      {
         console.log("true");
         tempRow = tileRows[0].children[0];
         Bee.Utils.removeEl(tileRows[0].children[0]);
         tileRows[0].insertBefore(tileRows[1].children[0], tileRows[0].children[0]);
         tileRows[1].insertBefore(tempRow, tileRows[1].children[0]);
         tempRow = null;
      }
   }
   else if(tileRows[0].children.length === 3  && tileRows[1].children.length === 3)
   {
      tempRow = Bee.String.trim(tileRows[0].innerHTML) + "\n" + Bee.String.trim(tileRows[1].innerHTML);

      tileRows[0].innerHTML = tileRows[0].innerHTML = "";
      tileRows[0].innerHTML = tempRow;
      tempRow = null;

      tileRows[0].parentElement.style.height = "580px";
      tileRows[1].innerHTML = "";

      if(document.getElementById("dragSortStyle"))
      {
         document.getElementById("dragSortStyle").innerHTML += ".row ul li{margin-top:35px}"
      }
   }
}

function fileUploadButtonManager(surrogateButton,fileInputEl,fileNameEl,progressBarEl,type)
{
   surrogateButton.onclick = function ()
   {
      fileInputEl.click();
   };

   fileInputEl.addEventListener("change", function ()
   {
      var txt = "";
      if ('files' in fileInputEl)
      {
         if (fileInputEl.files.length < 1)
         {
            txt = "Select one or more files.";
         }
         else
         {
            for (var i = 0; i < fileInputEl.files.length; i++)
            {  //txt += "<br><strong>" + (i+1) + ". file</strong><br>";
               var file = fileInputEl.files[i];
               if ('name' in file)
               {
                  txt += file.name;
               }
               if ('size' in file)
               {
                  txt += " (" + (file.size / 1024).toFixed(0) + " kB)";
               }
               if(type)
               {
                  if ('type' in file)
                  {
                     if (file.type.toString().indexOf(type) < 0)
                     {
                        txt = "Expects" + type + " file";
                     }
                  }
               }
               else if(type === "image")
               {
                  if ('type' in file)
                  {
                     if (file.type.toString().indexOf('image') < 0)
                     {
                        txt = "Not an image";
                     }
                  }
               }
               /*for (var k in file) {console.log( k, file[k] );}*/
            }
         }
      }
      else
      {
         if(surrogateButton.tagName.toLowerCase() === "input")
         {
            surrogateButton.value = "No file Selected";
         }
         else
         {
            surrogateButton.innerHTML = "No file Selected";
         }
      }

      var pTimer;
      if(progressBarEl && fileNameEl)
      {
         if (Bee.Utils.getDisplayState(progressBarEl) === 0)
         {
            progressBarEl.style.display = "block";
            pTimer = window.setInterval(function ()
            {
               if (progressBarEl.value !== 100)
               {
                  progressBarEl.value += 10;
               }
               else
               {
                  clearInterval(pTimer);
                  fileNameEl.setAttribute("data-tooltip", txt);
                  fileNameEl.innerHTML = Bee.String.ellipsify(txt, 19);
                  if(fileInputEl.value !== null)
                  {
                     if(surrogateButton.tagName.toLowerCase() === "input")
                     {
                        surrogateButton.value = Bee.String.ellipsify(txt, 9);
                     }
                     else
                     {
                        surrogateButton.innerHTML = Bee.String.ellipsify(txt, 9);
                     }
                  }
                  if (txt.indexOf("Not an image") >= 0)
                  {    //console.log(fileName.style.color);
                     fileNameEl.style.color = "#ff0000";
                     fileNameEl.style.textShadow = "1px 1px 7px rgba(255, 255, 255, 1)";
                     fileInputEl.reset();
                  }
                  else
                  {
                     fileNameEl.style.color = "#000";
                     fileNameEl.style.textShadow = "";
                  }
               }
            }, 40);
         }
         else
         {
            progressBarEl.value = 0;
            pTimer = window.setInterval(function ()
            {
               if (progressBarEl.value !== 100)
               {
                  progressBarEl.value += 10;
               }
               else
               {
                  clearInterval(pTimer);
                  fileNameEl.setAttribute("data-tooltip", txt);
                  fileNameEl.innerHTML = Bee.String.ellipsify(txt, 19);
                  if(fileInputEl.value !== null)
                  {
                     if(surrogateButton.tagName.toLowerCase() === "input")
                     {
                        surrogateButton.value = Bee.String.ellipsify(txt, 10);
                     }
                     else
                     {
                        surrogateButton.innerHTML = Bee.String.ellipsify(txt, 10);
                     }
                  }
                  if (txt.indexOf("Not an image") >= 0)
                  {
                     fileNameEl.style.color = "#ff0000";
                     fileNameEl.style.textShadow = "1px 1px 7px rgba(255, 255, 255, 1)";
                     fileInputEl.value = null;
                  }
                  else
                  {
                     fileNameEl.style.color = "#000";
                     fileNameEl.style.textShadow = "";
                  }
               }
            }, 40);
         }
      }
      else if(fileNameEl && !progressBarEl)
      {
         fileNameEl.setAttribute("title", txt);
         fileNameEl.innerHTML = Bee.String.ellipsify(txt, 19);
         if(fileInputEl.value !== null)
         {
            surrogateButton.setAttribute("title", txt);
            if(surrogateButton.tagName.toLowerCase() === "input")
            {
               surrogateButton.value = Bee.String.ellipsify(txt, 15);
            }
            else
            {
               surrogateButton.innerHTML = Bee.String.ellipsify(txt, 15);
            }
         }

         if (txt.indexOf("Not an image") >= 0)
         {
            fileNameEl.style.color = "#ff0000";
            fileNameEl.style.textShadow = "1px 1px 7px rgba(255, 255, 255, 1)";
            fileInputEl.value = null;
         }
         else
         {
            fileNameEl.style.color = "#000";
            fileNameEl.style.textShadow = "";
         }
      }
   });
}

function filterList(inputID,ul)
{
   // Declare variables
   var input, filter, a, i;
   //console.log(a);
   input = document.getElementById(inputID);
   filter = input.value.toUpperCase();
   var pEl = document.getElementsByClassName(ul)[0];
   var li = pEl.getElementsByTagName('li');

   // Loop through all list items, and hide those who don't match the search query
   if(filter !== "" || filter !== " ")
   {
      for (i = 0; i < li.length; i++)
      {
         a = li[i].getElementsByTagName("a")[0].innerHTML + " " +
             Bee.String.trim(li[i].getElementsByTagName("a")[1].innerHTML) + " " +
             Bee.String.trim(li[i].getElementsByTagName("a")[2].innerHTML);

         if (a.toUpperCase().indexOf(filter) > -1)
         {
            li[i].style.display = "";
         }
         else
         {
            li[i].style.display = "none";
         }
      }
   }
}

function uploadIntoTable(targetTableBodyID, fileInputID)
{
   var fileUpload = document.getElementById(fileInputID);
   var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
   var table = document.getElementById(targetTableBodyID);

   var dvCSV = document.getElementById("dvCSV2");

   if (regex.test(fileUpload.value.toLowerCase()))
   {
      if (typeof (FileReader) != "undefined")
      {
         var reader = new FileReader();
         reader.onload = function (e)
         {
            var record = e.target.result.split("\n");

            for (var i = 0; i < record.length; i++)
            {
               if(i < table.childElementCount)
               {
                  var tableRow = table.children[i];

                  var fields = record[i+1].split(",");
                  var studentName = tableRow.children[4].innerHTML.toString() + tableRow.children[5].innerHTML.toString();

                  if(studentName.indexOf(fields[1] + fields[2]) > -1)
                  {
                     var inputVal = null;
                     for(var j = 6; j < tableRow.children.length - 1; j++)
                     {
                        inputVal = tableRow.children[j].children[0].value;
                        if(inputVal == "" || inputVal == " ")
                        {
                           tableRow.children[j].children[0].value = fields[j - 3] !== undefined ? fields[j - 3] : "";
                        }
                     }
                  }
               }
               else
               {
                  break;
               }
            }
         };
         reader.readAsText(fileUpload.files[0]);
      }
      else
      {
         if(UITheme === "dark")
         {
            Bee.Dialog.darkAlert("This Browser does not support file reading.");
         }
         else
         {
            Bee.Dialog.lightAlert("This Browser does not support file reading.");
         }
      }
   }
   else
   {
      console.log(UITheme);
      if(UITheme == "dark")
      {
         Bee.Dialog.darkAlert("Please upload a valid CSV file.");
      }
      else
      {
         Bee.Dialog.lightAlert("Please upload a valid CSV file.");
      }
   }
}