/**
 * Created by ARCH on 23/07/2016.
 * Copyright (C) 2016 Barge Studios <bargestd@gmail.com>
 */
var Bee = Bee || {};

(function (Bu, Bd)
{
   let Be = new Bee.Event.EventManager();
   var theme = document.head.getAttribute("data-theme");
   theme = theme || 'light';

   function _generateOverlay()
   {
      var msgBackTint = document.createElement("section");
      msgBackTint.style.display = "block";
      msgBackTint.id = "popUpOverlay";
      msgBackTint.className = "overlay";

      msgBackTint.onmousedown = function ()
      {
         Bee.utils.closeWin(this, true, false);
         Bee.utils.closeWin(Bee.utils.gebi("popImageDiv"), false, false);
      };

      return msgBackTint;
   }

   Bee.Bursty = Bee.Bursty || {};
   Bee.Bursty.popup = function ()
   {
      var hasPopUp = Bee.utils.getElementsByAttribute("data-popup");

      for (let i = 0; i < hasPopUp.length; i++)
      {
         console.log(hasPopUp[i]);
         //displaying the popup
         hasPopUp[i].addEventListener('click', function (event)
         {
            let popUpItem = Bee.utils.qs(this.getAttribute("data-popupItem"));
            console.log(this.offsetLeft);
            Bee.utils.toggleDisplay(popUpItem);
            popUpItem.style.position = "absolute";
            Bee.utils.setObjectPositionAt(popUpItem, this, 'bottomLeft');

            //removing the popup
            popUpItem.addEventListener('click', function (event)
            {
               event.stopPropagation();
               console.log(event.target);
               if (event.target !== popUpItem)
               {
                  console.log(event.target);
                  //console.log(popUpItem);
                  Bee.utils.closeWin(popUpItem, false, false);
               }
            });

         });

      }
   };

   Bee.Bursty.BulgeImage = function (dark, parent)
   {
      // var bg = bgColor ? bgColor : "#fff";
      var popupImageCss = "#popupImageDiv {margin: 0; width: auto;  height:auto; padding: 10px; border: 1px solid #ccc; position: absolute;background-color: #fff;z-index: 30; box-shadow: 0 0 4px rgba(0, 0, 0, .5);border-radius: 3px;}\
   #popupImageDivImg{border:0; border: 1px solid #ccc;}";
      var popupImageCssDark = "#popupImageDiv {margin: 0; width: auto;  height:auto; padding: 10px; border: 1px solid #353434; position: absolute;background-color: #6b6b6b;z-index: 30; box-shadow: 0 0 4px rgba(0, 0, 0, .5);border-radius: 3px;}\
   #popupImageDivImg{border:0; border: 1px solid #353434;}";
      var popupImageDiv = document.createElement("div");
      popupImageDiv.id = "popupImageDiv";
      Bee.utils.addClass(popupImageDiv, "zoomIn");
      popupImageDiv.style.display = "none";

      var popupImage = document.createElement("img");
      popupImage.setAttribute("width", "200");
      popupImage.id = "popupImageDivImg";
      if (dark && dark == "dark")
      {
         Bee.utils.insertDynamicCss(popupImageCssDark, "popupImageCssDark");
      }
      else
      {
         Bee.utils.insertDynamicCss(popupImageCss, "popupImageCss");
      }
      if (!parent)
      {
         document.body.appendChild(popupImageDiv);
      }
      else
      {
         parent.appendChild(popupImageDiv)
      }

      var hasPopupImage = Bee.utils.getElementsByAttribute("data-popupImage");

      for (var i = 0; i < hasPopupImage.length; i++)
      {
         hasPopupImage[i].addEventListener('mouseenter', function (event)
         {
            event.stopPropagation();
            Bee.utils.setObjectPositionAt(popupImageDiv, false, false, event);

            if ((this.getAttribute("src") !== "" && this.complete.toString() === "true") || this.getAttribute("src") !== "defaultImg.png")
            {
               popupImage.setAttribute("src", this.getAttribute("src"));
               popupImage.setAttribute("alt", "N/A");
               //console.log();
               if (popupImage.complete === true &&
                   popupImage.getAttribute("src").indexOf("defaultImage") < 0 &&
                   popupImage.getAttribute("src").indexOf("defaultAvatar") < 0)
               {

                  popupImageDiv.appendChild(popupImage);
                  Bee.utils.openWin(popupImageDiv);

                  Bee.utils.dynamicSpaceElPositioner(popupImageDiv, parent);
               }
            }
         }, true);

         /*hasPopupImage[i].addEventListener("mousemove", function (event)
          {   hasPopupImage[i].removeEventListener("mouseover");
          Bee.utils.setObjectPositionAt(popupImageDiv, false,false,event);
          });*/

         hasPopupImage[i].addEventListener("mouseout", function ()
         {
            Bee.utils.closeWin(popupImageDiv, false, false)
         });
      }
   };

   Bee.Bursty.PopImage = function (theme)
   {
      // region css
      var popImageCss = "section{ width: 100%; height: 100%; overflow: hidden;}" +
                        ".overlay{z-index: 170; position: absolute; top:0;  background-color: #fff;  opacity: .8; display: none;}\
                            #popImageDiv {margin: 0; width: auto;  height:auto; padding: 10px; border: 1px solid #ccc; position: absolute;background-color: #fff;z-index: 171; box-shadow: 0 0 4px rgba(0, 0, 0, .5);}\
                     #popImageDivImg{border:0; border: 1px solid #ccc;}\
                     #popImageDldBtn{top:unset; bottom: 15px; right: 10px; opacity: .4; position:absolute} #popImageDldBtn:hover{opacity:1}";

      var popImageCssDark = "section{width: 100%;height: 100%;overflow: hidden;}\
   .overlay{z-index: 170;position: absolute;top:0;background-color: #000;opacity: .7;display: none;}\ #popImageDiv {margin: 0; width: auto;  height:auto; padding: 10px; border: 1px solid #353434; position: absolute;background-color: #6b6b6b;z-index: 171; box-shadow: 0 0 4px rgba(0, 0, 0, .5);}\
   #popImageDivImg{border:0; border: 1px solid #353434;}\
   #popImageDldBtn{top:unset; bottom: 15px; right: 10px; opacity: .4; position:absolute} #popImageDldBtn:hover{opacity:1}";
      //endregion
      var popImageDiv = document.createElement("div");
      popImageDiv.id = "popImageDiv";
      Bee.utils.addClass(popImageDiv, "zoomIn");
      popImageDiv.style.display = "none";

      var popImage = document.createElement("img");
      popImage.setAttribute("width", "500");
      popImage.id = "popImageDivImg";

      /*var downloadBtn = document.createElement("button");
       downloadBtn.id = "popImageDldBtn";
       downloadBtn.setAttribute("data-moderntooltip","Download");
       //downloadBtn.href = "#";
       downloadBtn.innerHTML = "<i class='fa fa-download'></i>";
       downloadBtn.className = "btn btnBlue";*/

      if (theme && theme == "dark")
      {
         Bee.utils.insertDynamicCss(popImageCssDark, "popImageCssDark");
      }
      else
      {
         Bee.utils.insertDynamicCss(popImageCss, "popImageCss");
      }

      document.body.appendChild(popImageDiv);

      var hasPopImage = Bee.utils.getElementsByAttribute("data-popupImage");

      for (var i = 0; i < hasPopImage.length; i++)
      {
         hasPopImage[i].addEventListener('click', function (event)
         {
            event.stopPropagation();

            if ((this.getAttribute("src") != "" && this.complete.toString() == "true") || this.getAttribute("src") != "defaultImg.png")
            {
               popImage.setAttribute("src", this.getAttribute("src"));
               popImage.setAttribute("alt", "N/A");

               if (popImage.complete == true && popImage.getAttribute("src").indexOf("defaultImage") < 0 &&
                   popImage.getAttribute("src").indexOf("defaultAvatar") < 0)
               {//console.log();
                  document.body.appendChild(_generateOverlay());
                  popImageDiv.appendChild(popImage);
                  //popImageDiv.appendChild(downloadBtn);
                  Bee.utils.openWin(popImageDiv);
                  popImageDiv.style.left = ((document.body.offsetWidth / 2) - popImageDiv.offsetWidth / 2) + "px";
                  popImageDiv.style.top = (document.body.offsetHeight / 2 - popImageDiv.offsetHeight / 2) + "px";
               }
            }
         }, true);

      }
   };

   Bee.Image = Bee.Image || {};

   Bee.Image.insertGenericAvatar = function (genericImageLoc, genericAvatarLoc )
   {
      //console.log("there are images on page"); //console.log(document.images[0]);
      var fnValidateImage = function (oImg)
      {
         //credit to Stack overflow (Great Community)
         //console.log(oImg.classList.contains("avatar"));
         var img = new Image();
         img.onerror = function ()
         {
            if(oImg.classList.contains("avatar"))
            {
               oImg.src = genericAvatarLoc;

            }
            else
            {
               oImg.src = genericImageLoc;
            }
            //img = null;
         };
         img.src = oImg.src;
      };

      var aImg = document.getElementsByTagName('IMG');
      var i = aImg.length;

      while (--i !== -1)
      {
         fnValidateImage(aImg[i]);
      }
   };
   /**

    * @type {preview}
    */
   Bee.Image.preview = new function ()
   {

      function _fileErrorMessage(theme)
      {
         Bee.DiceyDialog.confirm({t : "Selected file type not supported", m : "Please choose an image file.", i : "f"});
      }

      /**
       * @param imgInputEl {Object}
       * @param imgPreviewEl  {Object}
       */
      this.apply = function (imgInputEl, imgPreviewEl)
      {
         var typeRegEx = /^([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.tiff|.gif|.ico|.svg)$/;

         if (imgInputEl && imgPreviewEl)
         {
            if (typeof imgInputEl === 'string')
            {
               imgInputEl = Bu.gebi(imgInputEl);
            }

            if (typeof imgPreviewEl === 'string')
            {
               imgInputEl = Bu.gebi(imgPreviewEl);
            }

            var URL = window.URL || window.webkitURL,
                uploadedImageURL;

            if (URL)
            {
               imgInputEl.onchange = function ()
               {
                  var files = this.files;
                  var file;

                  if (files && files.length)
                  {
                     file = files[0];

                     if (/^image\/\w+/.test(file.type))
                     {
                        if (uploadedImageURL)
                        {
                           URL.revokeObjectURL(uploadedImageURL);
                        }
                     }

                     if (typeRegEx.test(imgInputEl.value.toLowerCase()))
                     {
                        if (Bu.defined(file.type))
                        {
                           console.log(file.type);
                        }

                        // imgPreviewEl.src =  URL.createObjectURL(file);//msg this is where the selected file is inserted into img src

                        imgPreviewEl.style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
                        /*for(var i in imgPreviewEl.src)
                         {
                         console.log(i, imgPreviewEl.src[i]);
                         }*/
                        /*for(var i in imgPreviewEl)
                         {
                         console.log(i, imgPreviewEl.src[i]);
                         }*/
                     }
                     else
                     {
                        Bee.DiceyDialog.confirm({t : "Selected file type not supported", m : "Please choose an image file.", i : "f"});
                     }

                  }
                  else
                  {
                     Bee.DiceyDialog.confirm({ t    : "Selected file type not supported",
                                                  m : "Please choose an image file.",
                                                  i : "f"
                                               });
                  }
               }
            }
            else
            {
               Bee.DiceyDialog.confirm({t     : "...well this is embarrassing",
                                            m : "Your image has been loaded but previewing is not supported by your browser.",
                                            i : "w"});
            }
         }
         else
         {
            throw new Error("Missing params imgInputEl and/or imgPreviewEl");
         }
      }

   };

   /*function popUpPositioner()
    {
    }*/

   /**@use
    * @e.g <img src="../im4.jpg" data-popupImage="" width="150" />
    * */
   /**
    * @Change-Log
    * @since V.2.8
    * @Date  02-10-16 : Added pop image by refactoring bulge image
    * Finished by Arch on 02/10/16.
    */
   //TODO implement popup with dynamic options object param lyk goog.window.popup
   Bee.Bursty.window = function ()
   {
      if (Bu.getElementsByAttribute("data-window")[0] !== undefined)
      {
         let hasPopWindow = Bu.nodeListToArray(Bu.getElementsByAttribute("data-window"));

         let i = 0, len = hasPopWindow.length;
         for (; i < len; i++)
         {
            hasPopWindow[i].addEventListener('click', function ()
            {
               let options = this.getAttribute("data-window").split('|'),
                   left    = Bu.pInt(options[2].split('=')[1]);
               //console.log(options[2]);
               //console.log(left);
               if (window.screen)
               {
                  left = 'left=' + (screen.availWidth / 2 - left / 2)
               }
               else
               {
                  left = 'left=200'
               }

               //console.log(left);

               //console.log(toolBoxFlyOutIsOpen);
               //if (Bu.defined(toolBoxFlyOutIsOpen))
               //{
                  if (!window.toolBoxFlyOutIsOpen)
                  {
                     const win = window.open(options[0], options[1], (options[2] + ', ' + options[3] + ', ' + left + ', ' +
                                                                      options[4]));
                     win.focus();

                  }

               //}
               left = options = null;
               // console.log('opener',win.opener);
            });
         }
         hasPopWindow = i = len = null;
      }
   };

   Bee.Bursty.DropDown = function ()
   {
      let drippys = Bd.getElementsByAttribute("data-dropdown");

      if(drippys)
      {
         Be.bindOnAll(drippys, "click", function (e)
         {
            let data = this.getAttribute("data-dropdown").split(",");
            let toDrop = Bd.getEl("#" + data[0]);


            if(Bd.getDisplayState(toDrop) === 0)
            {
               Bd.anchorBottomLeft(this, toDrop, data[1] , data[2]);

               if (this.classList.contains("dropup"))
               {
                  Bd.anchorTop(this, toDrop, data[1]);
                  Bd.alignLeft(this, toDrop, data[2]);
               }

               Bd.openWin(toDrop);

               Bd.pushIntoView(toDrop);
               //Bd.dynamicSpaceElPositioner(toDrop);
            }
            else
            {
               Bd.closeWin(toDrop);
            }
         });
      }
   };

   let drps = new Bee.Bursty.DropDown();
})(Bee.utils, Bee.Dom);
