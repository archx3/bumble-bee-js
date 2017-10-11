/**
 * Created by arch on 10/26/16.
 */

var Barge = Barge || {};
Barge.OSK = Barge.OSK || {};
Barge.OSK.createLayout = function ()
{
   this.layoutKeys = latinQwerty

};

function _addClassNames(el, classNames)
{
   if(classNames && typeof classNames === "string")
   {
      var scn = classNames.split(",");
      // console.log(scn);
      var i = 0;
      var len = scn.length;
      {
         for(i; i < len; i++)
         {//console.log(scn[i], " llff: ");
            if((scn[i] !== "" || scn[i] !== " ") && !el.classList.contains(scn[i]))
            {

               el.classList.add(scn[i].toString());
            }
         }
      }
   }
}

function _insertContent(key, shiftKey, normalKey)
{
   var noCapKey = key.classList.contains("noCaps");
   if(noCapKey)
   {
      key.innerHTML = shiftKey + "<br/>" + normalKey;
   }
   else
   {
      key.innerHTML = shiftKey;
   }
}

function _makeDataKey(normalKey, shiftKey, specialClassNames)
{
   var key = document.createElement("span");

   key.setAttribute("data-normalKey", normalKey);
   key.setAttribute("data-shiftKey", shiftKey);

   key.className = "key";

   if(specialClassNames && typeof specialClassNames === "string")
   {
      _addClassNames(key, specialClassNames)
   }

   _insertContent(key, shiftKey, normalKey);
   return key;
}



function _makeMetaKey(id, width, bip, content, specialClassNames)
{
   // console.log(width);
   var i, key = document.createElement("span"); bip = bip || null;
   var styleString = "width: "+ width + "px;";

   // console.log(styleString);
   key.setAttribute("style", styleString + ( bip ? " background-position: -" + bip.toString() +"px center;" : ""));
   key.className = "key";
   key.classList.add("metaKey");
   key.id = id && (id != "" || id != " ") ? id : "";

   if(specialClassNames && typeof specialClassNames === "string")
   {
      _addClassNames(key, specialClassNames)
   }

   key.innerHTML = content ? content : "";
   return key;
}

function _createNumRow()
{
   //console.log(numRowKeys);
   var rowKeys = [], i = 0, len = numRowKeys.length;
   //console.log(len);

   for(i; i < len; i++)
   {
      var keyVals = numRowKeys[i].split("|");
      // console.log(keyVals);
      // console.log(keyVals[0],keyVals[1]);
      var key = _makeDataKey(keyVals[0],keyVals[1],"noCaps");
      rowKeys.push(key);
   }
   rowKeys.push(_makeMetaKey("backSpace",60,147,"","smallFont,iconKey,lastKey"));
   return rowKeys;
}

function createCoreRowKeys()
{
   var rowKeys = [], i = 0, j=0;
   for(i in metaKeys)
   {
      if(metaKeys.hasOwnProperty(i))
      {
         var innerRowKeys = [], innerArrLen = metaKeys[i].length;
         // console.log(innerArrLen);
         for(j in metaKeys[i])
         {
            if(metaKeys[i].hasOwnProperty(j))
            {
               var keyVals = (metaKeys[i])[j].split(",");

               var key = _makeMetaKey(keyVals[0], keyVals[1], keyVals[2], keyVals[3], keyVals[4].toString().replace(/\s+/g,','));
               innerRowKeys.push(key);
            }
         }
         rowKeys.push(innerRowKeys);
         //console.log(innerRowKeys);
      }

   }
   //console.log(rowKeys);

   return rowKeys;
}

function createLetterAndPuncKeys()
{
   var rowKeys = [], i = 0, j=0;
   for(i in akanQwerty)
   {
      if(akanQwerty.hasOwnProperty(i))
      {
         var innerRowKeys = [], innerArrLen = akanQwerty[i].length;
         // console.log(innerArrLen);
         for(j in akanQwerty[i])
         {
            if(akanQwerty[i].hasOwnProperty(j))
            {
               var keyVals = (akanQwerty[i])[j].split("|");

               var key = _makeDataKey(keyVals[0],keyVals[1]);
               innerRowKeys.push(key);
            }
         }
         rowKeys.push(innerRowKeys);
         //console.log(innerRowKeys);
      }

   }
   //console.log(rowKeys);

   return rowKeys;
}

