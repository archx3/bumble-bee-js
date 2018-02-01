<!DOCTYPE html>
<html lang="en">
<head>
   <meta charset="UTF-8">
   <title>testSplash</title>
</head>
<body>
<?php

   error_reporting(0);
   function rgb2hex ($rgb)
   {
      $hex = "#";
      $hex .= str_pad(dechex($rgb[0]), 2, "0", STR_PAD_LEFT);
      $hex .= str_pad(dechex($rgb[1]), 2, "0", STR_PAD_LEFT);
      $hex .= str_pad(dechex($rgb[2]), 2, "0", STR_PAD_LEFT);

      return $hex; // returns the hex value including the number sign (#)
   }

   $source_file = "../../images/splashImages/dataResearch.jpg";

   // histogram options

   $maxheight = 300;
   $barwidth  = 2;

   $im = ImageCreateFromJpeg($source_file);

   $imgw = imagesx($im);
   $imgh = imagesy($im);

   // n = total number or pixels

   $n = $imgw * $imgh;

   $histo = [];
   $histo_color = [];

   for ($i = 0; $i < $imgw; $i++)
   {
      for ($j = 0; $j < $imgh; $j++)
      {

         // get the rgb value for current pixel

         $rgb = ImageColorAt($im, $i, $j);
         //echo $rgb."<br>";
// extract each value for r, g, b

         $r = ($rgb >> 16) & 0xFF;
         $g = ($rgb >> 8) & 0xFF;
         $b = $rgb & 0xFF;

// get the Value from the RGB value

         $V = floor(($r + $g + $b) / 3);
//echo $V."<br>";
// add the point to the histogram

         $histo[$V] += $V / $n;
         $histo_color[$V] = rgb2hex([$r, $g, $b]);

      }
   }

   // find the maximum in the histogram in order to display a normated graph

   $max = 0;
   for ($i = 0; $i < 255; $i++)
   {
      if ($histo[$i] > $max)
      {
         $max = $histo[$i];
      }
   }

   echo "<div style='width: " . (256 * $barwidth) . "px; border: 1px solid'>";
   for ($i = 0; $i < 255; $i++)
   {
      $val += $histo[$i];

      $h = ($histo[$i] / $max) * $maxheight;
      $hc = $histo_color[$i] ;

      echo "<span src=\"img.gif\" width=\"" . $barwidth . "\"
              height=\"" . $h . "\" border=\"0\" style=\"display:inline-block; background:" . $hc . "\"></span>";
   }
   echo "</div>";

   $key = array_search($max, $histo);
   $col = $histo_color[$key];
?>

<p style="min-width:100px; min-height:100px; background-color:<?php echo $col ?>;"></p>
<img src="<?php echo $source_file ?>">
</body>
</html>