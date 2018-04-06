/**
 * Created by ARCH on 17/09/2016.
 */
function UploadAndTabularise()
{
   var fileUpload = document.getElementById("fileUpload");
   var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
   if (regex.test(fileUpload.value.toLowerCase()))
   {
      if (typeof (FileReader) !== "undefined")
      {
         var reader = new FileReader();
         reader.onload = function (e)
         {
            var table = document.createElement("table");

            var rows = e.target.result.split("\n");
            for (var i = 0; i < rows.length; i++)
            {
               var row = table.insertRow(-1);
               var cells = rows[i].split(",");
               for (var j = 0; j < cells.length; j++)
               {
                  var cell = row.insertCell(-1);
                  cell.innerHTML = cells[j];
               }
            }
            var dvCSV = document.getElementById("dvCSV");
            dvCSV.innerHTML = "";
            dvCSV.appendChild(table);
         };
         reader.readAsText(fileUpload.files[0]);
      } else {
         alert("This browser does not support HTML5.");
      }
   } else {
      alert("Please upload a valid CSV file.");
   }
}
/**
 * 
 * @param targetTableBodyID
 * @param fileInputID
 */
function uploadIntoTable(targetTableBodyID, fileInputID)
{
   var fileUpload = document.getElementById(fileInputID);
   var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
   var table = document.getElementById(targetTableBodyID);

   var dvCSV = document.getElementById("dvCSV2");

   if (regex.test(fileUpload.value.toLowerCase()))
   {
      if (typeof (FileReader) !== "undefined")
      {
         var reader = new FileReader();
         reader.onload = function (e)
         {
            var record = e.target.result.split("\n");

            for (var i = 0; i < record.length; i++)
            {
               console.log(i);
               if(i < table.childElementCount)
               {
                  var tableRow = table.children[i];

                  var fields = record[i+1].split(",");
                  console.log(tableRow.children[0].innerHTML.toString().indexOf(fields[0]) > -1);

                  if(tableRow.children[0].innerHTML.toString().indexOf(fields[0]) > -1)
                  {
                     var input1Val = tableRow.children[1].children[0].value;
                     var input2Val = tableRow.children[2].children[0].value;
                     if(input1Val == "" || input1Val == " ")
                     {
                        tableRow.children[1].children[0].value = fields[1] != undefined ? fields[1] : "";
                     }
                     if(input2Val == "" || input2Val == " ")
                     {
                        tableRow.children[2].children[0].value = fields[2] != undefined ? fields[2] : "";
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
         alert("This Browser does not support file reading.");
      }
   }
   else
   {
      alert("Please upload a valid CSV file.");
   }
}