function _createRow(keysArray)
{
   var rowKeys = [], i = 0, len = keysArray.length;
   for(i; i < len; i++)
   {
      var keyVals = keysArray[i].split("|");
      var key = _makeDataKey(keyVals[0],keyVals[1]);
      rowKeys.push(key);
   }
   return rowKeys;
}

function _renderCoreKeyBoardLayout()
{
   var i, num , osk = document.createElement("div"),
       closeBtn = document.createElement("button"), layoutContainer = document.createElement("div");

   osk.id = "osk";
   closeBtn.id = "oskCloseBtn";
   closeBtn.innerHTML = "&times;";
   layoutContainer.id = "latinKeyboard";
   i = 0; num = 0;
   for(i; i < 5; i++)
   {  var row = null;
      if(i === 0)
      {
         row = document.createElement("div");
         row.className = "row";
         var nums = _createNumRow();
         var actualNumKeysSpan = document.createElement("span");
         actualNumKeysSpan.className = "numRowKey";

         for(num, numLen = nums.length; num < numLen; num++)
         {

            if(num > 0 && num < 10)
            {
               actualNumKeysSpan.appendChild(nums[num]);
            }
            else
            {
               row.appendChild(nums[num]);
               row.insertBefore(actualNumKeysSpan, row.childNodes[1]);
               // console.log(actualNumKeysSpan);
            }

         }
         layoutContainer.appendChild(row);
         row = null;
      }

   }

      var cRk = createCoreRowKeys();
      var lnpK = createLetterAndPuncKeys();

      // console.log(cRk, 'type', typeof cRk);
      num = 0;
      for(num, numLen = cRk.length; num < numLen; num++)
      {
         row = document.createElement("div");
         row.className = "row";
         var lRow = document.createElement("span");
         lRow.className = "alphaRowKeys";
         // console.log("num", num);
         // console.log("cRk[",num,"].length", cRk[num].length);

         for(var z = 0; z < cRk[num].length; z++)
         {
            // console.log("z", z);
            // console.log("cRk[",num,"][z]", cRk[num][z]);

            row.appendChild(cRk[num][z]);
            for(var x in lnpK)
            {
               // console.log("z", z);
               if(lnpK.hasOwnProperty(x))
               {
                  console.log("lnpK[",z,"][z]", lnpK[x][z]);

                  lRow.appendChild(lnpK[x][z]);
               }
               // console.log(row);
            }


            row.insertBefore(lRow, row.childNodes[1]);
            // console.log(row);
         }
         // console.log(cRk[num], 'type', typeof cRk[num]);
         /*for(var key in cRk[num])
         {
            (function (i)
            {
               if(cRk.hasOwnProperty(i))
               {
                  // console.log(i);
               }
            })(key);
            // console.log(row);
         }*/
         // console.log(row);
         layoutContainer.appendChild(row);
         row = null;
      }





   osk.appendChild(closeBtn);
   osk.appendChild(layoutContainer);
   document.body.appendChild(osk);

   /*lnpK = createLetterAndPuncKeys();
   console.log(lnpK, 'type', typeof lnpK);
   num = 0;
   for(num, numLen = lnpK.length; num < numLen; num++)
   {

      var lrc = document.getElementById("#latinKeyboard");
      console.log(lrc);

      // console.log("num", num);
      // console.log("cRk[",num,"].length", cRk[num].length);

      for(var z = 0; z < lnpK[num].length; z++)
      {
         // console.log("z", z);
         // console.log("lnpK[",num,"][z]", lnpK[num][z]);

         row.appendChild(lnpK[num][z]);
         // console.log(row);
      }
      // console.log(lnpK[num], 'type', typeof lnpK[num]);

      // console.log(row);

      lrc.appendChild(row);
      row = null;
   }*/
}

_renderCoreKeyBoardLayout();

/*TODO Fix CAPS LOCK AND SHIFT meta keys and add layout keys
/*TODO Fix Inserting letters */