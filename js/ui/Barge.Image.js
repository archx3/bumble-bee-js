/**
 * Created by arch on 3/11/17.
 */
/**
 * Created by ARCH on 23/07/2016.
 * Copyright (C) 2016 Barge Studios <bargestd@gmail.com>
 */
var Barge = Barge || {};

(function (Bu)
{
   var theme = document.head.getAttribute("data-theme");
   theme = theme || 'light';

   Barge.Image = Barge.Image || {};

   //Barge.Image.insertGenericAvatar = function (genericImageLoc, genericAvatarLoc )
   //{
   //   //console.log("there are images on page"); //console.log(document.images[0]);
   //   var fnValidateImage = function (oImg)
   //   {
   //      var img = new Image();      //credit to Stack overflow (Great Community)
   //      img.onerror = function ()
   //      {
   //         if(img.classList.contains("avatar"))
   //         {
   //            oImg.src = genericAvatarLoc;
   //         }
   //         else
   //         {
   //            oImg.src = genericImageLoc;
   //         }
   //      };
   //      img.src = oImg.src;
   //      img = null;
   //   };
   //
   //   var aImg = document.getElementsByTagName('IMG');
   //   var i = aImg.length;
   //
   //   while (--i !== -1)
   //   {
   //      fnValidateImage(aImg[i]);
   //   }
   //};

   /**
    * @param imgInputEl {Object}
    * @param imgPreviewEl  {Object}
    * @type {preview}
    */
   Barge.Image.makePreviewable = function (imgInputEl, imgPreviewEl)
   {

      let typeRegEx = /^([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.tiff|.gif|.ico|.svg)$/;

      if (imgInputEl && imgPreviewEl)
      {
         if (typeof imgInputEl === 'string')
         {
            imgInputEl = Bu.gebi(imgInputEl);
         }

         if (typeof imgPreviewEl === 'string')
         {
            imgPreviewEl = Bu.gebi(imgPreviewEl);
         }

         let URL = window.URL || window.webkitURL,
             uploadedImageURL;

         if (URL)
         {
            imgInputEl.onchange = function ()
            {
               let files = this.files;
               let file;

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
                     //if (Bu.defined(file.type))
                     //{
                     //   console.log(file.type);
                     //}
                     //MSG this is where the selected file is inserted into img src
                     // imgPreviewEl.src =  URL.createObjectURL(file);

                     imgPreviewEl.style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
                     /*for(var i in imgPreviewEl.src)
                      {
                      console.log(i, imgPreviewEl.src[i]);
                      }*/
                  }
                  else
                  {
                     Barge.DiceyDialog.confirm({t : 'Selected file type not supported', m: 'Please choose an image file.', i: 'f'});

                  }

               }
               else
               {
                  Barge.DiceyDialog.confirm({t : 'Selected file type not supported', m: 'Please choose an image file.', i: 'f'});

               }

               file = files = null;
            }
         }
         else
         {
            Barge.DiceyDialog.confirm({ t : '...well this is embarrassing',
                                      m : 'Your image has been loaded but previewing is not supported by your browser.',
                                      i: 'w'});
         }
         //URL = uploadedImageURL = null;
      }
      else
      {
         throw new Error("Missing params imgInputEl and/or imgPreviewEl");
      }

      //imgInputEl = imgPreviewEl = typeRegEx = null;
   };

   /**
    * @param imgInputEl {Object}
    * @param imgPreviewEl  {Object}
    */
   function previewImage(imgInputEl, imgPreviewEl)
   {

      function _fileErrorMessage(theme)
      {
         if (theme === "light")
         {
            Barge.Dialog.lightConfirm('Selected file type not supported', 'Please choose an image file.', 'Ok', false, false, false, 'failure');
         }
         else
         {
            Barge.Dialog.darkConfirm('Selected file type not supported', 'Please choose an image file.', 'Ok', false, false, false, 'failure');
         }
      }

      let typeRegEx = /^([a-zA-Z0-9\s_\\.\-:])+(.png|.jpg|.jpeg|.tiff|.gif|.ico|.svg)$/;

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

         let URL = window.URL || window.webkitURL,
             uploadedImageURL;

         if (URL)
         {
            imgInputEl.onchange = function ()
            {
               let files = this.files;
               let file;

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
                     {console.log(file.type);}

                     //MSG this is where the selected file is inserted into img src
                     // imgPreviewEl.src =  URL.createObjectURL(file);

                     imgPreviewEl.style.backgroundImage = "url(" + URL.createObjectURL(file) + ")";
                  }
                  else
                  {
                     _fileErrorMessage(theme);
                  }
               }
               else
               {
                  _fileErrorMessage(theme);
               }
            }
         }
         else
         {
            if (theme === "light")
            {
               Barge.Dialog.lightConfirm('...well this is embarrassing',
                                         'Your image has been loaded but previewing is not supported by your browser.',
                                         'Ok', false, 'Cancel', false, 'warning');
            }
            else
            {
               Barge.Dialog.darkConfirm('...well this is embarrassing',
                                        'Your image has been loaded but previewing is not supported by your browser.',
                                        'Ok', false, 'Cancel', false, 'warning');
            }
         }
      }
      else
      {
         throw new Error("Missing params imgInputEl and/or imgPreviewEl");
      }

   }

})(Barge.utils);
