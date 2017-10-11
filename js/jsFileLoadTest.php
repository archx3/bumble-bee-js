<?php
   /**
    * @Author       Created by arch on 27/05/17 using PhpStorm.
    * @Time         : 07:52
    * @Copyright (C) 2017
    * Barge Studios Inc, The $LIBRAY_NAME$ Authors
    * <bargestd@gmail.com>
    * <bumble.bee@bargestd.com>
    *
    * @licence      Licensed under the Barge Studios Eula
    *  you may not use this file except in compliance with the License.
    *
    * You may obtain a copy of the License at
    *     http://www.bargestudios.com/bumblebee/licence
    *
    * Unless required by applicable law or agreed to in writing, software
    * distributed under the License is distributed on an "AS-IS" BASIS,
    * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    * See the License for the specific language governing permissions and
    * limitations under the License.
    *
    *        \__/
    *    \  (-_-)  /
    *    \-( ___)-/
    *     ( ____)
    *   <-(____)->
    *    \      /
    * @fileOverview contains instruction[code] for creating a $OBJECT$
    */

   use includes\Barge\LOADER;
   use function includes\Barge\printArray;

   include "../../includes/Barge/loader.php";

   $loader = new includes\Barge\Loader("js", ".js", "../");

   $filePathsArray = [
      ["ui/Barge.Animations.js",
       ["core/Barge.Utils.js", "core/Barge.String",
                            ["core/Barge.Array"]
       ]
      ],
      ["ui/Barge.BarbeCue",
       ["ui/Barge.Events"]
      ]
   ];


   $filesArray = [
      ["Barge.Animations.js",
       ["Barge.Utils.js", "Barge.String",
                            ["Barge.Array"]
       ]
      ],
      ["Barge.BarbeCue",
       ["Barge.Events"]
      ]
   ];


   ?>
<!doctype>
<html>
<head>
   <title>Testing file loader</title>
   <meta charset="utf-8">
</head>
<body>
<?php

   $loader->load($filesArray);

//   $loader->getToBeLoaded($filesArray);

//   print_r($loader->getFilesInRoot());

//   foreach ($loader->getAllFilesInRoot() as $item)
//   {
//      echo $item . "<br>";
//      echo $item->getFileName(). "<br>";
//
//   }

?>
</body>
</html>
