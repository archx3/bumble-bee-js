/**
 * Created by ARCH on 08/08/2016.
 * Copyright (C) 2016 Barge Studios <bargestd@gmail.com>
 */
var Barge = Barge || {};
Barge.Progress = Barge.Progress || {};
var spinnerCss = '.loader{height: 37px;width: auto;border: 1px solid #e6e3e3;padding: 5px;margin: 0 auto;'+
   'border-radius: 21px;box-shadow: 0 0 4px rgba(0, 0, 0, .2);position: absolute;left: calc(50% - 100px);' +
   'top: calc(50% - 15px);z-index: 60; background-color:#fff;}'+
   '.spinner{border: 3px solid #e9e9e9;border-top: 3px solid #3498db;border-radius: 50%;width: 22px;height: 22px;' +
   'color: red;display: inline-block;float: left;margin-left: 1px;margin-top: 1px;animation: spin .6s linear infinite;}'+
   '.loader p{margin: 0;display: inline-block;margin-left: 10px;margin-right: 10px;line-height: 2;font-size: 15px;font-family' +
   ': "segoe iu",sans-serif;font-weight: 600;color: #959393;}'+
   '@keyframes spin {0% { transform: rotate(0deg); }100% { transform: rotate(360deg); }}';

/**
 *
 * @param loaderText {String}
 * @param duration {Number}
 * @param progress   {boolean}
 */
Barge.Progress.spinner = function(loaderText, duration, progress)
{

   var loader = document.createElement("div");
   loader.className = "loader";
   loader.id = "spinner";
   var spinner = document.createElement("div");
   spinner.className = "spinner";
   var loaderTextContainer = document.createElement("p");
   loaderTextContainer.innerHTML = loaderText ? loaderText : "Loading... Please Wait";

   Barge.utils.insertDynamicCss(spinnerCss, "spinnerCss");
   loader.appendChild(spinner);
   loader.appendChild(loaderTextContainer);

   if(!Barge.utils.gebi("spinner"))
   {
      document.body.appendChild(loader);
   }

   var lastPeriod = duration ? duration : 200;

   if(progress === false || progress === undefined)
   {
      window.document.addEventListener("readystatechange", function()
      {
         if(document.readyState === "complete")
         {
            var loaderTimeout = setTimeout(function()
            {
               loader.style.display = "none";
               //console.log('done');
            },lastPeriod);
         }
      }, false);
   }
   else
   {
      console.log(progress);
   }
};
